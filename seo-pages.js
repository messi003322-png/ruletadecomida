const fs = require('fs');
const path = require('path');

const OUT = path.join(process.cwd(), 'dist');
const SITE = 'https://www.ruletadecomida.es';

const pages = [
  ['que-comer-hoy','¿Qué comer hoy? Ideas para elegir rápido','Descubre ideas para decidir qué comer hoy sin darle mil vueltas. Usa la ruleta de comida y encuentra una opción en segundos.','Cuando no sabes qué comer, la mejor opción es tener variedad y decidir rápido. Aquí puedes explorar ideas de comida y volver a la ruleta para dejar que el azar elija por ti.'],
  ['ideas-de-comida','Ideas de comida para cualquier día','Ideas de comida para inspirarte cuando no sabes qué preparar o dónde comer. Explora opciones y deja que la ruleta decida por ti.','Busca inspiración según tus ganas, el momento y el tipo de comida que te apetezca. La ruleta te ayuda a convertir la indecisión en una elección sencilla.'],
  ['que-comer-esta-noche','¿Qué comer esta noche?','¿No sabes qué comer esta noche? Encuentra inspiración rápidamente y usa la ruleta para elegir una opción sin complicarte.','Por la noche muchas veces quieres decidir rápido. Explora diferentes posibilidades y utiliza la ruleta para obtener una sugerencia inesperada.'],
  ['comida-rapida','Ideas de comida rápida','Opciones e inspiración para cuando buscas algo rápido de preparar o elegir. Descubre nuevas ideas con Ruleta de Comida.','La comida rápida no tiene por qué significar elegir siempre lo mismo. Prueba diferentes opciones y deja que la ruleta cambie tu rutina.'],
  ['comida-saludable','Ideas de comida saludable','Inspírate con ideas de comida saludable y descubre nuevas opciones para variar tus comidas.','Combina tus preferencias con nuevas ideas y crea una lista de opciones que puedas alternar durante la semana.'],
  ['comida-italiana','Comida italiana: ideas para elegir','Pizza, pasta y otras ideas de comida italiana para cuando te apetece un sabor mediterráneo.','Si hoy te apetece comida italiana, explora opciones conocidas y descubre alternativas para salir de la rutina.'],
  ['comida-mexicana','Comida mexicana: ideas y opciones','Ideas de comida mexicana para cuando buscas sabores intensos y quieres probar algo diferente.','Tacos, burritos y otras especialidades pueden convertirse en una forma divertida de cambiar tu elección habitual.'],
  ['comida-espanola','Comida española: ideas para comer','Ideas de comida española para descubrir platos tradicionales y opciones para cualquier ocasión.','La gastronomía española ofrece muchísimas posibilidades. Explora ideas y utiliza la ruleta cuando no quieras decidir manualmente.'],
  ['comida-asiatica','Comida asiática: ideas para descubrir','Inspiración de comida asiática para variar tus elecciones y descubrir nuevos sabores.','Desde noodles y arroz hasta sushi y otras especialidades, hay muchas opciones para cambiar de menú.'],
  ['comida-vegetariana','Ideas de comida vegetariana','Ideas vegetarianas para descubrir nuevas combinaciones y variar tus comidas.','Una alimentación vegetariana permite combinar verduras, legumbres, cereales y muchas otras opciones. Usa estas ideas como punto de partida.'],
  ['comida-para-dos','¿Qué comer en pareja?','Ideas para elegir qué comer en pareja cuando no os ponéis de acuerdo. Deja que la ruleta decida.','Cuando dos personas quieren cosas diferentes, una elección aleatoria puede ser la solución más divertida. Probad la ruleta y aceptad el resultado.'],
  ['comida-para-familias','Ideas de comida para familias','Inspiración para decidir qué comer en familia sin perder tiempo pensando en opciones.','Para una familia puede ser difícil coincidir. Explora diferentes ideas y utiliza la ruleta como punto de partida para decidir juntos.']
];

