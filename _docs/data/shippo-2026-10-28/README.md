# Shippo review artifacts

Generated 2026-10-28 for local review. Supplied image provenance/rights remain unknown; original research files and earlier audit snapshots were not modified.

- `baseline.json`: exact immediate pre-Shippo tile output and settings for all nine generators at unit 40. Includes corrected Yagasuri and Seigaiha; retain unchanged as a test fixture.
- `shippo-before.svg`, `shippo-after.svg`: standalone 480-square SVGs at identical base-unit and color settings.
- [Comparison page](comparison.html) and [capture](comparison.png): supplied reference, default before/after, approximate reference-scale output at unit 28.5, and enlarged geometry at unit 120. The source image remains linked locally in the HTML.
- `formula-steel-night.png`, `formula-paper-mint.png`, `formula-neon-grid.png`: inspected actual formula panel under the named theme selections.
- [Browser results](browser-results.json): 51 passing assertions per theme. Download navigation and clipboard are stubbed; no native save or clipboard permission test. A disposable copy of the current app with an injected inspection probe was used and then removed; production source was not instrumented.
- `test-results.txt`: combined Node test results.

Run tests from `_CODE`:

```powershell
node --test _Vectors/tests/yagasuri.test.cjs _Vectors/tests/seigaiha.test.cjs _Vectors/tests/shippo.test.cjs
```

Manual reproduction: open `_Vectors/index.html`; inspect Shippo at frame sizes 240/480/2000 and repetitions 4/12/36; change line/background colors; confirm stroke and accent do not change its filled petals. Copy/download and inspect the SVG separately. Under each named theme, open Formula Info > Shippo and check the diagram/notes; Escape closes it. External-editor and non-Chromium checks remain open. Headless browser profiles reside under the OS temporary directory (`vectors-shippo-*`), outside project source/deployment inputs.

Equations, assumptions, and constraints: [Shippo construction](../../SHIPPO_CONSTRUCTION.md).
