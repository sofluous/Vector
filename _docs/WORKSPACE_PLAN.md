> Current entry (2026-10-29): open `index.html`; the separate `workspace.html` entry has been removed. Legacy galleries are retired. Earlier opt-in/entry references below describe implementation history. External-editor acceptance remains pending.

# Selected-pattern workspace plan

Status: staged implementation contract, 2026-10-28. Current geometry policy is [preserved native tessellations](TESSELLATION.md); older dated decisions below are historical. Generator modules, reference variants, and [slice 1 session/capability modules](WORKSPACE_SESSION.md) are implemented. [Slice 2 workspace UI](WORKSPACE_UI.md) is implemented as an opt-in separate page; the lab remains the default entry.

## Acceptance before implementation

Use the [nine-pattern review page](data/workspace-review-2026-10-28/review.html) to compare current standalone exports with the supplied references. It links eleven frozen SVGs: nine defaults and two optional reference variants. Different image crops/scales prevent pixel-aligned comparisons. No new visual approval is inferred from generating this page.

| Gate | Evidence now | Remaining action |
| --- | --- | --- |
| Default stability | Existing frozen-baseline tests | Keep passing throughout UI work |
| Repeat construction | Generator-specific geometry/raster checks | Inspect candidate fields at intended output scale |
| Visual choice | Before/after figures; consolidated review page | Record accepted variants or concrete residual differences |
| SVG interoperability | Standalone exports and browser XML checks | Open exports in a target vector editor; inspect repeats, fills, stroke, and dimensions; save/reopen |
| Reference context | Local reference files | Establish provenance before adding historical claims |

Asanoha, Kikko, and Uroko remain user-favored baselines. Yagasuri, Seigaiha, Shippo, Karakusa and the two reference variants remain review candidates. Editor import is unverified; installed editor availability and a preferred target are not established. A browser rendering is not a substitute for that check.

## Proposed first workspace

Use a gallery, central preview, and contextual inspector. User direction now retires the static-vector and project-logo galleries from the target product. Keep old files temporarily to transfer needed construction notes; the workspace has no legacy link. Group patterns by collection/construction and prioritize efficient property controls.

The gallery contains compact selectable pattern buttons with visible names and selected states. Selecting a pattern updates the preview, inspector and details together. Keep focus on the selected gallery button; do not move it to the preview on every selection. The toolbar holds fit/zoom, preview mode, Copy SVG, and one primary Download SVG action. The inspector contains supported parameters and a clearly named Reset pattern action.

Preview, Construction, and Context are tabs in the main region. Preview shows the generated field. Construction reuses the existing four formula explanations and actual generator diagrams; other entries explicitly say that a derivation is pending. Context presents the reference/review status and verified sources only. Unknown attribution remains visible. Selection must survive tab changes.

Follow [design.md](../../_DesignSystem/design.md), [layout/inspector patterns](../../_DesignSystem/wiki/PATTERNS.md), [component contracts](../../_DesignSystem/wiki/COMPONENT_SPEC.md), and the [validation checklist](../../_DesignSystem/wiki/VALIDATION_CHECKLIST.md). Consume the existing local Design System assets and semantic tokens for chrome; keep artwork palettes in model state. Audit the current app aliases before reusing them.

On narrow screens, use one main column with independently collapsible gallery and inspector sections first. This is a proposed simpler initial alternative to modal drawers: it preserves native keyboard flow without focus traps. Verify at 360, 768 and 1440 CSS pixels before deciding whether drawers improve the workflow. Record this choice in PRODUCT when implemented.

## State and rendering contract

Use an explicit session model: selected pattern ID, active tab, preview mode, zoom, and a map from pattern ID to validated artwork parameters plus variant. Each pattern starts with the current defaults. Editing one pattern must not change another. Reset restores only the selected pattern's original variation and default artwork values; it leaves theme, tab, zoom, and other patterns intact. Reload resets the session. Persistence remains deferred.

The current lab retains global controls. Do not reuse its shared mutable state as the workspace model. Both views call the existing catalog and serializer; do not duplicate geometry. Validate complete proposed changes before replacing a pattern's state. Invalid input keeps the last valid preview and export, shows an associated inline error, and blocks exporting stale state until resolved.

Frame now represents output width (240-2000); workspace density is now a whole cell count (1-36) on both axes, with output height following the natural cell ratio. Stroke stays 0.4-8. Preview zoom is presentation only and must never change SVG bytes. Render the selected preview on edit; gallery thumbnails use fixed defaults and do not rebuild on every inspector input.

## Contextual controls

All patterns support frame, repetitions, primary color and background. The following controls are additional; hide unsupported controls and explain effective stroke caps where applicable.

| Pattern | Stroke | Secondary | Variant |
| --- | --- | --- | --- |
| Asanoha | Yes | No | Original |
| Yagasuri | No | No | Original |
| Seigaiha | Yes, capped | No | Original |
| Ichimatsu | No | Original only | Original / Reference |
| Shippo | No | No | Original |
| Kikko | Yes | Yes | Original |
| Karakusa | Yes, capped | No | Original |
| Uroko | No | Yes | Original |
| Mameshibori | No | Original only | Original / Reference |

