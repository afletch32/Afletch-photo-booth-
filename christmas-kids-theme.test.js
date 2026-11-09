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
  assert.equal(theme.templates.length, 11);
  assert.equal(theme.templates[1].layout, "double_column");
  assert.ok(existsSync(`.${theme.templates[1].src}`), "missing minimal Christmas photo strip template");
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

test("saved Christmas for Kids themes adopt new catalog assets without restoring removals", async () => {
  const { createBuiltinThemeData } = await import("./scripts/app/themes/builtin-catalog.mjs");
  const { createCatalogStorageModule } = await import("./scripts/app/themes/catalog-storage.mjs");
  const { BUILTIN_THEMES } = createBuiltinThemeData({
    pruneUnapprovedThemes() {},
    approvedThemeKeys: new Set(),
  });
  const builtin = BUILTIN_THEMES.winter.holidays.christmasKids;
  const removedSrc = builtin.overlays[2].src;
  const savedThemes = {
    winter: {
      holidays: {
        christmasKids: {
          overlays: builtin.overlays.slice(0, 2),
          overlaysRemoved: [removedSrc],
          templates: builtin.templates.slice(0, 1),
        },
      },
    },
  };
  const storage = createCatalogStorageModule({
    BUILTIN_THEMES,
    getAssetEntrySrc: (entry) => (typeof entry === "string" ? entry : entry?.src || ""),
    cloneThemeValue: (value) => JSON.parse(JSON.stringify(value)),
  });

  assert.equal(storage.migrateChristmasKidsCatalogAssets(savedThemes), true);
  const saved = savedThemes.winter.holidays.christmasKids;
  assert.equal(saved.overlays.length, builtin.overlays.length - 1);
  assert.equal(saved.templates.length, builtin.templates.length);
  assert.ok(!saved.overlays.some((overlay) => overlay.src === removedSrc));
  assert.equal(storage.migrateChristmasKidsCatalogAssets(savedThemes), false);
});
