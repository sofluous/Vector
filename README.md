# Vectors

Browser SVG pattern workspace with deterministic generators, per-pattern controls, and export workflows. Current entry point is `index.html`.

Serve this directory with a static server (Python 3 example):

```text
python -m http.server 5500 --bind 127.0.0.1
```

Open `http://127.0.0.1:5500/`; stop with Ctrl+C. No package install/build is configured.

With Node (validated with 24.14.1), from the repository:

```text
node --test tests/*.test.cjs
```

The suite covers generators, contracts, sessions, content references, snapshots, layout and entry points. No separate build/lint command is configured. Native SVG/editor compatibility and historical/reference accuracy still need external/manual acceptance.

| Location | Ownership |
| --- | --- |
| `index.html`, `workspace.js`, `patterns/`, `css/`, `design-system/` | Application inputs |
| `_references/Japanese/` | Nine runtime/context reference JPGs; provenance and redistribution rights unverified |
| `tests/`, `tests/fixtures/` | Required checks and immutable JSON/SVG baselines |
| `tests/browser-workspace.cjs` | Optional project-specific Edge acceptance runner; BROWSER_PATH override, local output under repository `_docs/data/` |

Read [fixture provenance](tests/fixtures/README.md) before modifying snapshots. Local research/evidence originals are retained outside the repository; these test/runtime copies make normal checks independent of outer context. Do not infer publication permission from local file placement.

See [AGENTS.md](AGENTS.md). Optional local docs at `../_docs/README.md` may be absent in a clone. No hosting configuration is supplied; review intended runtime/support upload boundaries separately from ignore rules. Legacy root `theme.css` and split assets remain pending external-consumer review.
