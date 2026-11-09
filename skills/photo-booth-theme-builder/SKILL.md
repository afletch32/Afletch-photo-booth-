---
name: photo-booth-theme-builder
description: Plan and create reusable Decemberbooth event themes with matching idle screens, responsive artwork-aligned touch targets, and theme-matched visual feedback. Use when creating a new booth theme or adapting artwork for portrait and landscape booth screens.
---

# Photo Booth Theme Builder

Create a cohesive, reusable event theme for Decemberbooth. Keep the guest flow simple, make supplied artwork the visual source of truth, and use the app's existing theme and hotspot behavior wherever possible.

## Start with the theme plan

1. Inspect `DECEMBERBOOTH_IDENTITY.md`, `AGENTS.md`, the theme's existing asset folders and manifest, and the current theme renderer before making assets or code changes.
2. Confirm the event or theme name, intended audience, supplied artwork, and which screens the user wants. If a necessary choice is missing, ask before generating that part. Do not invent event names, dates, logos, or copy.
3. Identify the required orientations and screen roles. Keep portrait and landscape compositions intentional; do not crop one finished composition to make the other.
4. Summarize the asset plan briefly: screens, orientations, visual style, any editable text, and the button artwork that will receive the Start touch target.

## Idle screen and Start interaction

- Draw the visible Start control into the idle-screen artwork itself. It can look like a sign, badge, button, object, or other theme element. Do not add a second visible HTML button or duplicate “Tap to Start” label over the artwork.
- The artwork is the visual source of truth. The app's real accessible Start button is a single transparent hit target positioned over the artwork's existing Start control. Preserve its semantic label, keyboard activation, and visible keyboard focus treatment.
- Use the existing idle-screen manifest contract, including `buttonZones.start` and the `hotspot` variant, when the screen has a designed Start control. Do not add a parallel button system or new interaction framework.
- Define each hotspot in normalized percentages (`x`, `y`, `width`, `height`) relative to that orientation's full artwork. Center the hit target on the visible control and make it large enough for a comfortable iPad tap without covering nearby interactive regions. Set portrait and landscape positions independently.
- The Start hotspot must not obscure the idle art at rest. Keep the existing pressed feedback brief and theme-compatible; the current `hotspot` treatment supplies a translucent tint on press. Do not bake an extra idle-state button, glow, or duplicate control into a separate overlay.
- If the built-in pressed tint clashes with the artwork, first tune the existing hotspot treatment through the app's established theme styling. Only propose a new pressed-state asset or renderer change when the existing contract cannot produce the requested effect, and explain the smallest required change.
- Verify that the artwork's visible Start control and hotspot remain aligned at narrow and wide aspect ratios, with the app's actual contain/crop behavior. Check the setup preview and guest screen when available.
- If the artwork has no Start control, use the app's ordinary single Start button; do not create a misleading invisible hotspot.

## Other theme screens and assets

- Follow the existing theme manifest, asset naming, directory, and service-worker rules. Reuse current app contracts rather than adding a one-off theme implementation.
- Keep guest screens mobile-first, legible at iPad viewing distance, and visually consistent across idle, capture, photo choice, final/share, and thank-you screens that are requested.
- Keep photo-choice targets invisible over artwork only when the app's existing hotspot behavior is used. Do not draw decorative controls that appear to be additional clickable buttons.
- Keep overlays slot-based and use `skills/photo-booth-overlay-maker/SKILL.md` for overlay or print-template artwork. Do not duplicate photo storage or alter stable gallery/share behavior as part of theme work.
- Preserve user-supplied art and brand marks. Avoid busy decoration, tiny text, thin details, and unrequested screens or wording.
- Keep code modular and vanilla HTML/CSS/JS. If application modules, styles, or shell assets change, follow `AGENTS.md`, including service-worker precache and cache-version updates.

## Completion checks

1. Confirm there is one visible Start control in the idle artwork and one real Start hit target in the interface.
2. Confirm the Start target is correctly placed and sized separately for each orientation.
3. Confirm a tap produces visible pressed feedback, releases cleanly, and starts the normal guest flow once.
4. Confirm keyboard focus remains visible and the target can be activated accessibly.
5. Check theme asset records and paths, and ensure no unrelated files are included in the change.
6. For app-code changes, use the relevant validation required by `AGENTS.md`, update `BUILD_STATUS.md`, and follow the repo's release instructions. For artwork-only or skill-only changes, report the files and the checks actually performed without claiming an app release.

## Report back

Give the user a concise list of the theme assets or files created, the orientations and screen roles covered, the hotspot placement approach, and any remaining question or limitation. Clearly distinguish a saved skill or asset from a deployed application change.
