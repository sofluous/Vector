# Karakusa construction

Status: implemented experimental candidate `karakusa-2`, 2026-10-28. Version name is documentation-only. This is an idealized connected-vine reconstruction, not a tracing or an authenticated historical definition. Source: `_references/Japanese/Karakusa.jpg`; creator, provenance, and reuse rights remain unknown. The current arrangement still differs from the reference and requires further visual fitting before reference-match acceptance.

## Reference observations

The reference combines connected sweeping stems, inward curls of different sizes, and small pointed leaves. Its supplied palette is light vines on blue ground. The existing generator instead renders sparse disconnected curve rows.

A binary light-pixel comparison of the supplied raster found candidate periods of 278 pixels horizontally and 179 pixels vertically. Classification used RGB channels greater than 180 and sampled every third pixel; the best integer shifts over ranges 150..420 and 100..280 had mismatch fractions 0.0287 and 0.0262. This estimates the composition ratio, not exact pixel periodicity or a historical module.

## Graph and repeat

Normalize horizontal width to 1 and set height `H = 179/278`. A three-segment cubic horizontal backbone crosses the left/right edges with matched endpoint and derivative. A two-segment vertical connector joins one backbone node to its vertically translated copy, also matching position and derivative. This gives a connected two-direction periodic graph.

Eight spiral branches attach to evaluated backbone/connector points. Their connecting cubics share each source tangent direction and each spiral's initial tangent direction. Pointed two-quadratic leaves share base points with stems. Branches can extend outside the nominal cell; translated neighboring motifs supply the cropped geometry at boundaries.

Scale width to `W = 4 * frame / repetitions` and height to `WH`. Preserve the selected line color for stems/leaves and background for the frame. Palette inversion in the reference is a separate preset concern, not a reason to reverse the meaning of the controls. Reference-period measurement and input hash are preserved in [the measurement record](data/karakusa-2026-10-28/reference-measurement.json).

## Backbone coordinates

Coordinates below are normalized by `W`; `H = 179/278`. Each row lists the cubic's four control points. These are chosen construction parameters, not traced historical constants.

| Segment | P0 | P1 | P2 | P3 |
| --- | --- | --- | --- | --- |
| Horizontal 0 | `(0,.36)` | `(.10,.36)` | `(.15,.44)` | `(.30,.40)` |
| Horizontal 1 | `(.30,.40)` | `(.45,.36)` | `(.49,.24)` | `(.65,.28)` |
| Horizontal 2 | `(.65,.28)` | `(.81,.32)` | `(.90,.36)` | `(1,.36)` |
| Vertical 0 | `(.30,.40)` | `(.19,.46)` | `(.29,.60)` | `(.45,.60)` |
| Vertical 1 | `(.45,.60)` | `(.61,.60)` | `(.41,.34+H)` | `(.30,.40+H)` |

Horizontal end minus start is `(1,0)`; vertical end minus start is `(0,H)`. Endpoint derivative vectors, and derivatives at internal joins, agree because the corresponding end/start handle differences agree. The vertical start shares Horizontal 0's endpoint, so the translated graph is connected in both directions.

## Curve equations

For a cubic with points `P0..P3`, evaluate:

```text
B(t) = (1-t)^3 P0 + 3(1-t)^2 t P1 + 3(1-t)t^2 P2 + t^3 P3
B'(t) = 3(1-t)^2(P1-P0) + 6(1-t)t(P2-P1) + 3t^2(P3-P2)
```

For each inward spiral:

```text
rho(t) = R * (1 - 0.92t^2)
theta(t) = theta0 + winding * 2*pi*turns*t
S(t) = center + rho(t) * (cos(theta), sin(theta))
rho'(t) = -1.84Rt
omega = winding * 2*pi*turns
S'(t) = (rho' cos(theta) - rho*omega sin(theta),
         rho' sin(theta) + rho*omega cos(theta))
```

For interval `[a,b]`, export cubic points `S(a)`, `S(a)+(b-a)S'(a)/3`, `S(b)-(b-a)S'(b)/3`, `S(b)`. Use `ceil(12*turns)` equal intervals, at most 30 degrees per interval. This is a cubic Hermite approximation of the polar spiral; the exported curves are themselves precise editable Beziers. The quadratic radial profile keeps the outside of each curl fuller than linear shrinkage. It ends at radius `0.08R` rather than collapsing to a singular center.

| Curl | Source segment / t | Center | R | Start angle | Winding | Turns |
| --- | --- | --- | --- | --- | --- | --- |
| 0 | Horizontal 0 / .50 | `(.11,.18)` | .145 | pi/2 | +1 | 1.55 |
| 1 | Horizontal 1 / .25 | `(.40,.16)` | .145 | pi/2 | +1 | 1.45 |
| 2 | Horizontal 2 / .55 | `(.79,.12)` | .160 | pi/2 | -1 | 1.55 |
| 3 | Horizontal 0 / .15 | `(.10,.54)` | .110 | -pi/2 | +1 | 1.40 |
| 4 | Horizontal 1 / .65 | `(.60,.48)` | .140 | -pi/2 | -1 | 1.50 |
| 5 | Horizontal 2 / .92 | `(.88,.53)` | .110 | -pi/2 | -1 | 1.40 |
| 6 | Vertical 1 / .65 | `(.59,.10+H)` | .065 | pi/2 | +1 | 1.35 |
| 7 | Vertical 1 / .25 | `(.61,.66)` | .055 | pi | +1 | 1.30 |

