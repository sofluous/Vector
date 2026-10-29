# Workspace inspection evidence

2026-10-28. [Behavior and limitations](../../WORKSPACE_INSPECTION.md).

61 Node tests pass. [Edge results](browser-results.json) record 193 checks for each of nine theme/viewport combinations. The runner covers content/selection, tab ARIA/keyboard navigation, unique diagram IDs, invalid drafts, centered zoom bounds/Fit, invariant exports, existing native geometry, shifted seams, copy/download and viewport fit.

Screenshots include Preview, Motif, Tile, Construction and Context for each theme/size combination. Desktop Paper Mint also captures each pattern's Tile. Mobile Construction and desktop Preview/Context were visually reviewed. Historical artifacts remain in earlier folders.

Commands from the workspace parent:

```powershell
node --test _Vectors/tests/*.test.cjs
node _Vectors/tests/browser-workspace.cjs --out _docs/data/workspace-inspection-2026-10-28
```

Edge is required. Zoom is relative to Fit and centered; no panning is implemented. Reference/historical acceptance and external SVG-editor imports remain pending.
