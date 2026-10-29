# Karakusa composition refinement artifacts

Generated 2026-10-28. Local reference/review material; image provenance and reuse rights remain unknown.

- `baseline.json`: all nine immediate pre-refinement tile outputs and settings. Karakusa is the preserved v2 procedural prototype. Retain unchanged as the regression/comparison fixture.
- [Reference cell](reference-cell.html), [capture](reference-cell.png): enlarged 278-by-179 source cell with coordinate grid, used to fit composition landmarks.
- [Comparison](comparison.html), [capture](comparison.png): source, v2, v3 at equal approximate repeat scale/stroke, plus enlarged v3. Texture and local irregularity are excluded.
- `karakusa-before.svg`, `karakusa-after.svg`: standalone 480-square default-state exports before and after refinement.
- [Reference fit SVG](reference-fit.svg): one v3 cell at reference scale with light 3.8-pixel branches on blue.
- `formula-*.png`: actual Karakusa formula panel under Steel Night, Paper Mint, and Neon Grid selections.
- [Browser results](browser-results.json): 55 assertions per theme, repeat-coverage and reference-fit metrics, synchronous input timings, and stated limitations.
- [Geometry summary](geometry-summary.json): source/leaf/emitted-path counts, markup size, reference scores, and timing summary.
- `test-results.txt`: combined Node suite results.

From `_CODE`:

```powershell
node --test _Vectors/tests/yagasuri.test.cjs _Vectors/tests/seigaiha.test.cjs _Vectors/tests/shippo.test.cjs _Vectors/tests/karakusa.test.cjs
node _Vectors/tests/browser-karakusa.cjs --out _docs/data/karakusa-refinement-2026-10-28
```

The browser runner records generated outputs only inside this project's `_docs/data/`; set `BROWSER_PATH` if Edge is installed elsewhere. It removes its temporary HTML copy, while browser caches remain under the OS temporary directory. Native save and clipboard permissions are not exercised. Partial reports remain on failure; a passing run exits zero.

The reference score compares the first source cell with v2 and v3 at equal scale/stroke, using white foreground and a two-pixel neighborhood. F1 is 0.440 before and 0.760 after; raw intersection-over-union is 0.113 before and 0.249 after. The retained repeat-coverage check separately compares the same v3 geometry through pattern rendering and an unpruned direct field, allowing one-pixel antialias variation. Neither check establishes exact reference equivalence or historical authenticity.

Current equations, module API, fitting choices, limitations, and future work: [Karakusa construction](../../KARAKUSA_CONSTRUCTION.md).
