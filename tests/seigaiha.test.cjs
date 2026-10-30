const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const patterns = require('../patterns/catalog.js').patterns;
const seigaiha = patterns.find(pattern => pattern.id === 'seigaiha');
const state = { line: '#2a5db1', accent: '#6f8dcb', bg: '#ffffff', stroke: 1.6, reps: 12, frame: 480 };

// Parse the shipped semicircle commands so occupancy tests use serialized geometry.
function layers(tile) {
  return [...tile.markup.matchAll(/<path d="([^"]+)" fill="([^"]+)" stroke="([^"]+)"(?: stroke-width="([^"]+)")?\/>/g)].map(match => {
    const commands = match[1].trim().split(/\s+/);
    const arcs = [];
    for (let i = 0; i < commands.length; i += 11) {
      if (commands[i] === 'Z') break;
      assert.equal(commands[i], 'M');
      assert.equal(commands[i + 3], 'A');
      const [x, y, rx, ry, rotation, large, sweep, endX, endY] =
        [1, 2, 4, 5, 6, 7, 8, 9, 10].map(offset => Number(commands[i + offset]));
      assert.ok([x, y, rx, ry, rotation, large, sweep, endX, endY].every(Number.isFinite));
      assert.equal(rx, ry);
      assert.equal(y, endY);
      assert.equal(rotation, 0);
      assert.equal(large, 0);
      assert.equal(sweep, 1, 'upper semicircle must sweep left to right');
      assert.ok(Math.abs(endX - x - 2 * rx) < 0.0002);
      arcs.push({ cx: (x + endX) / 2, cy: y, radius: rx });
    }
    return { arcs, fill: match[2], stroke: match[3], width: Number(match[4] || 0), closed: commands.at(-1) === 'Z' };
  });
}

function serializedColor(layers, x, y, background) {
  let color = background;
  for (const layer of layers) {
    for (const arc of layer.arcs) {
      if (y > arc.cy) continue;
      const distance = Math.hypot(x - arc.cx, y - arc.cy);
      if (layer.fill !== 'none' && distance <= arc.radius) color = layer.fill;
      if (layer.stroke !== 'none' && Math.abs(distance - arc.radius) <= layer.width / 2) color = layer.stroke;
    }
  }
  return color;
}

// Infinite field specification, independent of the finite tile's row/column ranges.
function fieldColor(unit, requestedStroke, x, y) {
  const radius = unit / 2;
  const dy = radius / 2;
  const stroke = Math.min(requestedStroke, radius * 0.108);
  const firstRow = Math.floor(y / dy) - 1;
  const firstCol = Math.floor(x / unit) - 2;
  let color = state.bg;
  for (let row = firstRow; row <= firstRow + 6; row += 1) {
    const cy = row * dy;
    if (y > cy) continue;
    for (let col = firstCol; col <= firstCol + 4; col += 1) {
      const cx = col * unit + ((row % 2 + 2) % 2) * radius;
      const distance = Math.hypot(x - cx, y - cy);
      if (distance <= radius) color = state.bg;
      if ([1, 0.76, 0.52, 0.28].some(ratio => Math.abs(distance - ratio * radius) <= stroke / 2)) color = state.line;
    }
  }
  return color;
}

test('four concentric upper arcs are painted after each un-stroked fan silhouette', () => {
  const tile = seigaiha.tile(100, state);
  const parsed = layers(tile);
  assert.equal(tile.w, 100);
  assert.equal(tile.h, 50);
  assert.equal(parsed.length, 30);
  for (let i = 0; i < parsed.length; i += 2) {
    const fill = parsed[i];
    const stroke = parsed[i + 1];
    assert.equal(fill.fill, state.bg);
    assert.equal(fill.stroke, 'none');
    assert.equal(fill.closed, true);
    assert.equal(fill.arcs.length, 1);
    assert.equal(stroke.fill, 'none');
    assert.equal(stroke.closed, false, 'fan baseline must not be stroked');
    assert.equal(stroke.arcs.length, 4);
    assert.deepEqual(stroke.arcs.map(arc => arc.radius), [50, 38, 26, 14]);
    assert.ok(stroke.arcs.every(arc => arc.cx === fill.arcs[0].cx && arc.cy === fill.arcs[0].cy));
  }
});

