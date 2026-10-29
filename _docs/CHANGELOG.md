# Changelog

## 2026-03-03
- Created `_Vectors/index.html` geometric SVG gallery page.
- Added 12 reusable placeholder logo vector concepts.
- Added per-card `Copy SVG` and `Download` actions.
- Added `_Vectors/_docs` baseline documentation structure and `data/` folder.
- Expanded gallery with 8 Japanese crest/pattern-inspired vector concepts.
- Rebuilt `_Vectors/index.html` into a parametric tileable Japanese pattern lab.
- Added mathematically repeating generators for: Asanoha, Yagasuri, Seigaiha, Ichimatsu, Shippo, Kikko, Karakusa, Uroko, and Mameshibori.
- Added live controls for repetitions per frame, line thickness, line color, accent color, background color, and frame size.
- Merged the original static vector concepts back into the page as a dedicated `Static Vector Gallery` section.
- Reworked tile generators against `_Vectors/_references/*.jpg` to better match pattern structure and repeat geometry.
- Corrected `Yagasuri` to a clean geometric arrow tessellation with consistent repeat spacing.
- Fixed `Shippo` blank rendering by replacing non-stroked arc paths with explicit interlocking circle strokes.
- Rebuilt `Seigaiha` using constant radial increments for complete, uniformly spaced wave arcs.
- Refined `Asanoha` with denser internal construction geometry (triangular centroid lines) for fuller traditional structure.
- Updated `Seigaiha` again to enforce stronger row interlock (offset centers + shared-radius cadence).
- Updated `Shippo` again to a tighter circle lattice construction for canonical linked-circle appearance.
- Reworked `Asanoha` to a stricter lattice + six-direction spoke construction for closer reference matching.
- Reworked `Seigaiha` tile height/center offsets to create interlocked wave rows instead of visually separated bands.
- Reworked `Shippo` into lens-petal geometry with corner circle interplay for a closer filled motif look.
- Rebuilt `Asanoha` again using explicit regular-hexagon vertex connection logic (vertex-to-vertex network).
- Rebuilt `Shippo` again from quarter-offset circle stacks, rendering overlap regions directly as lens petals.
- Rebuilt `Seigaiha` using a triangular-lattice center model and variable opening-angle arcs based on the provided formula reference.
- Replaced `Asanoha` generator with the explicit per-hex line construction (matching the provided 4-connected-hex drawing logic).
- Updated `Shippo` to diagonal-overlap lens construction so center negative space reads as rotated-diamond instead of square.
- Reduced Seigaiha visual density at low repeat counts by lowering center/ring sampling and scaling ring count with repeats.
- Added an in-page formula info popout with base construction notes for Asanoha, Shippo, and Seigaiha.
- Reworked formula popout into a pattern-specific tabbed panel with mini construction diagrams.
- Updated `Shippo` to use the previous side-overlap lens construction and rotate the motif orientation by 45 degrees.
- Tuned Seigaiha ring scaling again to improve legibility at lower repetition settings.
- Added `Project Logo Starters` section with simple generated SVG logo cards for each top-level `_Code` project folder.
- Replaced generic project logo generation with purpose-led per-project logo profiles (intent + motif + palette) for stronger brand distinctiveness.

