const fs=require('fs'),path=require('path');
const DIST=path.join(__dirname,'..','dist');
const TOPICS=new Set(['No Se Que Cenar','Que Cenar Hoy','Comida Barata','Cena Rapida']);
function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')}
function norm(s){return String(s).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase()}
function hash(s){let h=2166136261;for(const c of s)h=((h^c.charCodeAt(0))*16777619)>>>0;return h>>>0}
const LIB=[
 ['Qué debería destacar','Empieza por identificar qué debería destacar en __FOOD__: el ingrediente principal, la técnica, la textura o una combinación concreta. Busca establecimientos que expliquen claramente su especialidad.'],
 ['La carta da pistas','Revisa cómo aparece __FOOD__ en la carta. Descripciones concretas de ingredientes, preparación y acompañamientos permiten comparar mejor que una foto o un nombre llamativo.'],
 ['Opiniones que sirven','Para valorar __FOOD__, busca reseñas que cuenten qué pidió la persona y cómo encontró el sabor, la textura, la cantidad y el servicio.'],
 ['Piensa en tu plan','No existe un único sitio perfecto para __FOOD__. Decide primero si quieres una versión ligera, abundante, tradicional, creativa, para llevar o para comer tranquilamente.'],
 ['Precio con sentido','Compara el coste de __FOOD__ con la ración, los ingredientes, los acompañamientos y la elaboración. El precio aislado dice poco.'],
 ['La preparación importa','Dos locales pueden ofrecer __FOOD__ de formas muy diferentes. Temperatura, punto de cocción, tiempos y tratamiento de los ingredientes cambian el resultado.'],
 ['Especialidad frente a variedad','Si un establecimiento destaca especialmente por __FOOD__, comprueba qué versión ofrece y qué la diferencia. Una especialidad bien trabajada puede valer más que una carta enorme.'],
 ['Los pequeños detalles','Con __FOOD__, detalles como la proporción de ingredientes, el tamaño, los acompañamientos o la forma de servir pueden cambiar bastante la experiencia.'],
 ['Tradicional o diferente','Antes de elegir __FOOD__, decide si quieres una interpretación clásica o una propuesta más moderna. Esa preferencia reduce mucho la búsqueda.'],
 ['Hazlo práctico','Si vas a comer __FOOD__ y tienes poco tiempo, prioriza distancia, horario y comentarios sobre la rapidez. Si tienes margen, puedes valorar locales más especializados.'],
 ['Compara dos opciones','Elige dos lugares que preparen __FOOD__ y compara ingredientes, estilo, precio, ubicación y opiniones recientes. Dos alternativas bien escogidas suelen ser suficientes.'],
 ['El acompañamiento cuenta','Guarniciones, salsas, bebidas y postres pueden cambiar tanto el sabor como el precio final de __FOOD__. Comprueba qué incluye realmente el pedido.']
];
const LOCAL=[
 c=>`En ${c}, además de la valoración general, merece la pena revisar comentarios recientes de personas que hayan pedido el plato concreto y comprobar si sigue disponible en la carta.`,
 c=>`Si estás buscando esta opción en ${c}, compara primero establecimientos de zonas que te resulten cómodas y después céntrate en cómo describen y preparan el plato.`,
 c=>`La oferta puede variar dentro de ${c}; por eso conviene comprobar horarios, carta actual y disponibilidad antes de desplazarte.`,
 c=>`Para una elección en ${c}, la cercanía puede ser decisiva si vas con prisa, mientras que una mayor distancia puede compensar si buscas una preparación especializada.`,
 c=>`Las opiniones recientes de clientes de ${c} ayudan especialmente cuando quieres saber cómo llega el plato actualmente y no basarte en experiencias antiguas.`
];
const MOMENT={desayuno:'para empezar el día',almuerzo:'para almorzar',merienda:'para una pausa de la tarde',cena:'para cerrar el día'};
function parts(file){const a=file.split(path.sep);const i=a.length-1;return {food:a[i-1]||'',moment:a[i-2]||'',city:a[i-3]||''}}
function human(s){return s.replace(/-/g,' ').replace(/\b\w/g,c=>c.toUpperCase())}
function findGuideStart(html){const candidates=[...html.matchAll(/<section\b[^>]*class=["'][^"']*food-guide[^"']*["'][^>]*>/gi)];if(candidates.length)return candidates[candidates.length-1].index;const m=html.search(/<h[1-3][^>]*>\s*(?:Guía específica de|Guía para elegir dónde comer|Cómo elegir un buen lugar)/i);return m>=0?html.lastIndexOf('<section',m):-1}
function run(){if(!fs.existsSync(DIST))return;let changed=0;for(const file of fs.readdirSync(DIST,{recursive:true})){
 if(!file.endsWith('.html'))continue;const {food,moment,city}=parts(file);if(!food||!city||!MOMENT[moment])continue;
 const foodText=human(food),cityText=human(city);if(TOPICS.has(foodText))continue;
 const p=path.join(DIST,file);let html=fs.readFileSync(p,'utf8');const start=findGuideStart(html);if(start<0)continue;const end=html.indexOf('</section>',start);if(end<0)continue;
 const seed=hash(norm(foodText)+'|'+norm(cityText)+'|'+moment);const a=LIB[seed%LIB.length],b=LIB[(seed>>>4)%LIB.length],c=LIB[(seed>>>8)%LIB.length];
 const fill=x=>x.replace(/__FOOD__/g,foodText);const local=LOCAL[(seed>>>12)%LOCAL.length](cityText);
 const intro=`<p>Elegir dónde comer ${esc(foodText)} ${esc(MOMENT[moment])} en ${esc(cityText)} empieza por saber qué tipo de experiencia buscas. Esta guía combina criterios del plato con detalles prácticos de la zona.</p>`;
 const section=`<section class="food-guide final-guide"><div class="guide-kicker">Guía de ${esc(foodText)}</div><h2>Dónde comer ${esc(foodText)} ${esc(MOMENT[moment])} en ${esc(cityText)}</h2>${intro}<h3>${a[0]}</h3><p>${esc(fill(a[1]))}</p><h3>${b[0]}</h3><p>${esc(fill(b[1]))}</p><h3>${c[0]}</h3><p>${esc(fill(c[1]))}</p><h3>Una pista para elegir en ${esc(cityText)}</h3><p>${esc(local)}</p><h3>Antes de decidir</h3><p>Comprueba la carta actual, el horario y las opiniones recientes. Si tienes dos opciones, compara qué versión de ${esc(foodText)} ofrece cada una y elige la que encaje mejor con tu plan de ${esc(moment)}.</p></section>`;
 html=html.slice(0,start)+section+html.slice(end+10);fs.writeFileSync(p,html);changed++;
 }
 console.log(`[final-guide-rewriter] ${changed} guías reescritas por comida + ciudad + momento.`);
}
if(require.main===module)run();module.exports={run};