const { test } = require("@playwright/test");
const assert = require("node:assert/strict");

function boothTestUrl() {
  const url = new URL(process.env.BOOTH_QA_URL || "http://127.0.0.1:4321/");
  url.searchParams.set("testMode", "booth");
  return url.toString();
}

test("guest options are remembered and retake stays hidden when disabled", async ({ page }) => {
  await page.goto(boothTestUrl(), { waitUntil: "domcontentloaded" });
  await page.waitForFunction(() => !!window.__photoboothQA);
  const options = [
    ["#allowRetakes", "photoboothAllowRetakes"],
    ["#livePhotoToggle", "photoboothLivePhoto"],
    ["#recordingModeToggle", "photoboothRecordingMode"],
    ["#themeSoundToggle", "photoboothThemeSounds"],
  ];
  for (const [selector, storageKey] of options) {
    await page.locator(selector).evaluate((toggle) => {
      toggle.checked = false;
      toggle.dispatchEvent(new Event("change", { bubbles: true }));
    });
    assert.equal(await page.evaluate((key) => localStorage.getItem(key), storageKey), "false");
  }

  await page.reload({ waitUntil: "domcontentloaded" });
  await page.waitForFunction(() => !!window.__photoboothQA && !!document.querySelector("#allowRetakes"));
  for (const [selector] of options) {
    assert.equal(await page.locator(selector).isChecked(), false, `${selector} should retain its last setting`);
  }
  const retakeButtonDisplay = await page.evaluate(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 32;
    canvas.height = 32;
    canvas.getContext("2d").fillRect(0, 0, canvas.width, canvas.height);
    window.__photoboothQA.showFinal(canvas.toDataURL(), { skipShare: true });
    return getComputedStyle(document.querySelector("#reviewRetakeBtn")).display;
  });
  assert.equal(retakeButtonDisplay, "none");
});
