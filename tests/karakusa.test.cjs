const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const helpers = source.slice(source.indexOf('    const SQRT3'), source.indexOf('    const ui ='));
const definitions = source.slice(source.indexOf('    const patternDefs ='), source.indexOf('    const codeProjects ='));
const patterns = vm.runInNewContext(`${helpers}${definitions};patternDefs`);
const karakusa = patterns.find(pattern => pattern.id === 'karakusa');
const state = { line: '#2a5db1', accent: '#6f8dcb', bg: '#ffffff', stroke: 1.6, reps: 12, frame: 480 };

const distance = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);
const subtract = (a, b) => a.map((v, i) => v - b[i]);
function near(a, b, tolerance = 0.0004) {
  assert.ok(distance(a, b) < tolerance, `${a} differs from ${b}`);
}
function aligned(a, b) {
  const length = Math.hypot(...a) * Math.hypot(...b);
  assert.ok(length > 0);
  assert.ok(Math.abs(a[0] * b[1] - a[1] * b[0]) / length < 0.005);
  assert.ok(a[0] * b[0] + a[1] * b[1] > 0, 'tangents must point in the same direction');
}
function at(c, t) {
  if (c.length === 3) return [0, 1].map(i => (1 - t) ** 2 * c[0][i] + 2 * (1 - t) * t * c[1][i] + t * t * c[2][i]);
  return [0, 1].map(i => (1 - t) ** 3 * c[0][i] + 3 * (1 - t) ** 2 * t * c[1][i] + 3 * (1 - t) * t * t * c[2][i] + t ** 3 * c[3][i]);
}
function tangent(c, t) {
  return [0, 1].map(i => 3 * (1 - t) ** 2 * (c[1][i] - c[0][i]) + 6 * (1 - t) * t * (c[2][i] - c[1][i]) + 3 * t * t * (c[3][i] - c[2][i]));
}
function parse(tile) {
  const unique = new Map();
  const copies = [];
  for (const match of tile.markup.matchAll(/<g data-motif="(-?\d+),(-?\d+)" transform="translate\(([-\d.]+) ([-\d.]+)\)">([\s\S]*?)<\/g>/g)) {
    const parts = [];
    for (const p of match[5].matchAll(/<path data-part="([^"]+)"([^>]+)\/>/g)) {
      const id = p[1];
      const d = p[2].match(/d="([^"]+)"/)[1];
      if (!unique.has(id)) {
        const tokens = d.split(/\s+/);
        assert.equal(tokens.shift(), 'M');
        let current = [Number(tokens.shift()), Number(tokens.shift())];
        const curves = [];
        while (tokens.length) {
          const command = tokens.shift();
          if (command === 'Z') break;
          assert.ok(['C', 'Q'].includes(command));
          const curve = [current];
          for (let j = 0; j < (command === 'C' ? 3 : 2); j += 1) curve.push([Number(tokens.shift()), Number(tokens.shift())]);
          assert.ok(curve.flat().every(Number.isFinite));
          curves.push(curve);
          current = curve.at(-1);
        }
        const points = curves.flat();
        const flat = [curves[0][0]];
        for (const c of curves) for (let j = 1; j <= 12; j += 1) flat.push(at(c, j / 12));
        unique.set(id, { id, d, curves, flat, closed: d.endsWith(' Z'), minX: Math.min(...points.map(p => p[0])), maxX: Math.max(...points.map(p => p[0])), minY: Math.min(...points.map(p => p[1])), maxY: Math.max(...points.map(p => p[1])) });
      }
      assert.equal(d, unique.get(id).d, 'translated copies must share identical geometry');
      parts.push(unique.get(id));
    }
    copies.push({ x: Number(match[3]), y: Number(match[4]), parts });
  }
  return { unique, copies, stroke: Number(tile.markup.match(/stroke-width="([^"]+)"/)[1]) };
}

const anchors = [['horizontal', 0, 0.50], ['horizontal', 1, 0.25], ['horizontal', 2, 0.55], ['horizontal', 0, 0.15], ['horizontal', 1, 0.65], ['horizontal', 2, 0.92], ['vertical', 1, 0.65], ['vertical', 1, 0.25]];
const leafAnchors = [['horizontal', 0, 0.74], ['horizontal', 1, 0.13], ['horizontal', 1, 0.80], ['horizontal', 2, 0.30], ['horizontal', 2, 0.75], ['vertical', 0, 0.55], ['vertical', 1, 0.50], ['vertical', 1, 0.85]];

