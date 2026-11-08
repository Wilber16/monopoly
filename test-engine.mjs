import assert from 'node:assert/strict';
import {board,newGame,apply,decks,groupDetails,money} from './engine.js';

const player=(id,name)=>({id,name,token:'🚕'});
function game(){return newGame([player('w','Will'),player('k','Katy')])}
function activateCard(deck,index){
 const g=game();g.players[0].pos=deck==='chance'?5:0;g.cardDecks={[deck]:[index]};
 const old=Math.random;Math.random=()=>0;
 try{return apply(g,{type:'roll',playerId:'w'})}
 finally{Math.random=old}
}
for(const deck of ['chance','community']){
 assert.equal(decks[deck].length,32,`${deck}: exactly 32 cards`);
 const names=new Set(decks[deck].map(c=>c.title));assert.equal(names.size,32,`${deck}: titles unique`);
 for(let i=0;i<32;i++){
  const g=activateCard(deck,i);
  assert.equal(g.lastCard?.title,decks[deck][i].title,`${deck} ${i}: correct card`);
  assert.equal(g.lastCard?.deck,deck,`${deck} ${i}: correct deck`);
  assert.equal(g.cardDecks?.[deck]?.length,0,`${deck} ${i}: consumed`);
  assert.ok(g.revision>0);
  assert.ok(g.players.every(p=>Number.isFinite(p.cash)),`${deck} ${i}: balances numeric`);
  assert.ok(Number.isFinite(g.pot||0),`${deck} ${i}: pot numeric`);
  assert.ok(g.players.every(p=>p.pos>=0&&p.pos<40),`${deck} ${i}: positions in range`);
 }
}
const names=['Café','Celeste','Magenta','Naranja','Amarillo','Verde','Coral','Azul'];
const colorSet=new Set();
for(const [i,group] of [[1,[1,3]],[6,[6,8,9]],[11,[11,13,14]],[16,[16,18,19]],[21,[21,23,24]],[26,[26,27,29]],[31,[31,32,34]],[36,[36,38,39]]]){
 const m=groupDetails(i);assert.ok(m);assert.deepEqual(m.ids,group);
 assert.ok(group.every(id=>board[id].color===m.color));colorSet.add(m.color);
}
assert.equal(colorSet.size,8,'8 unique real group colors');
assert.equal(groupDetails(2),null,'special square has no color group');
const cg=decks.community.findIndex(c=>c.type==='repairs');assert.ok(cg>=0);
let r=game();r.players[0].pos=0;r.cardDecks={community:[cg]};r.properties={1:{owner:'w',houses:2,mortgaged:false},3:{owner:'w',houses:5,mortgaged:false}};
const m=Math.random;Math.random=()=>0;try{r=apply(r,{type:'roll',playerId:'w'})}finally{Math.random=m}
assert.equal(r.pot,195,'repairs 2 houses *40 + hotel *115');
assert.equal(r.players[0].cash,1500-195);
const passIdx=decks.community.findIndex(c=>c.type==='jailPass');let pass=activateCard('community',passIdx);
assert.equal(pass.players[0].jailPass,1);
pass.players[0].jail=1;pass.players[0].pos=10;pass.phase='roll';
pass=apply(pass,{type:'useJailPass',playerId:'w'});
assert.equal(pass.players[0].jailPass,0);assert.equal(pass.players[0].jail,0);assert.equal(pass.phase,'roll');
let old=game();old.players[0].pos=0;delete old.players[0].jailPass;old.cardDecks={community:[passIdx]};
Math.random=()=>0;try{old=apply(old,{type:'roll',playerId:'w'})}finally{Math.random=m}
assert.equal(old.players[0].jailPass,1,'compatibility with old rooms');
// Repeated bids and automatic adjudication remain intact.
let a=game();a.phase='auction';a.auction={propertyId:1,highest:0,leader:null,passed:{},serial:1};
a=apply(a,{type:'auctionBid',amount:10,playerId:'w'});assert.equal(a.auction.highest,10);
a=apply(a,{type:'auctionBid',amount:30,playerId:'k'});assert.equal(a.auction.highest,30);
a=apply(a,{type:'auctionBid',amount:40,playerId:'w'});assert.equal(a.auction.highest,40);
a=apply(a,{type:'auctionPass',playerId:'k'});assert.equal(a.phase,'end');
assert.equal(a.properties[1].owner,'w');assert.equal(a.players[0].cash,1460);
console.log('PASS: 64 card draws, 32 unique per deck, 8 color groups, repairs, jail pass, backward compatibility, repeated auctions.');
