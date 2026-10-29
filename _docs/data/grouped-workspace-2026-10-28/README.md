# Grouped workspace verification

2026-10-28: [browser-results.json](browser-results.json) records 57 passing checks per theme/viewport combination, nine runs total. Captures show the default Asanoha workspace after interaction tests at exact 360, 768 and 1440 CSS-pixel widths in Steel Night, Paper Mint and Neon Grid. Libraries are expanded; some groups require scrolling inside the bounded library.

```powershell
node --test _Vectors/tests/*.test.cjs
node _Vectors/tests/browser-workspace.cjs --out _docs/data/grouped-workspace-2026-10-28
```

The Node suite has 42 passing tests. New browser coverage tests grouping/search, no-match recovery, unchanged selection during filtering, numeric/range synchronization, hex/picker synchronization, invalid hex recovery and native ArrowRight adjustment. Existing output, state, reset, error and intercepted-export assertions are retained. See [workspace documentation](../../WORKSPACE_UI.md) for behavior, token choices, script lifecycle and limitations.

Clipboard/download checks intercept native operations. These results do not certify OS permissions, external editors, non-Chromium or complete accessibility/contrast. Previous artifacts remain unchanged in workspace-ui-2026-10-28. Source catalog order and frozen geometry/export snapshots are unchanged.
