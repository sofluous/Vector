(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory(require("./catalog.js"), require("./capabilities.js"), require("./validation.js"));
  } else root.PatternSession = factory(root.PatternCatalog, root.PatternCapabilities, root.PatternValidation);
})(typeof globalThis !== "undefined" ? globalThis : this, function (catalog, capabilities, validation) {
  "use strict";

  const defaults = Object.freeze({
    frame: 480, reps: 12, stroke: 1.6, shiftX: 0, shiftY: 0,
    line: "#2a5db1", accent: "#6f8dcb", bg: "#ffffff", variant: "default"
  });

  function create(selectedId = catalog.patterns[0].id) {
    capabilities.get(selectedId);
    return Object.freeze({
      selectedId, tab: "preview", mode: "field", zoom: 1,
      artwork: Object.freeze(Object.fromEntries(catalog.patterns.map(pattern =>
        [pattern.id, Object.freeze({ ...defaults })])))
    });
  }

  function select(session, id) {
    capabilities.get(id);
    return Object.freeze({ ...session, selectedId: id });
  }

  // Commit only after the complete candidate validates; failures leave the caller's session intact.
  function edit(session, patch) {
    if (!patch || typeof patch !== "object" || Array.isArray(patch)) throw new TypeError("Expected an artwork patch.");
    const id = session.selectedId;
    const next = { ...session.artwork[id], ...patch };
    const supported = capabilities.get(id, next.variant).controls;
    for (const key of Object.keys(patch)) {
      if (key !== "variant" && !supported.includes(key)) throw new RangeError(`Unsupported control: ${key}.`);
    }
    validation.validate(next);
    return Object.freeze({ ...session, artwork: Object.freeze({
      ...session.artwork, [id]: Object.freeze(next)
    }) });
  }

  function reset(session) {
    capabilities.get(session.selectedId);
    return Object.freeze({ ...session, artwork: Object.freeze({
      ...session.artwork, [session.selectedId]: Object.freeze({ ...defaults })
    }) });
  }

  function view(session, patch) {
    if (!patch || typeof patch !== "object" || Array.isArray(patch)) throw new TypeError("Expected a view patch.");
    for (const key of Object.keys(patch)) {
      if (!["tab", "mode", "zoom"].includes(key)) throw new RangeError("Unknown view setting.");
    }
    const next = { ...session, ...patch };
    if (!["preview", "construction", "context"].includes(next.tab)) throw new RangeError("Unknown tab.");
    if (!["field", "tile", "motif", "repeat"].includes(next.mode)) throw new RangeError("Unknown preview mode.");
    if (!Number.isFinite(next.zoom) || next.zoom < 0.25 || next.zoom > 4) throw new RangeError("Zoom must be between 0.25 and 4.");
    return Object.freeze(next);
  }

  return Object.freeze({ defaults, create, select, edit, reset, view });
});
