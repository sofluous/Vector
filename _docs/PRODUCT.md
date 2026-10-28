# Product

## Goal and status
Become a curated repository of patterns and textures from around the world: understand their context and mathematical construction, edit their properties, and export precise, editable SVGs. This direction comes from [the scratchpad](data/scratchpad.md). The workspace/data contracts below remain proposed; the reference audit and first Yagasuri correction have started implementation.

## Current implementation
- Dependency-free browser page in `index.html` with inline catalog, generators, state, and rendering.
- Nine Japanese pattern generators: Asanoha, Yagasuri, Seigaiha, Ichimatsu, Shippo, Kikko, Karakusa, Uroko, and Mameshibori.
- Global controls for repetition, stroke width, line/accent/background colors, and square frame size; copy/download SVG actions.
- Formula panels for Asanoha, Shippo, and Seigaiha; separate static vector and project logo galleries.
- Reference images and saved research links in `_references/Japanese/`. Their presence does not establish attribution, accuracy, or reuse permission.
- A [nine-pattern reference audit](REFERENCE_AUDIT.md) and [Yagasuri construction pilot](YAGASURI_CONSTRUCTION.md), with a corrected paired-vane/staggered-repeat generator and dependency-free Node regression tests. Other generators remain unchanged.

Pattern definitions currently contain `id`, `name`, `desc`, and `tile(unit, state)`, returning width, height, and SVG markup. Export repeats this tile inside a frame. Static vectors separately use `id`, `name`, `desc`, `viewBox`, and `markup`.

## Proposed workflow and architecture
Browse a searchable gallery, select one pattern, edit it in a central preview with a contextual property inspector, inspect Construction and Context tabs, then export. Construction should explain coordinates, symbols, equations, repeat vectors, and an illustrated derivation. Context should contain sourced historical/cultural details and explicit uncertainty.

Use small browser modules separating catalog content, pure geometry, validated editing state, and SVG serialization. A framework, backend, or account system is not currently justified. Preserve access to existing static vectors and logo starters while deciding their long-term placement.

The shell owns navigation and spacing; a toolbar owns preview/export commands; the inspector owns selected-pattern controls. On narrow screens, use a collapsible gallery and inspector drawer. Follow the [Design System](../../_DesignSystem/design.md) and [layout patterns](../../_DesignSystem/wiki/PATTERNS.md); artwork colors remain separate from semantic UI tokens. Provide keyboard-accessible tabs and explicit focus, selected, error, and disabled states.

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
- Match a specific reference variant before expanding its editing range. A reconstruction does not represent every historical use of a motif.
- Export self-contained SVG with explicit colors, valid unique IDs, no UI CSS dependency, scripts, external assets, or raster substitutes.
- Validate numeric bounds and geometry complexity; unsupported parameters must not break the workspace.
- First collection: recommend the existing nine patterns before adding worldwide coverage. Defer raster texture synthesis and freeform path editing.
- Audience: recommend a practical design tool with inspectable construction/context; confirm whether research or production takes priority.
- Legacy galleries: recommend a separate Legacy collection; do not remove them without review.
- Persistence: recommend session editing/reset first, versioned saved presets later.
- Export: retain SVG pattern documents first; investigate tile-only/flattened output against intended design tools before promising compatibility.