function esc(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function page(item){
  const [slug,title,desc,body]=item;
  const related=pages.filter(p=>p[0]!==slug).slice(0,6);
  return `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)} | Ruleta de Comida</title><meta name="description" content="${esc(desc)}"><link rel="canonical" href="${SITE}/${slug}/"><meta name="robots" content="index,follow,max-image-preview:large"><meta property="og:title" content="${esc(title)} | Ruleta de Comida"><meta property="og:description" content="${esc(desc)}"><meta property="og:url" content="${SITE}/${slug}/"><meta property="og:type" content="website"><script type="application/ld+json">${JSON.stringify({'@context':'https://schema.org','@type':'WebPage','name':title,'description':desc,'url':`${SITE}/${slug}/`,'isPartOf':{'@type':'WebSite','name':'Ruleta de Comida','url':SITE}})}</script><style>body{font-family:system-ui,-apple-system,Segoe UI,sans-serif;margin:0;color:#1c1917;background:#fafaf9}main{max-width:900px;margin:auto;padding:32px 20px 60px}a{color:#e85d04;text-decoration:none}nav{display:flex;gap:14px;flex-wrap:wrap;margin-bottom:36px}article{background:white;border:1px solid #e7e5e4;border-radius:24px;padding:32px;box-shadow:0 12px 35px rgba(28,25,23,.07)}h1{font-size:clamp(2rem,6vw,3.4rem);line-height:1.05;margin:.2em 0}h2{margin-top:32px}p{font-size:1.08rem;line-height:1.7}.cta{display:inline-block;background:#e85d04;color:white;padding:14px 20px;border-radius:12px;font-weight:700;margin-top:10px}.links{display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:10px}.links a{padding:14px;background:#fff7ed;border-radius:12px}</style></head><body><main><nav><a href="${SITE}/">Ruleta de Comida</a><a href="${SITE}/que-comer-hoy/">Qué comer hoy</a><a href="${SITE}/ideas-de-comida/">Ideas de comida</a></nav><article><p>Ruleta de Comida</p><h1>${esc(title)}</h1><p>${esc(desc)}</p><p>${esc(body)}</p><a class="cta" href="${SITE}/">🎲 Probar la ruleta</a><h2>También te puede interesar</h2><div class="links">${related.map(p=>`<a href="${SITE}/${p[0]}/">${esc(p[1])}</a>`).join('')}</div></article></main></body></html>`;
}

for(const item of pages){
  const dir=path.join(OUT,item[0]);
  fs.mkdirSync(dir,{recursive:true});
  fs.writeFileSync(path.join(dir,'index.html'),page(item),'utf8');
}

const home=path.join(OUT,'index.html');
if(fs.existsSync(home)){
  let html=fs.readFileSync(home,'utf8');
  if(!html.includes('seo-hub')){
    const cards=pages.map(p=>`<a class="seo-card" href="${SITE}/${p[0]}/"><strong>${esc(p[1])}</strong><span>${esc(p[2])}</span></a>`).join('');
    const hub=`<section class="seo-hub" aria-labelledby="seo-hub-title"><h2 id="seo-hub-title">Más ideas para decidir qué comer</h2><p class="seo-hub-intro">Explora guías de comida y utiliza la ruleta cuando no sepas qué elegir. Encuentra ideas para hoy, esta noche, en pareja, en familia y según el tipo de comida que te apetezca.</p><div class="seo-hub-grid">${cards}</div></section>`;
    html=html.replace(/<\/main>/i,hub+'</main>');
    fs.writeFileSync(home,html,'utf8');
  }
}

const urls=[];
function walk(dir){for(const e of fs.readdirSync(dir,{withFileTypes:true})){const f=path.join(dir,e.name);if(e.isDirectory())walk(f);else if(e.name.toLowerCase()==='index.html')urls.push(`${SITE}/${path.relative(OUT,path.dirname(f)).replace(/\\/g,'/')}`.replace(/\/$/,'')+'/');}}
walk(OUT);
const unique=[...new Set(urls)].sort();
const xml=['<?xml version="1.0" encoding="UTF-8"?>','<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',...unique.map(u=>`<url><loc>${esc(u)}</loc></url>`),'</urlset>'].join('');
fs.writeFileSync(path.join(OUT,'sitemap.xml'),xml,'utf8');
console.log(`SEO landing pages generated: ${pages.length}; sitemap URLs: ${unique.length}`);