test('serialized repeat matches the infinite overlapped fan field around all tile boundaries', () => {
  let comparisons = 0;
  for (const unit of [240 / 36, 40, 500]) {
    for (const stroke of [0.4, 1.6, 8]) {
      const tile = seigaiha.tile(unit, { ...state, stroke });
      const parsed = layers(tile);
      const wrap = (value, period) => ((value % period) + period) % period;
      for (const xr of [-1.001, -0.999, -0.317, -0.001, 0.001, 0.133, 0.377, 0.629, 0.853, 0.999, 1.001]) {
        for (const yr of [-1.001, -0.999, -0.157, -0.001, 0.001, 0.193, 0.421, 0.673, 0.897, 0.999, 1.001]) {
          const x = xr * unit;
          const y = yr * unit / 2;
          const actual = serializedColor(parsed, wrap(x, tile.w), wrap(y, tile.h), state.bg);
          assert.equal(actual, fieldColor(unit, stroke, x, y), `unit=${unit}, stroke=${stroke}, sample=${xr},${yr}`);
          comparisons += 1;
        }
      }
    }
  }
  assert.equal(comparisons, 1089);
});

test('foreground fans erase rear arcs rather than forming a crossing-arc mesh', () => {
  const parsed = layers(seigaiha.tile(100, state));
  // The foreground fan at (50, 25) covers the rear radius-38 arc at (38, 0).
  assert.equal(serializedColor(parsed, 38, 0, state.bg), state.bg);
  assert.equal(serializedColor(parsed, 50, 0, state.bg), state.bg);
  assert.equal(serializedColor(parsed, 50, 25 - 14, state.bg), state.line);
});

test('density does not alter ring count; stroke is explicitly capped and artwork colors remain standalone', () => {
  const small = seigaiha.tile(10, { ...state, stroke: 8, bg: '#102030', line: '#abcdef' });
  const parsed = layers(small);
  assert.ok(parsed.filter(layer => layer.stroke !== 'none').every(layer => layer.width === 0.54));
  assert.ok(parsed.filter(layer => layer.fill !== 'none').every(layer => layer.fill === '#102030'));
  assert.match(small.markup, /stroke="#abcdef"/);
  assert.doesNotMatch(small.markup, /var\(|url\(|NaN|Infinity|<image|<script/);
  for (const reps of [4, 12, 36]) assert.deepEqual(seigaiha.tile(40, { ...state, reps }), seigaiha.tile(40, state));
  for (const frame of [240, 480, 2000]) {
    for (const reps of [4, 12, 36]) {
      const tile = seigaiha.tile(frame / reps, { ...state, frame, reps });
      assert.ok(tile.w > 0 && tile.h > 0);
      assert.deepEqual(tile, seigaiha.tile(frame / reps, { ...state, frame, reps }));
      layers(tile);
    }
  }
});

test('invalid units and strokes fail explicitly', () => {
  for (const invalid of [0, -1, NaN, Infinity, -Infinity, undefined, '40']) {
    assert.throws(() => seigaiha.tile(invalid, state), { name: 'RangeError' });
    assert.throws(() => seigaiha.tile(40, { ...state, stroke: invalid }), { name: 'RangeError' });
  }
});

test('generators outside Seigaiha and later corrections retain their pre-Seigaiha outputs', () => {
  const baseline = JSON.parse(fs.readFileSync(path.join(root, '_docs/data/seigaiha-2026-10-28/baseline.json'), 'utf8'));
  for (const pattern of patterns.filter(pattern => !['seigaiha', 'shippo', 'karakusa'].includes(pattern.id))) {
    const before = baseline[pattern.id];
    assert.equal(JSON.stringify(pattern.tile(40, before.state)), JSON.stringify(before.tile), pattern.id);
  }
});

test('formula notes describe the shipped construction', () => {
  const notes = require('../patterns/content.js').get('seigaiha').construction;
  assert.match(notes, /Ring count stays fixed/);
  assert.match(notes, /background-filled outer fan/);
  assert.doesNotMatch(notes, /atan|Ring count scales/);
});