Preview modes are Field, Tile, and 3-by-3 Repeat. Tile/repeat inspection must use a viewBox and SVG clipping, without modifying generator output or putting guides into exports. Exports remain the complete repeated field at its natural aspect ratio regardless of inspection mode; label Download SVG accordingly. Transparent and tile-only export are later work.

## Implementation slices and checks

1. **Session model and capabilities (implemented):** pure state operations and explicit pattern capability metadata. Tests cover independent edits, selection, reset scope, invalid IDs/variants, validation failures, no cross-pattern mutation, and frozen export snapshots. See [API and validation](WORKSPACE_SESSION.md).
2. **Opt-in workspace (implemented):** separate page with gallery selection, selected field preview and contextual inspector. The former lab/legacy link has been removed following user direction; old files remain temporarily for construction-content transfer. Browser checks cover focus/state, labels/errors, per-pattern state, reset, export content and invalid draft recovery. See [behavior and validation](WORKSPACE_UI.md).
3. **Inspection and content (implemented):** three tabs, centered Fit/zoom, Motif/Tile/Pattern and existing construction content. Test tab arrow/Home/End behavior, ARIA relationships, focus visibility, Escape only where appropriate, zoom/export invariance, repeat bounds and guides excluded from export.
4. **Acceptance and default entry:** capture wide/narrow views in Steel Night, Paper Mint and Neon Grid; test keyboard-only flows and native error feedback. Compare exports with pre-workspace defaults and review candidate editor imports. Make the workspace the default entry only after these checks and recorded visual review.

Each slice updates the single changelog and QA evidence. No framework, backend, saved preset schema, new geometry, search system, or worker is needed for this first workspace. Measure selected-preview responsiveness before considering caching.

## Next concrete task

Slice 3 is implemented. Next review the selected-pattern workflow and editor imports before switching the primary entry and retiring legacy galleries. Preserve native tessellations, natural-aspect exports and invalid-draft blocking. See [inspection contract](WORKSPACE_INSPECTION.md).

## User direction and implemented refinements - 2026-10-28

The workspace direction is accepted for further development. Legacy galleries are unnecessary once the workspace is updated. Implemented four construction groups for the current Japanese collection, search, compact thumbnail rows, grouped property sections, paired density/stroke controls, editable hex/picker pairs and a denser responsive shell. Details: [workspace UI](WORKSPACE_UI.md). Geometry, output defaults and independent session behavior are unchanged.

Next: selected-pattern Construction/Context content and preview inspection modes, then retire the temporary old entry/galleries when that workflow is covered. Further inspector ideas: per-property reset, explicit effective stroke readouts, and pattern-specific geometric parameters after reference acceptance. These ideas are proposals, not working features.

## Density decision - 2026-10-28
User chose natural cell aspect ratio. Density 1 shows one complete repeat cell; density N fills N-by-N cells. Output width remains selected; height is derived. See [implemented contract](DENSITY_AND_TILING.md).

## Motif versus tile clarification - 2026-10-28
Implemented [Motif/Tile/Pattern views](MOTIF_TILE_PATTERN.md). Complete motifs have padding and do not need to tile; Tile shows true cropped repeat construction, with square composites where possible. Pattern density counts those tiles. Rectangular lattice exceptions are explicit. Export follows the view. Remaining slice 3 work is Construction/Context content and fit/zoom; retain review gates before default-entry migration.

## Compact workspace refinement - 2026-10-28
Implemented a combined control bar, shortened visible labels, on-demand Info, fitted preview stage and fixed visible gallery density. Side panels collapse by default at narrow widths and scroll only within bounded content. See [contract and validation](COMPACT_WORKSPACE.md). Exports and motif/tile geometry remain unchanged.

## Final geometry priority - 2026-10-28
Motif shape/proportions are authoritative. Tile uses the smallest validated rectangular repeat; square-only Yagasuri/Seigaiha composites have been removed. No spacing/arrangement changes or stretching are authorized just to force a square. Gallery windows can remain square crops. Analytic motif invariants and serialized precision are tested separately from seamless repetition; global minimality across oblique bases remains outside the current rectangular contract.

## Rejected square arrangements - 2026-10-28 (historical)
User explicitly permits placement/spacing changes while preserving internal motif proportions. Implemented [all-square Tile/Pattern layouts](SQUARE_ARRANGEMENTS.md), deterministic compact defaults, Shift X/Y phase controls and Center. This supersedes the earlier prohibition on changing native lattice arrangement. Further spacing/row-stagger or per-motif editing is proposed only.

## Tessellation correction - 2026-10-28

Square motif packing was rejected because it broke lattice spacing and connectivity. Native repeat exports are restored; phase controls remain. See [current contract](TESSELLATION.md).

## Slice 3 inspection implemented - 2026-10-28

[Inspection tabs and centered Fit/zoom](WORKSPACE_INSPECTION.md) are implemented. Motif/Tile/Pattern were already present. Four formula explanations are transferred to the selected-pattern flow, with actual generator diagrams; Context exposes review status and unknown provenance. Next slice is acceptance/default entry retirement; editor imports remain pending.
