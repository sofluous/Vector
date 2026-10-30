> Current entry (2026-10-29): open `index.html`; the separate `workspace.html` entry has been removed. Legacy galleries are retired. Earlier opt-in/entry references below describe implementation history. External-editor acceptance remains pending.

# Workspace inspection

Implemented 2026-10-28. Open `index.html`. This completes the Construction/Context and centered Fit/zoom portion of slice 3; Motif/Tile/Pattern and view-specific exports were already implemented.

Preview, Construction and Context use a compact tab bar. Arrow Left/Right wrap between tabs; Home/End select the first/last tab. Active tabs use roving tabindex, aria-selected and linked tabpanels. Selection, artwork, invalid drafts, preview mode and zoom survive tab changes. Selection updates both content panels. Detailed notes scroll inside the panel; the page remains fitted to the viewport. Preview export/view/zoom controls are hidden on content tabs.

Construction transfers the four existing formula explanations (Asanoha, Shippo, Seigaiha and Karakusa) without changing their claims. A two-by-two native generator field provides the diagram using current validated artwork settings. Unique SVG definition IDs keep diagrams independent of the hidden preview. The other five entries explicitly state that detailed derivations are pending. Diagrams demonstrate implementation, not an independent proof or historical authentication.

Context provides the current catalog description, review status and local reference link. Creator, original publication, license and historical attribution remain unverified. No new historical claims or external research were added. `patterns/content.js` is the immutable content lookup; unknown IDs fail explicitly. It has no runtime dependency on the old lab page. Tests check that the transferred formula text matches the existing explanations, allowing Windows line endings.

Fit resets zoom to 100%; minus/plus step through 25%, 50%, 100%, 200% and 400%. Percentages are relative to the fitted preview, not physical SVG pixel size. Zoom changes only the preview SVG viewBox, centered on the artwork. It does not change the saved SVG, stroke, density, lattice or dimensions. There is no pan control yet. Oversized inspection crops at the viewport; it does not add page scrolling. Reset pattern retains the session's view settings.

All generator/export fixtures remain unchanged. `currentSVG` is serialized before preview-only framing and supplies Copy/Export. Invalid drafts still block export after tab or zoom changes. Inspection performs one additional bounded two-by-two generator render when content refreshes; no dependency, network request, cache or worker is introduced.

The shell, tab states and controls consume Design System tokens. Construction diagrams use artwork colors. The additional compact tab bar separates inspection navigation from output view/export actions. Legacy entry retirement remains a later slice after review; external SVG-editor interoperability remains unverified.

Validation commands from the workspace parent:

```powershell
node --test _Vectors/tests/*.test.cjs
node --check _Vectors/workspace.js
node _Vectors/tests/browser-workspace.cjs --out _docs/data/workspace-inspection-2026-10-28
```