A connector cubic joins source point `A=B(t)` to `S(0)`. Its first handle follows the source tangent; its last handle approaches along the initial spiral tangent. Handle length is `min(.06, .45*distance(A,S(0)))` in normalized coordinates. Direction continuity is enforced; connector/spiral handle lengths need not match, so this join is G1 rather than uniformly parameterized C1. Internal spiral joins are C1.

## Leaves and finite tiling

Eight leaves attach at Horizontal 0/.74, Horizontal 1/.13 and .80, Horizontal 2/.30 and .75, Vertical 0/.55, and Vertical 1/.50 and .85. Rotate the source tangent by alternating signed `0.9` radians (signs `-, -, +, -, +, +, -, +`). Leaf length is `.06W`. Two quadratic curves connect base to tip and back, using controls at half length plus/minus `.018W` along the leaf normal. Fill leaves in the selected line color without a stroke.

Start with translated motif copies at columns/rows `-1..1`. Conservative control-point hull bounds, padded by half the effective stroke, exclude paths that cannot intersect the cell. The default tile emits 25 paths rather than all 162 paths from nine complete 18-part motifs. This pruning preserves edge-crossing curls and the vertical connector. Tests compare it against an unpruned periodic field; source-part attributes support inspection and do not create document-ID collisions.

Effective stem stroke is `min(requested stroke, .018W)`, with round caps/joins. The card and formula tab disclose this limit. Accent is unused. Background remains an exporter frame property, not a mask within the vines. The current exporter still paints an opaque frame; no transparent-export UI was added.

## Evidence and checks

Run from `_CODE`:

```powershell
node --test _Vectors/tests/yagasuri.test.cjs _Vectors/tests/seigaiha.test.cjs _Vectors/tests/shippo.test.cjs _Vectors/tests/karakusa.test.cjs
```

The combined suite has 27 passing tests. Karakusa checks cover periodic positions/derivatives, every curl's source attachment and tangent, spiral approximation, closed leaf anchoring, pruned versus unpruned periodic coverage, finite/deterministic supported sizes, stroke limits, unused-control behavior, invalid units/strokes, formula notes, JavaScript syntax, and byte-identical output from the other eight generators at baseline settings.

[Edge results](data/karakusa-2026-10-28/browser-results.json) record 54 passing assertions under each of Steel Night, Paper Mint, and Neon Grid: gallery counts 9/20/27, eighteen size/density/stroke combinations, line/background/accent behavior, intercepted copy/download content and object-URL cleanup, formula open/tab/Escape, theme selection, and no captured page errors. SVG-pattern versus explicit unpruned-field rasterization has zero unmatched foreground pixels with a one-pixel antialias tolerance. Raw color differences affect about 12.05% of pixels because edge smoothing differs; strict per-channel equality initially failed and is not claimed. Both diagnostic SVGs were explicitly sized to 240 by 240 pixels. This check tests coverage, not exact raster color equality or fidelity to the historical reference.

See the [comparison](data/karakusa-2026-10-28/comparison.html), [capture](data/karakusa-2026-10-28/comparison.png), [standalone SVG](data/karakusa-2026-10-28/karakusa-after.svg), and [artifact index](data/karakusa-2026-10-28/README.md). Comparison panels use light vines on blue to match the source palette; app defaults still use the global controls. The source-scale panel uses approximately the measured repeat size. Neither it nor the mathematical tests establish an exact reference match.

## Remaining acceptance and performance

The reference has a denser, less visibly row-based arrangement and different local curl/branch shapes. Current work corrects disconnected topology and supplies a reproducible editable construction; further visual fitting remains necessary before declaring the pattern reference-matched. Preserve this candidate and the original baseline for comparison.

Geometry is bounded and neighboring paths are pruned, but this candidate contains more curve data than the earlier sparse generator. Across the three headless sessions, 66 synchronous whole-gallery input rebuilds per theme had medians of 6.8-8.4 ms and a maximum of 38.3 ms on this machine. These samples exclude paint/frame latency and do not establish a speedup or performance guarantee. The future selected-pattern workspace should avoid rebuilding inactive patterns.

Native save/clipboard permissions, external-editor compatibility, non-Chromium rendering, comprehensive accessibility, and full theme compliance remain separate checks. Original app chrome contains fixed colors; the new formula tab reuses the existing component and blue/white artwork conventions. No historical provenance or rights have been established by this reconstruction.
