# Vectors Development

Read [README](README.md) for setup, checks, and fixture provenance.

- `index.html` is the single entry point. Preserve native pattern geometry, independent state/validation, SVG export contracts, and current workspace interactions. Do not treat deterministic repetition as historical/reference accuracy approval.
- Keep runtime `patterns/`, `workspace.js`, CSS/theme assets, and `_references/Japanese/` JPGs together. Provenance/redistribution rights remain unverified; do not publish them automatically.
- Required Node checks and frozen snapshots belong in `tests/` and `tests/fixtures/`. Run `node --test tests/*.test.cjs` from this directory. Do not regenerate expected outputs from changed runtime merely to pass tests.
- Optional `tests/browser-workspace.cjs` uses installed Edge/BROWSER_PATH and writes ignored/local evidence under repository `_docs/data/`. Its output routing and broader browser acceptance remain separately reviewed. No package/build/lint pipeline is configured.
- Follow applicable parent instructions when present. Optional context is `../_docs/README.md`; normal tests/runtime inputs must not depend on outer docs/references. Preserve unrelated edits and report unavailable visual/editor checks.