## 2026-10-28
- Reviewed scratchpad and source structure; updated product direction from placeholder logos to a proposed worldwide pattern/texture repository with mathematical construction, contextual information, editing, and SVG export.
- Replaced outdated roadmap with reference audit, generator corrections, selected-pattern workspace, curated collection, and later expansion stages.
- Recorded user-reported accuracy concerns separately from verified visual findings; added proposed data contracts, Design System guidance, quality gates, migration considerations, and open decisions.
- Updated documentation index; left the scratchpad unchanged; its date was corrected to `20261028` during review. No application code changed or runtime checks performed.
- Proceeded with an initial nine-pattern reference audit, captured original tile outputs/settings and rendered comparisons, and documented provenance/rights gaps plus specific construction issues. This subsequent work includes rendered validation and application changes.
- Replaced Yagasuri bars/caps with paired slanted feather vanes, opposing columns, a half-period stagger, wrapped tips, and explicit invalid-unit handling. Preserved ID and colors; other eight generators retain byte-identical baseline output.
- Added the Yagasuri construction specification and five passing dependency-free Node tests. Parsed inline JavaScript and ten SVG artifacts; inspected Edge captures and confirmed initial rendering of all three galleries. External editor, clipboard/download interaction, cross-browser, and theme acceptance remain open.
- Updated product, roadmap, QA, migration notes, and index; next scoped correction is Seigaiha. Workspace overhaul remains planned.
- Rebuilt Seigaiha as four concentric upper-semicircle fans on staggered rows, painting background-filled silhouettes back to front to hide rear arcs. Fixed ring count independently of density and documented a stroke cap at 45% of ring spacing.
- Replaced obsolete Seigaiha formula notes and diagram with the new construction, including an accessible image label. Preserved the other eight immediate pre-change generator outputs and legacy galleries.
- Added Seigaiha construction documentation, pre-change snapshot, before/after SVGs, rendered comparisons, and seven new tests (12 total). Analytic repeat checks cover 1,089 samples; Edge checks cover live controls, color changes, intercepted SVG-download generation, formula interactions, and three theme selections.
- Updated QA, product, roadmap, audit, migration notes, and index. Final visual proportions and external-tool compatibility remain open; Shippo is the next scoped generator task.
- Added `GITHUB_SETUP.md` and indexed it: preserves web and GitHub CLI creation instructions, distinguishes the existing hosted repository from local remote configuration, and explains review/commit/push workflows and common errors. Documentation only; no remote, authentication, commit, or push changes were made.
- Rebuilt Shippo using four direct equal-circle lens paths with small tip gaps and an unrotated square repeat. Removed clipped-circle definitions, duplicate-prone clip IDs, rotated field geometry, and guide outlines; documented that stroke/accent are unused by the filled motif.
- Updated Shippo's formula diagram/notes and accessible image label. Added construction equations, an immediate pre-change snapshot, before/after SVGs, reference-scale/enlarged comparisons, and browser evidence.
- Added seven Shippo tests (19 combined): 1,875 serialized-geometry versus infinite-circle-field samples, gap/topology checks, supported dimensions, invalid inputs, and preservation of all eight other generator outputs. Edge checks pass 51 assertions per theme, with native download navigation/clipboard intercepted.
- Updated product, QA, audit, migration notes, index, and roadmap. Next is Karakusa's connected-motif specification. No runtime dependencies, shell redesign, commit, or push was added.
- Specified and implemented an experimental Karakusa graph with periodic cubic stems, eight tangent-attached inward spirals, eight anchored leaves, bounded stroke, and neighboring-path hull pruning. Recorded an approximate 278:179 reference composition ratio; current visual arrangement remains approximate and is not marked reference-matched.
- Added a Karakusa formula tab with the generated schematic and reproducible curve equations, plus construction documentation, a pre-change baseline, measurement record, before/after SVGs, and comparison captures.
- Added eight tests (27 combined) covering geometry/attachment/derivative/approximation/periodic coverage invariants and preservation of the other eight generators. Edge checks pass 54 assertions per theme, including export content and foreground raster coverage within a one-pixel antialias tolerance; strict raw color equality was not achieved and is recorded.
- Measured synchronous gallery rebuild timings and reduced the default tile from 162 potential neighbor paths to 25 emitted paths. Updated roadmap/QA with remaining Karakusa fitting and compatibility work; no shell redesign, new runtime dependency, commit, or push was performed.
- Refined Karakusa's composition against an enlarged reference cell. Replaced the crossing-prone artificial backbone/polar-spiral fit with sixteen reference-positioned spline paths and eight fitted leaves, preserving periodic branch positions and other generator outputs. Kept the v2 snapshot and comparison evidence.
- Isolated immutable fit data and the pure renderer in `patterns/karakusa.js`, usable by classic browser scripts and Node without a bundler. Updated formula notes and tests to explain fitted knots, cubic conversion, internal C1 continuity, and C0 branching rather than forcing parent tangent agreement.
- Added a retained app-specific Edge runner with origin-clean reference comparison and test-artifact bounds. All 28 Node tests and 55 checks per theme pass. Reference foreground F1 improves 0.440 to 0.760 at two-pixel tolerance (raw IoU 0.113 to 0.249); exact agreement/authenticity is not claimed.
- Added normalized before/after figures, standalone SVGs, a gridded reference cell, browser/geometry reports, and updated docs. Recorded remaining curve/editor acceptance and performance limits. No external runtime dependencies, remote changes, commits, or pushes were introduced.


