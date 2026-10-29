# Roadmap

Plan established on 2026-10-28 from the scratchpad and source review. User authorized proceeding. Four generator candidates are implemented; Karakusa now uses a substantially closer reference-fitted spline composition. Generator separation and optional reference variants are complete. The first workspace is opt-in. Final visual/editor acceptance and workspace inspection/content features remain open.

## Progress on 2026-10-28
- Completed the initial [nine-pattern visual audit](REFERENCE_AUDIT.md), preserving pre-change SVGs/settings and comparison captures. Provenance/rights and exact repeat specifications for other patterns remain open.
- Implemented the [Yagasuri construction pilot](YAGASURI_CONSTRUCTION.md); five focused tests pass, including unchanged baseline output for the other eight generators. Candidate visual proportions remain open for review.
- Implemented [Seigaiha's fan construction](SEIGAIHA_CONSTRUCTION.md), including fixed ring count, row stagger, background occlusion, bounded stroke, updated formula notes, and repeat tests. The combined suite has twelve passing tests. Edge checks cover live controls, intercepted SVG download generation, and the formula panel under three theme selections.
- Implemented [Shippo's direct-lens construction](SHIPPO_CONSTRUCTION.md), removing rotated repeat geometry, clip IDs, and guide outlines. The combined suite has 19 passing tests; Edge checks cover controls, intercepted copy/download content, and the formula panel under three theme selections.
- Implemented [Karakusa's experimental connected graph](KARAKUSA_CONSTRUCTION.md), including periodic cubic stems, tangent-attached spiral branches, filled leaves, hull-pruned neighboring paths, stroke bounds, and a formula tab. The combined suite has 27 passing tests; Edge checks cover interactions and repeated-field raster coverage under three themes.
- Refined Karakusa to sixteen fitted spline paths and eight leaves; replaced crossing-prone artificial spine/spiral connectors. Measured reference foreground F1 improves from 0.440 to 0.760 (two-pixel tolerance). Its fit data/renderer are isolated in `patterns/karakusa.js`; the combined suite has 28 passing tests and the retained browser runner passes 55 checks per theme.
- Separated catalog/generators, validation, and SVG serialization into dependency-free modules; added optional Ichimatsu and Mameshibori reference variants while preserving defaults. See [contracts](GENERATOR_CONTRACTS.md).
- Prepared the [selected-pattern workspace plan](WORKSPACE_PLAN.md) and [consolidated acceptance review](data/workspace-review-2026-10-28/review.html). Visual/editor acceptance remains open; these candidates do not complete Stage 2 acceptance.
- Implemented [workspace slice 1](WORKSPACE_SESSION.md): immutable independent per-pattern state and capability metadata; 40 tests pass. Geometry and page layout remain unchanged.
- Implemented [opt-in workspace slice 2](WORKSPACE_UI.md): gallery, selected field preview, contextual inspector, draft validation and selected export. The current lab remains the default.
- User endorsed the workspace direction and retired legacy galleries from the target scope. Implemented grouped/searchable pattern browsing and compact paired inspector controls with revised responsive layout.
- Implemented [density 1 and complete repeat fields](DENSITY_AND_TILING.md), preserving natural cell aspect as chosen by the user.
- Implemented [Motif/Tile/Pattern inspection](MOTIF_TILE_PATTERN.md), view-specific exports; subsequent user clarification prioritizes native minimal repeats over square composites.
- Implemented [compact workspace/gallery refinement](COMPACT_WORKSPACE.md): consistent visible thumbnails, toolbar, on-demand Info, aligned properties and viewport-fitted preview.
- Implemented Construction/Context tabs and centered Fit/zoom; next is workflow acceptance and default-entry/legacy-gallery retirement.

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
- Add reset, preview zoom, tile/repeated-field views, and selected-pattern export. Retire legacy galleries once the updated pattern/construction workflow is covered; no static/logo gallery port is planned.
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
[Workspace slice 3](WORKSPACE_INSPECTION.md) is implemented: Construction/Context content and centered Fit/zoom. Motif/Tile/Pattern views and view-specific exports are implemented. Continue visual/editor review using the consolidated review page. The workspace direction is user-endorsed. Construction content is transferred and inspection/export checks pass. Review the workflow and editor imports, then make it the primary entry before retiring the old galleries. Keep the product centered on grouped patterns and efficient contextual editing.

Geometry priority: preserve ideal motifs AND authentic tessellation spacing/connections. Native repeat exports and Shift X/Y are implemented. Exact square export remains unresolved for incompatible lattices.

Restored [native tessellations and phase controls](TESSELLATION.md) after rejecting square motif packing. Construction/Context content and centered Fit/zoom are implemented; next review the workflow before entry migration.

## Inspection slice implemented - 2026-10-28

Construction/Context tabs and centered Fit/zoom are implemented; see [inspection behavior](WORKSPACE_INSPECTION.md). Next: review the selected-pattern workflow and external-editor imports, then make the workspace the primary entry and retire the old galleries. Panning, lattice guides and new derivations remain proposals. Native tessellations and unresolved square-export constraints are unchanged.
