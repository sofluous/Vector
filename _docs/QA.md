# QA

## Status as of 2026-10-28
The initial documentation review was followed by a nine-pattern rendered reference audit, Yagasuri/Seigaiha/Shippo corrections, and an experimental connected Karakusa reconstruction. Prior checked boxes are historical claims, not current acceptance evidence. No project build/lint configuration was found; focused Node generator tests now exist.

| Patterns | Evidence | Next check |
| --- | --- | --- |
| Asanoha, Kikko, Uroko | User reports good matches | Capture baselines; inspect seams and exports |
| Yagasuri | User-reported mismatch; paired-vane and stagger correction now implemented | Candidate Edge rendering inspected; proportions await user review and external-tool checks |
| Seigaiha | Four-ring/staggered-fan correction now implemented; Edge comparison inspected | Final proportions, non-Chromium rendering, and external-editor imports remain open |
| Shippo | Direct equal-circle lens correction implemented; comparison and formula panel inspected in Edge | Final proportions and external-editor compatibility remain open |
| Karakusa | Reference-fitted spline graph implemented; measured foreground F1 improves 0.440 to 0.760 at two-pixel tolerance | Final local-curve/palette review and external-editor acceptance remain open; exact equivalence is not claimed |
| Ichimatsu, Mameshibori | Present; accuracy not assessed | Compare references and repeat behavior |

Scratchpad spellings `Asonaha` and `yagusuri` are interpreted as Asanoha and Yagasuri. Its current date `20261028` matches the review date, 2026-10-28.

## Implementation acceptance checklist
- [ ] Identify a reference variant and compare topology, proportions, curvature, spacing, fills, and orientation at common scale.
- [ ] Check repeated-field edges/corners for gaps, clipping, duplicate strokes, and discontinuities at minimum/default/maximum settings.
- [ ] Test deterministic geometry, positive bounds, finite coordinates, valid paths, and SVG definition/reference IDs.
- [ ] Validate empty/non-finite/out-of-range inputs and cross-field constraints; show inline errors without losing valid state.
- [ ] Check per-pattern state, selection, reset, and distinctions between zoom, output size, motif scale/density, and stroke width.
- [ ] Parse exports and open independently of the app; verify dimensions, colors, transparency, clipping, and absence of external CSS/assets/scripts. Record compatibility in at least one intended SVG design tool.
- [ ] Check copy failure/insecure contexts, download feedback, and repeated exports.
- [ ] Check keyboard navigation, tab semantics, focus return, accessible labels, responsive inspectors, and theme contrast.
- [ ] Run relevant generator tests and available build/lint checks; preserve legacy galleries. Record commands/results and mark unavailable checks explicitly.
- [ ] Measure dense-output responsiveness and SVG size before choosing complexity limits or optimizations.
- [ ] Review provenance, rights, and uncertain historical claims; validate future imported presets/metadata and prevent arbitrary HTML/SVG injection.

Manual browser acceptance should include Chromium and one non-Chromium browser. UI changes also require the [Design System checklist](../../_DesignSystem/wiki/VALIDATION_CHECKLIST.md).

## Risks
Seamless repetition does not establish visual or historical accuracy. Existing formula notes and changelog claims require independent review. Global controls and gallery-wide rerendering create state/performance regression risks during extraction. SVG patterns and clipping may behave differently across design tools. Unknown reference rights must not be silently treated as permission.

## Documentation review validation
Only Markdown changed. Validate links and consistency between current behavior, proposals, roadmap gates, and reported issues. Runtime tests, browser acceptance, builds, and lint were not run because application behavior was unchanged.

## Subsequent construction pilot validation
- `node --test _Vectors/tests/yagasuri.test.cjs`: 5/5 passed. Covers vane topology, stagger/open areas, analytically sampled repeat boundaries, supported UI dimensions, invalid units, and unchanged output for the other eight generators at baseline settings.
- Application inline JavaScript syntax parsed successfully; ten standalone artifact SVGs parsed as XML.
- Edge headless comparison captures inspected; actual page initially rendered 9 pattern, 20 static, and 27 project-logo cards.
- No configured build/lint command exists. Clipboard/download interactions, non-Chromium browsers, external editors, and multi-theme acceptance remain untested; no shell/control layout changed.
- Full evidence, source uncertainty, and baseline artifacts: [reference audit](REFERENCE_AUDIT.md). Earlier documentation-only validation above describes the preceding task, not this implementation.

