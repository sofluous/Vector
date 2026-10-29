const test = require('node:test');
const assert = require('node:assert/strict');
const { patterns } = require('../patterns/catalog.js');
const library = require('../patterns/library.js');

test('library categories cover the collection exactly once without changing catalog order', () => {
  const ids = library.groups.flatMap(group => group.patterns);
  assert.equal(ids.length, patterns.length);
  assert.equal(new Set(ids).size, ids.length);
  assert.deepEqual([...ids].sort(), patterns.map(pattern => pattern.id).sort());
  assert.equal(patterns[1].id, 'yagasuri');
  assert.ok(library.groups.every(group => Object.isFrozen(group) && Object.isFrozen(group.patterns)));
});

test('search matches names, descriptions and group names without changing source metadata', () => {
  assert.equal(library.browse('  KARAKUSA  ')[0].patterns[0].id, 'karakusa');
  assert.equal(library.browse('lenses')[0].patterns.length, 2);
  assert.equal(library.browse('checkerboard')[0].patterns[0].id, 'ichimatsu');
  assert.equal(library.browse('Japanese').flatMap(group => group.patterns).length, 9);
  assert.deepEqual(library.browse('no-such-pattern'), []);
  const result = library.browse(); result[0].patterns.pop();
  assert.equal(library.browse().flatMap(group => group.patterns).length, 9);
});
