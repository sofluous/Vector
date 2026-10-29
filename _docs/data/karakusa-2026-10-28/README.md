# Karakusa review artifacts

Generated 2026-10-28. Local review material; source-image rights and historical provenance remain unverified. The current candidate improves topology but is not an exact reference match.

This folder preserves the historical v2 prototype. It is superseded by the [v3 refinement](../karakusa-refinement-2026-10-28/README.md); its snapshots/results remain unchanged.

- `baseline.json`: all nine exact tile outputs/settings immediately before Karakusa work, including corrected Yagasuri/Seigaiha/Shippo. Retain unchanged as the regression fixture.
- [Reference measurement](reference-measurement.json): input hash, threshold/sampling method, search ranges, candidate periods, and rounded mismatch fractions.
- `karakusa-before.svg`, `karakusa-after.svg`: standalone 480-square SVGs using the original global default colors and unit 40.
- [Comparison page](comparison.html), [capture](comparison.png): original reference, before, candidate, approximate reference-scale panel, and enlarged geometry. Both generated comparison panels use light vines on blue to separate palette from geometry; the original image stays linked locally. This is not a tracing or a pixel-equivalence acceptance image.
- `formula-steel-night.png`, `formula-paper-mint.png`, `formula-neon-grid.png`: inspected actual Karakusa formula tab and generated construction schematic.
- [Browser results](browser-results.json): 54 assertions per theme, raster coverage diagnostic, and synchronous input/rebuild timing samples. Copy and download navigation are intercepted; native clipboard/save permissions are not tested.
- `test-results.txt`: combined Node test output.

Run from `_CODE`:

```powershell
node --test _Vectors/tests/yagasuri.test.cjs _Vectors/tests/seigaiha.test.cjs _Vectors/tests/shippo.test.cjs _Vectors/tests/karakusa.test.cjs
```

Manual reproduction: open `_Vectors/index.html`, inspect Karakusa at frame sizes 240/480/2000 and repetitions 4/12/36, change stroke/line/background controls, and confirm accent is unused. Open Formula Info > Karakusa; check the diagram, approximation notice, and Escape close behavior. Export and inspect the SVG independently. To approximate the reference palette, set line color white and background blue; global defaults intentionally retain the same control meanings as other patterns.

The raster diagnostic compares the repeated SVG pattern with an unpruned explicit field of the same serialized motif. Both are rendered at 240 pixels square. Foreground masks use a red-channel contrast threshold greater than 48 from white, with one-pixel neighborhood tolerance; zero unmatched foreground pixels were observed. Raw per-channel comparisons differed on about 12.05% of pixels due to smoothing and are preserved in the report. This does not test reference-image similarity.

Temporary instrumented app copies, raw DOM dumps, and raster-debug captures were discarded after recording results. Browser profiles reside in the OS temporary directory (`vectors-karakusa-*`), outside source/deployment inputs. Production source was not instrumented. No general benchmark or full browser compatibility claim is made.

Construction, control tables, assumptions, and remaining visual work: [Karakusa specification](../../KARAKUSA_CONSTRUCTION.md).
