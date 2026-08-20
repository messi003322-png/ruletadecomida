const fs=require('fs');
const path=require('path');
const OUT=path.join(process.cwd(),'dist');

function fix(file){
  let html=fs.readFileSync(file,'utf8');
  const footerRe=new RegExp('<footer([\\s\\S]*?)<\\/footer>','gi');
  html=html.replace(footerRe,(full,body)=>{
    let imgs=0;
    body=body.replace(/<img\b[^>]*>/gi,(img)=>{
      imgs++;
      return imgs===1?img:'';
    });
    return '<footer'+body+'</footer>';
  });
  html=html.replace(/<style data-responsive-footer-fix>[\s\S]*?<\/style>/gi,'');
  html=html.replace(/<\/head>/i,`<style data-responsive-footer-fix>
footer img{max-width:72px;height:auto;display:block;object-fit:contain}
footer > *{box-sizing:border-box}
@media(max-width:767px){footer{width:100%;overflow:hidden}footer img{max-width:56px}footer .footer-brand,footer [class*=brand]{display:flex;align-items:center;gap:10px}}
@media(min-width:768px){footer img{max-width:72px}}
</style></head>`);
  fs.writeFileSync(file,html);
}

function walk(dir){
  if(!fs.existsSync(dir))return;
  for(const n of fs.readdirSync(dir)){
    const p=path.join(dir,n),s=fs.statSync(p);
    if(s.isDirectory())walk(p); else if(n.endsWith('.html'))fix(p);
  }
}
walk(OUT);
console.log('Responsive footer fix applied');
