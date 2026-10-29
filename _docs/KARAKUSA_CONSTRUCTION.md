# Karakusa reference-fitted construction

Status: implemented candidate `karakusa-3`, reviewed 2026-10-28. This version refines the supplied `_references/Japanese/Karakusa.jpg` using measured landmarks and fitted splines. It is not an exact tracing, a universal Karakusa formula, or historical authentication. Source provenance and reuse rights remain unverified.

## Result and evidence

The earlier `karakusa-2` prototype used two artificial backbone curves and eight generic polar spirals. It repeated correctly, but its rows, regular curls, and connector routes differed from the reference. Moving spiral centers alone produced crossings. The replacement uses sixteen reference-positioned branching paths and eight pointed leaves; the earlier prototype is preserved in the refinement baseline and original review artifacts.

The [comparison page](data/karakusa-refinement-2026-10-28/comparison.html) and [capture](data/karakusa-refinement-2026-10-28/comparison.png) show equal approximate cell spacing and stroke for the two generated panels. The [enlarged reference cell](data/karakusa-refinement-2026-10-28/reference-cell.png) records the landmarks used for fitting.

At the original 278-by-179 cell scale, foreground F1 improves from **0.440 to 0.760** with a two-pixel square-neighborhood tolerance. Raw pixel intersection-over-union improves from 0.113 to 0.249. These are improvements over the preserved prototype, not exact image agreement. Texture, stroke irregularity, local curve estimates, and the approximate repeat period leave residual differences.

## Implementation and contract

- Runtime: [patterns/karakusa.js](../patterns/karakusa.js), loaded before the inline app script. It works as a classic browser script for local-file use and as a dependency-free CommonJS module in Node.
- Browser API: `KarakusaPattern.tile(unit, state)`. Node API: `require('./patterns/karakusa.js')` from the project root.
- `tile` takes a positive finite base unit and positive finite `state.stroke`, plus a trusted line-color string. It returns `{ w, h, markup }` as before. Invalid numeric inputs throw `RangeError`. Future untrusted imports must validate color/content before calling renderers.
- `paths` and `leaves` expose deeply frozen fit records. `buildGeometry()` returns fresh cubic/quadratic control points in reference coordinates; changing returned arrays cannot mutate the source fit.
- All eight other generators preserve their immediate pre-refinement outputs. No server, package installation, bundler, or external runtime dependency is required.

Example from the project root:

```javascript
const karakusa = require('./patterns/karakusa.js');
const tile = karakusa.tile(40, { line: '#2a5db1', stroke: 1.6 });
console.log(tile.w, tile.h); // 160, 103.0216
```

## What the mathematics reproduces

For this organic motif, the reproducible model is a fitted knot graph plus spline interpolation and periodic translation. The knot coordinates describe one selected reference variant; they are not historical constants or an inferred original artisan algorithm. The canonical coordinates and parent relationships live in the runtime module, not in a second copied implementation.

Let the reference cell be `278 x 179`. Its approximate ratio comes from the earlier binary repeat measurement, preserved in [the measurement record](data/karakusa-2026-10-28/reference-measurement.json). Map it to the current global base unit:

```text
u = frame / repetitions
W = 4u
scale = W / 278
H = 179 * scale
repeat vectors = (W, 0), (0, H)
```

Each branch is a list of measured/fitted knots. For consecutive knots `P[i]`, `P[i+1]`, use uniform Catmull-Rom conversion to cubic Bezier control points:

```text
C1 = P[i]   + (P[i+1] - P[i-1]) / 6
C2 = P[i+1] - (P[i+2] - P[i])   / 6

B(t) = (1-t)^3 P[i] + 3(1-t)^2 t C1
     + 3(1-t)t^2 C2 + t^3 P[i+1],  0 <= t <= 1
```

Clamp missing neighbor knots to the endpoint itself. Adjacent segments interpolate the same knot and share the same first derivative; the compiled geometry is C1 continuous within each path. SVG coordinates retain the existing four-decimal serialization precision.

## Branches, leaves, and seams

Each of the sixteen paths names a parent path and knot index. Its starting point equals that parent knot, optionally translated by an integer cell period. Three joins cross the vertical period: `curl-0` from `curl-12`, `curl-6` from `curl-5`, and `curl-14` from `curl-13`, each shifted by `(0,-179)` in reference coordinates. Tests verify these relationships and that every branch reaches the same periodic central cycle.

