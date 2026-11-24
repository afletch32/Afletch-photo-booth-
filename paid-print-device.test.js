const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const read = (...parts) => fs.readFileSync(path.join(__dirname, ...parts), "utf8");

test("paid printing starts from the guest photo page instead of the booth screen", () => {
  const services = read("scripts", "app", "settings", "services.mjs");
  const finalOutput = read("scripts", "app", "sharing", "final-output.mjs");
  const createOrder = read("functions", "api", "paypal", "create-order.js");
  const sharePage = read("functions", "share", "[id].js");
  const boothHtml = read("index.html");

  assert.ok(!boothHtml.includes('id="requestPrintBtn"'));
  assert.ok(!finalOutput.includes("enqueueFinalPrintIfNeeded"));
  assert.ok(sharePage.includes('id="order-print"'));
  assert.ok(sharePage.includes('fetch("/api/paypal/create-order"'));
  assert.ok(sharePage.includes('window.location.assign(order.approvalUrl)'));
  assert.ok(!services.includes("paypal.com/sdk/js"));
  assert.ok(!services.includes("paypal.Buttons("));
  assert.ok(createOrder.includes('link.rel === "approve" || link.rel === "payer-action"'));
});

test("PayPal return page captures payment and is included in the app shell", () => {
  const paymentPage = read("scripts", "pay-print-page.mjs");
  const html = read("pay-print.html");
  const serviceWorker = read("sw.js");

  assert.ok(paymentPage.includes('fetch("/api/paypal/capture-order"'));
  assert.ok(paymentPage.includes("Payment confirmed. Your print is ready with the booth attendant."));
  assert.ok(html.includes('<h1 id="payment-title">Complete your payment</h1>'));
  assert.ok(serviceWorker.includes('"pay-print"'));
  assert.ok(serviceWorker.includes('"scripts/pay-print-page.mjs"'));
  assert.ok(serviceWorker.includes('"styles/pay-print.css"'));
});
