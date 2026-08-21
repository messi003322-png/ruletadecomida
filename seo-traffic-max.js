const fs=require('fs');
const path=require('path');
const OUT=path.join(process.cwd(),'dist');
const SITE='https://www.ruletadecomida.es';
if(!fs.existsSync(OUT)) throw new Error('dist not found');

function esc(v){return String(v).replace(/[&<>\"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]));}
function walk(dir,cb){for(const e of fs.readdirSync(dir,{withFileTypes:true})){const f=path.join(dir,e.name);if(e.isDirectory())walk(f,cb);else if(/\.html$/i.test(e.name))cb(f);}}
function pagePath(file){const rel=path.relative(OUT,file).replace(/\\/g,'/');if(rel.toLowerCase()==='index.html')return '/';return '/'+rel.replace(/\/index\.html$/i,'').replace(/\.html$/i,'')+'/';}
function labelFromPath(p){const s=p.replace(/^\//,'').replace(/\/$/,'');if(!s)return 'Inicio';return s.split('/').pop().replace(/[-_]+/g,' ').replace(/\b\w/g,c=>c.toUpperCase());}
function injectHead(html,file){
 if(!/<\/head>/i.test(html)) return html;
 const p=pagePath(file);
 const crumbs=[{name:'Inicio',url:SITE+'/'}];
 if(p!=='/') crumbs.push({name:labelFromPath(p),url:SITE+p});
 const breadcrumb={'@context':'https://schema.org','@type':'BreadcrumbList','itemListElement':crumbs.map((c,i)=>({'@type':'ListItem',position:i+1,name:c.name,item:c.url}))};
 let out=html.replace(/<script\s+type=["']application\/ld\+json["'][^>]*>\s*\{\s*"@context"\s*:\s*"https:\/\/schema\.org"\s*,\s*"@type"\s*:\s*"BreadcrumbList"[\s\S]*?<\/script>\s*/gi,'');
 out=out.replace(/<\/head>/i,`<script type="application/ld+json">${JSON.stringify(breadcrumb)}</script>\n</head>`);
 if(fs.existsSync(path.join(OUT,'logo.png')) && !/<link[^>]+rel=["']icon["']/i.test(out)){
   out=out.replace(/<\/head>/i,'<link rel="icon" href="/logo.png" type="image/png">\n<link rel="apple-touch-icon" href="/logo.png">\n</head>');
 }
 return out;
}

const featured=[
 ['Pizza','/pizza/','Ideas para elegir pizza y decidir rápido qué pedir o preparar.'],
 ['Sushi','/sushi/','Guía para elegir sushi cuando no sabes qué comer.'],
 ['Cena rápida','/cena-rapida/','Opciones para resolver la cena en pocos minutos.'],
 ['Comida barata','/comida-barata/','Ideas económicas para comer bien gastando menos.'],
 ['Qué cenar hoy','/que-cenar-hoy/','Opciones prácticas para decidir la cena de hoy.'],
 ['Ideas de comida','/ideas-de-comida/','Más ideas para elegir según tiempo, presupuesto y ganas.']
];
function addFeaturedHome(html){
 if(!/<body[\s>]/i.test(html) || /id=["']seo-featured-guides["']/i.test(html)) return html;
 const cards=featured.map(([t,h,d])=>`<a href="${SITE}${h}" class="seo-featured-card"><strong>${esc(t)}</strong><span>${esc(d)}</span></a>`).join('');
 const block=`<section id="seo-featured-guides" class="seo-featured-guides" aria-labelledby="seo-featured-title"><h2 id="seo-featured-title">Guías populares para decidir qué comer</h2><p>Estas son algunas de las guías más útiles para pasar de una duda a una decisión rápida.</p><div class="seo-featured-grid">${cards}</div></section>`;
 return html.replace(/<section\b[^>]*class=["']seo-hub["'][^>]*>/i,block+'$&');
}
function addFoodLinks(html,file){
 const p=pagePath(file);
 if(p==='/' || /seo-related-food|seo-food-guide/i.test(html)) return html;
 if(/<\/main>/i.test(html) && /\/pizza\/$/i.test(p)) return html.replace(/<\/main>/i,`<section class="seo-food-guide"><h2>Ideas de pizza para decidir rápido</h2><p>Si sabes que quieres pizza pero no tienes claro cuál elegir, piensa primero en la base, después en los ingredientes y por último en el tamaño o formato. Así puedes reducir la elección sin revisar una lista interminable.</p><p>También puedes explorar opciones por ciudad: <a href="${SITE}/pizza-madrid/">pizza en Madrid</a>, <a href="${SITE}/pizza-barcelona/">pizza en Barcelona</a> y <a href="${SITE}/pizza-cornella/">pizza en Cornellà</a>.</p></section></main>`);
 if(/<\/main>/i.test(html) && /\/sushi\/$/i.test(p)) return html.replace(/<\/main>/i,`<section class="seo-food-guide"><h2>Ideas de sushi para elegir sin darle vueltas</h2><p>Cuando quieres sushi y dudas entre muchas opciones, empieza por decidir si prefieres piezas clásicas, opciones vegetarianas o una combinación variada. Después elige solo dos o tres alternativas.</p><p>Si buscas inspiración local, puedes consultar también <a href="${SITE}/sushi-barcelona/">sushi en Barcelona</a> y otras guías de comida de la web.</p></section></main>`);
 if(/<\/main>/i.test(html) && !/href=["'][^"']*\/pizza\//i.test(html)){
   const block=`<aside class="seo-related-food" aria-label="Guías populares"><strong>También puede interesarte</strong><p><a href="${SITE}/pizza/">Ideas de pizza</a> · <a href="${SITE}/sushi/">Ideas de sushi</a> · <a href="${SITE}/cena-rapida/">Cena rápida</a></p></aside>`;
   return html.replace(/<\/main>/i,block+'</main>');
 }
 return html;
}
function injectCss(html){
 if(!/<\/head>/i.test(html) || /id=["']seo-traffic-max["']/i.test(html)) return html;
 const css=`<style id="seo-traffic-max">.seo-featured-guides{max-width:1200px;margin:0 auto;padding:34px 20px 10px}.seo-featured-guides h2{margin:0 0 8px}.seo-featured-guides>p{margin:0 0 18px;line-height:1.6}.seo-featured-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px}.seo-featured-card{display:block;padding:18px;border:1px solid #e7e5e4;border-radius:18px;background:#fff;color:inherit;text-decoration:none;box-shadow:0 10px 28px rgba(28,25,23,.06);line-height:1.5}.seo-featured-card strong{display:block;margin-bottom:6px;color:#e85d04}.seo-featured-card span{display:block}.seo-related-food{margin:28px 0;padding:18px;border:1px solid #e7e5e4;border-radius:16px;background:#fff7ed}.seo-related-food strong{display:block;margin-bottom:6px}.seo-related-food p{margin:0;line-height:1.7}.seo-related-food a{font-weight:650}.seo-food-guide{margin:28px 0;padding:22px;border:1px solid #e7e5e4;border-radius:18px;background:#fff}.seo-food-guide h2{margin-top:0}.seo-food-guide p{line-height:1.7}@media(max-width:767px){.seo-featured-guides{padding:28px 16px 8px}.seo-featured-grid{grid-template-columns:1fr;gap:12px}}@media(min-width:768px) and (max-width:1023px){.seo-featured-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}</style>\n`;
 return html.replace(/<\/head>/i,css+'</head>');
}

let count=0;
walk(OUT,file=>{
 let html=fs.readFileSync(file,'utf8');
 html=injectHead(html,file);
 if(pagePath(file)==='/') html=addFeaturedHome(html);
 html=addFoodLinks(html,file);
 html=injectCss(html);
 fs.writeFileSync(file,html,'utf8');count++;
});

fs.writeFileSync(path.join(OUT,'robots.txt'),'User-agent: *\nAllow: /\nSitemap: '+SITE+'/sitemap.xml\n','utf8');
const urls=[];walk(OUT,file=>{if(path.basename(file).toLowerCase()==='index.html')urls.push(SITE+pagePath(file));});
const unique=[...new Set(urls)].sort();
fs.writeFileSync(path.join(OUT,'sitemap.xml'),['<?xml version="1.0" encoding="UTF-8"?>','<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',...unique.map(u=>`<url><loc>${esc(u)}</loc></url>`),'</urlset>'].join(''),'utf8');
console.log(`SEO traffic max complete: ${count} HTML pages enhanced; ${unique.length} URLs in sitemap.`);
