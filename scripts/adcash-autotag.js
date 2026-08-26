#!/usr/bin/env node
'use strict';

/**
 * Integra el Autotag estándar de Adcash una vez por documento HTML.
 * No incluye Anti-Adblock ni descarga/ejecuta instaladores externos.
 */
const fs = require('fs');
const path = require('path');

const DIST = path.resolve(__dirname, '..', 'dist');
const ZONE_ID = 'ghvlvlnm9k';
const BLOCK = `<script id="adcash-lib" type="text/javascript" src="https://acscdn.com/script/aclib.js"></script>
<script id="adcash-autotag" type="text/javascript">(function(){var started=false;function start(){if(started||!window.aclib||typeof window.aclib.runAutoTag!=='function')return;started=true;window.aclib.runAutoTag({zoneId:'${ZONE_ID}'});}var lib=document.getElementById('adcash-lib');if(window.aclib){start();}else if(lib){lib.addEventListener('load',start,{once:true});}})();</script>`;

if (!fs.existsSync(DIST)) {
  console.error('[adcash-autotag] dist no existe; ejecuta el build antes.');
  process.exit(1);
}

let changed = 0;
let scanned = 0;
function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(file);
    else if (entry.name === 'index.html') {
      scanned++;
      let html = fs.readFileSync(file, 'utf8');
      // Garantiza idempotencia si el script se ejecuta más de una vez.
      html = html.replace(/<script id="adcash-lib"[\s\S]*?<\/script>\s*<script id="adcash-autotag"[\s\S]*?<\/script>\s*/i, '');
      if (!/<\/head>/i.test(html)) {
        console.warn(`[adcash-autotag] Sin </head>: ${file}`);
        continue;
      }
      html = html.replace(/<\/head>/i, `${BLOCK}\n</head>`);
      fs.writeFileSync(file, html, 'utf8');
      changed++;
    }
  }
}

walk(DIST);
console.log(`[adcash-autotag] ${changed}/${scanned} páginas HTML integradas con la zona ${ZONE_ID}.`);
