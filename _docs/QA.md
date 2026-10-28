# QA

## Status as of 2026-10-28
The initial documentation review was followed by a nine-pattern rendered reference audit and a Yagasuri correction. Prior checked boxes are historical claims, not current acceptance evidence. No project build/lint configuration was found; focused Node generator tests now exist.

| Patterns | Evidence | Next check |
| --- | --- | --- |
| Asanoha, Kikko, Uroko | User reports good matches | Capture baselines; inspect seams and exports |
| Yagasuri | User-reported mismatch; paired-vane and stagger correction now implemented | Candidate Edge rendering inspected; proportions await user review and external-tool checks |
| Seigaiha, Karakusa, Shippo | Reported mismatch confirmed structurally in rendered audit | Specify fan occlusion, connected vine topology, and lens/repeat geometry respectively |
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

