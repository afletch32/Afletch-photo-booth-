# Canonical dimensions and slots

## Choose dimensions by asset type

| Asset | Canvas | Destination |
| --- | ---: | --- |
| Single-photo theme overlay, portrait | 1200 × 1800 px | `assets/themes/<theme>/overlays/` |
| Single-photo theme overlay, landscape | 1800 × 1200 px | `assets/themes/<theme>/overlays/` |
| Duplicate 2x6 photo-strip template on 4x6 paper | 1200 × 1800 px, portrait | `assets/themes/<theme>/templates/` |

The 1200 × 1800 sheet is a 4 × 6 inch portrait print at 300 dpi. It contains two identical 600 × 1800 px strips. A 2x6 strip layout is not a landscape 6 × 4 sheet.

The overlay-maker print-template guides use different canvases (1350 × 1800 portrait and 1800 × 1350 landscape). Do not apply those dimensions to the built-in theme overlay or 4x6 print-strip assets above. For any other asset class, inspect its current theme manifest and producing code before choosing dimensions.

## Optional bottom banner on single-photo overlays

When the user wants a banner, reserve a distinct plaque or clean text band at the bottom edge, outside the visible photo opening. Keep the art blank when the wording will be entered later, and register editable `event_name` and/or `event_date` fields in `textFields`. Place the fields inside the visible plaque and check that long names shrink cleanly. Do not bake example wording into the PNG.

The artwork can use a different plaque shape by theme, but keep it in the lower band: roughly y=0.86–0.97 on portrait frames and y=0.78–0.96 on landscape frames. Store actual field positions as normalized coordinates in each manifest entry; do not use these guide bands as a substitute for checking the finished art.

## Two identical 2x6 strips

Split the 1200 × 1800 canvas at x=600. Center and compose each strip on its own 600 px half-sheet axis, at x=300 and x=900. Do not center the pair as one composition.

The current Halloween strip templates use 50 px margins on both sides of each strip's photo slots:

- Left slot column: x=50 px, width=500 px.
- Right slot column: x=650 px, width=500 px.
- Each strip therefore has a 50 px outside margin and a 50 px margin from the photo opening to the center cut.
- The two columns have matching y positions and heights. The current three-photo rows use y=357, 823, and 1288 px, with heights 414, 414, and 413 px.
- Repeat each source photo index in both strips: rows 1, 2, and 3 use source indices 0, 1, and 2 respectively.
- Reserve the bottom 90 px of each half-sheet (y=1710 to 1800) for a requested event banner. Keep the banner and its text field inside that strip's x=50 to 550 or x=650 to 1150 bounds; do not let either cross the cut line.
- For a 4x6 template with live editable wording, keep the decorative banner background in the PNG and add matching per-strip `textFields` to `templates.json`. Use `event_name` and/or `event_date`; do not bake sample wording into the artwork unless the user asks for fixed copy.

For another slot width or margin, choose the margin `m` per strip and set the photo opening width to `600 - 2m`. Place the left opening at `x=m` and the right opening at `x=600+m`. Keep both openings and all decoration mirrored around their own strip centerlines. Check the actual cut halves and adjust only if the theme's established manifest already defines another canonical layout.

Normalized slot coordinates are pixel coordinates divided by the full canvas size. For the current 1200 × 1800 sheet, the horizontal slot values are:

| Strip | x | width |
| --- | ---: | ---: |
| Left | 0.041667 | 0.416667 |
| Right | 0.541667 | 0.416667 |

Use the exact row coordinates from the theme's `templates.json` where available; keep the left and right slot rows identical.

## Manifest and alpha

- Register single-photo frames in `overlays.json`; register double-strip print layouts in `templates.json` with `layout: "double_column"` and `orientation: "portrait"`.
- Represent each live aperture in `photoSlots` with normalized `x`, `y`, `width`, and `height`. For a double strip, include both copies and the matching `sourceIndex` values.
- When requested, represent editable banner copy in `textFields` with normalized `xPct`, `yPct`, `wPct`, and `hPct`, plus the theme-matched font, size, color, and alignment. Define two separate fields for the duplicated strip halves so the text is repeated on each cut strip.
- Preserve full PNG alpha. Photo areas must be transparent in the exported PNG, and opaque artwork must remain outside those slot rectangles.
- Keep the thumbnail at the repo's established `.thumb.webp` size and include its manifest entry without replacing the main asset record.