## Seigaiha correction validation
- `node --test _Vectors/tests/yagasuri.test.cjs _Vectors/tests/seigaiha.test.cjs`: 12/12 passed. Includes 1,089 serialized-tile versus infinite-field samples around seams/corners, occlusion, ring topology, stroke cap, invalid values, supported dimensions, JavaScript syntax, and preservation of the other eight immediate pre-change outputs.
- Standalone before/after SVGs parse as XML. [Comparison capture](data/seigaiha-2026-10-28/comparison.png) visually inspected in Edge.
- Browser checks exercise 18 frame/repetition/stroke combinations, background/line color changes, formula open/tab/Escape behavior, theme selection, and the download button's blob/name/content/URL cleanup with anchor navigation intercepted. They preserve initial gallery counts (9/20/27).
- Formula artwork/notes inspected under Steel Night, Paper Mint, and Neon Grid selections. App chrome still contains pre-existing fixed colors; this does not certify full Design System compliance or responsive accessibility.
- [Browser results](data/seigaiha-2026-10-28/browser-results.json) record checks and captured page errors. Edge background device/task-manager/sync diagnostics are separate from application errors.
- Clipboard permissions, OS file-save behavior, non-Chromium rendering, and external-editor compatibility remain untested. Transparent output is not supported by the background-filled occlusion model.

## Shippo correction validation
- `node --test _Vectors/tests/yagasuri.test.cjs _Vectors/tests/seigaiha.test.cjs _Vectors/tests/shippo.test.cjs`: 19/19 passed. New checks recover circles from serialized lens arcs and compare 1,875 repeated-field samples with an independent circle lattice; test open gaps, supported sizes, deterministic color/control behavior, invalid units, formula notes, and unchanged output for all eight other generators.
- Before/after standalone SVGs parse as XML. [Comparison capture](data/shippo-2026-10-28/comparison.png) and formula screenshots inspected in Edge.
- [Browser results](data/shippo-2026-10-28/browser-results.json): 51 passing assertions per theme (Steel Night, Paper Mint, Neon Grid), including 18 size/density/stroke combinations, colors, unused-control invariance, intercepted download/copy content, object-URL cleanup, formula interactions, theme selection, and no captured page errors. Initial gallery counts remain 9/20/27.
- Native save/clipboard permissions, non-Chromium rendering, external-editor compatibility, and comprehensive responsive/Design System acceptance remain open. The motif has unfilled negative space, but the exporter still paints a background; no transparent-export UI was added.

## Karakusa experimental reconstruction validation
- Combined command: `node --test _Vectors/tests/yagasuri.test.cjs _Vectors/tests/seigaiha.test.cjs _Vectors/tests/shippo.test.cjs _Vectors/tests/karakusa.test.cjs` (27/27 passed). New checks cover periodic endpoint/derivative identities, all branch/leaf attachments, spiral approximation, hull-pruned versus unpruned periodic coverage, control bounds, invalid inputs, formula notes, syntax, and unchanged output from the other eight generators.
- Standalone before/after SVGs parse as XML. Comparison and formula captures inspected. This is a topology/procedural construction candidate; the source's denser arrangement and different curl/branch shapes remain unresolved.
- [Edge results](data/karakusa-2026-10-28/browser-results.json): 54 assertions per theme, including 18 size/density/stroke combinations, recoloring, unused accent, intercepted download/copy, formula interactions, theme selection, and no captured page errors. Gallery counts remain 9/20/27.
- A strict raster color comparison initially failed (about 12.05% of pixels differ). Side-by-side inspection showed differing SVG-pattern/direct-path smoothing. Foreground coverage subsequently had zero unmatched pixels using a one-pixel antialias tolerance; raw differences and the tolerance are retained in the report. This check is not reference-image similarity testing.
- Default motif pruning reduces 162 possible translated paths to 25. Recorded synchronous gallery rebuild medians were 6.8-8.4 ms, maximum 38.3 ms across the sampled sessions; paint/frame latency and comparative benchmarks were not measured.
- Native save/clipboard permissions, external-editor imports, non-Chromium rendering, comprehensive accessibility/theme acceptance, provenance, and reference-match acceptance remain open. Pre-existing Edge background task/device/sync diagnostics are separate from captured page errors.

