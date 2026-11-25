const { test, expect } = require("@playwright/test");

function boothTestUrl() {
  const url = new URL(process.env.BOOTH_QA_URL || "http://127.0.0.1:4321/");
  url.searchParams.set("testMode", "booth");
  return url.toString();
}

test("theme categories stay visible for a saved wedding", async ({ page }) => {
  await page.addInitScript(() => {
    const event = {
      id: "theme-visibility-wedding",
      name: "Taylor and Morgan Wedding",
      date: "2026-06-14",
      eventType: "wedding",
      themeKey: "wedding:eucalyptusGarden",
      weddingThemeStyle: "eucalyptus",
      partner1: "Taylor",
      partner2: "Morgan",
      weddingTheme: { name: "Eucalyptus Garden Wedding" },
      printPrice: 3,
      overrides: {},
    };
    localStorage.setItem("photoboothEvents", JSON.stringify([event]));
    localStorage.setItem("photoboothActiveEventId", event.id);
  });

  await page.goto(boothTestUrl(), { waitUntil: "domcontentloaded" });
  await page.waitForFunction(() => !!window.__photoboothQA);
  await expect(page.locator("#themeQuickPicker")).toBeVisible();
  await expect(page.locator("#themeQuickFilters")).toBeVisible();
  expect(await page.locator("#themeQuickGrid [data-theme-key]").count()).toBeGreaterThan(0);
  await expect(page.locator("#startWeddingSetupBtn")).toHaveText("Edit Wedding Setup");

  await page.locator("#startWeddingSetupBtn").click();
  await expect(page.locator("#weddingEventSetup")).toBeVisible();
  await expect(page.locator("#themeQuickPicker")).toBeHidden();

  await page.locator("#cancelWeddingSetupBtn").click();
  await expect(page.locator("#weddingEventSetup")).toBeHidden();
  await expect(page.locator("#themeQuickPicker")).toBeVisible();
});
