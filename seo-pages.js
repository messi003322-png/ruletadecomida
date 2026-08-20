const fs = require('fs');
const path = require('path');

const OUT = path.join(process.cwd(), 'dist');
const SITE = 'https://www.ruletadecomida.es';
const pages = [
  ['que-comer-hoy','¿Qué comer hoy? Ideas para elegir rápido','Descubre ideas para decidir qué comer hoy sin darle mil vueltas. Usa la ruleta de comida y encuentra una opción en segundos.','Cuando no sabes qué comer, explora ideas y vuelve a la ruleta para dejar que el azar elija por ti.'],
  ['ideas-de-comida','Ideas de comida para cualquier día','Ideas de comida para inspirarte cuando no sabes qué preparar o dónde comer.','Busca inspiración según tus ganas y el momento. La ruleta convierte la indecisión en una elección sencilla.'],
  ['que-comer-esta-noche','¿Qué comer esta noche?','Ideas para decidir qué comer esta noche rápidamente.','Explora posibilidades y utiliza la ruleta para obtener una sugerencia inesperada.'],
  ['comida-rapida','Ideas de comida rápida','Opciones e inspiración para cuando buscas algo rápido de preparar o elegir.','Prueba diferentes opciones y deja que la ruleta cambie tu rutina.'],
  ['comida-saludable','Ideas de comida saludable','Inspírate con ideas de comida saludable para variar tus comidas.','Combina tus preferencias con nuevas ideas y opciones para toda la semana.'],
  ['comida-italiana','Comida italiana: ideas para elegir','Pizza, pasta y otras ideas de comida italiana.','Explora opciones conocidas y alternativas para salir de la rutina.'],
  ['comida-mexicana','Comida mexicana: ideas y opciones','Ideas de comida mexicana para cuando buscas sabores intensos.','Tacos, burritos y otras especialidades pueden cambiar tu elección habitual.'],
  ['comida-espanola','Comida española: ideas para comer','Ideas de comida española para descubrir platos tradicionales.','Explora ideas y utiliza la ruleta cuando no quieras decidir manualmente.'],
  ['comida-asiatica','Comida asiática: ideas para descubrir','Inspiración de comida asiática para variar tus elecciones.','Noodles, arroz, sushi y otras especialidades para cambiar de menú.'],
  ['comida-vegetariana','Ideas de comida vegetariana','Ideas vegetarianas para descubrir nuevas combinaciones.','Combina verduras, legumbres, cereales y otras opciones.'],
  ['comida-para-dos','¿Qué comer en pareja?','Ideas para elegir qué comer en pareja cuando no os ponéis de acuerdo.','Probad la ruleta y aceptad el resultado para decidir juntos.'],
  ['comida-para-familias','Ideas de comida para familias','Inspiración para decidir qué comer en familia sin perder tiempo.','Explora diferentes ideas y utiliza la ruleta como punto de partida.']
];
function esc(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function page(item){
 const [slug,title,desc,body]=item; const related=pages.filter(p=>p[0]!==slug).slice(0,6);
 return `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)} | Ruleta de Comida</title><meta name="description" content="${esc(desc)}"><link rel="canonical" href="${SITE}/${slug}/"><meta name="robots" content="index,follow,max-image-preview:large"><meta property="og:title" content="${esc(title)} | Ruleta de Comida"><meta property="og:description" content="${esc(desc)}"><meta property="og:url" content="${SITE}/${slug}/"><meta property="og:type" content="website"><script type="application/ld+json">${JSON.stringify({'@context':'https://schema.org','@type':'WebPage','name':title,'description':desc,'url':`${SITE}/${slug}/`,'isPartOf':{'@type':'WebSite','name':'Ruleta de Comida','url':SITE}})}</script><style>body{font-family:system-ui,-apple-system,Segoe UI,sans-serif;margin:0;color:#1c1917;background:#fafaf9}main{max-width:900px;margin:auto;padding:32px 20px 60px}a{color:#e85d04;text-decoration:none}nav{display:flex;gap:14px;flex-wrap:wrap;margin-bottom:36px}article{background:white;border:1px solid #e7e5e4;border-radius:24px;padding:32px;box-shadow:0 12px 35px rgba(28,25,23,.07)}h1{font-size:clamp(2rem,6vw,3.4rem);line-height:1.05;margin:.2em 0}h2{margin-top:32px}p{font-size:1.08rem;line-height:1.7}.cta{display:inline-block;background:#e85d04;color:white;padding:14px 20px;border-radius:12px;font-weight:700;margin-top:10px}.links{display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:10px}.links a{padding:14px;background:#fff7ed;border-radius:12px}</style></head><body><main><nav><a href="${SITE}/">Ruleta de Comida</a><a href="${SITE}/que-comer-hoy/">Qué comer hoy</a><a href="${SITE}/ideas-de-comida/">Ideas de comida</a></nav><article><p>Ruleta de Comida</p><h1>${esc(title)}</h1><p>${esc(desc)}</p><p>${esc(body)}</p><a class="cta" href="${SITE}/">🎲 Probar la ruleta</a><h2>También te puede interesar</h2><div class="links">${related.map(p=>`<a href="${SITE}/${p[0]}/">${esc(p[1])}</a>`).join('')}</div></article></main></body></html>`;
}
for(const item of pages){const dir=path.join(OUT,item[0]);fs.mkdirSync(dir,{recursive:true});fs.writeFileSync(path.join(dir,'index.html'),page(item),'utf8');}

// La portada existente no depende de una etiqueta </main>: insertamos el hub antes del pie o, como último recurso, antes de </body>.
const home=path.join(OUT,'index.html');
if(fs.existsSync(home)){
 let html=fs.readFileSync(home,'utf8');
 if(!html.includes('seo-hub-title')){
  const cards=pages.map(p=>`<a class="seo-card" href="${SITE}/${p[0]}/"><strong>${esc(p[1])}</strong><span>${esc(p[2])}</span></a>`).join('');
  const hub=`<section class="seo-hub" aria-labelledby="seo-hub-title"><h2 id="seo-hub-title">Más ideas para decidir qué comer</h2><p class="seo-hub-intro">Explora guías de comida y utiliza la ruleta cuando no sepas qué elegir. Encuentra ideas para hoy, esta noche, en pareja, en familia y según el tipo de comida que te apetezca.</p><div class="seo-hub-grid">${cards}</div></section>`;
  const marker=/<footer[\s\S]*?>/i;
  if(marker.test(html)) html=html.replace(marker,hub+'$&');
  else if(/<body[^>]*>/i.test(html)) html=html.replace(/<\/body>/i,hub+'</body>');
  else html += hub;
  fs.writeFileSync(home,html,'utf8');
 }
}

const urls=[];
function walk(dir){for(const e of fs.readdirSync(dir,{withFileTypes:true})){const f=path.join(dir,e.name);if(e.isDirectory())walk(f);else if(e.name.toLowerCase()==='index.html'){const rel=path.relative(OUT,path.dirname(f)).replace(/\\/g,'/');urls.push(rel?`${SITE}/${rel}/`:`${SITE}/`);}}}
walk(OUT);
const unique=[...new Set(urls)].sort();
const xml=['<?xml version="1.0" encoding="UTF-8"?>','<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',...unique.map(u=>`<url><loc>${esc(u)}</loc></url>`),'</urlset>'].join('');
fs.writeFileSync(path.join(OUT,'sitemap.xml'),xml,'utf8');
console.log(`SEO landing pages generated: ${pages.length}; sitemap URLs: ${unique.length}`);