## Karakusa composition refinement validation
- Combined Node command (add `tests/karakusa.test.cjs` to the earlier three-file suite): 28 tests pass. New Karakusa assertions replace v2-specific spiral/backbone assumptions with fitted-knot interpolation, internal C1 derivatives, shared branch positions, three periodic joins, leaf anchors, pruned field coverage, immutable inputs, and fresh geometry outputs. All eight other generators retain the refinement baseline.
- `node _Vectors/tests/browser-karakusa.cjs --out _docs/data/karakusa-refinement-2026-10-28`: retained dependency-free Edge runner, 55 checks pass per theme. Covers initial counts 9/20/27, eighteen size/density/stroke combinations, colors, copy/download content with native navigation/clipboard intercepted, formula interactions, themes, repeat coverage, and no captured page errors.
- Reference-mask F1 is 0.440 for v2 versus 0.760 for v3 at the same cell scale and approximate stroke, with a two-pixel square-neighborhood tolerance; raw IoU is 0.113 versus 0.249. The runner requires at least a 0.15 F1 gain. This is selected-cell improvement, not exact pixel agreement or historical authentication.
- Same-geometry pattern/direct-field coverage passes at one-pixel antialias tolerance. Before/after standalone SVGs and one-cell reference-fit SVG parse as XML. Formula/figure captures inspected under Steel Night, Paper Mint, and Neon Grid.
- V3 emits 33 default paths and about 17.9 KB motif markup. Headless synchronous rebuild medians were 10.8-14.0 ms, max 59.3 ms; paint/frame latency and controlled comparative performance are unmeasured. Selected-pattern editing remains a future performance improvement.
- Local curve estimates, full-image similarity, editor imports, non-Chromium rendering, native permissions, comprehensive accessibility/theme compliance, and provenance remain open. No build/lint configuration exists; syntax parsing, regression tests, browser checks, and whitespace checks are the available validations.


## 2026-10-28 ? Module contracts and reference variants
- 32 Node tests pass, including existing frozen tile baselines, deterministic standalone exports at supported bounds, invalid export input rejection, checkerboard palette, uniform dot spacing and wrapped repeat pitch.
- Edge: 64 checks per theme under steel-night, paper-mint, neon-grid. Added per-card variant change, focus restoration, isolation and exact default restoration. Existing controls, Karakusa repeat/reference raster comparisons, intercepted copy/download and formula checks pass.
- Sandbox Edge initialization failed with GPU subprocess access errors; the permitted unsandboxed run passed. Reports and screenshots: [contract artifacts](data/contracts-2026-10-28/README.md).
- No configured build/lint commands; Node syntax/import checks and `git diff --check` pass. Native controls reuse existing styling; full Design System chrome migration, narrow-screen visual acceptance, reference provenance, and external SVG editor acceptance remain open.

## 2026-10-28 - Workspace planning evidence
- Consolidated review snapshot contains eleven standalone SVGs; all parse as XML with SVG roots. New review-page/specification local links resolve.
- Existing 32 Node tests pass. No application code or geometry changed in this planning task; prior browser results remain historical evidence, not a new UI certification.
- WORKSPACE_PLAN.md separates mathematical checks, visual approval, external-editor import, and future workspace accessibility acceptance. None of the pending human/editor gates has been marked complete.

## 2026-10-28 - Workspace session foundation
- 40 Node tests pass (eight new session/capability tests). All eleven current-review SVG snapshots match byte-for-byte. Independent edits, selected-only reset, validation atomicity, unsupported IDs/variants/controls, inactive color retention, and preview/export separation are covered.
- Capability declarations are compared against actual stroke/secondary effects in all nine generators. Classic script globals execute in a DOM-free VM with matching CommonJS behavior. Syntax checks pass for both modules; whitespace checks pass.
- No page wiring or layout changed. Browser interaction/error display/export blocking remain slice 2 acceptance requirements; this model throws errors but does not manage invalid UI drafts. No configured build/lint task exists.

