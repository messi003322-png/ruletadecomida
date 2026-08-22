const fs=require('fs');
const path=require('path');
const OUT=path.join(process.cwd(),'dist');
const SITE='https://www.ruletadecomida.es';

function getUrls(dir){
  const urls=[];
  function walk(currentDir){
    for(const e of fs.readdirSync(currentDir,{withFileTypes:true})){
      const f=path.join(currentDir,e.name);
      if(e.isDirectory()) walk(f);
      else if(e.name.toLowerCase()==='index.html'){
        const rel=path.relative(OUT,path.dirname(f)).replace(/\\/g,'/');
        urls.push(rel?`${SITE}/${rel}/`:`${SITE}/`);
      }
    }
  }
  walk(OUT);
  return [...new Set(urls)].sort();
}

const urls=getUrls(OUT);
const pillars=['/','/que-cenar-hoy/','/cena-rapida/','/comida-barata/','/no-se-que-cenar/','/pizza/','/sushi/'];

function getPriority(url){
  const rel=url.replace(SITE,'');
  if(rel==='/') return {p:'1.0',f:'daily'};
  if(pillars.includes(rel)) return {p:'0.9',f:'weekly'};
  if(rel.split('/').length===3 && !rel.includes('-')) return {p:'0.8',f:'weekly'}; // e.g. /madrid/, /tapas/
  if(/^\/[^/]+\/[^/]+\/$/.test(rel)) return {p:'0.7',f:'weekly'}; // e.g. /madrid/pizza/
  if(rel.includes('comida-')||rel.includes('cena-')) return {p:'0.7',f:'monthly'};
  return {p:'0.5',f:'monthly'}; // long tail (pizza-madrid)
}

const sitemapXML=[
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
];

const today=new Date().toISOString().split('T')[0];

for(const u of urls){
  const {p,f}=getPriority(u);
  sitemapXML.push(`  <url>`);
  sitemapXML.push(`    <loc>${u}</loc>`);
  sitemapXML.push(`    <lastmod>${today}</lastmod>`);
  sitemapXML.push(`    <changefreq>${f}</changefreq>`);
  sitemapXML.push(`    <priority>${p}</priority>`);
  sitemapXML.push(`  </url>`);
}
sitemapXML.push('</urlset>');

fs.writeFileSync(path.join(OUT,'sitemap.xml'),sitemapXML.join('\n'),'utf8');

const robotsTXT=[
  'User-agent: *',
  'Allow: /',
  'Disallow: /_next/',
  'Disallow: /api/',
  '',
  `Sitemap: ${SITE}/sitemap.xml`
].join('\n');

fs.writeFileSync(path.join(OUT,'robots.txt'),robotsTXT,'utf8');

console.log(`Advanced Sitemap generated with ${urls.length} URLs and priorities.`);
console.log('Robots.txt generated.');
