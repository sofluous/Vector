# QA

## Status as of 2026-10-28
The initial documentation review was followed by a nine-pattern rendered reference audit, Yagasuri/Seigaiha/Shippo corrections, and an experimental connected Karakusa reconstruction. Prior checked boxes are historical claims, not current acceptance evidence. No project build/lint configuration was found; focused Node generator tests now exist.

| Patterns | Evidence | Next check |
| --- | --- | --- |
| Asanoha, Kikko, Uroko | User reports good matches | Capture baselines; inspect seams and exports |
| Yagasuri | User-reported mismatch; paired-vane and stagger correction now implemented | Candidate Edge rendering inspected; proportions await user review and external-tool checks |
| Seigaiha | Four-ring/staggered-fan correction now implemented; Edge comparison inspected | Final proportions, non-Chromium rendering, and external-editor imports remain open |
| Shippo | Direct equal-circle lens correction implemented; comparison and formula panel inspected in Edge | Final proportions and external-editor compatibility remain open |
| Karakusa | Experimental periodic stem/curl/leaf graph implemented and tested | Further visual arrangement/curve fitting required; not reference-matched yet |
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