## 2026-10-28 - Opt-in workspace UI
- 40 Node tests pass; workspace and runner syntax checks pass. No generator or serializer behavior changed. No configured build/lint command exists.
- [Edge workspace results](data/workspace-ui-2026-10-28/browser-results.json): 46 checks pass for each combination of Steel Night/Paper Mint/Neon Grid and exact 360/768/1440 CSS-pixel widths (nine runs). Checks cover all nine default SVGs, selection/focus, supported controls, variants, independent edits, invalid drafts/recovery, reset, export payloads/cleanup, clipboard failure, stable thumbnails, overflow, native Tab/Enter navigation and disclosure collapse, and no captured page errors.
- Inspected desktop Steel Night and narrow Paper Mint captures: panel hierarchy, readable controls, selected/focus states and stacked library layout are visible. Narrow library can be collapsed to reach the preview; full cross-theme contrast/accessibility and external editor approval remain open. Native disclosure alignment is an intentional initial exception documented in WORKSPACE_UI.md.
- Initial runner failures came from XML attribute-whitespace normalization, report parsing and incomplete native key-event payloads. Fixture comparison now uses the same HTML parsing as preview. Edge debugging-pipe emulation checks actual viewport width, avoiding the browser's minimum desktop window size; no geometry tolerance was relaxed.
- Clipboard/download are intercepted for payload assertions. Native OS permissions, non-Chromium behavior and external editor imports remain unverified. Workspace stays opt-in; Construction/Context tabs and inspection modes are not implemented in this slice.

- Preserved-lab regression rerun: 64 checks pass in each of three themes, including 9/20/27 gallery counts, live controls, SVG payloads and formula checks. An initial Edge timeout was transient; the retry passed. [Lab results](data/workspace-ui-2026-10-28/lab-regression/browser-results.json). Workspace resource links and all referenced DS tokens resolve. Reviewed the Neon Grid 768-pixel capture in addition to desktop Steel Night and narrow Paper Mint.

## 2026-10-28 - Grouped library and paired inspector
- 42 Node tests pass. New library checks prove each current pattern belongs to exactly one group, catalog order/IDs remain unchanged, and name/description/group/collection search returns independent result arrays.
- [Grouped-workspace Edge evidence](data/grouped-workspace-2026-10-28/browser-results.json): 57 checks pass in each of nine theme/viewport combinations (Steel Night, Paper Mint, Neon Grid; exact 360, 768, 1440 CSS pixels). Added group/search/empty-state checks, selection preservation while filtering, range/exact-value synchronization, hex/picker synchronization, invalid hex blocking/recovery and native ArrowRight slider adjustment. Existing snapshots, independent edits, numeric errors/reset, intercepted exports, native Tab/Enter, disclosures and horizontal-overflow checks remain passing.
- Inspected desktop and narrow Steel Night plus tablet Paper Mint captures. Compact library and bounded panel scrolling bring preview closer to the top; tablet preview/inspector sit side by side. Scoped accent thumb styling improves visibility while retaining DS component tokens. Native disclosure alignment remains the documented exception.
- Workspace legacy link is intentionally removed; old files remain during construction transfer. Generated SVG geometry/defaults are unchanged. Native OS save/clipboard, external editors, non-Chromium and full accessibility/contrast certification remain open.
- Syntax, whitespace, linked resources and referenced DS token checks pass. No configured build/lint command exists.

## 2026-10-28 - Density one and seamless complete fields
- User explicitly selected natural cell aspect ratio. Workspace density now spans integer 1-36; N means N-by-N complete cells. Selected output width is preserved, derived height avoids distortion. Repeat factors reduce duplicate drawing periods without changing native markup.
- 47 Node tests pass. New layout tests cover sizes 240/480/2000, densities 1/2/3/12/36, all supported variants, output proportions, deterministic output, output-unit stroke, equivalent repeated-field scale, invalid density, frozen periods and a single-dot reference cell.
- [Edge results](data/density-one-2026-10-28/browser/browser-results.json): 90 checks pass for all nine theme/viewport combinations. All patterns accept one-cell density in numeric/slider controls. Eleven single-export-versus-direct-field comparisons pass with >0.995 foreground precision/recall within one-pixel antialias tolerance; four reduced-period fields also match their original drawing periods. Whole-field masks, not just seam strips, are compared. Earlier independent generator checks remain passing.
- Current 1/3/12 SVGs and comparison page are saved with exact dimensions; original geometry/square-lab evidence is preserved. Same numeric density has intentionally different visual scale. No persisted presets exist. Height can exceed selected width, e.g. Yagasuri 480 by 960.
- Syntax, XML, local links and whitespace checks pass. Native editor/OS permissions, non-Chromium and historical/reference acceptance remain open. No build/lint task is configured.

