const fs=require('fs');
const path=require('path');
const OUT=path.join(process.cwd(),'dist');
const SITE='https://www.ruletadecomida.es';

function walk(dir,cb){
  for(const e of fs.readdirSync(dir,{withFileTypes:true})){
    const f=path.join(dir,e.name);
    if(e.isDirectory()) walk(f,cb);
    else if(/\.html$/i.test(e.name)) cb(f);
  }
}

function cleanWallOfLinks(html){
  // Remove huge blocks of links often labeled "Más guías de comida" or "Más ideas"
  html=html.replace(/<h2[^>]*>Más (?:guías de comida|ideas)<\/h2>\s*<div class=["']links["'][^>]*>[\s\S]*?<\/div>/gi,'');
  return html;
}

function addContextualLinks(html,file){
  if(html.includes('rf-contextual-links')) return html;
  const rel=path.relative(OUT,file).replace(/\\/g,'/');
  if(rel==='index.html' || rel==='404.html') return html;
  
  // Categorize based on path to provide relevant links
  const isCity = /madrid|barcelona|valencia|sevilla/i.test(rel);
  const isFood = /pizza|sushi|tapas|paella|hamburguesa/i.test(rel);
  
  let linksHtml = '';
  if(isCity){
    linksHtml = `
      <section class="rf-contextual-links" aria-labelledby="related-food-title">
        <h2 id="related-food-title">Opciones populares en tu ciudad</h2>
        <div class="links-grid">
          <a href="${SITE}/pizza/">Pizza rápida</a>
          <a href="${SITE}/sushi/">Sushi y asiática</a>
          <a href="${SITE}/hamburguesa/">Hamburguesas</a>
          <a href="${SITE}/tapas/">Tapas para compartir</a>
        </div>
      </section>
    `;
  } else if(isFood){
    linksHtml = `
      <section class="rf-contextual-links" aria-labelledby="related-situations-title">
        <h2 id="related-situations-title">Ideas según tu situación</h2>
        <div class="links-grid">
          <a href="${SITE}/cena-rapida/">Cenas en 15 minutos</a>
          <a href="${SITE}/comida-barata/">Opciones económicas</a>
          <a href="${SITE}/comida-para-uno/">Para comer solo</a>
          <a href="${SITE}/comida-para-amigos/">Para compartir</a>
        </div>
      </section>
    `;
  } else {
    linksHtml = `
      <section class="rf-contextual-links" aria-labelledby="related-ideas-title">
        <h2 id="related-ideas-title">Explora más opciones</h2>
        <div class="links-grid">
          <a href="${SITE}/que-cenar-hoy/">Qué cenar hoy</a>
          <a href="${SITE}/cena-rapida/">Cena rápida</a>
          <a href="${SITE}/comida-barata/">Comida barata</a>
          <a href="${SITE}/pizza/">Pizza</a>
        </div>
      </section>
    `;
  }
  
  const css = `<style id="rf-contextual-links-css">.rf-contextual-links{margin-top:40px;padding-top:20px;border-top:1px solid rgba(235,212,194,.96)}.links-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:12px;margin-top:16px}.links-grid a{display:flex;align-items:center;padding:14px 18px;background:linear-gradient(135deg,#fff,#fff9f3);border:1px solid rgba(235,212,194,.96);border-radius:14px;color:#c84500;font-weight:700;text-decoration:none;transition:transform .2s ease,box-shadow .2s ease}.links-grid a:hover{transform:translateY(-2px);box-shadow:0 8px 20px rgba(98,45,13,.06);border-color:#f4bb85}</style>`;
  
  if(!html.includes('rf-contextual-links-css') && html.includes('</head>')){
    html = html.replace('</head>', css+'</head>');
  }
  
  const ctaRegex = /<a[^>]*class=["'][^"']*cta[^"']*["'][^>]*>🎯 Girar la ruleta<\/a>/i;
  if(ctaRegex.test(html)){
    html = html.replace(ctaRegex, linksHtml + '$&');
  } else if(/<\/article>/i.test(html)){
    html = html.replace(/<\/article>/i, linksHtml + '</article>');
  }
  
  return html;
}

let count=0;
walk(OUT,file=>{
  let html=fs.readFileSync(file,'utf8');
  html=cleanWallOfLinks(html);
  html=addContextualLinks(html,file);
  fs.writeFileSync(file,html,'utf8');
  count++;
});

console.log(`Internal linking optimized in ${count} pages.`);
