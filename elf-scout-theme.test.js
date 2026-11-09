const { test } = require("node:test");
const assert = require("node:assert/strict");
const { existsSync } = require("node:fs");

test("Christmas for Kids catalogs the Elf Scout overlay and template set", async () => {
  const { createBuiltinThemeData } = await import("./scripts/app/themes/builtin-catalog.mjs");
  const { BUILTIN_THEMES } = createBuiltinThemeData({
    pruneUnapprovedThemes() {},
    approvedThemeKeys: new Set(),
  });
  const theme = BUILTIN_THEMES.winter.holidays.christmasKids;
  const overlays = theme.overlays.filter((entry) => entry.name.startsWith("Elf Scout"));
  const templates = theme.templates.filter((entry) => entry.name.startsWith("Elf Scout"));

  assert.equal(overlays.length, 6);
  assert.equal(templates.length, 9);

  for (const overlay of overlays) {
    assert.ok(existsSync(`.${overlay.src}`), `missing Elf Scout overlay: ${overlay.src}`);
    assert.equal(overlay.photoSlots.length, 1);
  }
  for (const template of templates) {
    assert.ok(existsSync(`.${template.src}`), `missing Elf Scout template: ${template.src}`);
  }

  const stripTemplates = templates.filter((entry) => entry.layout === "double_column");
  assert.equal(stripTemplates.length, 3);
  for (const template of stripTemplates) {
    assert.equal(template.orientation, "portrait");
    assert.deepEqual(template.photoSlots.map((slot) => slot.sourceIndex), [0, 0, 1, 1, 2, 2]);
    assert.deepEqual(template.photoSlots.map(({ x, y, width, height }) => [x, y, width, height]), [
      [0.041666666666666664, 0.19833333333333333, 0.4166666666666667, 0.23944444444444445],
      [0.5416666666666666, 0.19833333333333333, 0.4166666666666667, 0.23944444444444445],
      [0.041666666666666664, 0.4666666666666667, 0.4166666666666667, 0.23944444444444445],
      [0.5416666666666666, 0.4666666666666667, 0.4166666666666667, 0.23944444444444445],
      [0.041666666666666664, 0.735, 0.4166666666666667, 0.23944444444444445],
      [0.5416666666666666, 0.735, 0.4166666666666667, 0.23944444444444445],
    ]);
  }
  assert.equal(templates.filter((entry) => entry.layout === "single_photo").length, 6);
});
