- Christmas strip layout revision (2026-11-02): Removed the leftover empty footer by spreading three equal photo openings down the full strip. The template has no banner, text, or penguins.
- Christmas strip revision (2026-11-02): Removed the banner and penguin footer, completed the third icy frame, and aligned all six transparent openings to canonical print slots.

- Christmas for Kids overlays (2026-11-02): Added matching transparent polar-bear and icy-frame portrait and landscape overlays. The bear sits in the lower corner and may overlap the photo opening edge.
- Christmas for Kids minimal strip (2026-11-09): Added the clean 4x6 double-column strip to the catalog and template manifest with matching canonical six-slot geometry.
- Elf Scout overlay/template set (2026-11-09): Added six transparent portrait and landscape overlays, six single-photo templates, and three duplicated 2x6 strip templates to Christmas for Kids. Both copies use canonical six-slot geometry; artwork is banner-free.
- Christmas theme (2026-11-02): Added portrait and landscape idle, photo-choice, background, and Thank You art to the approved Christmas catalog.
- Wedding theme packs (2026-11-09): Added reusable Eucalyptus Garden and Minimal Botanical wedding records with orientation-specific screens, overlays, and print templates.
- Photo booth overlay-maker skill (2026-10-30): Added canonical dimensions, transparent slot rules, duplicate-strip geometry, and banner guidance.
- Photo booth theme-builder skill (2026-11-02): Added the reusable theme workflow for matched screen art and invisible responsive hotspots.

- Saved catalog migration (2026-11-09): Existing saved Christmas for Kids themes now adopt missing built-in overlays and templates while honoring assets explicitly removed by the user. The app-shell cache was bumped to v85 so existing booths receive the migration. Four focused theme/catalog tests pass.

# Build status

- Christmas for Kids overlay refinement (2026-11-02): Added matching transparent portrait and landscape icy frames with the polar bear in the lower corner. The bear may overlap the photo opening edges, and the openings now use most of each frame.

- Current goal: Keep setup theme browsing clear and make holiday assets discoverable by category.
- Done: Removed the duplicate Browse All Themes dropdown; the main picker remains. Avery's Birthday is cataloged under General and the picker classifies it as General. Holiday filters load built-in and remote assets; production Christmas results verified at 13 cards (backgrounds and templates).
- In progress: None for the completed catalog and theme updates.
- Next steps: Verify the catalog changes on the production booth after deployment.
- Known bugs/blockers: Physical iPad/Safari/camera and print output still need device verification.
- Important decisions: Keep holiday filtering view-only and preserve existing assets and theme approval rules.
- Production target: Cloudflare Pages project `decemeberbooth`, branch `main`, `https://decemeberbooth.pages.dev/`.
- Face tracking performance (2026-10-28): Moved MediaPipe inference into a module worker, capped scheduling at about 3.3 frames/second, downsized analysis frames to 320px, and kept preview processing nonblocking with a fallback when worker support or loading fails. Focused tracker tests pass (2/2); focused browser checks pass (2/2). Full suite currently has one unrelated setup-picker assertion failure; physical camera/iPad performance remains unverified.
- Beauty engine fix (2026-10-28): Corrected the lazy import from the booth renderer to `scripts/beauty/engine.mjs`; included in this release. Full suite now passes 301/301.
- Gallery typography (2026-10-27): Gallery headings use Montserrat and body text uses Inter regardless of booth theme font settings; theme colors and logos still apply. Focused gallery browser checks pass locally and on production (3/3 each). Full suite is 300/301 with the known unrelated Halloween manifest fixture failure. Commit `8b12b22` is pushed to `main` and active on Pages Production (`a1bed870`).

- Kiosk launch (2026-10-30): The setup launch action starts the guest booth and requests browser full screen; returning to Admin exits full screen. Documented that device locking still requires the OS kiosk feature, such as iPad Guided Access.
- Halloween choices and share preview (2026-10-31): Added transparent caption-frame portrait and landscape overlays to both built-in Halloween theme packs, so each offers multiple frame choices. The frame picker closes and hides when a capture enters final/share preview. Full unit suite passes (294 passed, 9 skipped); the focused Playwright test is blocked here because the sandbox cannot bind its local test server (`EPERM` on `127.0.0.1:4321`).

- Browser regression investigation (2026-11-08): Updated export checks for `{ previewUrl, blob }` JPEG results and compared filter parity against a JPEG reference with matching canvas settings. Selected Halloween portrait previews by asset source, limited the pizza renderer check to pizza artwork, and updated Cheer migration counts for the retained tea-party assets. Kiosk coverage now opens Share before clicking Launch; guest interaction checks wait for actionable controls and measure settled geometry with a fixed theme. The swipe fixture disables remote sync and waits for capture readiness before injecting frames. No application runtime files changed. Validation: 85 browser tests passed, 18 existing tests skipped, zero failures; all 303 unit tests passed. The swipe check also passed three consecutive isolated runs. Browser verification used `PLAYWRIGHT_EXECUTABLE_PATH=/usr/bin/chromium`. Release path: Cloudflare Pages Git integration deploys pushes to `main`; a local `CLOUDFLARE_API_TOKEN` is not required. The release preserves the latest Christmas for Kids production changes.
- Christmas for Kids (2026-11-02): Added a separate kid-friendly Christmas theme with portrait and landscape idle, photo-choice, camera background, and Thank You screens. Start and photo-choice hit targets align with the illustrated controls; the Start target uses the existing hotspot press feedback. Transparent portrait and landscape single-photo overlays and 4x6 print templates with two identical 2x6 strips are included. Photo apertures are transparent and use canonical strip geometry; the templates have no banner.

- Browser-fix production release (2026-11-08): Integrated the browser fixes with the latest production Christmas for Kids assets. All 304 unit tests passed. All 85 active browser cases passed across the release run and startup recheck, with 18 pre-existing skips; a transient socket reset affected the initial mobile startup request, and all three startup viewports passed on rerun. Release uses the existing Cloudflare Pages Git integration on `main`, which does not need a token in the local environment.