## 2026-10-28 ? Generator contracts and optional reference variants
- Extracted remaining generators/catalog, strict export validation, and SVG serialization; retained direct-file loading and unchanged default tile output.
- Added scoped Ichimatsu primary/background and Mameshibori uniform-dot reference variants, preserving originals and keyboard focus.
- Migrated regression tests to direct module imports and added contract/variant tests.

## 2026-10-28 - Workspace specification and acceptance review
- Documented gallery/preview/inspector behavior, independent per-pattern state, contextual capabilities, validation, reset, preview/export separation, responsive accessibility, and four implementation slices.
- Generated eleven current standalone SVG snapshots and a consolidated nine-reference review page. Visual approval and external-editor acceptance remain pending.
- Updated roadmap to the next concrete implementation: session model and capability metadata, preserving geometry and the existing lab.

## 2026-10-28 - Workspace session model and capabilities
- Added pure immutable session operations for selection, per-pattern edits, scoped reset, and view settings, with strict atomic validation and frozen state.
- Added explicit supported-control/variant metadata and effective stroke-cap descriptions; reference variants retain inactive secondary values.
- Added eight tests, bringing the suite to 40 passing tests, including eleven frozen export comparisons and browser-global module execution. Documented APIs, errors, limitations, and next UI slice. Existing page and geometry are unchanged.

## 2026-10-28 - Opt-in selected-pattern workspace
- Added workspace.html, workspace.js and token-based workspace CSS with a nine-pattern gallery, selected field preview, contextual inspector and selected SVG export. Added an opt-in link to the existing lab.
- Connected immutable per-pattern state and capabilities. Invalid drafts retain the last valid preview, show associated errors and block export; edits/drafts survive pattern switching. Reset is scoped to the selected pattern. The lab/legacy link opens a separate tab to retain the workspace document.
- Added retained Edge acceptance checks with exact viewport emulation and native keyboard events. Forty Node tests pass; workspace checks pass across three themes and three widths. Tabs, zoom and tile/repeat modes remain the next slice.

## 2026-10-28 - Grouped library and efficient inspector
- Added independent Japanese construction-group metadata, collapsible compact thumbnail groups, search, counts and empty-result recovery. Filtering retains selection and edits.
- Grouped properties into Variation, Layout, Palette and Linework. Added paired density/stroke sliders and exact values, hex/picker color pairs, invalid-hex recovery and scoped slider contrast tokens.
- Revised desktop/tablet/mobile panel layout and library height. Removed the workspace's legacy-gallery link following user direction; old files remain only for transition/construction transfer.
- Added library tests and extended browser assertions, preserving generator and default export snapshots. Updated product scope, workspace documentation and roadmap.

## 2026-10-28 - Density one and whole-cell tiling
- Lowered validated workspace density to 1; N now means N-by-N repeat cells. User selected natural aspect ratio, so output width is selected and height is derived without stretching.
- Added repeat-period metadata and repeatLayout/serializeField APIs with output-unit stroke compensation; retained original generator markup and legacy square serializer. Reduced duplicate drawing periods, including a single-dot uniform reference cell.
- Added layout/validation/proportion tests and browser single-cell, export seam and reduced-period checks; recorded density 1/3/12 SVGs and compatibility notes.

