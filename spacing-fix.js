const fs=require('fs');const path=require('path');
const OUT=path.join(process.cwd(),'dist');
const CSS=`.seo-card h2,.seo-card h3,.seo-card h4{margin:0 0 12px!important;line-height:1.25}.seo-card p{margin:0 0 16px!important;line-height:1.65}.seo-card p:last-child{margin-bottom:0!important}.seo-card h2+p,.seo-card h3+p,.seo-card h4+p{margin-top:0!important}.seo-card+.seo-card{margin-top:16px}`;
function walk(dir){for(const e of fs.readdirSync(dir,{withFileTypes:true})){const f=path.join(dir,e.name);if(e.isDirectory())walk(f);else if(e.name.toLowerCase().endsWith('.html')){let t=fs.readFileSync(f,'utf8');if(t.includes('</head>')&&!t.includes('ruleta-spacing-fix')){t=t.replace('</head>',`<style id="ruleta-spacing-fix">${CSS}</style></head>`);fs.writeFileSync(f,t)}}}}
walk(OUT);console.log('Spacing fix applied to all HTML pages.');
