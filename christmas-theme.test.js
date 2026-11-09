const { test } = require("node:test");
const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");

test("Christmas has a complete, dimensioned booth screen pack", async () => {
  const { createBuiltinThemeData } = await import("./scripts/app/themes/builtin-catalog.mjs");
  const { BUILTIN_THEMES } = createBuiltinThemeData({ pruneUnapprovedThemes() {}, approvedThemeKeys: new Set() });
  const theme = BUILTIN_THEMES.winter.holidays.christmas;
  assert.equal(theme.idleScreens.length, 4);
  assert.equal(theme.thankYouScreens.length, 2);
  assert.equal(theme.backgrounds[0], "/assets/themes/christmas/christmas-background-landscape.png");
  assert.equal(theme.backgrounds[1], "/assets/themes/christmas/christmas-background-portrait.png");

  const assets = [
    ["christmas-idle-portrait.png", 1200, 1800],
    ["christmas-idle-landscape.png", 1800, 1200],
    ["christmas-photo-choice-portrait.png", 1200, 1800],
    ["christmas-photo-choice-landscape.png", 1800, 1200],
    ["christmas-background-portrait.png", 1200, 1800],
    ["christmas-background-landscape.png", 1800, 1200],
    ["christmas-thank-you-portrait.png", 1200, 1800],
    ["christmas-thank-you-landscape.png", 1800, 1200],
  ];
  for (const [name, width, height] of assets) {
    const png = readFileSync(`assets/themes/christmas/${name}`);
    assert.deepEqual([...png.subarray(0, 8)], [137, 80, 78, 71, 13, 10, 26, 10]);
    assert.equal(png.readUInt32BE(16), width, `${name} width`);
    assert.equal(png.readUInt32BE(20), height, `${name} height`);
  }

  const portraitChoices = theme.idleScreens.find((screen) => screen.orientation === "portrait" && screen.role === "photo-choice");
  const landscapeChoices = theme.idleScreens.find((screen) => screen.orientation === "landscape" && screen.role === "photo-choice");
  assert.deepEqual(Object.keys(portraitChoices.buttonZones).sort(), ["photoStrip", "singlePhoto"]);
  assert.deepEqual(Object.keys(landscapeChoices.buttonZones).sort(), ["photoStrip", "singlePhoto"]);
  assert.equal(theme.idleScreens.filter((screen) => screen.role === "idle").length, 2);
});
