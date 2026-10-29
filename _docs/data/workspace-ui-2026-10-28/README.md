# Opt-in workspace browser validation

2026-10-28. [Results](browser-results.json): 46 checks for each of nine theme/viewport combinations, all passing. Viewport widths are verified at 360, 768 and 1440 CSS pixels via Edge debugging-pipe emulation. `workspace-THEME-WIDTH.png` captures the default Asanoha workspace after interaction checks, with the library expanded and selection focus visible. Narrow captures intentionally show the stacked, collapsible library before the preview.

Run from workspace root:

```powershell
node _Vectors/tests/browser-workspace.cjs --out _docs/data/workspace-ui-2026-10-28
```

See [workspace behavior and test boundaries](../../WORKSPACE_UI.md). Tests compare frozen SVG snapshots through HTML parsing, preserving SVG attribute line breaks consistently. Intercepted clipboard/download checks certify content, not OS permissions. Native keyboard events cover Tab/Enter gallery selection and Enter disclosure collapse. Browser profiles remain in OS temp; the exact temporary instrumented HTML file is removed after each runner invocation. Existing lab verification is stored separately under `lab-regression/`.

[Lab regression results](lab-regression/browser-results.json): 64 checks pass per theme, preserving the 9-pattern/20-static/27-logo galleries and prior behavior. One initial Edge launch timed out; retry passed.
