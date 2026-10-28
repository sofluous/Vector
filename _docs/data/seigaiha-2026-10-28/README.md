# Seigaiha review artifacts

Generated on 2026-10-28. Local research/review only; the supplied reference's reuse rights remain unknown. Original images and original audit artifacts were not modified.

- `baseline.json`: all nine exact tile outputs immediately before the Seigaiha correction, at unit 40 with settings included. This includes corrected Yagasuri and is a regression-test fixture; retain it unchanged.
- `seigaiha-before.svg`, `seigaiha-after.svg`: standalone 480-square exports at the same unit/settings.
- [Comparison page](comparison.html), [capture](comparison.png): supplied reference, before, after, and an enlarged candidate. Original reference remains linked locally, not copied into the page source. Densities are not normalized.
- `formula-steel-night.png`, `formula-paper-mint.png`, `formula-neon-grid.png`: actual formula panel after live-control and download-generation checks under the named theme selections.
- [Browser results](browser-results.json): 49 assertions per theme; native download navigation intercepted, no OS save/clipboard acceptance. A disposable local copy of the current app with an injected inspection probe was used, then removed; application source was not instrumented.
- `test-results.txt`: combined Node test output.

Run the retained tests from `_CODE`:

```powershell
node --test _Vectors/tests/yagasuri.test.cjs _Vectors/tests/seigaiha.test.cjs
```

For manual browser reproduction, open `_Vectors/index.html`, exercise frame sizes 240/480/2000, repetitions 4/12/36, and strokes 0.4/8. Change line/background colors, export Seigaiha and open independently, then select each named theme and open Formula Info > Seigaiha. Escape should close the panel. External-editor and non-Chromium acceptance remain open. Browser profiles used for these headless captures reside under the OS temporary directory (`vectors-seigaiha-*`); they are not project source or deployment inputs.

Construction equations, implementation limits, and next work: [Seigaiha specification](../../SEIGAIHA_CONSTRUCTION.md).
