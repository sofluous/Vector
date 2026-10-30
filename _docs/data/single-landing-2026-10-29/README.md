# Single Vectors landing - 2026-10-29

`index.html` is the only application entry. `workspace.html` is removed at user request. The browser suite opens the actual main landing directly, then runs the instrumented editing/export checks.

63 Node tests pass, including a regression check that the separate entry is absent and no redirect is present on the main page. [Browser results](browser-results.json) cover three themes and three viewport sizes, with 195 checks per case. Existing geometry, exports, zoom, content and reference-fit checks are preserved.

Commands from the workspace parent:

```powershell
node --test _Vectors/tests/*.test.cjs
node _Vectors/tests/browser-workspace.cjs --out _docs/data/single-landing-2026-10-29
```

The editing controller and stylesheet retain their internal workspace names; these are assets, not secondary entry points. Prior redirect evidence remains historical. No deployment was performed.
