const names=['SALIDA','Ancón','Comunidad','Santa Rosa','Impuesto municipal','Metropolitano','Puente Piedra','Suerte limeña','Carabayllo','Comas','COMISARÍA','Independencia','Empresa de luz','Los Olivos','San Martín de Porres','Línea 1','Rímac','Comunidad','Breña','Pueblo Libre','DESCANSO','Jesús María','Suerte limeña','Lince','Magdalena','Corredor Azul','San Miguel','San Borja','Empresa de agua','Surquillo','A COMISARÍA','Barranco','Chorrillos','Comunidad','La Molina','Taxi amarillo','Surco','Impuesto predial','Miraflores','San Isidro'];
const colors=['#7b86a1','#8d6be7','#8d6be7','#8d6be7','#7b86a1','#23c7bb','#8d6be7','#ffb84c','#8d6be7','#8d6be7','#7b86a1','#48b5ff','#7b86a1','#48b5ff','#48b5ff','#23c7bb','#ff8b5d','#ffb84c','#ff8b5d','#ff8b5d','#7b86a1','#f2cf57','#ffb84c','#f2cf57','#f2cf57','#23c7bb','#6fe19d','#6fe19d','#7b86a1','#6fe19d','#7b86a1','#f26d9b','#f26d9b','#ffb84c','#f26d9b','#23c7bb','#f16b55','#7b86a1','#f16b55','#e9ba58'];
export const board=names.map((name,i)=>({id:i,name,color:colors[i],kind:[0,10,20,30].includes(i)?'corner':[2,17,33].includes(i)?'community':[7,22].includes(i)?'chance':[4,37].includes(i)?'tax':[5,15,25,35].includes(i)?'transport':[12,28].includes(i)?'utility':'property',price:[0,60,0,60,0,200,100,0,100,120,0,140,150,140,160,200,180,0,180,200,0,220,0,220,240,200,260,260,150,280,0,300,300,0,320,200,350,0,400,450][i]}));
export const tokens=['🚕','🛵','🚌','🚲','🚗','🚁'];
export const money=n=>'S/ '+Math.round(n).toLocaleString('es-PE');
export function newGame(players){return {players:players.map((p,i)=>({id:p.id,name:p.name,token:tokens[i],pos:0,cash:1500,jail:0,bankrupt:false})),turn:0,phase:'roll',properties:{},dice:[1,1],doubleCount:0,log:['¡Bienvenidos a Lima City!'],winner:null,revision:0};}
const log=(g,t)=>{g.log=[t,...g.log].slice(0,18)};
const next=(g)=>{let n=g.turn;do{n=(n+1)%g.players.length}while(g.players[n].bankrupt&&n!==g.turn);g.turn=n;g.phase='roll';g.doubleCount=0};
const owns=(g,id)=>g.properties[id];
const rent=(g,id)=>{let b=board[id],pr=owns(g,id);if(!pr)return 0;if(b.kind==='transport')return 25*Math.pow(2,Object.keys(g.properties).filter(k=>board[k].kind==='transport'&&g.properties[k].owner===pr.owner).length-1);if(b.kind==='utility')return 35;return Math.round(b.price*(.10+pr.houses*.45));};
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
 if(card.type==='jail'){p.pos=10;p.jail=1;log(g,`${p.name} fue a la comisaría`)}
 else if(card.type==='move'||card.type==='back'){
  const old=p.pos;const target=card.type==='back'?(p.pos-card.steps+40)%40:card.target;
  p.pos=target;if(card.type==='move'&&target<=old){p.cash+=200;log(g,`${p.name} cobró ${money(200)} por pasar por SALIDA`)}
  log(g,`${p.name} avanzó a ${board[p.pos].name}`);resolve(g,p,false)
 }else if(card.type==='collectEach'||card.type==='payEach'){
  for(const other of g.players){if(other.id===p.id||other.bankrupt)continue;if(card.type==='collectEach')transfer(g,other.id,p.id,card.amount);else transfer(g,p.id,other.id,card.amount)}
  log(g,`${p.name}: ${card.title}`)
 }else{const amt=card.amount;if(amt>=0)p.cash+=amt;else transfer(g,p.id,null,-amt);log(g,`${card.title}: ${amt>=0?'+':''}${money(amt)}`)}
}
function resolve(g,p,allowCard=true){let b=board[p.pos],pr=owns(g,p.pos);if(b.kind==='property'||b.kind==='transport'||b.kind==='utility'){if(pr){if(pr.owner!==p.id&&!pr.mortgaged){let r=rent(g,p.pos);transfer(g,p.id,pr.owner,r);log(g,`${p.name} pagó ${money(r)} por ${b.name}`)}}else{g.phase='decision';log(g,`${p.name} puede comprar ${b.name} por ${money(b.price)}`)}}else if(b.kind==='tax'){let v=p.pos===4?100:150;transfer(g,p.id,null,v);log(g,`${p.name} pagó ${money(v)} de impuestos`)}else if((b.kind==='chance'||b.kind==='community')&&allowCard){let deck=b.kind==='chance'?'chance':'community';let card=draw(g,deck);applyCard(g,p,card);g.lastCard={...card,deck,playerId:p.id,playerName:p.name,revision:(g.lastCard?.revision||0)+1};}else if(p.pos===30){p.pos=10;p.jail=1;log(g,`${p.name} fue enviado a la comisaría`)}else if(p.pos===20){p.cash+=50;log(g,`${p.name} recibió ${money(50)} por descansar`)}}
export function apply(input,action){let g=structuredClone(input);g.properties ??= {};g.dice ??= [1,1];g.log ??= [];if(g.winner)return g;let p=g.players[g.turn];if(action.playerId!==p.id)return input;
if(action.type==='roll'&&g.phase==='roll'){let a=1+Math.floor(Math.random()*6),b=1+Math.floor(Math.random()*6);g.dice=[a,b];if(p.jail){p.jail=0;log(g,`${p.name} salió de la comisaría y pierde este turno`);g.phase='end'}else{let old=p.pos;p.pos=(p.pos+a+b)%40;if(p.pos<old){p.cash+=200;log(g,`${p.name} cobró ${money(200)} por pasar por SALIDA`)}log(g,`${p.name} sacó ${a} y ${b} y llegó a ${board[p.pos].name}`);g.phase='end';resolve(g,p)}}
else if(action.type==='buy'&&g.phase==='decision'){let b=board[p.pos];if(!owns(g,p.pos)&&p.cash>=b.price){p.cash-=b.price;g.properties[p.pos]={owner:p.id,houses:0,mortgaged:false};log(g,`${p.name} compró ${b.name}`);g.phase='end'}}
else if(action.type==='skip'&&g.phase==='decision'){g.phase='end';log(g,`${p.name} no compró ${board[p.pos].name}`)}
else if(action.type==='end'&&g.phase==='end'){next(g)}
else if(action.type==='build'&&g.phase!=='finished'){let id=Number(action.id),b=board[id],pr=g.properties[id],cost=Math.round(b.price*.5);if(pr?.owner===p.id&&b.kind==='property'&&pr.houses<5&&p.cash>=cost&&!pr.mortgaged){p.cash-=cost;pr.houses++;log(g,`${p.name} construyó en ${b.name} (${pr.houses===5?'hotel':pr.houses+' casas'})`)}}
else if(action.type==='mortgage'&&g.phase!=='finished'){let id=Number(action.id),pr=g.properties[id],b=board[id];if(pr?.owner===p.id&&pr.houses===0){if(pr.mortgaged&&p.cash>=Math.ceil(b.price*.55)){p.cash-=Math.ceil(b.price*.55);pr.mortgaged=false;log(g,`${p.name} levantó la hipoteca de ${b.name}`)}else if(!pr.mortgaged){p.cash+=Math.floor(b.price*.5);pr.mortgaged=true;log(g,`${p.name} hipotecó ${b.name}`)}}}
else return input;g.revision++;return g}
