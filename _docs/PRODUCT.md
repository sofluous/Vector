# Product

## Goal and status
Become a curated repository of patterns and textures from around the world: understand their context and mathematical construction, edit their properties, and export precise, editable SVGs. This direction comes from [the scratchpad](data/scratchpad.md). The selected-pattern workspace and its editing/export contracts are implemented; the reference audit and four generator candidates, including a reference-fitted Karakusa reconstruction, await final visual/editor acceptance.

## Current implementation
- [Workspace session and capability modules](WORKSPACE_SESSION.md) provide independent immutable artwork state, selection, reset, view settings, and supported-control metadata. They power the single `index.html` Vectors landing page.
- Dependency-free browser page in `index.html` with DOM/session state; pure catalog/generators, strict export validation, and SVG serialization now live in `patterns/`. See [generator contracts](GENERATOR_CONTRACTS.md).
- Nine Japanese pattern generators: Asanoha, Yagasuri, Seigaiha, Ichimatsu, Shippo, Kikko, Karakusa, Uroko, and Mameshibori.
- Workspace [density and tiling](DENSITY_AND_TILING.md) supports 1-36 genuine native repeat cells per axis; output height follows the native cell aspect ratio. Density 1 in Pattern matches Tile view. [Motif view](MOTIF_TILE_PATTERN.md) separately shows a complete uncropped shape; workspace tiles preserve the [original tessellations](TESSELLATION.md), including native lattice spacing and connections.
- [Compact workspace chrome](COMPACT_WORKSPACE.md) provides a combined view/export toolbar, on-demand Info, fitted stage and aligned property rows without unnecessary page/preview scrolling. Gallery previews use a fixed readable density of two tiles.
- Arrangement controls Shift X/Y and Center provide wrapped repeat-phase adjustment independently per pattern; Motif ignores shifts.
- Workspace library groups the Japanese collection by construction with search and compact thumbnails. The inspector groups layout, palette, variation and linework with paired sliders/numeric values and color pickers/hex input.
- Optional per-card reference variants for Ichimatsu and Mameshibori preserve original defaults.
- Selected-pattern controls for density, output width, colors, supported stroke, and shifts; copy/download SVG actions.
- Construction/Context tabs with four transferred formula explanations, native generator diagrams and selected reference/review status. The static-vector and logo galleries are retired.
- Reference images and saved research links in `_references/Japanese/`. Their presence does not establish attribution, accuracy, or reuse permission.
- A [nine-pattern reference audit](REFERENCE_AUDIT.md) and [Yagasuri construction pilot](YAGASURI_CONSTRUCTION.md), with a corrected paired-vane/staggered-repeat generator and dependency-free Node regression tests.
- A [Seigaiha construction correction](SEIGAIHA_CONSTRUCTION.md): four-ring fans with foreground occlusion, a rectangular two-row repeat, fixed ring count, and a documented stroke cap. Its formula panel now matches the generator.
- A [Shippo construction correction](SHIPPO_CONSTRUCTION.md): four direct diagonal equal-circle lenses, small tip gaps, and an unrotated square repeat without clips or guide outlines. Stroke/accent controls are unused and documented.
- A [reference-fitted Karakusa reconstruction](KARAKUSA_CONSTRUCTION.md): sixteen spline paths, shared periodic branch anchors, and eight pointed leaves. Its foreground reference-fit F1 improves from 0.440 to 0.760 at a documented two-pixel tolerance. This is a selected-variant spline model, not a universal historical formula. Effective stroke is capped and accent unused. Five remaining generators retain original audit outputs.

Pattern definitions currently contain `id`, `name`, `desc`, and `tile(unit, state)`, returning width, height, and SVG markup. Export repeats this tile inside a frame. The retired static-vector and logo records are no longer part of the runtime.

## Proposed workflow and architecture
See the [workspace implementation plan](WORKSPACE_PLAN.md) for state semantics, supported controls, staged delivery, and review gates. The [primary workspace](WORKSPACE_UI.md) provides gallery selection, contextual editing, Motif/Tile/Pattern, Construction/Context and centered Fit/zoom. The old lab/gallery UI is retired.

