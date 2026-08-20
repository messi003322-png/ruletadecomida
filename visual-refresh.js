const fs = require('fs');
const path = require('path');

const OUT = path.join(process.cwd(), 'dist');
const CSS = `
:root{--wow-bg:#fffaf6;--wow-card:#fff;--wow-ink:#17120f;--wow-muted:#6b625c;--wow-brand:#f05a00;--wow-brand-2:#ff8a24;--wow-line:#eee7e1;--wow-shadow:0 18px 55px rgba(42,28,18,.08);--wow-shadow-lg:0 28px 80px rgba(42,28,18,.13)}
html{scroll-behavior:smooth}body{background:radial-gradient(circle at 8% 4%,rgba(255,184,120,.18),transparent 28rem),radial-gradient(circle at 92% 18%,rgba(113,191,255,.12),transparent 30rem),linear-gradient(180deg,#fff 0%,var(--wow-bg) 48%,#fff 100%);color:var(--wow-ink);font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;-webkit-font-smoothing:antialiased}
header{position:sticky!important;top:0;z-index:50;background:rgba(255,255,255,.9)!important;backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px);border-bottom:1px solid rgba(238,231,225,.9);box-shadow:0 8px 28px rgba(42,28,18,.05)!important}
header .mx-auto{max-width:1240px!important}header nav a{border-radius:999px!important;font-weight:700!important;transition:all .18s ease!important}header nav a:hover{background:#fff2e8!important;color:var(--wow-brand)!important;transform:translateY(-1px)}header nav a:last-child{background:linear-gradient(135deg,var(--wow-brand),var(--wow-brand-2))!important;color:#fff!important;box-shadow:0 10px 24px rgba(240,90,0,.25)!important}
main{overflow:hidden}main section{position:relative}h1,h2,h3{color:var(--wow-ink);letter-spacing:-.04em!important}h1{font-weight:850!important}h2{font-weight:800!important}
#view-home>section:first-child{padding-top:clamp(3rem,8vw,7rem)!important;padding-bottom:clamp(3rem,7vw,6rem)!important;position:relative}#view-home>section:first-child:before{content:"";position:absolute;width:460px;height:460px;border-radius:50%;background:radial-gradient(circle,rgba(240,90,0,.12),transparent 68%);right:-180px;top:-160px;pointer-events:none}
#view-home>section:first-child>div{position:relative;z-index:1}#view-home>section:first-child .grid{align-items:center!important}
#ruleta{filter:drop-shadow(0 25px 55px rgba(240,90,0,.12))!important}#wheel{box-shadow:0 24px 60px rgba(24,18,14,.18),0 0 0 10px rgba(255,255,255,.98)!important}
#spinBtn{min-height:58px!important;border-radius:999px!important;background:linear-gradient(135deg,var(--wow-brand),var(--wow-brand-2))!important;box-shadow:0 16px 32px rgba(240,90,0,.25)!important;font-weight:800!important;transition:transform .18s ease,box-shadow .18s ease!important}#spinBtn:hover{transform:translateY(-2px)!important;box-shadow:0 20px 40px rgba(240,90,0,.32)!important}
#result{border:1px solid rgba(238,231,225,.9);border-radius:28px!important;box-shadow:var(--wow-shadow)!important;background:rgba(255,255,255,.92)!important}
main>section:not(:first-child),#view-home>section:not(:first-child){max-width:1240px;margin-left:auto;margin-right:auto}
main p{color:#554d47;line-height:1.75}main a{color:inherit}button{font-weight:750!important}
.seo-hub{max-width:1240px!important;padding:64px 20px!important;margin:auto!important}.seo-hub-grid{gap:20px!important}.seo-card{position:relative;overflow:hidden;padding:25px!important;border:1px solid var(--wow-line)!important;border-radius:24px!important;background:linear-gradient(180deg,#fff,#fffaf7)!important;box-shadow:var(--wow-shadow)!important}.seo-card:before{content:"";position:absolute;left:0;top:0;width:100%;height:4px;background:linear-gradient(90deg,var(--wow-brand),#ffbd66,#5ab9ff);opacity:.85}.seo-card:hover{transform:translateY(-5px)!important;box-shadow:var(--wow-shadow-lg)!important;border-color:#f1d5bf!important}.seo-card strong{font-size:1.08rem!important}.seo-card span{line-height:1.6!important}
.rf-final-footer{margin-top:72px!important;background:#11100f!important;color:#fff!important;border-top:1px solid #2c2926!important}.rf-footer-inner{max-width:1240px!important;margin:0 auto!important;padding:52px 20px 28px!important}.rf-footer-brand{display:flex!important;align-items:center!important;gap:12px!important;flex-wrap:wrap!important;margin-bottom:24px!important}.rf-footer-brand strong{font-size:1.15rem!important}.rf-footer-brand p{width:100%;margin:0!important;color:#bdb5ae!important;line-height:1.6!important}.rf-footer-brand .rf-logo{width:44px!important;height:44px!important;border-radius:14px!important;object-fit:cover!important;box-shadow:0 8px 22px rgba(0,0,0,.3)!important}.rf-footer-brand>span{display:none!important}.rf-footer-links{border-top:1px solid #2c2926!important;padding-top:24px!important}.rf-footer-grid{display:grid!important;grid-template-columns:repeat(4,minmax(0,1fr))!important;gap:10px 18px!important}.rf-footer-grid a{color:#d8d1ca!important;text-decoration:none!important;font-size:.9rem!important;line-height:1.45!important;transition:color .16s ease!important}.rf-footer-grid a:hover{color:#ff9b55!important}.rf-footer-copy{margin:34px 0 0!important;padding-top:22px!important;border-top:1px solid #2c2926!important;color:#938a82!important;text-align:center!important;font-size:.86rem!important}
@media(max-width:767px){header .mx-auto{min-height:64px!important;padding:6px 12px!important}header nav a{font-size:.78rem!important;padding:.52rem .6rem!important}#view-home>section:first-child{padding-top:2.5rem!important}#view-home>section:first-child:before{width:300px;height:300px;right:-170px}.seo-hub{padding:44px 16px!important}.seo-card{border-radius:20px!important}.rf-footer-inner{padding:40px 18px 24px!important}.rf-footer-grid{grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:12px 14px!important}.rf-footer-brand .rf-logo{width:40px!important;height:40px!important}}
@media(min-width:768px) and (max-width:1023px){.rf-footer-grid{grid-template-columns:repeat(3,minmax(0,1fr))!important}}
@media(prefers-reduced-motion:reduce){*{scroll-behavior:auto!important;transition:none!important}}
`;

