const fs=require('fs');
const path=require('path');
const OUT=path.join(process.cwd(),'dist');
const CSS=`
/* Clean premium footer: keep brand + copyright, remove SEO wall of links */
.rf-footer-links,.rf-footer-grid{display:none!important}
.rf-final-footer{margin-top:72px!important}
.rf-footer-inner{padding:38px 20px 22px!important}
.rf-footer-brand{justify-content:center!important;text-align:center!important}
.rf-footer-brand p{width:auto!important;max-width:620px!important;margin:8px auto 0!important}
.rf-footer-copy{margin-top:22px!important;padding-top:18px!important}
@media(max-width:767px){.rf-footer-inner{padding:32px 16px 18px!important}.rf-footer-brand .rf-logo{width:44px!important;height:44px!important}}
`;
function walk(dir){const out=[];if(!fs.existsSync(dir))return out;for(const e of fs.readdirSync(dir,{withFileTypes:true})){const f=path.join(dir,e.name);if(e.isDirectory())out.push(...walk(f));else if(/\.html$/i.test(e.name))out.push(f)}return out}
let count=0;
for(const file of walk(OUT)){let html=fs.readFileSync(file,'utf8');if(!/<\/head>/i.test(html))continue;html=html.replace(/<style[^>]+id=["']ruleta-footer-clean["'][^>]*>[\s\S]*?<\/style>/gi,'');html=html.replace(/<\/head>/i,`<style id="ruleta-footer-clean">${CSS}</style>\n</head>`);fs.writeFileSync(file,html);count++}
console.log(`Footer cleaned: ${count} HTML pages.`);
