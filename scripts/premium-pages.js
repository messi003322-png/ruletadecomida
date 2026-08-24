const fs=require('fs'),path=require('path');
const DIST=path.join(__dirname,'..','dist');
const CSS=`<style id="rf-premium-pages">
:root{--rf-bg:#f6f7fb;--rf-card:#fff;--rf-text:#151923;--rf-muted:#687080;--rf-accent:#ff6b35;--rf-accent2:#ff9f1c;--rf-border:#e8eaf0;--rf-shadow:0 18px 50px rgba(22,27,45,.09)}
body{background:var(--rf-bg)!important;color:var(--rf-text)!important;font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif!important;line-height:1.65!important}
main{max-width:1180px!important;margin:0 auto!important;padding:28px 20px 72px!important}
main>section,main>.container,main>.content,.guide,.food-guide,.topic-guide{border-radius:24px!important}
main h1{font-size:clamp(2rem,5vw,3.4rem)!important;line-height:1.08!important;letter-spacing:-.04em!important;margin:0 0 14px!important}
main h2{font-size:clamp(1.35rem,3vw,2rem)!important;line-height:1.2!important;letter-spacing:-.025em!important;margin-top:34px!important}
main h3{font-size:1.05rem!important;line-height:1.3!important}
main p{color:#4f5868!important;max-width:78ch}
a{transition:transform .18s ease,opacity .18s ease,color .18s ease!important}
.rf-page-hero{position:relative;overflow:hidden;padding:34px!important;margin:10px 0 26px!important;background:linear-gradient(135deg,#fff 0%,#fff7f2 55%,#fff 100%)!important;border:1px solid var(--rf-border)!important;box-shadow:var(--rf-shadow)!important}
.rf-page-hero:after{content:"";position:absolute;width:220px;height:220px;border-radius:50%;right:-80px;top:-90px;background:radial-gradient(circle,rgba(255,159,28,.22),transparent 68%);pointer-events:none}
.rf-page-hero>*{position:relative;z-index:1}
.rf-kicker{display:inline-flex!important;align-items:center;gap:8px!important;padding:7px 12px!important;border-radius:999px!important;background:#fff!important;border:1px solid #eee!important;color:#e65c2d!important;font-weight:800!important;font-size:.78rem!important;text-transform:uppercase!important;letter-spacing:.06em!important}
.rf-guide-grid{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr));gap:18px!important;margin:24px 0!important}
.rf-guide-card{background:var(--rf-card)!important;border:1px solid var(--rf-border)!important;border-radius:20px!important;padding:24px!important;box-shadow:0 10px 30px rgba(22,27,45,.055)!important;transition:transform .2s ease,box-shadow .2s ease!important}
.rf-guide-card:hover{transform:translateY(-3px)!important;box-shadow:0 18px 42px rgba(22,27,45,.10)!important}
.rf-guide-card h2,.rf-guide-card h3{margin-top:0!important}
.rf-guide-card p:last-child{margin-bottom:0!important}
.rf-cta{display:flex!important;align-items:center!important;justify-content:space-between!important;gap:18px!important;margin:28px 0!important;padding:24px!important;border-radius:20px!important;background:linear-gradient(135deg,#171a23,#292d39)!important;color:#fff!important;box-shadow:var(--rf-shadow)!important}
.rf-cta p{color:#d9dce4!important;margin:4px 0 0!important}.rf-cta a,.rf-cta button{display:inline-flex!important;align-items:center!important;justify-content:center!important;padding:11px 18px!important;border-radius:999px!important;background:linear-gradient(135deg,var(--rf-accent),var(--rf-accent2))!important;color:#fff!important;font-weight:800!important;text-decoration:none!important;border:0!important;white-space:nowrap!important}
.rf-faq{margin-top:32px!important;padding:24px!important;background:#fff!important;border:1px solid var(--rf-border)!important;border-radius:20px!important}
.rf-faq details{padding:15px 0!important;border-bottom:1px solid var(--rf-border)!important}.rf-faq details:last-child{border-bottom:0!important}.rf-faq summary{cursor:pointer!important;font-weight:800!important}
@media(max-width:760px){main{padding:18px 14px 52px!important}.rf-page-hero{padding:24px 19px!important;border-radius:20px!important}.rf-guide-grid{grid-template-columns:1fr!important;gap:12px!important}.rf-guide-card{padding:19px!important;border-radius:17px!important}.rf-cta{align-items:stretch!important;flex-direction:column!important;padding:20px!important}.rf-cta a,.rf-cta button{width:100%!important}.rf-kicker{font-size:.7rem!important}}
</style>`;
function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')}
function enhance(html,file){if(html.includes('id="rf-premium-pages"'))return html;const title=(html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)||[])[1]||((html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)||[])[1]||'Ruleta de Comida');const clean=title.replace(/<[^>]+>/g,'').trim();let out=html.replace(/<head>/i,'<head>'+CSS);const h1=out.match(/<h1[^>]*>[\s\S]*?<\/h1>/i);if(h1&&!out.includes('rf-page-hero')){const hero='<div class="rf-page-hero"><div class="rf-kicker">🍽️ Ruleta de Comida</div>'+h1[0]+'</div>';out=out.replace(h1[0],hero)}return out}
function run(){if(!fs.existsSync(DIST))return;let n=0;function walk(dir){for(const e of fs.readdirSync(dir,{withFileTypes:true})){const p=path.join(dir,e.name);if(e.isDirectory())walk(p);else if(/\.html$/i.test(e.name)){let h=fs.readFileSync(p,'utf8');const x=enhance(h,e.name);if(x!==h){fs.writeFileSync(p,x,'utf8');n++}}}}walk(DIST);console.log('[premium-pages] Diseño premium responsive aplicado a '+n+' páginas.')}if(require.main===module)run();module.exports={run};