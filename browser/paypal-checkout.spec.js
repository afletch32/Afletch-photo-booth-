const { test, expect } = require("@playwright/test");

test("admin reports live PayPal checkout and server price", async ({ page }) => {
  await page.route("**/api/paypal/config**", (route) => route.fulfill({
    status: 200,
    contentType: "application/json",
    body: JSON.stringify({
      ok: true,
      configured: true,
      environment: "live",
      amount: "3.00",
      currency: "USD",
      clientId: "public-client-id",
    }),
  }));

  await page.goto("/index.html", { waitUntil: "domcontentloaded" });

  await expect(page.locator("#paypalPrintConfigStatus"))
    .toHaveText("PayPal live checkout ready · 3.00 USD per print.");
});

test("operator saves one PayPal print price on a saved event", async ({ page }) => {
  const events = [{ id: "party", name: "Party", date: "2026-10-10", themeKey: "general:summer", eventType: "party", printPrice: 3 }];
  let savedPrice = 3;
  await page.addInitScript(() => {
    localStorage.setItem("photoboothEvents", JSON.stringify([
      { id: "party", name: "Party", date: "2026-10-10", themeKey: "general:summer", eventType: "party", printPrice: 3 },
    ]));
    localStorage.setItem("photoboothActiveEventId", "party");
    localStorage.setItem("photoboothPrintSettings", JSON.stringify({ mode: "paid", eventId: "party" }));
  });
  await page.route("**/api/events**", async (route) => {
    if (route.request().method() === "GET") {
      return route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ events, activeEventId: "party" }) });
    }
    const payload = route.request().postDataJSON();
    savedPrice = payload.events.find((event) => event.id === "party").printPrice;
    return route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ ok: true }) });
  });
  await page.route("**/api/paypal/config**", async (route) => route.fulfill({
    status: 200,
    contentType: "application/json",
    body: JSON.stringify({
      ok: true,
      configured: true,
      environment: "live",
      amount: Number(savedPrice).toFixed(2),
      currency: "USD",
      clientId: "public-client-id",
    }),
  }));

  await page.goto("/index.html", { waitUntil: "domcontentloaded" });
  await page.waitForFunction(() => !!window.__photoboothTest);
  await page.waitForFunction(() =>
    document.documentElement.dataset.priceVisibilityBound === "true"
  );
  await page.locator("#printModeInput").selectOption("paid");
  await page.locator("#printModeInput").dispatchEvent("change");
  await expect(page.locator("#eventPrintPriceSettings")).not.toHaveAttribute("hidden");
  await expect(page.locator("#eventPrintPriceInput")).toBeEnabled();
  await page.locator("#eventPrintPriceInput").fill("5.50");
  await page.locator("#saveEventPrintPriceBtn").click();

  await expect.poll(() => savedPrice).toBe(5.5);
  await expect(page.locator("#paypalPrintConfigStatus"))
    .toHaveText("PayPal live checkout ready · 5.50 USD per print.");
});

test("operator can enable paid printing and set the price during wedding setup", async ({ page }) => {
  await page.route("**/api/events**", (route) => route.fulfill({
    status: 200,
    contentType: "application/json",
    body: JSON.stringify({ events: [], activeEventId: "" }),
  }));
  await page.goto("/index.html", { waitUntil: "domcontentloaded" });
  await page.waitForFunction(() => !!window.__photoboothTest);
  await page.waitForFunction(() =>
    document.documentElement.dataset.priceVisibilityBound === "true"
  );

  await page.locator("#startWeddingSetupBtn").click();
  await expect(page.locator("#printModeSetupField")).toBeVisible();
  await page.locator("#printModeInput").selectOption("paid");
  await expect(page.locator("#eventPrintPriceSettings")).toBeVisible();
  await page.locator("#eventPartner1Input").fill("Alex");
  await page.locator("#eventPartner2Input").fill("Jordan");
  await page.locator("#eventDateInput").fill("2026-12-12");
  await page.locator("#createWeddingEventBtn").click();

  await expect(page.locator("#eventPrintPriceInput")).toBeEnabled();
  await page.locator("#eventPrintPriceInput").fill("7.25");
  await page.locator("#saveEventPrintPriceBtn").click();
  await expect.poll(() => page.evaluate(() =>
    window.__photoboothTest.getActiveEvent()?.printPrice
  )).toBe(7.25);
});