test('backbone joins and periodic endpoints match position and first derivative', () => {
  for (const unit of [10, 40, 100]) {
    const tile = karakusa.tile(unit, state);
    const { unique } = parse(tile);
    assert.equal(unique.size, 18);
    for (const [id, translation] of [['horizontal', [tile.w, 0]], ['vertical', [0, tile.h]]]) {
      const curves = unique.get(id).curves;
      for (let i = 1; i < curves.length; i += 1) {
        near(curves[i - 1][3], curves[i][0]);
        near(subtract(curves[i - 1][3], curves[i - 1][2]), subtract(curves[i][1], curves[i][0]));
      }
      const first = curves[0], last = curves.at(-1);
      near(subtract(last[3], first[0]), translation);
      near(subtract(last[3], last[2]), subtract(first[1], first[0]));
    }
    near(unique.get('vertical').curves[0][0], unique.get('horizontal').curves[0][3]);
  }
});

test('every curl shares a source point and tangent; connector/spiral joins are smooth', () => {
  const { unique } = parse(karakusa.tile(40, state));
  anchors.forEach(([id, segment, t], index) => {
    const stem = unique.get(id).curves[segment];
    const curl = unique.get(`curl-${index}`).curves;
    near(curl[0][0], at(stem, t));
    aligned(subtract(curl[0][1], curl[0][0]), tangent(stem, t));
    for (let j = 1; j < curl.length; j += 1) {
      near(curl[j - 1][3], curl[j][0]);
      aligned(subtract(curl[j - 1][3], curl[j - 1][2]), subtract(curl[j][1], curl[j][0]));
      if (j > 1) near(subtract(curl[j - 1][3], curl[j - 1][2]), subtract(curl[j][1], curl[j][0]));
    }
  });
});

test('piecewise cubic curls approximate the specified inward polar spirals', () => {
  const unit = 40, width = 4 * unit, height = 179 / 278;
  const { unique } = parse(karakusa.tile(unit, state));
  const specs = [[0.11, 0.18, 0.145, Math.PI / 2, 1, 1.55], [0.40, 0.16, 0.145, Math.PI / 2, 1, 1.45], [0.79, 0.12, 0.160, Math.PI / 2, -1, 1.55], [0.10, 0.54, 0.110, -Math.PI / 2, 1, 1.40], [0.60, 0.48, 0.140, -Math.PI / 2, -1, 1.50], [0.88, 0.53, 0.110, -Math.PI / 2, -1, 1.40], [0.59, 0.10 + height, 0.065, Math.PI / 2, 1, 1.35], [0.61, 0.66, 0.055, Math.PI, 1, 1.30]];
  specs.forEach(([x, y, radius, angle, winding, turns], index) => {
    const curves = unique.get(`curl-${index}`).curves.slice(1);
    const point = t => {
      const r = radius * (1 - 0.92 * t * t), theta = angle + winding * 2 * Math.PI * turns * t;
      return [(x + r * Math.cos(theta)) * width, (y + r * Math.sin(theta)) * width];
    };
    near(curves[0][0], point(0));
    near(curves.at(-1)[3], point(1));
    curves.forEach((curve, j) => near(at(curve, 0.5), point((j + 0.5) / curves.length), width * 0.0002));
  });
});

test('filled pointed leaves are closed and their bases lie on their source stems', () => {
  const { unique } = parse(karakusa.tile(40, state));
  leafAnchors.forEach(([id, segment, t], index) => {
    const leaf = unique.get(`leaf-${index}`);
    assert.equal(leaf.closed, true);
    assert.equal(leaf.curves.length, 2);
    near(leaf.curves[0][0], at(unique.get(id).curves[segment], t));
    near(leaf.curves[1].at(-1), leaf.curves[0][0]);
    near(leaf.curves[0].at(-1), leaf.curves[1][0]);
    assert.ok(distance(leaf.curves[0][0], leaf.curves[0].at(-1)) > 0);
  });
});