function walk(dir, files=[]){
  if(!fs.existsSync(dir)) return files;
  for(const e of fs.readdirSync(dir,{withFileTypes:true})){
    const full=path.join(dir,e.name);
    if(e.isDirectory()) walk(full,files);
    else if(/\.html$/i.test(e.name)) files.push(full);
  }
  return files;
}

const files=walk(OUT);
let count=0;
for(const file of files){
  let html=fs.readFileSync(file,'utf8');
  if(!/<\/head>/i.test(html)) continue;
  if(!html.includes('id="ruleta-wow-refresh"')) html=html.replace(/<\/head>/i,`<style id="ruleta-wow-refresh">${CSS}</style>\n</head>`);

  const logoMatch=html.match(/<header[\s\S]*?<img[^>]+(?:src|data-src)=["']([^"']+)["'][^>]*>/i);
  const logo=logoMatch?logoMatch[1]:'';
  if(logo && /class=["'][^"']*rf-footer-brand[^"']*["']/i.test(html) && !html.includes('class="rf-logo"')){
    html=html.replace(/(<div class="rf-footer-brand">)/i,`$1<img class="rf-logo" src="${logo}" alt="Ruleta de Comida" loading="lazy">`);
  }
  fs.writeFileSync(file,html);
  count++;
}
console.log(`Visual refresh complete: ${count} HTML pages styled.`);
