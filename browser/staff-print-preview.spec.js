const { test, expect } = require("@playwright/test");

test("empty session default preview follows portrait and landscape paper settings", async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem("photoboothStaffPrintOrientation", "portrait");
  });
  await page.route("**/api/print-queue?eventId=qa-preview", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ ok: true, items: [] }),
    })
  );

  await page.goto("/staff-print.html?eventId=qa-preview", {
    waitUntil: "domcontentloaded",
  });
  await expect(page.locator("#queueStatus")).toContainText("0 active items");
  await expect(page.locator("#printPreviewSheet")).toHaveClass(
    /print-preview-sheet portrait single/
  );

  await page.locator("#printOrientation").selectOption("landscape");

  await expect(page.locator("#printPreviewSheet")).toHaveClass(
    /print-preview-sheet landscape single/
  );
  await expect(page.locator("#printPreviewSummary")).toContainText(
    "landscape 6×4"
  );
});

test("expanded queued photo preview follows its orientation override", async ({ page }) => {
  const imageUrl = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='40'%3E%3Crect width='64' height='40' fill='%23abc'/%3E%3C/svg%3E";
  await page.addInitScript(() => {
    localStorage.setItem("photoboothStaffPrintOrientation", "portrait");
    localStorage.setItem("photoboothStaffPrintOverrides:qa-preview", JSON.stringify({
      "queue-1": { layout: "single", orientation: "landscape" },
    }));
  });
  await page.route("**/api/print-queue?eventId=qa-preview", (route) => route.fulfill({
    status: 200,
    contentType: "application/json",
    body: JSON.stringify({
      ok: true,
      items: [{
        id: "queue-1",
        eventId: "qa-preview",
        imageUrl,
        thumbnailUrl: imageUrl,
        createdAt: "2026-11-24T12:00:00.000Z",
        quantity: 1,
        paymentStatus: "paid",
        printStatus: "new",
        paymentRequired: true,
      }],
    }),
  }));

  await page.goto("/staff-print.html?eventId=qa-preview", { waitUntil: "domcontentloaded" });
  await expect(page.locator("#printPreviewLabel")).toHaveText("Session default preview");
  await expect(page.locator("#printPreviewSheet")).toHaveClass(/print-preview-sheet portrait single/);

  await page.locator('[data-action="toggle-print-settings"][data-id="queue-1"]').click();

  await expect(page.locator("#printPreviewLabel")).toHaveText("Selected photo preview");
  await expect(page.locator("#printPreviewSheet")).toHaveClass(/print-preview-sheet landscape single/);
  await expect(page.locator("#printPreviewSummary")).toContainText("landscape 6×4");

  await page.locator('select[data-print-setting="orientation"][data-id="queue-1"]').selectOption("portrait");
  await expect(page.locator("#printPreviewSheet")).toHaveClass(/print-preview-sheet portrait single/);
  await expect(page.locator("#printPreviewSummary")).toContainText("portrait 4×6");
});