Browse a searchable gallery, select one pattern, edit it in a central preview with a contextual property inspector, inspect Construction and Context tabs, then export. Construction should explain coordinates, symbols, equations, repeat vectors, and an illustrated derivation. Context should contain sourced historical/cultural details and explicit uncertainty.

Use small browser modules separating catalog content, pure geometry, validated editing state, and SVG serialization. A framework, backend, or account system is not currently justified. The user has retired static-vector and logo galleries from the target product; focus new development on the grouped pattern library and inspector.

The shell owns navigation and spacing; a toolbar owns preview/export commands; the inspector owns selected-pattern controls. The opt-in first workspace uses native collapsible gallery/inspector sections on narrow screens, avoiding modal focus handling; a drawer remains an option after review. Follow the [Design System](../../_DesignSystem/design.md) and [layout patterns](../../_DesignSystem/wiki/PATTERNS.md); artwork colors remain separate from semantic UI tokens. Provide keyboard-accessible tabs and explicit focus, selected, error, and disabled states.

## Proposed data contracts
| Record | Contents |
| --- | --- |
| Catalog entry | Stable ID, name/aliases, collection, motif tags, sourced cultural/geographic attribution, reference IDs, review status |
| Reference | Local path/URL, creator or institution when known, rights status, access date, supported claims, intended variant |
| Construction | Units, coordinate system, equations, symbols, repeat basis, diagram, assumptions, sources, generator version |
| Parameters | Types, defaults, bounds, steps, units, supported controls, cross-field constraints |
| Generator result | Tile bounds, repeat basis, geometry and definitions; deterministic for identical validated inputs |
| Editing state | Selected ID and per-pattern values; preview zoom separate from artwork/export dimensions |
| Future preset | Schema version, pattern ID, generator version, validated parameters; persistence deferred until agreed |

Expose size, color, stroke, fill, tiling, and density only where meaningful. Define density in relation to motif size and frame dimensions rather than offering conflicting controls. Reference presets should remain distinguishable from creative variations.

## Constraints and open decisions
- Preserve each motif's mathematically defined geometry and proportions. Preserve lattice spacing and interlocking connections as well as motif proportions. Square packing was rejected; native repeats and per-pattern phase shifts are current.
- Match a specific reference variant before expanding its editing range. A reconstruction does not represent every historical use of a motif.
- Export self-contained SVG with explicit colors, valid unique IDs, no UI CSS dependency, scripts, external assets, or raster substitutes.
- Validate numeric bounds and geometry complexity; unsupported parameters must not break the workspace.
- First collection: recommend the existing nine patterns before adding worldwide coverage. Defer raster texture synthesis and freeform path editing.
- Audience: recommend a practical design tool with inspectable construction/context; confirm whether research or production takes priority.
- Legacy galleries: user confirmed these are unnecessary in the updated product. Remove them from the target navigation; keep old files temporarily while construction notes and needed pattern workflow move to the workspace. Do not expand or port static/logo galleries.
- Persistence: recommend session editing/reset first, versioned saved presets later.
- Export: retain SVG pattern documents first; investigate tile-only/flattened output against intended design tools before promising compatibility.

## Selected-pattern inspection

[Construction/Context tabs and centered Fit/zoom](WORKSPACE_INSPECTION.md) are implemented in the opt-in workspace. Four existing formula explanations are transferred; missing derivations and provenance remain explicit. Preview framing never changes SVG exports.

## Primary entry and delivery - 2026-10-29

Open `index.html` directly or serve the project folder. The separate workspace entry has been removed; there is no secondary app or redirect. Runtime dependencies are `workspace.js`, `css/workspace.css`, `patterns/*.js`, the bundled `design-system/theme.css` and theme scripts, plus selected local reference JPGs for Context links. The app needs no framework, build, server or network connection for its main workflow.

There is no configured packaging/deployment pipeline. For a runtime-only delivery, include `index.html`, workspace code, pattern modules, bundled Design System runtime files and nine local reference JPGs; exclude `_docs`, `tests`, `.git`, and unused legacy CSS from the delivery copy. Publishing the entire repository would expose documentation/evidence too; `.gitignore` is not a deployment filter. No deployment was performed. Reference redistribution rights remain unverified.

External-editor imports remain unverified. Making the workspace the default is a navigation change, not acceptance of historical authenticity or SVG-editor interoperability.
