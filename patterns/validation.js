(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.PatternValidation = factory();
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";
  function validate(state) {
    for (const [key, min, max] of [["frame", 240, 2000], ["reps", 1, 36], ["stroke", 0.4, 8]]) {
      if (!Number.isFinite(state[key]) || state[key] < min || state[key] > max) throw new RangeError(`Invalid ${key}: expected ${min}–${max}.`);
    }
    if (!Number.isInteger(state.reps)) throw new RangeError("Repeat count must be an integer.");
    for (const key of ["shiftX", "shiftY"]) {
      if (state[key] !== undefined && (!Number.isFinite(state[key]) || state[key] < -100 || state[key] > 100)) throw new RangeError(`Invalid ${key}: expected -100 to 100 percent.`);
    }
    for (const key of ["line", "accent", "bg"]) {
      if (!/^#[0-9a-f]{6}$/i.test(state[key])) throw new TypeError(`Invalid ${key}: expected a six-digit hex color.`);
    }
    return state;
  }
  return Object.freeze({ validate });
});
