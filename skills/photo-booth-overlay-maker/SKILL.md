---
name: photo-booth-overlay-maker
description: Create and add polished, transparent photo booth overlays and print-ready photo strip templates for existing Decemberbooth themes. Use when asked for single-photo frames, 4x6 print layouts, duplicate 2x6 strips, or theme-matched overlay assets.
---

# Photo Booth Overlay Maker

Create separate, production-ready image assets that match an existing booth theme. Preserve the theme's visual identity and leave live photo slots transparent. Use image-generation tools for artwork; do not replace finished image assets with SVG, HTML, CSS, or hand-drawn Python graphics.

## Workflow

1. Inspect the requested theme's idle, photo-choice, background, and thank-you screens, plus its existing `overlays.json` and `templates.json` entries.
2. Read [canonical dimensions and slots](references/canonical-dimensions.md). Treat the requested asset type and layout class as authoritative; do not copy dimensions from a thumbnail or an unrelated editor export.
3. At the start of every new overlay or template job, ask: “Would you like a banner at the bottom? If yes, what exact wording should it display?” If the user says yes but wants to enter the wording later, keep the artwork blank there and define editable `textFields`. Do not invent or bake in copy. If the user already answered both parts for this job, use those answers without asking again.
4. Write a short asset plan naming the theme, file type, orientation, canvas size, layer role, banner treatment, and every photo slot.
5. Compose portrait and landscape artwork independently. For a 4x6 duplicate-strip sheet, create only the portrait sheet unless the user asks for another print layout.
6. Generate each asset as a separate transparent PNG. Keep decoration out of photo windows and safe from the cut line. A requested bottom banner may have a solid theme-matched plaque, but leave the live text area clear.
7. Resize only within the same aspect ratio when the generator's output dimensions differ. Preserve alpha; never stretch or crop one orientation into another.
8. Add single-photo assets to the theme's `overlays/` folder and `overlays.json`. Add print strip templates to `templates/` and `templates.json`. Preserve existing records and naming conventions.
9. Create or refresh the matching `.thumb.webp` preview using the repo's established thumbnail dimensions.
10. Validate image dimensions, alpha, slot geometry, banner clearance, both cut strips, and the rendered design at actual print/display scale. Update `BUILD_STATUS.md` when the repo assets change.
11. Report exact paths, dimensions, layout class, alpha status, normalized slot coordinates, banner wording or editable field keys, and validation results.

## Visual rules

- Match the existing theme's palette, type, lighting, materials, depth, and decorative density. Treat supplied examples as layout and finish references, not as art to copy.
- Keep the entire live-photo area transparent in the PNG. Do not use opaque placeholder colors in exported assets; those colors may appear only in a separate preview mockup.
- Keep text and decoration outside live-photo slots. Do not bake in guest photos, QR codes, controls, or unrelated wording.
- Keep the bottom banner outside live-photo slots. When event text is meant to be entered later, use editable fields for `event_name` and/or `event_date`, sized to fit the blank banner zone.
- For paired 2x6 strips, duplicate the complete strip artwork and photo-slot geometry exactly across both halves. Center each half independently; never center the entire sheet as one strip.
- When a banner is requested on a 4x6 strip template, repeat the same blank footer banner on both 2x6 strips and define corresponding editable text fields for each half.
- Inspect each strip after a simulated center cut. The outside margin and cut-edge margin of each strip must match.
- Keep the transparent photo apertures large, clean, and unobstructed. Use the existing manifest's slot geometry for the requested class whenever it exists.

## Resources

- Read [canonical dimensions and slots](references/canonical-dimensions.md) for production sizes, the 4x6 duplicate-strip geometry, and manifest coordinates.
