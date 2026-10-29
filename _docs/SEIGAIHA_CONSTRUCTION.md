# Seigaiha construction

Status: implemented candidate `seigaiha-2`, 2026-10-28. This version name is a documentation identifier, not a runtime preset field. Reference: `_references/Japanese/Seigaiha.jpg`; provenance and rights remain unknown. No historical claims are inferred from this geometric reconstruction.

## Why the previous construction changed

The baseline draws many partially opened arcs on a compressed lattice and changes their count with repetition. Its rendered result has crossing curves and diamond openings, rather than the reference's nested rounded fans. The replacement keeps four rings per fan, alternates row offsets, and paints background-filled foreground fans over lower portions of rear arcs.

The proportions are visual estimates for this reference variant. Mottling, irregular linework, and color variation are excluded. [Before/reference/after comparison](data/seigaiha-2026-10-28/comparison.html), [Edge capture](data/seigaiha-2026-10-28/comparison.png), and [standalone candidate SVG](data/seigaiha-2026-10-28/seigaiha-after.svg) record the result. Reference and generated densities are not normalized; these are construction comparisons, not pixel-equivalence tests.

## Equations and coordinates

SVG x increases right and y increases down. Let `u = frame / repetitions`, preserving the existing base-unit convention.

| Quantity | Definition |
| --- | --- |
| Outer radius | `R = u / 2` |
| Radii | `R * [1, 0.76, 0.52, 0.28]` |
| Ring spacing | `d = 0.24R` |
| Horizontal center spacing | `2R = u` |
| Vertical center spacing | `R / 2` |
| Alternating row offset | `R` |
| Center in column i, row j | `(2Ri + (j mod 2)R, jR/2)` |
| Rectangular repeat | Width `2R`, height `R` (two rows) |
| Effective stroke | `min(requested stroke, 0.45d)` |

Each ring is the upper semicircle from `(cx-r, cy)` to `(cx+r, cy)`: `M ... A r r 0 0 1 ...`. The left-to-right positive sweep makes the arc rise above its center. The outer semicircle plus a closing baseline defines the fill silhouette; its baseline is never stroked.

Paint centers in increasing row order. For each fan, paint the silhouette in the selected background color, then its four arcs in the selected line color. This background fill hides rear curves and produces the scalloped visible boundary. Merely drawing all arcs together would reintroduce crossings.

## Finite tile and seams

Generate rows `j = 0..4`, columns `i = -1..1`, in row-major order. The tile occupies `[0, 2R]` by `[0, R]`. Extra columns supply edge geometry; later rows below the tile supply overlapping fan tops. The final row's outer arc reaches the bottom boundary, including stroke coverage. Earlier negative rows cannot reach the tile with the bounded stroke.

SVG pattern clipping limits this extended geometry to the cell. Repeat vectors `(2R, 0)` and `(0, R)` return to the same row parity and painter order. Fifteen fans emit thirty paths: fifteen filled silhouettes and fifteen four-arc paths. No masks, clip IDs, external assets, or additional runtime dependencies are required. Existing four-decimal coordinate serialization remains in use.

## Controls and export behavior

- Repetition changes motif scale, not ring count. Frame dimensions retain their existing square-frame behavior.
- Stroke remains editable, with an explicit cap of 45% of ring spacing to keep small/dense fans readable. At the default `u=40`, the cap is 2.16 units, so the default 1.6-unit stroke is preserved. The card description and formula notes state this behavior.
- Background and line colors affect both preview and standalone SVG. Accent color is unused by this motif.
- Occlusion requires an opaque background. Transparent export is not implemented; a future transparent version needs actual geometric clipping or trimmed arcs, not simply removing the fill.
- The formula panel diagram uses the existing fixed blue/white construction-artwork palette, separate from UI theme colors. Its geometry, notes, and accessible image label match the new construction. Shell, themes, navigation, and other generators are unchanged.

## Verification

From `_CODE`:

```powershell
node --test _Vectors/tests/yagasuri.test.cjs _Vectors/tests/seigaiha.test.cjs
```

The suite covers four concentric upper arcs, painter order, un-stroked baselines, foreground occlusion, deterministic output, supported dimensions, explicit stroke limiting, invalid numeric inputs, standalone colors, updated formula notes, and JavaScript syntax. It compares 1,089 samples of the serialized finite tile against an independent analytic infinite fan field across horizontal/vertical repeat boundaries and corners, including minimum/default/maximum representative sizes and stroke settings. Regression checks retain the pre-Seigaiha baseline for entries outside Seigaiha and the later intentional Shippo/Karakusa work, including corrected Yagasuri; five untouched generators also retain the original audit baseline. The Shippo and Karakusa suites separately preserve this corrected Seigaiha output.

All twelve combined tests pass. [Browser results](data/seigaiha-2026-10-28/browser-results.json) record 49 passing assertions per theme (Steel Night, Paper Mint, Neon Grid): initial gallery counts, 18 live size/density/stroke combinations, colors, intercepted download blob/name/content/URL cleanup, formula tab/Escape behavior, theme selection, and no captured page errors. Screenshots were inspected; pre-existing fixed app chrome colors mean this is not full Design System certification. OS save navigation, clipboard permission, non-Chromium rendering, and external-editor imports remain untested.

Pixel-boundary anti-aliasing and four-decimal rounding are not equivalent to analytic occupancy; sampled tests avoid deliberate boundary ambiguities. See the [artifact index](data/seigaiha-2026-10-28/README.md) for exact outputs and test results.

## Performance and remaining decisions

Geometry size is bounded per tile and independent of repetition count. At default settings, the replacement has 75 arc commands including fill silhouettes, compared with 120 arc commands in the previous generator. Multiple SVG path elements and painter-order fills change rendering costs; no speedup is claimed without benchmarking. Gallery-wide rerendering remains unchanged.

Final visual proportions await user review. Resolve editor targets and transparent export requirements before expanding controls. Subsequent [Shippo correction](SHIPPO_CONSTRUCTION.md) and reference-fitted [Karakusa](KARAKUSA_CONSTRUCTION.md) candidate preserve this corrected Seigaiha output in their regression checks. Earlier tests exclude later intentional corrections. Final visual/editor acceptance remains open.
