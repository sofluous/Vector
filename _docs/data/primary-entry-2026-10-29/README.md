# Primary entry validation - 2026-10-29

The updated workspace is the main `index.html` entry. `workspace.html` redirects existing bookmarks while preserving query parameters and fragments. Legacy lab/static/logo gallery markup is retired.

The Node suite has 63 tests, including complete entry resource/parse checks, redirect behavior and the retained construction-text fixture. The current Edge suite runs 195 checks per theme/viewport combination (three themes at 360, 768 and 1440 CSS pixels). [Results](browser-results.json) include the transferred Karakusa reference-fit measurement as well as existing export, geometry/seam, input, keyboard and inspection checks.

Screenshots cover the main workspace, Motif/Tile, Construction/Context, and desktop individual tiles. Mobile main-entry and desktop content captures are selected visual evidence. All earlier artifacts remain historical evidence; no source-page backup was added.

Commands from the workspace parent:

```powershell
node --test _Vectors/tests/*.test.cjs
node _Vectors/tests/browser-workspace.cjs --out _docs/data/primary-entry-2026-10-29
```

Edge is required. The bounded browser timeout now reports its stage and allows 90 seconds per case. External SVG-editor round trips, final candidate visual acceptance, historical provenance and reference redistribution rights remain unverified. No deployment was performed.
