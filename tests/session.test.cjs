'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const model = require('../patterns/session.js');
const capabilities = require('../patterns/capabilities.js');
const { patterns } = require('../patterns/catalog.js');
const { serialize } = require('../patterns/svg.js');

function exported(session) {
  const index = patterns.findIndex(pattern => pattern.id === session.selectedId);
  const artwork = session.artwork[session.selectedId];
  return serialize(patterns[index], index, artwork, artwork.variant);
}

test('new sessions preserve all nine frozen default export snapshots', () => {
  const session = model.create();
  const manifest = require('./fixtures/workspace-review-2026-10-28/manifest.json');
  assert.equal(session.selectedId, 'asanoha');
  assert.equal(Object.keys(session.artwork).length, patterns.length);
  assert.ok(Object.isFrozen(session) && Object.isFrozen(session.artwork));
  for (const record of manifest.records) {
    let selected = model.select(session, record.id);
    if (record.variant !== 'default') selected = model.edit(selected, { variant: record.variant });
    const snapshot = fs.readFileSync(path.join(__dirname, './fixtures/workspace-review-2026-10-28', record.filename), 'utf8');
    assert.equal(exported(selected), snapshot);
    assert.ok(Object.isFrozen(selected.artwork[record.id]));
  }
  assert.notEqual(session.artwork.asanoha, session.artwork.kikko);
});

test('selection and independent edits preserve other patterns and previous sessions', () => {
  const initial = model.create('kikko');
  const edited = model.edit(initial, { accent: '#123456', stroke: 2, reps: 20 });
  const other = model.edit(model.select(edited, 'shippo'), { line: '#abcdef' });
  assert.equal(initial.artwork.kikko.accent, model.defaults.accent);
  assert.equal(other.artwork.kikko.accent, '#123456');
  assert.equal(other.artwork.shippo.line, '#abcdef');
  assert.equal(edited.artwork.shippo.line, model.defaults.line);
  assert.equal(other.artwork.asanoha, initial.artwork.asanoha);
  assert.equal(model.select(other, 'kikko').artwork.kikko, edited.artwork.kikko);
  assert.throws(() => { other.artwork.kikko.line = '#000000'; }, TypeError);
});

test('reset restores selected defaults and leaves navigation and other artwork intact', () => {
  let session = model.edit(model.create('kikko'), { accent: '#112233' });
  session = model.edit(model.select(session, 'ichimatsu'), { line: '#ffffff', variant: 'reference' });
  session = model.view(session, { tab: 'context', mode: 'repeat', zoom: 2 });
  const reset = model.reset(session);
  assert.deepEqual(reset.artwork.ichimatsu, model.defaults);
  assert.equal(reset.artwork.kikko, session.artwork.kikko);
  assert.equal(reset.selectedId, 'ichimatsu');
  for (const key of ['tab', 'mode', 'zoom']) assert.equal(reset[key], session[key]);
  assert.equal(session.artwork.ichimatsu.variant, 'reference');
  assert.deepEqual(model.create().artwork.kikko, model.defaults);
});

test('invalid identifiers, variants, controls and combined edits cannot partially commit', () => {
  const session = model.create('ichimatsu');
  const before = JSON.stringify(session);
  for (const id of ['missing', '__proto__', 'constructor', null]) {
    assert.throws(() => model.create(id), RangeError);
    assert.throws(() => model.select(session, id), RangeError);
    assert.throws(() => capabilities.get(id), RangeError);
  }
  for (const patch of [null, [], 4, { variant: 'unknown' }, { stroke: 2 }, { extra: 1 },
    { frame: 2001, line: '#123456' }, { reps: 4.5 }, { bg: 'red' }, { frame: NaN },
    { variant: 'reference', accent: '#123456' }]) assert.throws(() => model.edit(session, patch));
  assert.throws(() => model.edit(model.create('shippo'), { variant: 'reference' }));
  for (const stroke of [0, 9, Infinity]) assert.throws(() => model.edit(model.create('kikko'), { stroke }));
  assert.equal(JSON.stringify(session), before);
});

test('variant switches retain inactive secondary values and restore them on return', () => {
  let session = model.edit(model.create('mameshibori'), { accent: '#123456' });
  const original = exported(session);
  session = model.edit(session, { variant: 'reference' });
  assert.equal(session.artwork.mameshibori.accent, '#123456');
  assert.ok(!capabilities.get('mameshibori', 'reference').controls.includes('accent'));
  assert.throws(() => model.edit(session, { accent: '#abcdef' }));
  assert.equal(exported(model.edit(session, { variant: 'default' })), original);
});

test('capabilities match generator behavior for stroke and secondary color', () => {
  for (const pattern of patterns) {
    const caps = capabilities.get(pattern.id);
    assert.ok(Object.isFrozen(caps) && Object.isFrozen(caps.controls) && Object.isFrozen(caps.variants));
    assert.equal(pattern.tile(40, model.defaults).markup !== pattern.tile(40, { ...model.defaults, stroke: 0.4 }).markup, caps.stroke, pattern.id);
    assert.equal(pattern.tile(40, model.defaults).markup !== pattern.tile(40, { ...model.defaults, accent: '#000000' }).markup, caps.secondary, pattern.id);
  }
  assert.equal(capabilities.get('seigaiha').strokeLimit, '45% of ring spacing');
  assert.equal(capabilities.get('karakusa').strokeLimit, '1.8% of motif width');
});

test('view changes never alter artwork exports and reject invalid values', () => {
  const initial = model.create('karakusa');
  const svg = exported(initial);
  for (const tab of ['preview', 'construction', 'context']) {
    for (const mode of ['field', 'tile', 'repeat']) {
      for (const zoom of [0.25, 1, 4]) assert.equal(exported(model.view(initial, { tab, mode, zoom })), svg);
    }
  }
  for (const patch of [null, [], { zoom: NaN }, { zoom: 0 }, { zoom: 4.1 },
    { tab: 'missing' }, { mode: 'missing' }, { selectedId: 'shippo' }]) assert.throws(() => model.view(initial, patch));
  assert.equal(initial.zoom, 1);
});

test('classic browser modules expose the same session behavior without DOM or CommonJS', () => {
  const context = vm.createContext({});
  for (const file of ['karakusa', 'catalog', 'validation', 'capabilities', 'session']) {
    vm.runInContext(fs.readFileSync(path.join(__dirname, `../patterns/${file}.js`), 'utf8'), context);
  }
  const browser = context.PatternSession;
  const result = browser.edit(browser.create('ichimatsu'), { variant: 'reference', line: '#112233' });
  assert.equal(JSON.stringify(result), JSON.stringify(model.edit(model.create('ichimatsu'), { variant: 'reference', line: '#112233' })));
});
