(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory(require("./catalog.js"));
  else root.PatternLibrary = factory(root.PatternCatalog);
})(typeof globalThis !== "undefined" ? globalThis : this, function (catalog) {
  "use strict";
  // Browsing categories describe construction, not historical attribution.
  const groups = Object.freeze([
    { id: "grids", name: "Grids and scales", patterns: ["asanoha", "ichimatsu", "kikko", "uroko", "mameshibori"] },
    { id: "curves", name: "Waves and lenses", patterns: ["seigaiha", "shippo"] },
    { id: "botanical", name: "Branching vines", patterns: ["karakusa"] },
    { id: "directional", name: "Directional repeats", patterns: ["yagasuri"] }
  ].map(group => Object.freeze({ ...group, patterns: Object.freeze(group.patterns) })));

  function browse(query = "") {
    const term = String(query).trim().toLowerCase();
    return groups.map(group => ({ ...group, patterns: group.patterns
      .map(id => catalog.patterns.find(pattern => pattern.id === id))
      .filter(pattern => `${pattern.name} ${pattern.desc} ${group.name} Japanese`.toLowerCase().includes(term))
    })).filter(group => group.patterns.length);
  }

  return Object.freeze({ collection: "Japanese patterns", groups, browse });
});
