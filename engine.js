const names=['SALIDA','Ancón','Comunidad','Santa Rosa','Impuesto municipal','Metropolitano','Puente Piedra','Suerte limeña','Carabayllo','Comas','COMISARÍA','Independencia','Empresa de luz','Los Olivos','San Martín de Porres','Línea 1','Rímac','Comunidad','Breña','Pueblo Libre','DESCANSO','Jesús María','Suerte limeña','Lince','Magdalena','Corredor Azul','San Miguel','San Borja','Empresa de agua','Surquillo','A COMISARÍA','Barranco','Chorrillos','Comunidad','La Molina','Taxi amarillo','Surco','Impuesto predial','Miraflores','San Isidro'];
const colors=['#7b86a1','#8d6be7','#8d6be7','#8d6be7','#7b86a1','#23c7bb','#8d6be7','#ffb84c','#8d6be7','#8d6be7','#7b86a1','#48b5ff','#7b86a1','#48b5ff','#48b5ff','#23c7bb','#ff8b5d','#ffb84c','#ff8b5d','#ff8b5d','#7b86a1','#f2cf57','#ffb84c','#f2cf57','#f2cf57','#23c7bb','#6fe19d','#6fe19d','#7b86a1','#6fe19d','#7b86a1','#f26d9b','#f26d9b','#ffb84c','#f26d9b','#23c7bb','#f16b55','#7b86a1','#f16b55','#e9ba58'];
export const board=names.map((name,i)=>({id:i,name,color:colors[i],kind:[0,10,20,30].includes(i)?'corner':[2,17,33].includes(i)?'community':[7,22].includes(i)?'chance':[4,37].includes(i)?'tax':[5,15,25,35].includes(i)?'transport':[12,28].includes(i)?'utility':'property',price:[0,60,0,60,0,200,100,0,100,120,0,140,150,140,160,200,180,0,180,200,0,220,0,220,240,200,260,260,150,280,0,300,300,0,320,200,350,0,400,450][i]}));
export const tokens=['🚕','🛵','🚌','🚲','🚗','🚁','🚀','🐆','🦙','🛺','⚽','🛹'];
export const money=n=>'S/ '+Math.round(n).toLocaleString('es-PE');
export function newGame(players){return {players:players.map((p,i)=>({id:p.id,name:p.name,token:tokens.includes(p.token)?p.token:tokens[i],pos:0,cash:1500,jail:0,jailAttempts:0,bankrupt:false})),turn:0,phase:'roll',properties:{},dice:[1,1],doubleCount:0,log:['¡Bienvenidos a Lima City!'],winner:null,pot:0,revision:0};}
const payBank=(g,player,amount,toPot=false)=>{transfer(g,player.id,null,amount);if(toPot)g.pot=(g.pot||0)+amount};
const log=(g,t)=>{g.log=[t,...g.log].slice(0,18)};
const next=(g)=>{let n=g.turn;do{n=(n+1)%g.players.length}while(g.players[n].bankrupt&&n!==g.turn);g.turn=n;g.phase='roll';g.doubleCount=0};
const owns=(g,id)=>g.properties[id];
const groups=[[1,3],[6,8,9],[11,13,14],[16,18,19],[21,23,24],[26,27,29],[31,32,34],[36,38,39]];
export const groupFor=id=>groups.find(a=>a.includes(Number(id)))||[];
export const buildCost=id=>Math.round(board[id].price*.5);
export function rentTable(id){let b=board[id];if(b.kind!=='property')return [];let base=Math.max(2,Math.round(b.price*.1));return [base,Math.round(base*5),Math.round(base*15),Math.round(base*45),Math.round(base*80),Math.round(base*125)];}
export function rentAt(g,id){let b=board[id],pr=g.properties?.[id];if(!pr||pr.mortgaged)return 0;if(b.kind==='transport')return 25*Math.pow(2,Object.keys(g.properties).filter(k=>board[k].kind==='transport'&&g.properties[k].owner===pr.owner).length-1);if(b.kind==='utility')return 35;let table=rentTable(id);if(pr.houses>0)return table[Math.min(5,pr.houses)];let monopoly=groupFor(id).every(i=>g.properties?.[i]?.owner===pr.owner);return table[0]*(monopoly?2:1)};
const notify=(g,type,p,details={})=>{g.lastEvent={type,playerId:p.id,playerName:p.name,revision:(g.eventSerial=(g.eventSerial||0)+1),...details};};

