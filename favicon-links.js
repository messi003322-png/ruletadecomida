const fs=require('fs');
const path=require('path');
const OUT=path.join(process.cwd(),'dist');

const links=`
<link rel="icon" type="image/png" sizes="512x512" href="/favicon.png">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
<meta name="theme-color" content="#e95808">
`;

const manifest={
  name:'Ruleta de Comida',
  short_name:'Ruleta',
  start_url:'/',
  display:'standalone',
  background_color:'#fffdf9',
  theme_color:'#e95808',
  icons:[
    {src:'/android-chrome-192x192.png',sizes:'192x192',type:'image/png'},
    {src:'/android-chrome-512x512.png',sizes:'512x512',type:'image/png'}
  ]
};

function walk(dir,cb){for(const entry of fs.readdirSync(dir,{withFileTypes:true})){const full=path.join(dir,entry.name);if(entry.isDirectory())walk(full,cb);else if(/\.html$/i.test(entry.name))cb(full);}}

let count=0;
walk(OUT,file=>{
  let html=fs.readFileSync(file,'utf8');
  html=html.replace(/<link\s+rel=["'](?:icon|apple-touch-icon)["'][^>]*>\s*/gi,'');
  html=html.replace(/<link\s+rel=["']manifest["'][^>]*>\s*/gi,'');
  html=html.replace(/<meta\s+name=["']theme-color["'][^>]*>\s*/gi,'');
  if(/<\/head>/i.test(html))html=html.replace(/<\/head>/i,links+'</head>');
  fs.writeFileSync(file,html,'utf8');
  count++;
});
fs.writeFileSync(path.join(OUT,'site.webmanifest'),JSON.stringify(manifest,null,2),'utf8');
console.log(`Declaraciones de favicon integradas en ${count} páginas.`);

// Copiar favicons estáticos desde la raíz al directorio de salida
const icons = ['favicon.png', 'favicon.ico', 'favicon-16x16.png', 'favicon-32x32.png', 'apple-touch-icon.png', 'android-chrome-192x192.png', 'android-chrome-512x512.png'];
icons.forEach(icon => {
  const src = path.join(process.cwd(), icon);
  const dest = path.join(OUT, icon);
  if(fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
  }
});
