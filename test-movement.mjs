import assert from 'node:assert/strict';
import {newGame,apply,board,tokens} from './engine.js';
assert.equal(board[20].name,'LA TINKA');
assert.equal(tokens.length,12);
assert.ok(tokens.includes('🦙')&&tokens.includes('🛺')&&tokens.includes('🚕'));
const game=()=>newGame([{id:'a',name:'A',token:'🦙'},{id:'b',name:'B',token:'🚕'}]);
const random=Math.random;
// Two 1s advance from START to ARCA COMUNAL and may trigger another move.
Math.random=()=>0;
let g=game();g.cardDecks={community:[0]};
try{g=apply(g,{type:'roll',playerId:'a'})}finally{Math.random=random}
assert.equal(g.players[0].pos,2);
assert.equal(g.lastMotion?.playerId,'a');
assert.equal(g.lastMotion?.segments[0]?.from,0);
assert.equal(g.lastMotion?.segments[0]?.to,2);
assert.equal(g.lastMotion?.segments[0]?.steps,2);
assert.equal(g.lastMotion?.segments[0]?.direction,'forward');
assert.equal(g.lastMotion?.segments[0]?.steps,g.dice[0]+g.dice[1]);
// No movement should be fabricated by a nonmovement action.
const serial=g.lastMotion.serial;
let r=apply(g,{type:'reaction',playerId:'a',emoji:'👏'});
assert.equal(r.lastMotion?.serial,serial);
// On a known movement card, the route must include dice first and card second.
let j=game();j.cardDecks={community:[15]};Math.random=()=>0;
try{j=apply(j,{type:'roll',playerId:'a'})}finally{Math.random=random}
assert.equal(j.players[0].pos,0);
assert.equal(j.lastMotion.segments.length,2);
assert.deepEqual(j.lastMotion.segments.map(t=>t.to),[2,0]);
console.log('OK: Tinka, 12 fichas, tramo por dados, movimiento por carta, compatibilidad de reacciones');