const rent=(g,id)=>rentAt(g,id);
function transfer(g,from,to,amount){let p=g.players.find(p=>p.id===from);if(!p)return;p.cash-=amount;if(to){let q=g.players.find(p=>p.id===to);if(q)q.cash+=amount;}if(p.cash<0){p.bankrupt=true;for(let k of Object.keys(g.properties)){if(g.properties[k].owner===p.id)delete g.properties[k]}log(g,`${p.name} quedó en bancarrota`);let active=g.players.filter(x=>!x.bankrupt);if(active.length===1){g.winner=active[0].id;g.phase='finished';log(g,`🏆 ${active[0].name} ganó Lima City`)}}}
const decks={
 community:[
 {title:'Fondo de ahorro',description:'Recuperas dinero de tu fondo comunal.',amount:200,emoji:'🏦'},
 {title:'Consulta médica',description:'Pagas gastos de atención médica.',amount:-50,emoji:'🩺'},
 {title:'Premio del vecindario',description:'Tu barrio premia tu iniciativa.',amount:100,emoji:'🏆'},
 {title:'Colecta vecinal',description:'Aportas a una causa comunitaria.',amount:-50,emoji:'🤝'},
 {title:'Cumpleaños limeño',description:'Cada jugador te regala S/ 20.',type:'collectEach',amount:20,emoji:'🎂'},
 {title:'Apoyo a tus vecinos',description:'Entregas S/ 20 a cada jugador.',type:'payEach',amount:20,emoji:'💝'},
 {title:'Beca municipal',description:'Recibes una beca de formación.',amount:150,emoji:'🎓'},
 {title:'Reparación de vereda',description:'Colaboras con la reparación del barrio.',amount:-40,emoji:'🧱'},
 {title:'Devolución bancaria',description:'Recibes un reembolso inesperado.',amount:75,emoji:'💳'},
 {title:'Herencia familiar',description:'Recibes una herencia.',amount:100,emoji:'📜'},
 {title:'Campaña de reciclaje',description:'Tu participación recibe una recompensa.',amount:50,emoji:'♻️'},
 {title:'Mantenimiento de parques',description:'Pagas una contribución.',amount:-80,emoji:'🌳'},
 {title:'Voluntariado reconocido',description:'Recibes un incentivo por tu ayuda.',amount:60,emoji:'🙌'},
 {title:'Aporte escolar',description:'Colaboras con materiales para una escuela.',amount:-50,emoji:'📚'},
 {title:'Visita a la comisaría',description:'Ve a la comisaría sin cobrar por SALIDA.',type:'jail',emoji:'🚓'},
 {title:'Vuelve a SALIDA',description:'Avanza a SALIDA y cobra S/ 200.',type:'move',target:0,emoji:'🚩'}
 ],
 chance:[
 {title:'¡Rumbo a Miraflores!',description:'Avanza hasta Miraflores.',type:'move',target:38,emoji:'🌊'},
 {title:'Avanza a SALIDA',description:'Cobra S/ 200 al llegar.',type:'move',target:0,emoji:'🚩'},
 {title:'Visita la comisaría',description:'Ve directamente a la comisaría.',type:'jail',emoji:'🚓'},
 {title:'Viaje a Barranco',description:'Trasládate a Barranco.',type:'move',target:31,emoji:'🎨'},
 {title:'Visita San Isidro',description:'Avanza hasta San Isidro.',type:'move',target:39,emoji:'🏙️'},
 {title:'Papeleta de tránsito',description:'Pagas una multa.',amount:-100,emoji:'🚦'},
 {title:'Concurso de emprendimiento',description:'Ganaste un concurso.',amount:150,emoji:'🥇'},
 {title:'Impuesto extraordinario',description:'Pagas un cargo inesperado.',amount:-75,emoji:'🧾'},
 {title:'Campaña publicitaria',description:'Tu negocio recibe más clientes.',amount:100,emoji:'📣'},
 {title:'Reparación del auto',description:'Debes pagar el taller.',amount:-120,emoji:'🔧'},
 {title:'Retrocede tres casillas',description:'Retrocede tres espacios en el tablero.',type:'back',steps:3,emoji:'↩️'},
 {title:'Adelanta a Jesús María',description:'Avanza hasta Jesús María.',type:'move',target:21,emoji:'🏘️'},
 {title:'Premio de la feria',description:'Ganaste un sorteo limeño.',amount:200,emoji:'🎟️'},
 {title:'Gastos de transporte',description:'Pagas pasajes y movilidad.',amount:-50,emoji:'🚌'},
 {title:'Bono de temporada',description:'Recibes un bono especial.',amount:75,emoji:'🎁'},
 {title:'Cobro por servicios',description:'Cada jugador te paga S/ 25.',type:'collectEach',amount:25,emoji:'💰'}
 ]
};
const shuffle=a=>{let v=[...a];for(let i=v.length-1;i>0;i--){let j=Math.floor(Math.random()*(i+1));[v[i],v[j]]=[v[j],v[i]]}return v};
function draw(g,deck){g.cardDecks??={};if(!g.cardDecks[deck]?.length)g.cardDecks[deck]=shuffle(decks[deck].map((_,i)=>i));return decks[deck][g.cardDecks[deck].shift()]}
function applyCard(g,p,card){
 if(card.type==='jail'){p.pos=10;p.jail=1;p.jailAttempts=0;log(g,`${p.name} fue a la comisaría`)}
 else if(card.type==='move'||card.type==='back'){
  const old=p.pos;const target=card.type==='back'?(p.pos-card.steps+40)%40:card.target;
  p.pos=target;if(card.type==='move'&&target<=old){p.cash+=200;log(g,`${p.name} cobró ${money(200)} por pasar por SALIDA`)}
  log(g,`${p.name} avanzó a ${board[p.pos].name}`);resolve(g,p,false)
 }else if(card.type==='collectEach'||card.type==='payEach'){
  for(const other of g.players){if(other.id===p.id||other.bankrupt)continue;if(card.type==='collectEach')transfer(g,other.id,p.id,card.amount);else transfer(g,p.id,other.id,card.amount)}
  log(g,`${p.name}: ${card.title}`)
 }else{const amt=card.amount;if(amt>=0)p.cash+=amt;else payBank(g,p,-amt,true);log(g,`${card.title}: ${amt>=0?'+':''}${money(amt)}`)}
}
function resolve(g,p,allowCard=true){let b=board[p.pos],pr=owns(g,p.pos);if(b.kind==='property'||b.kind==='transport'||b.kind==='utility'){if(pr){if(pr.owner!==p.id&&!pr.mortgaged){let r=rent(g,p.pos);transfer(g,p.id,pr.owner,r);log(g,`${p.name} pagó ${money(r)} por ${b.name}`);notify(g,'rent',p,{propertyId:p.pos,amount:r,ownerName:g.players.find(z=>z.id===pr.owner)?.name||'otro jugador'})}}else{g.phase='decision';notify(g,'property',p,{propertyId:p.pos,amount:b.price});log(g,`${p.name} puede comprar ${b.name} por ${money(b.price)}`)}}else if(b.kind==='tax'){let v=p.pos===4?100:150;payBank(g,p,v,true);notify(g,'tax',p,{amount:v,propertyId:p.pos});log(g,`${p.name} pagó ${money(v)} de impuestos`)}else if((b.kind==='chance'||b.kind==='community')&&allowCard){let deck=b.kind==='chance'?'chance':'community';let card=draw(g,deck);applyCard(g,p,card);g.lastCard={...card,deck,playerId:p.id,playerName:p.name,revision:(g.cardSerial=(g.cardSerial||0)+1)};}else if(p.pos===30){p.pos=10;p.jail=1;p.jailAttempts=0;notify(g,'jail',p);log(g,`${p.name} fue enviado a la comisaría`)}else if(p.pos===20){let jackpot=g.pot||0;g.pot=0;p.cash+=jackpot;notify(g,'pot',p,{amount:jackpot});log(g,`${p.name} cobró ${money(jackpot)} del pozo de DESCANSO`)}}
export function apply(input,action){let g=structuredClone(input);g.properties ??= {};g.dice ??= [1,1];g.log ??= [];if(g.auction)g.auction.passed ??= {};if(g.winner)return g;let p=g.players[g.turn];const actor=g.players.find(x=>x.id===action.playerId);if(!actor||actor.bankrupt)return input;
if(action.type==='reaction'){const allowed=['👏','😂','😎','🔥','💸','😱'];if(!allowed.includes(action.emoji))return input;g.reaction={emoji:action.emoji,playerName:actor.name,serial:(g.reactionSerial||0)+1};g.reactionSerial=g.reaction.serial;g.revision++;return g}
// Subasta por rondas libres: se puede contraofertar mientras no se haya pasado.
const finishAuction=()=>{
 const a=g.auction; if(!a)return;
 const winner=a.leader&&g.players.find(z=>z.id===a.leader&&!z.bankrupt);
 if(winner&&winner.cash>=a.highest){winner.cash-=a.highest;g.properties[a.propertyId]={owner:winner.id,houses:0,mortgaged:false};log(g,`🏆 ${winner.name} ganó la subasta de ${board[a.propertyId].name} por ${money(a.highest)}`)}
 else log(g,`🔨 La subasta de ${board[a.propertyId].name} terminó sin comprador`);
 g.auction=null;g.phase='end';
};
if(g.phase==='auction'&&g.auction&&(action.type==='auctionBid'||action.type==='auctionPass')){
 let a=g.auction;a.passed??={};
 const eligible=g.players.filter(z=>!z.bankrupt&&!a.passed[z.id]);
 if(!eligible.some(z=>z.id===actor.id))return input;
 if(action.type==='auctionBid'){
  let amount=Number(action.amount),increment=amount-a.highest;
  if(a.leader===actor.id||![10,20,40].includes(increment)||!Number.isSafeInteger(amount)||actor.cash<amount)return input;
  a.highest=amount;a.leader=actor.id;
  log(g,`🔨 ${actor.name} ofertó ${money(amount)} por ${board[a.propertyId].name}`);
 }else{
  // Quien tiene la mejor oferta no se retira: debe esperar a que otros pasen o le superen.
  if(a.leader===actor.id)return input;
  a.passed[actor.id]=true;log(g,`${actor.name} se retiró de la subasta`);
 }
 const remaining=g.players.filter(z=>!z.bankrupt&&!a.passed[z.id]);
 if(remaining.length===0||(a.leader&&remaining.length===1&&remaining[0].id===a.leader))finishAuction();
 g.revision++;return g;
}
// Compatibilidad con salas de versiones previas, sin adjudicaciones manuales incorrectas.
if(action.type==='auctionClose'&&g.phase==='auction'&&g.auction&&action.playerId===p.id){
 const a=g.auction,remaining=g.players.filter(z=>!z.bankrupt&&!a.passed?.[z.id]);
 if(remaining.length===0||(a.leader&&remaining.length===1&&remaining[0].id===a.leader)){finishAuction();g.revision++;return g}
 return input;
}
if(action.type==='tradeOffer'&&g.phase!=='auction'&&!g.trade){let t=action.trade;if(!t||action.playerId!==p.id||t.to===actor.id)return input;let target=g.players.find(x=>x.id===t.to&&!x.bankrupt);let give=Number(t.give),take=Number(t.take),pay=Math.floor(Number(t.pay||0)),receive=Math.floor(Number(t.receive||0));if(!target||!Number.isInteger(give)||!Number.isInteger(take)||!Number.isFinite(pay)||!Number.isFinite(receive)||pay<0||receive<0||pay>actor.cash||receive>target.cash||!(g.properties[give]?.owner===actor.id||give===-1)||!(g.properties[take]?.owner===target.id||take===-1)||give===-1&&take===-1&&pay===0&&receive===0)return input;const clear=id=>id===-1||g.properties[id]?.houses===0&&groupFor(id).every(i=>!g.properties[i]?.houses);if(!clear(give)||!clear(take))return input;g.trade={from:actor.id,to:target.id,give,take,pay,receive};log(g,`🤝 ${actor.name} envió una propuesta a ${target.name}`);g.revision++;return g}
if((action.type==='tradeAccept'||action.type==='tradeReject')&&g.trade){let t=g.trade;if(action.playerId!==t.to&&!(action.type==='tradeReject'&&action.playerId===t.from))return input;if(action.type==='tradeAccept'){let sender=g.players.find(x=>x.id===t.from),target=g.players.find(x=>x.id===t.to);const valid=sender&&!sender.bankrupt&&target&&!target.bankrupt&&sender.cash>=t.pay&&target.cash>=t.receive&&(t.give===-1||g.properties[t.give]?.owner===sender.id)&&(t.take===-1||g.properties[t.take]?.owner===target.id)&&[t.give,t.take].every(id=>id===-1||g.properties[id]?.houses===0&&groupFor(id).every(i=>!g.properties[i]?.houses));if(!valid){g.trade=null;log(g,'La propuesta ya no es válida');g.revision++;return g}sender.cash+=t.receive-t.pay;target.cash+=t.pay-t.receive;if(t.give!==-1)g.properties[t.give].owner=target.id;if(t.take!==-1)g.properties[t.take].owner=sender.id;log(g,`🤝 ${sender.name} y ${target.name} intercambiaron propiedades y dinero`)}else log(g,'Propuesta de intercambio rechazada');g.trade=null;g.revision++;return g}
if(action.playerId!==p.id)return input;
if(action.type==='roll'&&g.phase==='roll'){let a=1+Math.floor(Math.random()*6),b=1+Math.floor(Math.random()*6);g.dice=[a,b];if(p.jail){
 if(a===b){p.jail=0;p.jailAttempts=0;log(g,`${p.name} sacó dobles y salió de la comisaría`);let old=p.pos;p.pos=(p.pos+a+b)%40;if(p.pos<old)p.cash+=200;g.phase='end';resolve(g,p)}
 else{p.jailAttempts=(p.jailAttempts||0)+1;if(p.jailAttempts>=3){payBank(g,p,50,true);p.jail=0;p.jailAttempts=0;notify(g,'jailFee',p,{amount:50});log(g,`${p.name} agotó sus 3 intentos y pagó ${money(50)} para salir`);let old=p.pos;p.pos=(p.pos+a+b)%40;if(p.pos<old)p.cash+=200;g.phase='end';if(!p.bankrupt)resolve(g,p)}else{g.phase='end';notify(g,'jailTry',p,{attempt:p.jailAttempts});log(g,`${p.name} no sacó dobles. Intento ${p.jailAttempts}/3`)}}
 }else{let old=p.pos;p.pos=(p.pos+a+b)%40;if(p.pos<old){p.cash+=200;log(g,`${p.name} cobró ${money(200)} por pasar por SALIDA`)}log(g,`${p.name} sacó ${a} y ${b} y llegó a ${board[p.pos].name}`);g.phase='end';resolve(g,p)}}
else if(action.type==='payJail'&&g.phase==='roll'&&p.jail&&p.cash>=50){payBank(g,p,50,true);p.jail=0;p.jailAttempts=0;notify(g,'jailFee',p,{amount:50});log(g,`${p.name} pagó ${money(50)} para salir de la comisaría`)}
else if(action.type==='ackEvent'&&g.lastEvent&&g.lastEvent.playerId===p.id){g.lastEvent=null}
else if(action.type==='ackCard'&&g.lastCard&&g.lastCard.playerId===p.id){g.lastCard=null}
else if(action.type==='buy'&&g.phase==='decision'){let b=board[p.pos];if(!owns(g,p.pos)&&p.cash>=b.price){p.cash-=b.price;g.properties[p.pos]={owner:p.id,houses:0,mortgaged:false};log(g,`${p.name} compró ${b.name}`);g.lastEvent=null;g.phase='end'}}
else if(action.type==='skip'&&g.phase==='decision'){g.lastEvent=null;g.phase='auction';g.auction={propertyId:p.pos,highest:0,leader:null,passed:{},serial:(g.auctionSerial||0)+1};g.auctionSerial=g.auction.serial;log(g,`🔨 Subasta abierta: ${board[p.pos].name}`)}
else if(action.type==='end'&&g.phase==='end'){next(g)}
else if(action.type==='build'&&g.phase!=='finished'){let id=Number(action.id),b=board[id],pr=g.properties[id],cost=Math.round(b.price*.5);if(pr?.owner===p.id&&b.kind==='property'&&pr.houses<5&&p.cash>=cost&&!pr.mortgaged&&groupFor(id).every(i=>g.properties[i]?.owner===p.id&&!g.properties[i]?.mortgaged)&&groupFor(id).every(i=>(g.properties[i]?.houses||0)>=pr.houses)){p.cash-=cost;pr.houses++;log(g,`${p.name} construyó en ${b.name} (${pr.houses===5?'hotel':pr.houses+' casas'})`)}}
else if(action.type==='mortgage'&&g.phase!=='finished'){let id=Number(action.id),pr=g.properties[id],b=board[id];if(pr?.owner===p.id&&pr.houses===0&&groupFor(id).every(i=>!g.properties[i]?.houses)){if(pr.mortgaged&&p.cash>=Math.ceil(b.price*.55)){p.cash-=Math.ceil(b.price*.55);pr.mortgaged=false;log(g,`${p.name} levantó la hipoteca de ${b.name}`)}else if(!pr.mortgaged){p.cash+=Math.floor(b.price*.5);pr.mortgaged=true;log(g,`${p.name} hipotecó ${b.name}`)}}}
else return input;g.revision++;return g}
