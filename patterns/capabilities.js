(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory(require("./catalog.js"));
  else root.PatternCapabilities = factory(root.PatternCatalog);
})(typeof globalThis !== "undefined" ? globalThis : this, function (catalog) {
  "use strict";

  const strokePatterns = ["asanoha", "seigaiha", "kikko", "karakusa"];
  const secondaryPatterns = ["ichimatsu", "kikko", "uroko", "mameshibori"];
  const referencePatterns = ["ichimatsu", "mameshibori"];
  const strokeLimits = Object.freeze({
    seigaiha: "45% of ring spacing",
    karakusa: "1.8% of motif width"
  });
  const entries = new Map(catalog.patterns.map(pattern => [pattern.id, Object.freeze({
    id: pattern.id,
    stroke: strokePatterns.includes(pattern.id),
    strokeLimit: strokeLimits[pattern.id] || null,
    secondary: secondaryPatterns.includes(pattern.id),
    variants: Object.freeze(referencePatterns.includes(pattern.id) ? ["default", "reference"] : ["default"])
  })]));

  function get(id, variant = "default") {
    const entry = entries.get(id);
    if (!entry) throw new RangeError("Unknown pattern ID.");
    if (!entry.variants.includes(variant)) throw new RangeError("Unsupported pattern variant.");
    return Object.freeze({
      ...entry,
      secondary: entry.secondary && variant === "default",
      controls: Object.freeze(["frame", "reps", "shiftX", "shiftY", "line", "bg",
        ...(entry.stroke ? ["stroke"] : []),
        ...(entry.secondary && variant === "default" ? ["accent"] : [])])
    });
  }

  return Object.freeze({ get });
});