## 2026-10-28 - Separate complete motifs and repeat tiles
- Added explicit complete-shape definitions for all nine patterns, including a full six-sector Asanoha rosette, isolated fan/feather/hexagon/scale/dot and one unwrapped finite vine branch. Motif exports have breathing room and no repeat clipping.
- Added native Motif/Tile/Pattern view controls; preview, copy and download follow the view, preserve session artwork/drafts and use mode-specific filenames.
- Square repeat composites combine native Yagasuri/Seigaiha cells. True rectangular periods remain for triangular/hexagonal lattices and the compact vine, with explicit explanations; no distortion or false square-crop repeat claim.
- Extended geometry, state/export and browser tests and recorded three-view snapshots; retained prior drawing baselines and compatibility serializers.

## 2026-10-28 - Compact workspace and visible gallery density
- Standardized library thumbnails to a fixed two-tile browse crop with readable source strokes, independently of editor state/export geometry.
- Replaced stacked header/description/export regions with a compact title/theme bar, combined canvas toolbar, Info disclosure and status bar. Retained full accessible action names behind short visible Copy/Export labels.
- Aligned compact property rows and fitted preview to the remaining viewport. Narrow side panels start collapsed and expanded content stays bounded; normal page/preview scrolling is eliminated.
- Added Info close/position handling and browser checks for viewport bounds, panel expansion and thumbnail density; retained prior state/export/seam coverage. Updated UI/architecture and roadmap documentation.

## 2026-10-28 - Prioritize motif proportions and minimal native repeats
- Recorded the governing rule: preserve mathematically defined motifs; use only required repetitions/crops for the smallest validated rectangular repeat. No distortion, rearrangement or redundant square-only supercell.
- Removed Yagasuri/Seigaiha square composites and restored their smaller native rectangular repeat dimensions. Updated Info terminology without adding layout clutter. Square gallery windows remain browse-only.
- Added equal-side/radius and uniform-axis-scale assertions, retained motif snapshots byte-for-byte, and reran tile/field seam checks with current native-period exports.

## 2026-10-28 - Square arrangements with wrapped phase controls
- Implemented user-authorized placement/spacing changes to make every Tile/Pattern export square while preserving complete motif geometry and uniform scale. Native square-compatible constructions reuse original repeats; other layouts place complete motifs on square periods.
- Added per-pattern Shift X/Y percentage controls, whole-period wrap, independent state, Center recovery and scoped reset. Motif and browse defaults remain shift-independent.
- Added square-layout tests and browser checks for all-square dimensions, independent shifts, invalid input/recovery, full-period equivalence and default/shifted export seams. Preserved native generator and motif snapshots.

## 2026-10-28 ? Restore continuous tessellations

- Removed square motif packing; restored original lattice generators and smallest validated rectangular periods for Tile/Pattern and genuine field crops in gallery previews. Preserved Motif view and phase controls.
- Shift X/Y now translate native pattern origins without changing spacing or branch connectivity. Zero-phase exports match all eleven earlier minimal-repeat field fixtures exactly.
- Replaced all-square assertions with native-aspect and frozen-tessellation checks. Historical square artifacts are marked rejected; square export for incompatible lattices remains unresolved.

## 2026-10-28 - Add selected-pattern inspection and Fit/zoom

- Added accessible Preview/Construction/Context tabs with arrow/Home/End navigation, retained selection/view/draft state and compact Design System styling.
- Transferred four formula explanations into an independent immutable content module; added live native-generator diagrams, explicit pending derivations and selected reference/review context for all nine patterns. Diagram SVG IDs are independent of the hidden preview.
- Added centered 25%-400% preview zoom and Fit; SVG export bytes, native tessellations and output dimensions remain unchanged. Export/view controls stay in Preview.
- Validation: 61 Node tests and 193 Edge checks per nine theme/viewport combinations; syntax and whitespace checks pass. Updated roadmap: workflow/editor review and primary-entry retirement are next.
