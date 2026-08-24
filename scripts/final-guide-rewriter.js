const fs=require('fs'),path=require('path');
const DIST=path.join(__dirname,'..','dist');
const TOPICS=new Set(['no se que cenar','que cenar hoy','comida barata','cena rapida']);
function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')}
function norm(s){return String(s).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase()}
function hash(s){let h=2166136261;for(const c of s)h=((h^c.charCodeAt(0))*16777619)>>>0;return h>>>0}
const LIB=[
 ['Elige el estilo que buscas','Antes de comparar locales, decide qué versión de __FOOD__ te apetece. Puede ser tradicional, ligera, abundante, casera, creativa o pensada para comer rápido.'],
 ['La carta da pistas','Lee la descripción de __FOOD__ y fíjate en ingredientes, preparación y acompañamientos. Una carta concreta permite saber mejor qué vas a recibir.'],
 ['Busca opiniones concretas','Las reseñas más útiles son las que hablan del plato: sabor, textura, cantidad, temperatura y presentación. Las opiniones recientes tienen más valor que una puntuación aislada.'],
 ['Mira cómo encaja en tu plan','Si quieres __FOOD__ sin perder tiempo, prioriza distancia y servicio. Si buscas disfrutar con calma, valora también ambiente y especialización.'],
 ['Compara el precio de verdad','No mires solo el número. Relaciona el precio de __FOOD__ con la cantidad, los ingredientes, los extras y la elaboración.'],
 ['La preparación cambia el resultado','Dos establecimientos pueden ofrecer __FOOD__ de maneras muy diferentes. La cocción, el punto, la temperatura y los condimentos pueden cambiar por completo el plato.'],
 ['Una especialidad puede marcar la diferencia','Si un local centra parte de su propuesta en __FOOD__, revisa qué versión prepara y qué técnica o ingrediente la distingue.'],
 ['Fíjate en los pequeños detalles','En __FOOD__, la proporción entre ingredientes, el acompañamiento y la forma de servirlo pueden importar tanto como el ingrediente principal.'],
 ['Tradicional o moderno','Decide si prefieres una receta reconocible o una interpretación diferente de __FOOD__. Tenerlo claro hace mucho más fácil comparar establecimientos.'],
 ['Si vas con prisa','Para comer __FOOD__ rápidamente, comprueba horarios, distancia, servicio para llevar y comentarios sobre los tiempos de espera.'],
 ['Quédate con dos opciones','Selecciona dos establecimientos que preparen __FOOD__ y compara carta, estilo, precio, ubicación y reseñas recientes antes de decidir.'],
 ['No olvides los acompañamientos','Salsas, guarniciones, bebidas y extras pueden cambiar tanto la experiencia como el precio final de __FOOD__. Comprueba qué está incluido.']
];
const LOCAL=[
 c=>`En ${c}, comprueba la carta actual y los comentarios recientes antes de desplazarte, porque la oferta y los horarios pueden cambiar.`,
 c=>`Si buscas esta opción en ${c}, empieza por zonas que te resulten cómodas y después compara la preparación concreta de cada establecimiento.`,
 c=>`Dentro de ${c} puede haber estilos muy distintos, así que conviene comparar la especialidad del local en lugar de quedarse solo con la valoración general.`,
 c=>`Para elegir en ${c}, la cercanía gana importancia si tienes poco tiempo; si buscas una elaboración concreta, puede compensar ampliar la zona de búsqueda.`,
 c=>`Las reseñas recientes de ${c} pueden ayudarte a comprobar cómo está funcionando actualmente el servicio y cómo llega el plato.`
];
const MOMENT={desayuno:'para desayunar',almuerzo:'para almorzar',merienda:'para la merienda',cena:'para cenar'};
function human(s){return s.replace(/-/g,' ').replace(/\b\w/g,c=>c.toUpperCase())}
function guideSectionRange(html){
 const re=/<section\b[^>]*>[\s\S]*?<\/section>/gi;let m;
 while((m=re.exec(html))){const t=m[0].replace(/<[^>]+>/g,' ');if(/Guía específica de|Cómo elegir un buen lugar donde comer|Esta guía reúne criterios pensados/i.test(t))return {start:m.index,end:m.index+m[0].length};}
 return null;
}
function run(){if(!fs.existsSync(DIST))throw new Error('dist no existe');let changed=0;
 for(const rel of fs.readdirSync(DIST,{recursive:true})){
  if(!rel.endsWith('.html'))continue;
  const parts=rel.split(path.sep);if(parts.length!==4||parts[3]!=='index.html')continue;
  const [city,moment,food]=parts;if(!MOMENT[moment])continue;
  const foodText=human(food),cityText=human(city);if(TOPICS.has(norm(foodText)))continue;
  const file=path.join(DIST,rel);let html=fs.readFileSync(file,'utf8');const range=guideSectionRange(html);if(!range)continue;
  const seed=hash(norm(foodText)+'|'+norm(cityText)+'|'+moment);const a=LIB[seed%LIB.length],b=LIB[(seed>>>4)%LIB.length],c=LIB[(seed>>>8)%LIB.length];const fill=x=>x.replace(/__FOOD__/g,foodText);const local=LOCAL[(seed>>>12)%LOCAL.length](cityText);
  const section=`<section class="food-guide final-guide"><div class="guide-kicker">Guía de ${esc(foodText)}</div><h2>Dónde comer ${esc(foodText)} ${esc(MOMENT[moment])} en ${esc(cityText)}</h2><p>Encontrar ${esc(foodText)} ${esc(MOMENT[moment])} en ${esc(cityText)} es más sencillo si primero decides qué versión quieres y después comparas cómo la prepara cada establecimiento.</p><h3>${a[0]}</h3><p>${esc(fill(a[1]))}</p><h3>${b[0]}</h3><p>${esc(fill(b[1]))}</p><h3>${c[0]}</h3><p>${esc(fill(c[1]))}</p><h3>Una pista para elegir en ${esc(cityText)}</h3><p>${esc(local)}</p><h3>Última comprobación</h3><p>Antes de ir, revisa la carta, el horario y las opiniones más recientes. Así podrás escoger la opción de ${esc(foodText)} que mejor encaje con tu momento y tu presupuesto.</p></section>`;
  html=html.slice(0,range.start)+section+html.slice(range.end);fs.writeFileSync(file,html);changed++;
 }
 console.log(`[final-guide-rewriter] ${changed} guías reescritas por comida + ciudad + momento.`);
}
if(require.main===module)run();module.exports={run};