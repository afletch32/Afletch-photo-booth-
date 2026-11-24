const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const read = (...parts) => fs.readFileSync(path.join(__dirname, ...parts), "utf8");

function loadHandler(file, importStub = "") {
  const source = read(...file);
  const code = source
    .replace(/^import .*;\s*$/gm, "")
    .replace(/export async function onRequest/, "async function onRequest")
    .replace(/export \{[^}]+\};?\s*$/m, "");
  return new Function("getPayPalEventConfig", `${code}\nreturn onRequest;`)(importStub);
}

function createKv(initial = {}) {
  const values = new Map(Object.entries(initial));
  return {
    values,
    async get(key) { return values.get(key) || null; },
    async put(key, value) { values.set(key, value); },
  };
}

test("share records retain paid-print event metadata", async () => {
  const gallery = loadHandler(["functions", "api", "gallery.js"]);
  const kv = createKv();
  const response = await gallery({
    request: new Request("https://booth.example/api/gallery?tag=event-123", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        capture_id: "capture-123",
        secure_url: "https://images.example/photo.jpg",
        event_id: "event-123",
        paid_print_enabled: true,
      }),
    }),
    env: { THEMES_KV: kv },
  });

  assert.equal(response.status, 200);
  assert.deepEqual(JSON.parse(kv.values.get("share:capture-123")), {
    capture_id: "capture-123",
    secure_url: "https://images.example/photo.jpg",
    resource_type: "image",
    title: "",
    created_at: JSON.parse(kv.values.get("gallery:event-123")).resources[0].created_at,
    gallery_url: "",
    event_id: "event-123",
    paid_print_enabled: true,
  });
});

test("photo page shows a print action only for paid photos with configured PayPal", async () => {
  const paidItem = {
    secure_url: "https://images.example/photo.jpg",
    resource_type: "image",
    event_id: "event-123",
    paid_print_enabled: true,
  };
  const pageFor = async (item, config = { configured: true, amount: "3.00", currency: "USD" }) => {
    const route = loadHandler(["functions", "share", "[id].js"], async () => config);
    const kv = createKv({ "share:capture": JSON.stringify(item) });
    return route({ params: { id: "capture" }, env: { THEMES_KV: kv } });
  };

  const paidPage = await pageFor(paidItem);
  const paidHtml = await paidPage.text();
  assert.match(paidHtml, /Your photo is ready/);
  assert.match(paidHtml, /Download photo/);
  assert.match(paidHtml, /Order a print for \$3\.00/);
  assert.match(paidHtml, /id="order-print"/);

  const oldPage = await pageFor({ secure_url: paidItem.secure_url, resource_type: "image" });
  const oldHtml = await oldPage.text();
  assert.match(oldHtml, /Download photo/);
  assert.doesNotMatch(oldHtml, /id="order-print"/);

  const unconfiguredPage = await pageFor(paidItem, { configured: false });
  assert.doesNotMatch(await unconfiguredPage.text(), /id="order-print"/);

  const videoPage = await pageFor({ ...paidItem, resource_type: "video" });
  assert.doesNotMatch(await videoPage.text(), /id="order-print"/);
});

test("phone photo-page order queues one print and redirects to PayPal", async () => {
  const handler = loadHandler(["functions", "share", "[id].js"], async () => ({
    configured: true,
    amount: "3.00",
    currency: "USD",
  }));
  const kv = createKv({
    "share:capture": JSON.stringify({
      secure_url: "https://images.example/photo.jpg",
      resource_type: "image",
      event_id: "event-123",
      paid_print_enabled: true,
    }),
  });
  const response = await handler({ params: { id: "capture" }, env: { THEMES_KV: kv } });
  const html = await response.text();
  const script = html.match(/<script>([\s\S]*?)<\/script>/)[1];
  const listeners = {};
  const button = {
    dataset: { eventId: "event-123", photoUrl: "https://images.example/photo.jpg" },
    addEventListener(name, listener) { listeners[name] = listener; },
    disabled: false,
  };
  const status = { textContent: "" };
  const calls = [];
  const redirects = [];
  const replies = [
    { ok: true, item: { id: "print-123" } },
    { ok: true, approvalUrl: "https://paypal.example/approve" },
  ];
  vm.runInNewContext(script, {
    document: { getElementById(id) { return id === "order-print" ? button : status; } },
    fetch: async (url, options) => {
      calls.push({ url, options });
      return { ok: true, json: async () => replies.shift() };
    },
    window: { location: { assign(url) { redirects.push(url); } } },
    encodeURIComponent,
  });

  await listeners.click();
  assert.equal(calls.length, 2);
  assert.match(calls[0].url, /\/api\/print-queue\?eventId=event-123/);
  assert.equal(JSON.parse(calls[0].options.body).quantity, 1);
  assert.equal(JSON.parse(calls[0].options.body).paymentRequired, true);
  assert.equal(JSON.parse(calls[1].options.body).printItemId, "print-123");
  assert.deepEqual(redirects, ["https://paypal.example/approve"]);
  assert.equal(button.disabled, true);
});

test("retrying the same photo print request reuses its queue item", async () => {
  const queue = loadHandler(["functions", "api", "print-queue.js"]);
  const kv = createKv();
  const post = () => queue({
    request: new Request("https://booth.example/api/print-queue?eventId=party-123", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        eventId: "party-123",
        imageUrl: "https://images.example/photo.jpg",
        quantity: 1,
        paymentRequired: true,
      }),
    }),
    env: { THEMES_KV: kv },
  });

  const first = await (await post()).json();
  const retry = await (await post()).json();
  assert.equal(first.created, true);
  assert.equal(retry.created, false);
  assert.equal(retry.item.id, first.item.id);
  assert.equal(JSON.parse(kv.values.get("print-queue:party-123")).length, 1);
});
