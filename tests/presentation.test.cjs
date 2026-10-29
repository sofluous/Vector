const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { patterns } = require('../patterns/catalog.js');
const { defaults } = require('../patterns/session.js');
const motifs = require('../patterns/motifs.js');
const { render } = require('../patterns/presentation.js');
const { thumbnail } = require('../patterns/presentation.js');

test('all patterns provide distinct bounded uncropped motif definitions', () => {
  for (const pattern of patterns) {
    const motif = motifs.build(pattern, defaults);
    assert.ok([motif.x, motif.y, motif.w, motif.h].every(Number.isFinite), pattern.id);
    assert.ok(motif.w > 0 && motif.h > 0 && motif.note.length > 0);
    const single = render(pattern, 0, { ...defaults, reps: 1 }, 'default', 'motif').svg;
    const priorMotif = fs.readFileSync(path.join(__dirname, `../_docs/data/preview-modes-2026-10-28/${pattern.id}-default-motif.svg`), 'utf8');
    assert.equal(single, priorMotif, `${pattern.id} motif remains unchanged`);
    assert.equal(single, render(pattern, 0, { ...defaults, reps: 36 }, 'default', 'motif').svg);
    assert.doesNotMatch(single, /<pattern|clipPath|NaN|Infinity/);
    assert.notEqual(single, render(pattern, 0, defaults, 'default', 'tile').svg);
  }
});

test('repeat constructions retain natural lattice proportions', () => {
  const squareIds = ['ichimatsu', 'shippo', 'mameshibori'];
  for (const pattern of patterns) {
    const tile = render(pattern, 0, defaults, 'default', 'tile');
    assert.equal(tile.square, squareIds.includes(pattern.id), pattern.id);
    if (!tile.square) assert.match(tile.note, /Rectangular/);
    const svg = tile.svg;
    // Layout itself is covered by the repeat-layout tests; ensure mode does not depend on density.
    assert.equal(svg, render(pattern, 0, { ...defaults, reps: 1 }, 'default', 'tile').svg);
  }
});

test('density one pattern is exactly the displayed tile for all variants', () => {
  for (const pattern of patterns) for (const variant of ['default', ...(['ichimatsu', 'mameshibori'].includes(pattern.id) ? ['reference'] : [])]) {
    const tile = render(pattern, 0, defaults, variant, 'tile').svg;
    assert.equal(tile, render(pattern, 0, { ...defaults, reps: 1 }, variant, 'field').svg);
  }
  assert.throws(() => render(patterns[0], 0, defaults, 'default', 'unknown'));
  assert.throws(() => render(patterns[0], 0, defaults, 'reference', 'motif'));
  assert.throws(() => render(patterns[0], -1, defaults, 'default', 'motif'));
});

test('vine motif unwraps every branch once and fits all curve control hulls', () => {
  const motif = motifs.build(patterns.find(pattern => pattern.id === 'karakusa'), defaults);
  assert.equal(motif.parts.length, 24);
  assert.equal(new Set(motif.parts.map(part => part.id)).size, 24);
  for (const part of motif.parts) for (const curve of part.curves) for (const [x, y] of curve) {
    assert.ok(x >= motif.x - 1e-8 && x <= motif.x + motif.w + 1e-8);
    assert.ok(y >= motif.y - 1e-8 && y <= motif.y + motif.h + 1e-8);
  }
  const model = require('../patterns/karakusa.js');
  for (const path of model.paths.filter(path => path.id !== 'curl-0')) {
    const part = motif.parts.find(part => part.id === path.id);
    const parent = motif.parts.find(part => part.id === path.parent);
    const anchor = path.knot === 0 ? parent.curves[0][0] : parent.curves[path.knot - 1].at(-1);
    assert.ok(Math.hypot(...part.curves[0][0].map((value, axis) => value - anchor[axis])) < 1e-8);
  }
});

test('Asanoha motif assembles all six triangular sectors rather than one cropped lattice contribution', () => {
  const motif = motifs.build(patterns.find(pattern => pattern.id === 'asanoha'), defaults);
  assert.equal((motif.markup.match(/M /g) || []).length, 24);
  assert.equal(motif.markup.match(/points="([^"]+)"/)[1].split(' ').length, 6);
  assert.match(motif.note, /six-sector/);
});

test('motif padding preserves the requested stroke in output units', () => {
  const pattern = patterns.find(pattern => pattern.id === 'asanoha');
  for (const frame of [240, 480, 2000]) for (const stroke of [0.4, 1.6, 8]) {
    const svg = render(pattern, 0, { ...defaults, frame, stroke }, 'default', 'motif').svg;
    const width = Number(svg.match(/viewBox="([^"]+)"/)[1].split(' ')[2]);
    const localStroke = Number(svg.match(/stroke-width="([^"]+)"/)[1]);
    assert.ok(Math.abs(localStroke * frame / width - stroke) < 1e-8);
  }
});

test('gallery thumbnails use a fixed visible two-tile density and fill a square crop', () => {
  for (const pattern of patterns) {
    const svg = thumbnail(pattern, 0, defaults);
    assert.equal(svg, thumbnail(pattern, 0, { ...defaults, reps: 36 }));
    assert.equal(svg, thumbnail(pattern, 0, { ...defaults, frame: 2000, stroke: 0.4 }));
    assert.match(svg, /viewBox="0 0 480 480"/);
    assert.match(svg, /data-density="2"/);
    assert.match(svg, /width="480" height="480"/);
    assert.doesNotMatch(svg, /NaN|Infinity|undefined/);
  }
  assert.throws(() => thumbnail(patterns[0], -1, defaults));
  assert.throws(() => thumbnail(patterns[0], 0, defaults, 'reference'));
});

test('regular motifs retain equal sides and radii within SVG serialization precision', () => {
  for (const [id, radius] of [['asanoha', 100], ['kikko', 42]]) {
    const motif = motifs.build(patterns.find(pattern => pattern.id === id), defaults);
    const points = motif.markup.match(/points="([^"]+)"/)[1].split(' ').map(point => point.split(',').map(Number));
    for (let i = 0; i < points.length; i += 1) {
      assert.ok(Math.abs(Math.hypot(...points[i]) - radius) < 0.0001, id);
      const next = points[(i + 1) % points.length];
      assert.ok(Math.abs(Math.hypot(...points[i].map((value, axis) => value - next[axis])) - radius) < 0.0001, id);
    }
  }
  const triangle = motifs.build(patterns.find(pattern => pattern.id === 'uroko'), defaults);
  const points = triangle.markup.match(/points="([^"]+)"/)[1].split(' ').map(point => point.split(',').map(Number));
  for (let i = 0; i < 3; i += 1) {
    const next = points[(i + 1) % 3];
    assert.ok(Math.abs(Math.hypot(...points[i].map((value, axis) => value - next[axis])) - 100) < 0.0001);
  }
});

test('motif output uses the same scale on both axes at all supported size limits', () => {
  for (const pattern of patterns) for (const frame of [240, 2000]) {
    const svg = render(pattern, 0, { ...defaults, frame, stroke: 8 }, 'default', 'motif').svg;
    const width = Number(svg.match(/width="([^"]+)"/)[1]);
    const height = Number(svg.match(/height="([^"]+)"/)[1]);
    const [, , w, h] = svg.match(/viewBox="([^"]+)"/)[1].split(' ').map(Number);
    assert.ok(Math.abs(width / w - height / h) < 1e-9, pattern.id);
  }
});