## 2026-10-28 - Separate Motif, Tile and Pattern
- 53 Node tests pass: explicit complete motif bounds and density independence, square/rectangular declarations, all-variant Tile versus density-one equality, six-sector Asanoha construction, finite vine parent attachments/control hulls, and exact motif stroke compensation at widths 240/480/2000 and strokes 0.4/1.6/8. Existing native geometry and legacy output baselines remain passing.
- [Current Edge results](data/preview-modes-2026-10-28/browser/browser-results.json): 140 checks pass across each of nine theme/viewport combinations, adding all-nine view switching, geometric breathing room, motif density independence, displayed tile equality, view export labels, matching named clipboard/download output and native radio ArrowRight selection. Whole displayed tiles repeat into direct Pattern output at >0.995 foreground precision/recall with one-pixel antialias tolerance. Original period-reduction checks remain covered.
- Inspected Asanoha captures to distinguish a full six-sector rosette from one lattice contribution; complete motif construction is explicit and the native repeated generator remains unchanged. Karakusa's finite motif is an unwrapped branch with one opened periodic stem, not an invented closed emblem.
- Square tiles are implemented where exact small-period composition permits. Asanoha/Kikko/Uroko retain rectangular lattice periods and Karakusa its compact rectangle; the UI explains this, rather than calling a square crop seamless. This is the explicit limitation against the earlier all-square proposal.
- Motif exports have no repeat clipping; view-specific padding leaves room for strokes. No new runtime dependencies. Existing reference/provenance, editor imports, non-Chromium and OS permission limits remain open. Construction/Context and zoom remain later work.

## 2026-10-28 - Compact workspace and visible thumbnails
- 54 Node tests pass. Thumbnail checks cover source density 2, square repeat-filled crop, fixed source size, independence from editor density/output width and low stroke, deterministic output, and invalid identifiers/variants. Existing geometry, field/motif/tile, state and stroke tests remain passing.
- [Compact-workspace Edge results](data/compact-workspace-2026-10-28/browser-results.json): 149 checks pass for each of nine combinations of Steel Night/Paper Mint/Neon Grid and 360x780/768x800/1440x900 CSS pixels. New checks cover initial and expanded-panel viewport fit without page scrolling, stage bounds, no internal preview scrolling, consistent gallery density, default-hidden Info, Info/Escape and viewport placement. Existing native keyboard, view-specific export, invalid drafts/reset and seam checks remain passing.
- Visually reviewed desktop Steel Night/Paper Mint and phone/tablet captures, including Neon Grid motif. Full gallery is readable on desktop without unnecessary page scrolling; preview fits its stage; inspector and control bar remain compact. Side-panel content may scroll when genuinely larger than available space.
- Descriptions/caps/limitations remain available under Info. Short visible controls retain full dynamic accessible names/tooltips. Native left disclosure placement remains a documented DS exception. Complete accessibility/contrast certification, external editors, native OS save/clipboard and non-Chromium remain open.
- No generator/export behavior changed. No configured build/lint command exists. Syntax, whitespace, local resources and referenced DS tokens pass checks.

## 2026-10-28 - Motif geometry and minimal-repeat priority
- User clarified that complete mathematical motif proportions are authoritative; Tile must use only repetitions/crops needed for the smallest validated rectangular repeat. No stretching, rearrangement or added spacing solely for square format.
- Removed square-only Yagasuri/Seigaiha composites; their native 1:2 and 2:1 repeats are restored. Other native period declarations remain unchanged. All eleven previous complete-motif SVGs match byte-for-byte.
- 56 Node tests pass, including regular hexagon radius/side equality, equilateral triangle side equality within four-decimal serialization precision, uniform axis scaling for all motifs at size limits, and native-period export equality. Existing geometry, vine topology, state and tile tests remain passing.
- [Minimal-repeat browser results](data/minimal-repeat-2026-10-28/browser/browser-results.json): 149 checks pass per nine theme/viewport combinations, retaining compact layout, complete motif, mode-specific exports, native keyboard and seamless whole-field repetition checks with current native-repeat fixtures. Earlier artifacts remain preserved.
- Smallest validated rectangular period is the declared scope, not global optimality over arbitrary oblique bases. Karakusa remains an explicit fitted cubic model. Historical/reference acceptance, native OS save/clipboard, external editors and non-Chromium remain open.
- New SVGs parse as XML; resource/document links, syntax and whitespace checks pass. No build/lint task is configured.

