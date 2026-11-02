const { test } = require("node:test");
const assert = require("node:assert/strict");
const { existsSync } = require("node:fs");

test("Christmas for Kids includes both orientations and artwork-aligned hotspots", async () => {
  const { createBuiltinThemeData } = await import("./scripts/app/themes/builtin-catalog.mjs");
  const { BUILTIN_THEMES } = createBuiltinThemeData({
    pruneUnapprovedThemes() {},
    approvedThemeKeys: new Set(),
  });
  const theme = BUILTIN_THEMES.winter.holidays.christmasKids;

  assert.equal(theme.idleScreens.filter((screen) => screen.role === "idle").length, 2);
  assert.equal(theme.idleScreens.filter((screen) => screen.role === "photo-choice").length, 2);
  assert.equal(theme.thankYouScreens.length, 2);
  assert.equal(theme.backgrounds.length, 2);

  const assets = [
    ...theme.backgrounds,
    ...theme.idleScreens.map((screen) => screen.src),
    ...theme.thankYouScreens.map((screen) => screen.src),
  ];
  for (const asset of assets) {
    assert.ok(existsSync(`.${asset}`), `missing theme artwork: ${asset}`);
  }

  for (const screen of theme.idleScreens.filter((entry) => entry.role === "idle")) {
    assert.equal(screen.buttonZones.start.variant, "hotspot");
  }
  for (const screen of theme.idleScreens.filter((entry) => entry.role === "photo-choice")) {
    assert.deepEqual(Object.keys(screen.buttonZones).sort(), ["photoStrip", "singlePhoto"]);
  }
});
