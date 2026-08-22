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

function extractFaq(html){
  const faqs=[];
  const regex=/<div class=["']faq["'][^>]*>\s*<strong[^>]*>([\s\S]*?)<\/strong>\s*<span[^>]*>([\s\S]*?)<\/span>\s*<\/div>/gi;
  let m;
  while((m=regex.exec(html))){
    faqs.push({q:m[1].replace(/<[^>]+>/g,'').trim(),a:m[2].replace(/<[^>]+>/g,'').trim()});
  }
  return faqs;
}

function injectFaqSchema(html,faqs){
  if(faqs.length===0 || /"@type"\s*:\s*"FAQPage"/i.test(html)) return html;
  const schema={
    "@context":"https://schema.org",
    "@type":"FAQPage",
    "mainEntity":faqs.map(f=>({
      "@type":"Question",
      "name":f.q,
      "acceptedAnswer":{"@type":"Answer","text":f.a}
    }))
  };
  const script=`\n<script type="application/ld+json">${JSON.stringify(schema)}</script>\n`;
  return html.replace(/<\/head>/i,script+'</head>');
}

let count=0;
walk(OUT,file=>{
  let html=fs.readFileSync(file,'utf8');
  const faqs=extractFaq(html);
  if(faqs.length>0){
    html=injectFaqSchema(html,faqs);
    fs.writeFileSync(file,html,'utf8');
    count++;
  }
});

console.log(`FAQPage Schema injected into ${count} pages.`);
