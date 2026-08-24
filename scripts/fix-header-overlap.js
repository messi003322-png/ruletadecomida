const fs = require('fs');
const path = require('path');

const INDEX = path.join(__dirname, '..', 'dist', 'index.html');

const STYLE = `<style id="rf-header-overlap-fix">
/* FIX FINAL: el contenido nunca debe verse/metérse dentro del panel superior */
header {
  position: sticky !important;
  top: 0 !important;
  z-index: 99999 !important;
  background: #fffdf9 !important;
  background-color: #fffdf9 !important;
  opacity: 1 !important;
  backdrop-filter: none !important;
  -webkit-backdrop-filter: none !important;
  isolation: isolate !important;
  box-shadow: 0 6px 24px rgba(80,40,10,.12) !important;
}
header::before, header::after {
  opacity: 1 !important;
  pointer-events: none !important;
}
header > *, header .mx-auto, header nav {
  position: relative !important;
  z-index: 1 !important;
}
main, #directorio, #view-home {
  position: relative !important;
  z-index: 1 !important;
}
/* Evita que títulos/anclas queden ocultos bajo el header al navegar */
[id] { scroll-margin-top: 110px !important; }
@media (max-width: 767px) {
  [id] { scroll-margin-top: 72px !important; }
}
</style>`;

function run(){
  if(!fs.existsSync(INDEX)) return false;
  let html = fs.readFileSync(INDEX,'utf8');
  html = html.replace(/<style id="rf-header-overlap-fix">[\s\S]*?<\/style>/i,'');
  html = html.replace(/<\/head>/i, STYLE + '</head>');
  fs.writeFileSync(INDEX, html, 'utf8');
  return true;
}

if(require.main === module) run();
module.exports = { run };
