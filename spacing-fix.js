const fs=require('fs');const path=require('path');
const OUT=path.join(process.cwd(),'dist');
const CSS=`
/* More breathing room in SEO hub and cards */
.seo-hub{padding-top:clamp(72px,9vw,120px)!important;padding-bottom:clamp(72px,9vw,120px)!important}
.seo-hub-title{margin-bottom:18px!important}
.seo-hub-intro{margin:0 0 34px!important;max-width:820px!important;line-height:1.75!important}
.seo-hub-grid{gap:28px!important}
.seo-card{display:block!important;padding:clamp(28px,4vw,42px)!important;margin:0!important}
.seo-card strong{display:block!important;margin:0 0 18px!important;font-size:clamp(1.25rem,2vw,1.6rem)!important;line-height:1.2!important}
.seo-card span{display:block!important;margin:0!important;line-height:1.75!important;color:#554b44!important}
.seo-card+.seo-card{margin-top:0!important}
.seo-card h2,.seo-card h3,.seo-card h4{margin:0 0 16px!important;line-height:1.25}
.seo-card p{margin:0 0 20px!important;line-height:1.7}
.seo-card p:last-child{margin-bottom:0!important}
@media(max-width:767px){
 .seo-hub{padding:64px 16px 76px!important}
 .seo-hub-intro{margin-bottom:28px!important}
 .seo-hub-grid{gap:20px!important}
 .seo-card{padding:26px 22px!important}
 .seo-card strong{margin-bottom:14px!important;font-size:1.2rem!important;line-height:1.25!important}
 .seo-card span{font-size:1rem!important;line-height:1.7!important}
}
@media(min-width:768px) and (max-width:1023px){.seo-hub-grid{gap:24px!important}}
`;
function walk(dir){for(const e of fs.readdirSync(dir,{withFileTypes:true})){const f=path.join(dir,e.name);if(e.isDirectory())walk(f);else if(e.name.toLowerCase().endsWith('.html')){let t=fs.readFileSync(f,'utf8');const style=/<style[^>]+id=["']ruleta-spacing-fix["'][^>]*>[\s\S]*?<\/style>/i;if(style.test(t))t=t.replace(style,`<style id="ruleta-spacing-fix">${CSS}</style>`);else if(t.includes('</head>'))t=t.replace('</head>',`<style id="ruleta-spacing-fix">${CSS}</style></head>`);fs.writeFileSync(f,t)}}}
walk(OUT);console.log('Spacing and breathing-room fix applied to all HTML pages.');