function occupies(parts, x, y, stroke) {
  for (const p of parts) {
    if (x < p.minX - stroke / 2 || x > p.maxX + stroke / 2 || y < p.minY - stroke / 2 || y > p.maxY + stroke / 2) continue;
    if (p.closed) {
      let inside = false;
      for (let i = 0, j = p.flat.length - 1; i < p.flat.length; j = i++) {
        const [xi, yi] = p.flat[i], [xj, yj] = p.flat[j];
        if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) inside = !inside;
      }
      if (inside) return true;
    } else {
      for (let i = 1; i < p.flat.length; i += 1) {
        const a = p.flat[i - 1], b = p.flat[i];
        const dx = b[0] - a[0], dy = b[1] - a[1];
        const t = Math.max(0, Math.min(1, ((x - a[0]) * dx + (y - a[1]) * dy) / (dx * dx + dy * dy || 1)));
        if (Math.hypot(x - a[0] - t * dx, y - a[1] - t * dy) <= stroke / 2) return true;
      }
    }
  }
  return false;
}

test('pruned neighbor copies agree with an unpruned periodic field across tile edges and wrapped curls', () => {
  for (const unit of [10, 40, 100]) {
    const tile = karakusa.tile(unit, state), parsed = parse(tile);
    const all = [...parsed.unique.values()];
    const wrap = (v, period) => ((v % period) + period) % period;
    const samples = [];
    for (const x of [-1.001, -0.999, -0.001, 0.001, 0.131, 0.379, 0.631, 0.877, 0.999, 1.001]) {
      for (const y of [-1.001, -0.999, -0.001, 0.001, 0.193, 0.421, 0.673, 0.897, 0.999, 1.001]) samples.push([x * tile.w, y * tile.h]);
    }
    for (const p of all.filter(p => !p.closed)) for (let i = 0; i < p.flat.length; i += 29) samples.push(p.flat[i]);
    for (const [x, y] of samples) {
      const actual = parsed.copies.some(copy => occupies(copy.parts, wrap(x, tile.w) - copy.x, wrap(y, tile.h) - copy.y, parsed.stroke));
      let expected = false;
      for (let row = -3; row <= 3 && !expected; row += 1) for (let col = -3; col <= 3 && !expected; col += 1) expected = occupies(all, x - col * tile.w, y - row * tile.h, parsed.stroke);
      assert.equal(actual, expected, `unit=${unit}, sample=${x},${y}`);
    }
    assert.ok(parsed.copies.reduce((sum, copy) => sum + copy.parts.length, 0) < 9 * 18, 'invisible neighbor paths should be excluded');
  }
});

test('sizes, colors, bounded strokes, and unused controls have explicit deterministic behavior', () => {
  for (const frame of [240, 480, 2000]) for (const reps of [4, 12, 36]) {
    const unit = frame / reps, current = { ...state, frame, reps, stroke: 8 };
    const tile = karakusa.tile(unit, current), parsed = parse(tile);
    assert.ok(tile.w > 0 && tile.h > 0);
    assert.equal(parsed.unique.size, 18);
    assert.ok(parsed.stroke <= tile.w * 0.018 + 0.0001);
    assert.deepEqual(tile, karakusa.tile(unit, current));
    assert.deepEqual(tile, karakusa.tile(unit, { ...current, bg: '#102030', accent: '#ffffff' }));
  }
  const tile = karakusa.tile(40, { ...state, line: '#abcdef' });
  assert.match(tile.markup, /stroke="#abcdef"/);
  assert.equal((tile.markup.match(/fill="#abcdef"/g) || []).length > 0, true);
  assert.doesNotMatch(tile.markup, /NaN|Infinity|var\(|url\(|<image|<script/);
});

test('invalid units/strokes fail explicitly and other eight generators retain immediate baseline output', () => {
  for (const invalid of [0, -1, NaN, Infinity, -Infinity, undefined, '40']) {
    assert.throws(() => karakusa.tile(invalid, state), { name: 'RangeError' });
    assert.throws(() => karakusa.tile(40, { ...state, stroke: invalid }), { name: 'RangeError' });
  }
  const baseline = JSON.parse(fs.readFileSync(path.join(root, '_docs/data/karakusa-2026-10-28/baseline.json'), 'utf8'));
  for (const p of patterns.filter(p => p.id !== 'karakusa')) assert.equal(JSON.stringify(p.tile(40, baseline[p.id].state)), JSON.stringify(baseline[p.id].tile), p.id);
});

test('formula tab states the approximate reconstruction and shipped script parses', () => {
  assert.match(source, /data-formula="karakusa"/);
  assert.match(source, /data-formula-body="karakusa"/);
  assert.match(source, /not an exact tracing/);
  for (const match of source.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)) if (match[1].trim()) new vm.Script(match[1]);
});