test("paid event checkout is not shown on the booth finish screen", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const event = { id: "wedding", name: "Wedding", themeKey: "wedding", printPrice: 5.5 };
  await page.addInitScript(() => {
    localStorage.setItem("photoboothEvents", JSON.stringify([
      { id: "wedding", name: "Wedding", themeKey: "wedding", printPrice: 5.5 },
    ]));
    localStorage.setItem("photoboothActiveEventId", "wedding");
    localStorage.setItem("photoboothPrintSettings", JSON.stringify({ mode: "paid", eventId: "wedding" }));
  });
  await page.route("**/api/events**", (route) => route.fulfill({
    status: 200,
    contentType: "application/json",
    body: JSON.stringify({ events: [event], activeEventId: event.id }),
  }));
  await page.goto("/index.html?testMode=booth&testPaidPrint=true", { waitUntil: "domcontentloaded" });
  await page.evaluate(() => new Promise((resolve) => {
    requestAnimationFrame(() => {
      window.__photoboothQA.enterState("final");
      requestAnimationFrame(resolve);
    });
  }));

  await expect(page.locator("#finalPreview")).toHaveClass(/show/, { timeout: 15000 });
  await expect(page.locator("#requestPrintBtn")).toHaveCount(0);
  await expect(page.locator("#paypalPrintCheckout")).toHaveCount(0);
  await expect(page.locator("#qrCodeContainer")).toBeVisible();
});

test("phone payment return confirms the capture without opening booth checkout", async ({ page }) => {
  let capturePayload = null;
  await page.route("**/api/paypal/capture-order", async (route) => {
    capturePayload = route.request().postDataJSON();
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ ok: true, paid: true }),
    });
  });

  await page.goto("/pay-print.html?eventId=summer-fair&printItemId=print-123&token=order-123&flow=return");

  await expect(page.locator("#payment-status"))
    .toHaveText("Payment confirmed. Your print is ready with the booth attendant.");
  expect(capturePayload).toEqual({ eventId: "summer-fair", printItemId: "print-123", orderId: "order-123" });
});

test("phone payment cancel return does not capture the order", async ({ page }) => {
  let captureCalled = false;
  await page.route("**/api/paypal/capture-order", async (route) => {
    captureCalled = true;
    await route.fulfill({ status: 500, body: "unexpected capture" });
  });

  await page.goto("/pay-print.html?eventId=summer-fair&printItemId=print-123&flow=cancel");

  await expect(page.locator("#payment-status"))
    .toHaveText("Payment was canceled. Your print is still waiting for payment.");
  expect(captureCalled).toBe(false);
});

test("paid print mode keeps checkout off the booth finish screen", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.addInitScript(() => {
    localStorage.setItem("photoboothEvents", JSON.stringify([
      { id: "party", name: "Party", date: "2026-11-23", themeKey: "general:summer", printPrice: 3 },
    ]));
    localStorage.setItem("photoboothActiveEventId", "party");
    localStorage.setItem("photoboothPrintSettings", JSON.stringify({ mode: "paid", eventId: "party" }));
  });
  await page.route("**/api/events**", (route) => route.fulfill({
    status: 200,
    contentType: "application/json",
    body: JSON.stringify({ events: [{ id: "party", name: "Party", printPrice: 3 }], activeEventId: "party" }),
  }));
  await page.goto("/index.html?testMode=booth&testPaidPrint=true", { waitUntil: "domcontentloaded" });
  await page.waitForFunction(() => !!window.__photoboothTest);
  await page.evaluate(() => window.__photoboothQA.enterState("final"));
  await expect(page.locator("#finalPreview")).toHaveClass(/show/, { timeout: 15_000 });
  await expect(page.locator("#requestPrintBtn")).toHaveCount(0);
  await expect(page.locator("#paypalPrintCheckout")).toHaveCount(0);
  await expect(page.locator("#qrCodeContainer")).toBeVisible();
  await page.locator("#finishBoothBtn").click();
  await expect(page.locator("#finalPreview")).not.toHaveClass(/show/);
});
