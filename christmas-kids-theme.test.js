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
  assert.equal(theme.overlays.length, 10);
  assert.equal(theme.templates.length, 10);
  assert.deepEqual(theme.overlays.slice(2, 4).map((overlay) => overlay.photoSlots[0]), [
    { x: 0.075, y: 0.07, width: 0.85, height: 0.85, borderRadius: 0 },
    { x: 0.09, y: 0.09, width: 0.82, height: 0.82, borderRadius: 0 },
  ]);
  assert.equal(theme.templates[0].layout, "double_column");
  assert.equal(theme.templates[0].orientation, "portrait");
  assert.equal(theme.templates[0].photoSlots.length, 6);
  assert.deepEqual(theme.templates[0].photoSlots.map((slot) => slot.sourceIndex), [0, 0, 1, 1, 2, 2]);
  assert.equal(theme.templates[0].textFields, undefined);
  assert.deepEqual(theme.templates[0].photoSlots.map(({ x, y, width, height }) => [x, y, width, height]), [
    [0.041666666666666664, 0.19833333333333333, 0.4166666666666667, 0.23944444444444445],
    [0.5416666666666666, 0.19833333333333333, 0.4166666666666667, 0.23944444444444445],
    [0.041666666666666664, 0.4666666666666667, 0.4166666666666667, 0.23944444444444445],
    [0.5416666666666666, 0.4666666666666667, 0.4166666666666667, 0.23944444444444445],
    [0.041666666666666664, 0.735, 0.4166666666666667, 0.23944444444444445],
    [0.5416666666666666, 0.735, 0.4166666666666667, 0.23944444444444445],
  ]);
  assert.ok(existsSync(`.${theme.templates[0].src}`), "missing Christmas photo strip template");

  for (const overlay of theme.overlays) {
    assert.ok(existsSync(`.${overlay.src}`), `missing photo overlay: ${overlay.src}`);
  }
  for (const overlay of theme.overlays.slice(0, 2)) {
    assert.deepEqual(overlay.photoSlots, [
      { x: 0.25, y: 0.25, width: 0.5, height: 0.5, borderRadius: 0 },
    ]);
  }

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
