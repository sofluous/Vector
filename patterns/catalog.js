(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory(require("./karakusa.js"));
  else root.PatternCatalog = factory(root.KarakusaPattern);
})(typeof globalThis !== "undefined" ? globalThis : this, function (KarakusaPattern) {
  "use strict";
    const SQRT3 = Math.sqrt(3);

    function n(v) {
      return Number(v.toFixed(4));
    }

    function arcPath(cx, cy, r, up) {
      const x0 = n(cx - r);
      const x1 = n(cx + r);
      const sweep = up ? 1 : 0;
      return `M ${x0} ${n(cy)} A ${n(r)} ${n(r)} 0 0 ${sweep} ${x1} ${n(cy)}`;
    }

    function polygonPoints(cx, cy, r, sides, rotation) {
      const pts = [];
      for (let i = 0; i < sides; i += 1) {
        const a = rotation + (Math.PI * 2 * i / sides);
        pts.push(`${n(cx + r * Math.cos(a))},${n(cy + r * Math.sin(a))}`);
      }
      return pts.join(" ");
    }

    function hex(cx, cy, r) {
      return `<polygon points="${polygonPoints(cx, cy, r, 6, Math.PI / 6)}"/>`;
    }

          function oneHex(cx, cy, rr) {
            const t = [cx, cy - rr];
            const ur = [cx + (SQRT3 / 2) * rr, cy - rr / 2];
            const lr = [cx + (SQRT3 / 2) * rr, cy + rr / 2];
            const b = [cx, cy + rr];
            const ll = [cx - (SQRT3 / 2) * rr, cy + rr / 2];
            const ul = [cx - (SQRT3 / 2) * rr, cy - rr / 2];
            return `
              <path d="M ${n(t[0])} ${n(t[1])} L ${n(ur[0])} ${n(ur[1])} L ${n(lr[0])} ${n(lr[1])}
                       M ${n(t[0])} ${n(t[1])} L ${n(ul[0])} ${n(ul[1])} L ${n(ll[0])} ${n(ll[1])}
                       M ${n(t[0])} ${n(t[1])} L ${n(ll[0])} ${n(ll[1])}
                       M ${n(t[0])} ${n(t[1])} L ${n(lr[0])} ${n(lr[1])}
                       M ${n(t[0])} ${n(t[1])} L ${n(cx)} ${n(cy)}
                       M ${n(lr[0])} ${n(lr[1])} L ${n(b[0])} ${n(b[1])} L ${n(ll[0])} ${n(ll[1])}
                       M ${n(lr[0])} ${n(lr[1])} L ${n(ll[0])} ${n(ll[1])}
                       M ${n(lr[0])} ${n(lr[1])} L ${n(cx)} ${n(cy)}
                       M ${n(ll[0])} ${n(ll[1])} L ${n(cx)} ${n(cy)}"/>
            `;
          }

    const patternDefs = [
      {
        id: "asanoha",
        name: "Asanoha",
        desc: "Hemp-leaf star lattice on an exact 60-degree triangular grid.",
        tile(unit, s) {
          const r = unit * 0.58;
          const dx = SQRT3 * r;
          const dy = 1.5 * r;
          const w = 2 * dx;
          const h = 2 * dy;
          let geom = "";


          for (let row = -1; row <= 4; row += 1) {
            const y = row * dy;
            const off = (row % 2 === 0) ? 0 : dx / 2;
            for (let col = -1; col <= 4; col += 1) {
              const x = col * dx + off;
              geom += oneHex(x, y, r);
            }
          }

          return {
            w: n(w),
            h: n(h),
            markup: `<g stroke="${s.line}" stroke-width="${s.stroke}" fill="none">${geom}</g>`
          };
        }
      },
      {
        id: "yagasuri",
        name: "Yagasuri",
        desc: "Paired feather vanes with opposing columns staggered by half a repeat.",
        tile(unit, s) {
          if (!Number.isFinite(unit) || unit <= 0) {
            throw new RangeError("Yagasuri unit must be a positive finite number.");
          }
          const pitch = unit / 2;
          const inset = unit * 0.02;
          const shaftGap = unit * 0.04;
          const slope = unit * 0.25;
          const body = unit * 0.94;
          let motifs = "";

          // Adjacent columns reverse direction and shift by half the vertical period.
          for (let row = -1; row <= 0; row += 1) {
            for (let col = 0; col < 2; col += 1) {
              const y = row * 2 * unit + (col === 0 ? unit : 0);
              const center = (col + 0.5) * pitch;
              const outerLeft = col * pitch + inset;
              const innerLeft = center - shaftGap / 2;
              const innerRight = center + shaftGap / 2;
              const outerRight = (col + 1) * pitch - inset;
              const outerY = y + (col === 0 ? 0 : slope);
              const innerY = y + (col === 0 ? slope : 0);
              motifs += `<polygon points="${n(outerLeft)},${n(outerY)} ${n(innerLeft)},${n(innerY)} ${n(innerLeft)},${n(innerY + body)} ${n(outerLeft)},${n(outerY + body)}"/>
                <polygon points="${n(innerRight)},${n(innerY)} ${n(outerRight)},${n(outerY)} ${n(outerRight)},${n(outerY + body)} ${n(innerRight)},${n(innerY + body)}"/>`;
            }
          }
          return {
            w: n(unit),
            h: n(2 * unit),
            markup: `<g fill="${s.line}" stroke="none">${motifs}</g>`
          };
        }
      },
      {
        id: "seigaiha",
        name: "Seigaiha",
        desc: "Four-ring wave fans with staggered, overlapping rows. Stroke is capped at 45% of ring spacing.",
        tile(unit, s) {
          if (!Number.isFinite(unit) || unit <= 0 || !Number.isFinite(s.stroke) || s.stroke <= 0) {
            throw new RangeError("Seigaiha unit and stroke must be positive finite numbers.");
          }
          const radius = unit / 2;
          const ringStep = radius * 0.24;
          const stroke = Math.min(s.stroke, ringStep * 0.45);
          let fans = "";

          // Paint back to front: each filled fan hides the lower arcs behind it.
          // The last row starts below the tile but its stroke reaches the bottom edge.
          for (let row = 0; row <= 4; row += 1) {
            const cy = row * radius / 2;
            const offset = row % 2 ? radius : 0;
            for (let col = -1; col <= 1; col += 1) {
              const cx = col * unit + offset;
              const silhouette = `${arcPath(cx, cy, radius, true)} Z`;
              let arcs = "";
              for (let ring = 0; ring < 4; ring += 1) {
                arcs += `${arcPath(cx, cy, radius - ring * ringStep, true)} `;
              }
              fans += `<path d="${silhouette}" fill="${s.bg}" stroke="none"/>
                <path d="${arcs.trim()}" fill="none" stroke="${s.line}" stroke-width="${n(stroke)}"/>`;
            }
          }
          return {
            w: n(unit),
            h: n(radius),
            markup: fans
          };
        }
      },
      {
        id: "ichimatsu",
        name: "Ichimatsu",
        desc: "Classic checkerboard from a two-cell parity unit.",
        tile(unit, s) {
          const u = unit;
          return {
            w: n(2 * u),
            h: n(2 * u),
            markup: `
              <rect x="0" y="0" width="${n(u)}" height="${n(u)}" fill="${s.line}"/>
              <rect x="${n(u)}" y="${n(u)}" width="${n(u)}" height="${n(u)}" fill="${s.line}"/>
              <rect x="${n(u)}" y="0" width="${n(u)}" height="${n(u)}" fill="${s.accent}"/>
              <rect x="0" y="${n(u)}" width="${n(u)}" height="${n(u)}" fill="${s.accent}"/>
            `
          };
        }
      },
      {
        id: "shippo",
        name: "Shippo",
        desc: "Four diagonal equal-circle lens petals with open tip gaps. Filled motif; stroke and accent are unused.",
        tile(unit, s) {
          if (!Number.isFinite(unit) || unit <= 0) {
            throw new RangeError("Shippo unit must be a positive finite number.");
          }
          const radius = unit * 0.48;
          const center = unit / 2;
          // Intersections of circles centered on adjacent edge midpoints.
          // Work in unit ratios to avoid squaring large coordinates.
          const inset = unit * (0.25 - Math.sqrt(0.48 ** 2 - 0.125) / Math.SQRT2);
          let petals = "";

          for (const [cornerX, cornerY] of [[0, 0], [unit, 0], [unit, unit], [0, unit]]) {
            const sx = cornerX === 0 ? 1 : -1;
            const sy = cornerY === 0 ? 1 : -1;
            const x1 = n(cornerX + sx * inset);
            const y1 = n(cornerY + sy * inset);
            const x2 = n(center - sx * inset);
            const y2 = n(center - sy * inset);
            petals += `<path d="M ${x1} ${y1} A ${n(radius)} ${n(radius)} 0 0 1 ${x2} ${y2} A ${n(radius)} ${n(radius)} 0 0 1 ${x1} ${y1} Z"/>`;
          }
          return {
            w: n(unit),
            h: n(unit),
            markup: `<g fill="${s.line}" stroke="none">${petals}</g>`
          };
        }
      },
      {
        id: "kikko",
        name: "Kikko",
        desc: "Regular hexagon tortoiseshell with concentric inner hex lines.",
        tile(unit, s) {
          const r = unit * 0.42;
          const dx = SQRT3 * r;
          const dy = 1.5 * r;
          const w = 2 * dx;
          const h = 2 * dy;
          let out = "";
          let inner = "";
          for (let row = -1; row <= 2; row += 1) {
            const y = row * dy;
            const off = (row % 2 ? dx / 2 : 0);
            for (let col = -1; col <= 3; col += 1) {
              const x = col * dx + off;
              out += hex(x, y, r);
              inner += hex(x, y, r * 0.56);
            }
          }
          return {
            w: n(w),
            h: n(h),
            markup: `<g stroke="${s.line}" stroke-width="${s.stroke}" fill="none">${out}</g><g stroke="${s.accent}" stroke-width="${n(s.stroke * 0.8)}" fill="none">${inner}</g>`
          };
        }
      },
      {
        id: "karakusa",
        name: "Karakusa",
        desc: "Reference-fitted branching vines and curls. Stroke capped at 1.8% of motif width; accent unused.",
        tile: KarakusaPattern.tile
      },
      {
        id: "uroko",
        name: "Uroko",
        desc: "Alternating equilateral triangle scales with row offset.",
        tile(unit, s) {
          const a = unit;
          const h = a * SQRT3 / 2;
          let tris = "";
          for (let row = -1; row <= 2; row += 1) {
            const y = row * h;
            const off = (row % 2 ? a / 2 : 0);
            for (let col = -1; col <= 3; col += 1) {
              const x = col * a + off;
              const p1 = `${n(x)},${n(y + h)}`;
              const p2 = `${n(x + a / 2)},${n(y)}`;
              const p3 = `${n(x + a)},${n(y + h)}`;
              tris += `<polygon points="${p1} ${p2} ${p3}" fill="${(col + row) % 2 ? s.accent : s.line}"/>`;
            }
          }
          return { w: n(2 * a), h: n(2 * h), markup: tris };
        }
      },
      {
        id: "mameshibori",
        name: "Mameshibori",
        desc: "Small-dot shibori grid with regular spacing and dot hierarchy.",
        tile(unit, s) {
          const u = unit;
          const w = 2 * u;
          const h = 2 * u;
          const step = u / 4;
          let dots = "";
          for (let r = 0; r <= 8; r += 1) {
            for (let c = 0; c <= 8; c += 1) {
              const x = c * step;
              const y = r * step;
              const major = (r % 4 === 0 && c % 4 === 0);
              dots += `<circle cx="${n(x)}" cy="${n(y)}" r="${n(major ? u * 0.08 : u * 0.055)}" fill="${major ? s.line : s.accent}"/>`;
            }
          }
          return { w: n(w), h: n(h), markup: dots };
        }
      }
    ];


    function referenceTile(pattern, unit, state) {
      if (!Number.isFinite(unit) || unit <= 0) throw new RangeError("Unit must be positive and finite.");
      if (pattern.id === "ichimatsu") return pattern.tile(unit, { ...state, accent: state.bg });
      if (pattern.id !== "mameshibori") throw new RangeError("No reference preset for this pattern.");
      const step = unit / 4;
      let dots = "";
      for (let row = 0; row < 8; row += 1) {
        for (let col = 0; col < 8; col += 1) {
          dots += `<circle cx="${n((col + 0.5) * step)}" cy="${n((row + 0.5) * step)}" r="${n(unit * 0.055)}" fill="${state.line}"/>`;
        }
      }
      return { w: n(2 * unit), h: n(2 * unit), markup: dots };
    }
    // Rectangular repeat periods may be smaller than the padded drawing tile.
    const periods = { asanoha: [0.5, 1], kikko: [0.5, 1], mameshibori: [0.5, 0.5] };
    const patterns = patternDefs.map(pattern => Object.freeze({ ...pattern,
      repeat: Object.freeze({
        default: Object.freeze(periods[pattern.id] || [1, 1]),
        reference: Object.freeze(pattern.id === "mameshibori" ? [0.125, 0.125] : [1, 1])
      })
    }));
    return Object.freeze({ patterns: Object.freeze(patterns), referenceTile, glyphs: Object.freeze({ hex, arcPath }) });
});
