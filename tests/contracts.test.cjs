const test = require('node:test');
const assert = require('node:assert/strict');
const { patterns, referenceTile } = require('../patterns/catalog.js');
const { validate } = require('../patterns/validation.js');
const { serialize } = require('../patterns/svg.js');
const s = { frame:480, reps:12, stroke:1.6, line:'#2a5db1', accent:'#6f8dcb', bg:'#ffffff' };
test('export rejects invalid bounds, nonfinite values, colors and identifiers', () => {
  for (const [key, values] of Object.entries({frame:[0,2001,Infinity],reps:[0,4.5,37,NaN],stroke:[0,9,Infinity],line:['red','" onload="x'],accent:['#fff'],bg:['url(x)']})) {
    for (const value of values) assert.throws(() => validate({...s,[key]:value}));
  }
  assert.throws(() => serialize({...patterns[0],id:'bad"'},0,s));
  assert.throws(() => serialize(patterns[0],-1,s));
  assert.throws(() => serialize(patterns[0],0,s,'unknown'));
});
test('all nine exports remain deterministic and standalone at supported limits', () => {
  for (const pattern of patterns) for (const frame of [240,480,2000]) for (const reps of [4,12,36]) {
    const state = {...s,frame,reps}; const svg=serialize(pattern,0,state);
    assert.equal(svg,serialize(pattern,0,state));
    assert.match(svg,/xmlns="http:\/\/www.w3.org\/2000\/svg"/);
    assert.doesNotMatch(svg,/NaN|Infinity|var\(|<script/);
  }
});
test('Ichimatsu reference uses primary and background without mutating state', () => {
  const pattern=patterns.find(p=>p.id==='ichimatsu');
  const before=JSON.stringify(s);const tile=referenceTile(pattern,40,s);
  assert.equal(tile.markup,pattern.tile(40,{...s,accent:s.bg}).markup);
  assert.equal(JSON.stringify(s),before);
  assert.throws(()=>referenceTile(pattern,NaN,s));
});
test('Mameshibori reference is a uniform periodic grid with no clipped boundary dots', () => {
  const pattern=patterns.find(p=>p.id==='mameshibori');
  const tile=referenceTile(pattern,40,s);
  const circles=[...tile.markup.matchAll(/cx="([^"]+)" cy="([^"]+)" r="([^"]+)" fill="([^"]+)"/g)];
  assert.equal(circles.length,64);
  for(const [,x,y,r,color] of circles){assert.equal(Number(r),2.2);assert.equal(color,s.line);assert.ok(+x-r>0&&+x+(+r)<tile.w&&+y-r>0&&+y+(+r)<tile.h);}
  const xs=[...new Set(circles.map(c=>+c[1]))];
  assert.equal(tile.w-xs.at(-1)+xs[0],xs[1]-xs[0]);
  assert.equal(referenceTile(pattern,40,{...s,accent:'#123456'}).markup,tile.markup);
  assert.throws(()=>referenceTile(patterns[0],40,s));
});
