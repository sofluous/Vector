# Vectors Docs Index

Tracks product direction, current implementation, proposed development, validation, and history.

## Update rules
- Update `CHANGELOG.md` for meaningful implementation or documentation changes.
- Keep current behavior separate from proposed work and `ROADMAP.md` focused on priorities.
- Keep `QA.md` aligned with risks; accuracy requires recorded evidence.
- Preserve raw scratchpad notes; record interpretations and assumptions in the product/plan.
- Cite verified sources before presenting historical or mathematical claims as established facts.
- Store generated review reports/artifacts in `_docs/data/`.

## Documents
- [Product](PRODUCT.md): current architecture, direction, proposed contracts, open decisions.
- [Roadmap](ROADMAP.md): stages, acceptance gates, and ideas.
- [QA](QA.md): reported issues, risks, and validation.
- [Data migration](DATA_MIGRATION.md): data ownership and proposed compatibility rules.
- [Changelog](CHANGELOG.md): chronological change log.
- [GitHub setup and publishing](GITHUB_SETUP.md): web/terminal repository creation, remote configuration, committing, pushing, and troubleshooting.
- [Scratchpad](data/scratchpad.md): original notes, date preserved as supplied.
- [Reference audit](REFERENCE_AUDIT.md): nine-pattern visual findings, provenance gaps, artifacts, and priorities.
- [Yagasuri construction](YAGASURI_CONSTRUCTION.md): implemented pilot equations, repeat rules, tests, and limitations.
- [Seigaiha construction](SEIGAIHA_CONSTRUCTION.md): layered wave fans, repeat/occlusion rules, stroke limits, and validation.
- [Shippo construction](SHIPPO_CONSTRUCTION.md): direct equal-circle lens petals, tip gaps, square repeat, and validation.
- [Karakusa construction](KARAKUSA_CONSTRUCTION.md): reference-fitted spline graph, branch/leaf equations, measured fit improvement, seam tests, and browser-runner usage.

- [Generator contracts](GENERATOR_CONTRACTS.md): runtime modules, validation, reference variants, and checks.

- [Selected-pattern workspace plan](WORKSPACE_PLAN.md): acceptance gates, proposed interactions/state, control capabilities, and implementation slices.
- [Current pattern review](data/workspace-review-2026-10-28/review.html): nine local references and eleven standalone candidate/default SVGs.

- [Workspace session model](WORKSPACE_SESSION.md): implemented state/capability APIs, examples, validation and UI integration responsibilities.

- [Pattern workspace](WORKSPACE_UI.md): grouped browsing, paired inspector controls, responsive behavior, browser checks and legacy retirement direction.

- [Density and seamless output](DENSITY_AND_TILING.md): density 1, natural cell aspect, whole-field repetition, APIs and compatibility.

- [Motif, tile and pattern](MOTIF_TILE_PATTERN.md): complete shapes, repeat construction, square-tile exceptions and view-specific exports.

- [Compact workspace](COMPACT_WORKSPACE.md): readable gallery previews, toolbar/Info layout, fitted preview, responsive panels and validation.

- [Rejected square-arrangement experiment](SQUARE_ARRANGEMENTS.md): historical evidence; superseded by the tessellation contract.

- [Current tessellation contract](TESSELLATION.md): native lattice spacing/connections, phase controls, and unresolved square-export constraints. Supersedes the rejected square-packing experiment.

- [Workspace inspection](WORKSPACE_INSPECTION.md): Construction/Context tabs, selected reference/review content and preview-only Fit/zoom.

## Running and validating the app

Open `index.html` for the primary workspace. The separate `workspace.html` entry is removed; use the project root or `index.html`. Static-vector/logo galleries are retired. There is no configured build/lint/CI/deployment pipeline.

From the `_CODE` workspace parent:

```powershell
node --test _Vectors/tests/*.test.cjs
node _Vectors/tests/browser-workspace.cjs --out _docs/data/primary-entry-2026-10-29
```

Node is required for automated tests; the browser runner also needs Edge (override with `BROWSER_PATH`). `tests/` is essential regression/acceptance infrastructure and stays in the project root. `tests/fixtures/` holds the transferred construction-text contract. Some historical SVG/JSON files in `_docs/data/` are required test fixtures, not disposable output. Browser screenshots and reports are intentionally retained evidence; temporary instrumented `.workspace-qa-*.html` files are ignored narrowly and cleaned by the runner. The former lab-only `browser-karakusa.cjs` is retired; its reference-fit check now runs in `browser-workspace.cjs`.

Supporting `notes/`, `tests/` or `scripts/` folders under `_docs` should be introduced only when material needs them; none were created for this entry migration. See the cleanup backlog in [Roadmap](ROADMAP.md) and runtime delivery inputs in [Product](PRODUCT.md). Git ignore rules do not control deployment inclusion.
