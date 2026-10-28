# Roadmap

Plan established on 2026-10-28 from the scratchpad and source review. User authorized proceeding. Initial reference audit and Yagasuri correction are implemented; the workspace and remaining generator corrections are still planned.

## Progress on 2026-10-28
- Completed the initial [nine-pattern visual audit](REFERENCE_AUDIT.md), preserving pre-change SVGs/settings and comparison captures. Provenance/rights and exact repeat specifications for other patterns remain open.
- Implemented the [Yagasuri construction pilot](YAGASURI_CONSTRUCTION.md); five focused tests pass, including unchanged baseline output for the other eight generators. Candidate visual proportions remain open for review.
- Next implementation task: specify Seigaiha's fan geometry, radius increments, stagger, and occlusion before correcting its generator. Module separation remains pending; do not treat this pilot as completion of all Stage 2 work.

## Stage 1: Reference and accuracy audit
- Inventory all nine patterns against `_references/Japanese/`, recording intended variants, provenance, rights uncertainty, repeat cells, and construction rules.
- Capture comparable reference/current-output images in `_docs/data/`; preserve original research files.
- Prioritize user-reported failures: Yagasuri, Seigaiha, Karakusa, Shippo. Preserve Asanoha, Kikko, Uroko as regression candidates; independently assess Ichimatsu and Mameshibori.
- Provisionally choose Yagasuri as the first complete reference-to-construction pilot, subject to reference inspection.

Exit: every pattern has a review status; the pilot has a reference-specific construction specification and acceptance images. Unknown provenance stays explicitly unknown.

## Stage 2: Generator contracts and corrections
- Extract catalog, validation, pure generators, and SVG serialization incrementally, preserving existing behavior and stable IDs.
- Correct the pilot, then remaining reported failures one at a time. Specify Karakusa curves independently rather than assuming a lattice solution.
- Add deterministic output, finite-coordinate/bounds, seam, and SVG structure tests alongside changed generators. Record generator versions when output changes.

Exit: corrected patterns match their chosen references, repeat cleanly, and export standalone SVGs; baseline patterns have no unexplained regressions. Visual and mathematical acceptance are separate gates.

## Stage 3: Selected-pattern workspace
- Review Design System shell, gallery, inspector, tab, and accessibility contracts before implementation.
- Add gallery selection, central preview, contextual controls, and Preview/Construction/Context tabs. Move formula notes into the selected-pattern flow and label unverified material.
- Add reset, preview zoom, tile/repeated-field views, and selected-pattern export. Preserve legacy gallery access.
- Make navigation and inspectors usable on narrow screens; use semantic UI tokens and accessible focus behavior.

Exit: users can select, edit, inspect, reset, and export with keyboard or pointer. Validate wide/narrow layouts and light, dark, and a high-style theme.

## Stage 4: Complete the curated first collection
- Apply metadata and parameter contracts to all nine patterns, with sourced construction/context where available.
- Add search/filtering, review badges, and supported pattern-specific controls.
- Separate preview size from output dimensions; add transparent-background export. Evaluate tile-only export and preset JSON against actual workflows.

Exit: all entries have useful metadata, declared limitations, and consistent export behavior. Unverified history, rights, or reconstruction remains visible.

## Stage 5: Expand after validation
- Add a small second collection with reliable references to test the data model across construction types and cultural contexts.
- Introduce versioned preset import/export and local saving only after agreeing the format and migration behavior.
- Measure dense-output responsiveness before adding caching or workers.

Exit: new collections fit existing contracts without special-case UI branches; any persisted format has documented compatibility and recovery behavior.

## Ideas to evaluate
| Idea | Value | Timing |
| --- | --- | --- |
| Reference split/overlay comparison | Reveals proportion, curvature, spacing errors | Audit artifacts first; interactive tool later |
| Construction steps and lattice guides | Connects equations to visible geometry | Pilot, then Construction tab |
| Reference preset versus variation | Preserves accuracy while enabling exploration | Workspace |
| Tile boundary and 3-by-3 repeat view | Reveals seams, clipping, doubled strokes | Generator checks, then preview |
| Provenance and confidence badges | Makes uncertainty visible | Catalog foundation |
| Shareable parameter recipes | Reproduces variants without storing SVG blobs | After preset versioning |

## Recommended next task and review decisions
Continue with Seigaiha construction and a scoped correction, followed by Shippo; Karakusa needs a larger motif/topology specification. Preserve legacy galleries and defer saved presets under the recommended defaults until workspace requirements are reviewed. Keep UI rebuilding behind geometry contracts and acceptance gates.
