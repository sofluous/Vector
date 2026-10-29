const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const patterns = require('../patterns/catalog.js').patterns;
const karakusa = patterns.find(pattern => pattern.id === 'karakusa');
const state = { line: '#2a5db1', accent: '#6f8dcb', bg: '#ffffff', stroke: 1.6, reps: 12, frame: 480 };

const model = require('../patterns/karakusa.js');
const distance = (a,b) => Math.hypot(a[0]-b[0],a[1]-b[1]);
const subtract = (a,b) => a.map((v,i)=>v-b[i]);
function near(a,b,tolerance=0.0004) { assert.ok(distance(a,b)<tolerance, a+' differs from '+b); }
function at(c,t) {
  if(c.length===3)return [0,1].map(i=>(1-t)**2*c[0][i]+2*(1-t)*t*c[1][i]+t*t*c[2][i]);
  return [0,1].map(i=>(1-t)**3*c[0][i]+3*(1-t)**2*t*c[1][i]+3*(1-t)*t*t*c[2][i]+t**3*c[3][i]);
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

test('reference fit has sixteen attached paths, including three translated period joins', () => {
  assert.equal(model.paths.length, 16);
  assert.equal(model.leaves.length, 8);
  assert.equal(model.referenceWidth, 278);
  assert.equal(model.referenceHeight, 179);
  const ids = new Set(model.paths.map(p => p.id));
  assert.equal(ids.size, 16);
  assert.equal(model.paths.filter(p => p.shift).length, 3);
  for (const p of model.paths) {
    const parent = model.paths.find(candidate => candidate.id === p.parent);
    assert.ok(parent, p.parent);
    const shift = p.shift || [0,0];
    near(p.points[0], parent.points[p.knot].map((v,i)=>v+shift[i]));
    assert.equal(Math.abs(shift[0] % model.referenceWidth), 0);
    assert.equal(Math.abs(shift[1] % model.referenceHeight), 0);
    // Every branch must reach the same translated central cycle, rather than
    // becoming an isolated decorative curl.
    const seen = new Set();
    let current = p;
    while (!seen.has(current.id)) {
      seen.add(current.id);
      current = model.paths.find(candidate => candidate.id === current.parent);
    }
    assert.equal(current.id.startsWith('curl-'), true);
    assert.ok(seen.has('curl-0') && seen.has('curl-1') && seen.has('curl-12'));
  }
});

test('spline knots interpolate fitted landmarks with continuous internal derivatives', () => {
  const geometry = model.buildGeometry();
  for (const p of model.paths) {
    const curves = geometry.find(part => part.id === p.id).curves;
    assert.equal(curves.length, p.points.length-1);
    curves.forEach((curve,i) => {
      near(curve[0],p.points[i]);
      near(curve[3],p.points[i+1]);
      assert.ok(curve.flat().every(Number.isFinite));
      if(i>0) {
        near(curves[i-1][3],curve[0]);
        near(subtract(curves[i-1][3],curves[i-1][2]),subtract(curve[1],curve[0]),1e-8);
      }
    });
  }
});

test('leaves are closed, nondegenerate, and based on fitted stem landmarks', () => {
  const geometry = model.buildGeometry();
  model.leaves.forEach((leaf,i) => {
    const stem = model.paths.find(p=>p.id===leaf.parent);
    const part = geometry.find(p=>p.id===`leaf-${i}`);
    assert.equal(part.filled,true);
    near(part.curves[0][0],stem.points[leaf.knot]);
    near(part.curves[0][2],leaf.tip);
    near(part.curves[1][0],leaf.tip);
    near(part.curves[1][2],stem.points[leaf.knot]);
    assert.ok(distance(part.curves[0][1],part.curves[1][1])>0);
  });
});

test('serialized geometry preserves the spline control points at supported scales', () => {
  const geometry = model.buildGeometry();
  for(const unit of [240/36,40,500]) {
    const tile = karakusa.tile(unit,state), parsed = parse(tile), scale = 4*unit/278;
    assert.equal(parsed.unique.size,24);
    for(const part of geometry) {
      const actual = parsed.unique.get(part.id);
      assert.equal(actual.curves.length,part.curves.length);
      part.curves.forEach((c,i)=>c.forEach((p,j)=>near(actual.curves[i][j],p.map(v=>v*scale))));
    }
  }
});

test('hull-pruned copies match an unpruned periodic field at seams and crossing branches', () => {
  for(const unit of [10,40,100]) {
    const tile=karakusa.tile(unit,state), parsed=parse(tile), all=[...parsed.unique.values()];
    const wrap=(v,period)=>((v%period)+period)%period;
    const samples=[];
    for(const x of [-1.001,-0.999,-0.001,0.001,0.131,0.379,0.631,0.877,0.999,1.001]) {
      for(const y of [-1.001,-0.999,-0.001,0.001,0.193,0.421,0.673,0.897,0.999,1.001])samples.push([x*tile.w,y*tile.h]);
    }
    for(const p of all.filter(p=>!p.closed))for(let i=0;i<p.flat.length;i+=29)samples.push(p.flat[i]);
    for(const [x,y] of samples) {
      const actual=parsed.copies.some(copy=>occupies(copy.parts,wrap(x,tile.w)-copy.x,wrap(y,tile.h)-copy.y,parsed.stroke));
      let expected=false;
      for(let row=-3;row<=3&&!expected;row++)for(let col=-3;col<=3&&!expected;col++)expected=occupies(all,x-col*tile.w,y-row*tile.h,parsed.stroke);
      assert.equal(actual,expected,`unit=${unit}, sample=${x},${y}`);
    }
    assert.ok(parsed.copies.reduce((sum,copy)=>sum+copy.parts.length,0)<9*24);
  }
});

test('fixed fit data cannot be mutated and geometry calls return independent values', () => {
  assert.ok(Object.isFrozen(model.paths) && Object.isFrozen(model.paths[0].points[0]));
  const a=model.buildGeometry(), b=model.buildGeometry();
  a[0].curves[0][0][0]=999;
  assert.notEqual(b[0].curves[0][0][0],999);
  assert.notEqual(model.paths[0].points[0][0],999);
});

test('supported sizes, color changes, stroke limits and unused controls remain deterministic', () => {
  for(const frame of [240,480,2000])for(const reps of [4,12,36]) {
    const unit=frame/reps,current={...state,frame,reps,stroke:8};
    const tile=karakusa.tile(unit,current), parsed=parse(tile);
    assert.ok(tile.w>0&&tile.h>0);
    assert.equal(parsed.unique.size,24);
    assert.ok(parsed.stroke<=tile.w*0.018+0.0001);
    assert.deepEqual(tile,karakusa.tile(unit,current));
    assert.deepEqual(tile,karakusa.tile(unit,{...current,bg:'#102030',accent:'#ffffff'}));
  }
  const tile=karakusa.tile(40,{...state,line:'#abcdef'});
  assert.match(tile.markup,/stroke="#abcdef"/);
  assert.match(tile.markup,/fill="#abcdef"/);
  assert.doesNotMatch(tile.markup,/NaN|Infinity|var\(|url\(|<image|<script/);
});

test('invalid inputs fail explicitly and all other generators retain the refinement baseline', () => {
  for(const invalid of [0,-1,NaN,Infinity,-Infinity,undefined,'40']) {
    assert.throws(()=>karakusa.tile(invalid,state),{name:'RangeError'});
    assert.throws(()=>karakusa.tile(40,{...state,stroke:invalid}),{name:'RangeError'});
  }
  const baseline=JSON.parse(fs.readFileSync(path.join(root,'_docs/data/karakusa-refinement-2026-10-28/baseline.json'),'utf8'));
  for(const p of patterns.filter(p=>p.id!=='karakusa'))assert.equal(JSON.stringify(p.tile(40,baseline[p.id].state)),JSON.stringify(baseline[p.id].tile),p.id);
});

test('formula documents the fitted spline and both runtime scripts parse', () => {
  assert.match(source, /patterns\/karakusa\.js/);
  assert.match(source, /Reference-fitted spline reconstruction/);
  assert.match(source, /Branches share positions, not tangents/);
  const section=source.match(/data-formula-body="karakusa">([\s\S]*?)<\/section>/)[1];
  assert.doesNotMatch(section,/rho\(t\)|Eight curls/);
  new vm.Script(fs.readFileSync(path.join(root,'patterns/karakusa.js'),'utf8'));
  for(const match of source.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g))if(match[1].trim())new vm.Script(match[1]);
});
