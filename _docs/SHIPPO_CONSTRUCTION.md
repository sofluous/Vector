# Shippo construction

Status: implemented candidate `shippo-2`, 2026-10-28. Version name is documentation-only; there is no runtime preset version field. Reference: `_references/Japanese/Shippo.jpg`. Its provenance/rights remain unknown, and this reconstruction makes no historical authenticity claim.

## Reference and change

The supplied image shows diagonal blue lens petals, small gaps at their tips, and light circular negative spaces. The previous generator intersects circles on a square lattice, rotates its filled field by 45 degrees inside the original square cell, and overlays unrotated guide circles. The resulting dense star/diamond field does not match the reference.

The replacement builds four diagonal lenses directly in the square cell, using paired circular arcs and a slightly reduced radius to leave tip gaps. No tile rotation, clip-path IDs, guide outlines, or background masks are needed. Texture and local irregularities are excluded from the idealized vector geometry.

See the [comparison page](data/shippo-2026-10-28/comparison.html), [Edge capture](data/shippo-2026-10-28/comparison.png), and [standalone SVG](data/shippo-2026-10-28/shippo-after.svg). The comparison includes default before/after output, an approximately reference-scaled candidate, and enlarged construction. Reference scale and proportions are estimates, not pixel-equivalence certification.

## Geometry

SVG x increases right and y increases down. Let `u = frame / repetitions`, preserving the existing global unit convention.

| Quantity | Definition |
| --- | --- |
| Tile width/height | `u`, `u` |
| Circle radius | `r = 0.48u` |
| Generating circle centers | `(u/2, 0)`, `(u, u/2)`, `(u/2, u)`, `(0, u/2)` |
| Adjacent-center separation | `d = u/sqrt(2)` |
| Half intersection chord | `h = sqrt(r*r - u*u/8)` |
| Tip inset along each coordinate | `t = u/4 - h/sqrt(2)`, approximately `0.020435u` |
| Repeat vectors | `(u, 0)` and `(0, u)` |

Intersect each adjacent pair of edge-midpoint circles. For the top-left pair, the chord midpoint is `(u/4, u/4)` and the chord points along the diagonal. Its endpoints are `(t,t)` and `(u/2-t,u/2-t)`. Use two minor arcs of radius `r`, each with SVG flags `0 0 1`, to close the lens:

```text
M t t
A r r 0 0 1 (u/2-t) (u/2-t)
A r r 0 0 1 t t
Z
```

Construct the remaining lenses symmetrically. In code, visit each corner `(cx,cy)`; let `sx` and `sy` be +1 toward the tile center from a zero coordinate, otherwise -1. Endpoints are:

```text
P = (cx + sx*t, cy + sy*t)
Q = (u/2 - sx*t, u/2 - sy*t)
```

The radius must lie strictly between `u/(2sqrt(2))` (circles just touch) and `u/2` (tip gaps close) for this particular separated-lens model. The fixed `0.48u` ratio is a visual estimate within that interval, not a historical constant. The implementation computes the inset in normalized ratios before multiplying by `u`, avoiding unnecessary large-coordinate squaring.

## Repetition and controls

All four lenses lie strictly inside their cell. Their tips stop short of the corners and center; neighboring tiles continue the same symmetric spacing. No off-tile copies or rotated repeat basis are necessary. Negative spaces stay unfilled, so they reveal the frame background rather than a painted mask.

- Repetition and frame size continue to determine `u`; the tile dimensions remain `u` by `u`, although motif density/topology changes from the previous construction.
- Line color fills the petals. Stroke width and accent color are intentionally unused; this is stated in the card and formula notes. A future contextual inspector should hide unsupported controls.
- The existing exporter still paints the frame background. The motif itself has no opaque mask, but a transparent-export UI option is not implemented.
- Output is four closed paths inside one filled, un-stroked group, with eight circular arc commands. No IDs, external CSS/assets, raster images, clipping, or new runtime dependencies occur inside the motif.
- The formula diagram uses the established blue/white construction-artwork palette and an accessible image label. App shell and controls remain unchanged.

## Validation

Run from `_CODE`:

```powershell
node --test _Vectors/tests/yagasuri.test.cjs _Vectors/tests/seigaiha.test.cjs _Vectors/tests/shippo.test.cjs
```

The combined suite has 19 passing tests. Shippo tests reconstruct the generating circles from serialized arc commands, verify four closed lenses and their edge-midpoint centers, check filled petal interiors and open tip/edge/center spaces, and compare 1,875 samples against an independent infinite odd-parity circle lattice around repeated cells and seams. They also cover supported UI dimensions, deterministic output, invalid units, recoloring, unsupported-control invariance, formula notes, and JavaScript syntax.

Regression checks retain the pre-Shippo snapshot for generators outside Shippo and the later intentional Karakusa reconstruction, including corrected Yagasuri/Seigaiha. The Karakusa suite separately preserves this Shippo output; five untouched generators still match the original audit baseline.

Edge checks pass 51 assertions for each of Steel Night, Paper Mint, and Neon Grid. They exercise initial gallery counts (9 pattern, 20 static, 27 logo cards), 18 size/density/stroke combinations, color changes, invariant unused controls, formula open/tab/Escape, theme selection, and SVG download/copy content. Download navigation and the clipboard are intercepted: native file saving and clipboard permissions are not certified. See [browser results](data/shippo-2026-10-28/browser-results.json) and the [artifact index](data/shippo-2026-10-28/README.md).

## Limits and next work

Final proportions await user review. Non-Chromium rendering, external-editor imports, native clipboard/file saves, and full responsive/accessibility/theme acceptance remain open. Existing hardcoded app chrome colors are outside this correction. No source attribution or reuse permission has been established by a visual match.

Geometry stays constant at four paths per tile, replacing fifty clipped circles plus fifty clip definitions and four guide circles. This reduces SVG structure substantially, but runtime speed has not been benchmarked; gallery-wide rerendering is unchanged.

Subsequent Karakusa work now implements an experimental connected stem/curl/leaf graph with tested seam position/tangent constraints. Its reference arrangement still needs fitting. Keep user-favored baselines unchanged while refining remaining scoped patterns.