## 2026-10-28 - All-square arrangements and phase controls
- User explicitly authorizes tile spacing/placement changes while requiring motif proportions to remain intact. Implemented square-native compositions for five patterns and uniform-scale motif placements for Asanoha/Kikko/Uroko/Karakusa. All Tile/Pattern exports now have equal width/height; complete Motif exports remain unchanged.
- 60 Node tests pass. New coverage checks square layout at frame 240/480/2000 and density 1/2/36, uniform scale, path/point geometry equality against original motifs, signed whole-period phase equivalence, motif/gallery independence from shifts, atomic validation, independent state and scoped reset.
- [Square-arrangement Edge results](data/square-arrangements-2026-10-28/browser/browser-results.json): 175 checks pass for each of nine theme/viewport combinations. Added all-square dimensions, shift-control changes, independent per-pattern phase, full-period equivalence, invalid shift blocking and Center recovery. Twenty-two default/shifted whole-export raster comparisons pass; original native-period checks remain independently covered.
- Reviewed Asanoha Tile at tablet size and full Paper Mint square-tile captures for Karakusa/Uroko. Regular shapes retain their aspect; stagger/spacing changes are deliberate. Karakusa repeats one finite opened branch rather than preserving original inter-cell vine connectivity. This distinction is documented, and no global packing-optimum claim is made.
- Shift X/Y are finite -100..100 percent; one whole tile wraps to zero. Both axes remain seamless under translation. Motif ignores shifts. Center clears only shift drafts; Reset clears selected artwork including shifts. Native OS permissions, SVG editor imports, non-Chromium, full accessibility and reference approval remain open.
- XML, syntax, resource/document links, DS tokens and whitespace checks pass. No configured build/lint task exists. Earlier native and motif evidence remains unchanged.

## 2026-10-28 ? Tessellation restoration

- 59 Node tests pass. New regression coverage compares all eleven native default/reference field exports byte for byte with the earlier minimal-repeat fixtures. This catches changes to tessellation, spacing and branch connectivity that periodic-edge checks alone missed. Existing independent generator geometry/seam tests and phase/state validation remain passing.
- Edge: 175 checks pass in each of nine theme/viewport combinations. Tests cover native proportions, density-one/Tile equality, shift controls, export payloads, invalid input, keyboard navigation, viewport fit and 22 default/shifted raster comparisons. [Results and screenshots](data/tessellation-restored-2026-10-28/README.md).
- Visually inspected restored Asanoha, Kikko and Karakusa Tile captures. Gallery shows the actual lattice; native rectangular tiles remain rectangular. No shell/theme changes.
- Runtime scripts parse and git diff --check passes. No package/build/lint configuration exists.
- Limitation: square seamless export remains unresolved for incompatible native lattices. The rejected square-packing evidence above proves only periodicity of that incorrect grid and must not be treated as tessellation acceptance.

## 2026-10-28 - Workspace inspection tabs and zoom

- 61 Node tests pass, including content coverage for all nine entries, explicit pending derivations, existing local reference paths and exact transfer of the four existing formula explanations (line endings normalized). Native tessellation and export snapshots remain unchanged.
- Edge runner passes 193 checks in each of nine theme/viewport combinations: Steel Night, Paper Mint and Neon Grid at 360/768/1440 CSS pixels. Added checks cover roving tab state/ARIA, arrow wrapping and Home/End, native ArrowRight activation, selection/content updates, unique SVG definition IDs, invalid draft retention, zoom bounds, Fit restoration and exact zoom/export byte invariance.
- Visual inspection caught and corrected duplicate pattern IDs causing blank diagrams while the preview was hidden. The corrected mobile Construction diagram and desktop Preview/Context were reviewed. Detailed notes scroll within the content panel; preview and page overflow checks remain passing.
- Evidence: [inspection results and screenshots](data/workspace-inspection-2026-10-28/README.md). Syntax and whitespace checks pass. No build/lint configuration exists.
- Limitations: zoom is centered and relative to Fit; panning is not implemented. Five detailed derivations, reference provenance, final visual acceptance and external-editor import checks remain open. Existing native rectangular repeats and unresolved square-export constraints are unchanged.