Branches share positions (C0 attachment), while the directions may diverge at a fork. Requiring every branch to share its parent's tangent was a prototype simplification that produced incorrect connectors. Each individual fitted path remains internally smooth. The model does not assert that all horizontally repeated vines form one global connected component.

Eight leaves use parent knots as bases and fitted tip coordinates. Two quadratic curves close each leaf. Their controls sit at the base/tip midpoint, offset by the recorded width along its perpendicular. Leaves are filled in the selected line color without a stroke.

Control-point hull bounds, padded by half the effective stroke, determine which translated copies can intersect the cell. Translation ranges are calculated per path rather than assuming a fixed stencil. Thus curves crossing a tile edge continue as translated pieces of the same curve. The default tile emits 33 paths from 24 logical parts; it does not emit every full neighboring motif.

## Controls and limits

- Line color controls both branches and leaves. Background remains an exporter-frame property; no background masks are embedded in the motif. Accent is unused.
- Effective stroke remains `min(requested stroke, 0.018W)`, with round caps and joins. The existing card and formula notes disclose the cap.
- Cell dimensions and global size/repetition behavior are unchanged from v2. The composition and SVG paths change; existing SVG files remain untouched.
- The source palette is light vines on blue. App defaults preserve the meaning of the global color controls; comparison artifacts use a reference-like palette explicitly.
- Individual curl radius/turn controls are not provided: this fit uses knots, not generic polar spirals. Any future local shape editor must preserve shared anchors and periodic joins.
- The exporter still paints an opaque frame. No transparent-export UI, freeform path editor, or historical metadata system was added.

## Validation

From `_CODE`:

```powershell
node --test _Vectors/tests/yagasuri.test.cjs _Vectors/tests/seigaiha.test.cjs _Vectors/tests/shippo.test.cjs _Vectors/tests/karakusa.test.cjs
node _Vectors/tests/browser-karakusa.cjs --out _docs/data/karakusa-refinement-2026-10-28
```

The combined Node suite has 28 passing tests. Karakusa checks cover graph attachment, periodic joins, knot interpolation, internal derivatives, closed leaf anchoring, exported control points, pruned versus unpruned coverage, immutable source/fresh outputs, supported sizes, invalid inputs, colors, unused controls, formula notes, JavaScript syntax, and the eight other generators' baseline outputs.

The retained app-specific browser runner needs Node and Microsoft Edge on Windows. Set `BROWSER_PATH` to another compatible Chromium executable if needed. It accepts `--out` only inside this project's `_docs/data/`; failures exit nonzero and record available reports. A temporary instrumented HTML copy is removed afterward. Fresh browser profiles remain under the OS temporary directory (`vectors-karakusa-qa-*`); they are not source or deployment inputs. The JPEG is embedded into the local test copy as a data URL for origin-clean canvas comparisons without weakening browser file-access settings.

[Browser results](data/karakusa-refinement-2026-10-28/browser-results.json) record 55 passing checks per theme (Steel Night, Paper Mint, Neon Grid), including eighteen control combinations, reference-fit improvement, repeated-field foreground coverage within one-pixel antialias tolerance, recoloring, intercepted copy/download content, formula interactions, theme selection, gallery counts 9/20/27, and no captured page errors. Save navigation and clipboard are stubbed, so native permissions and actual file saving remain untested.

The reference metric uses the upper-left 278-by-179 image cell, white foreground above 180 in each RGB channel, and symmetric precision/recall with a two-pixel square-neighborhood tolerance. Both candidates use equivalent cell scale and approximately 3.8-pixel stroke. The runner requires an F1 gain of at least 0.15 over v2; the observed gain is 0.320. The metric is for this selected cell, not the entire world's Karakusa variants.

## Performance and remaining acceptance

The default motif markup grows from about 13.9 KB (v2) to 17.9 KB (v3), reflecting more fitted paths. In these headless sessions, 66 synchronous gallery rebuild samples per theme had medians of 10.8-14.0 ms and a maximum of 59.3 ms. These measurements exclude paint/frame latency and are not a controlled before/after benchmark. The future workspace should render only the selected pattern during editing.

Final curve/palette review, non-Chromium behavior, external SVG-editor imports, native save/clipboard permissions, and comprehensive accessibility/theme acceptance remain open. Reference-image similarity has improved substantially, while exact tracing and historical authenticity are not claimed. Next work can separate the remaining generators and serialization contracts, then add reference presets before the workspace redesign.
