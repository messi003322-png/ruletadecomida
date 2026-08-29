#!/usr/bin/env node
'use strict';

/**
 * Sustituye las integraciones publicitarias anteriores por el script indicado
 * explícitamente por el propietario del sitio. Se ejecuta sobre la salida
 * estática y mantiene exactamente una copia por página.
 */
const fs = require('fs');
const path = require('path');

const DIST = path.join(__dirname, '..', 'dist');
const SCRIPT_ID = 'publisher-script-a6cc452ba86aee46ecc8449d28cc7873';
const SCRIPT_HTML = `<script id="${SCRIPT_ID}" type="text/javascript" data-cfasync="false">
/*<![CDATA[/* */
(function(){var z=window,q="a6cc452ba86aee46ecc8449d28cc7873",x=[["siteId",242-416-437+302+5318708],["minBid",1.50],["popundersPerIP","0"],["delayBetween",0],["default",false],["defaultPerDay",0],["topmostLayer","auto"]],c=["d3d3LnByZW1pdW12ZXJ0aXNpbmcuY29tL0tUbkgvYmNhbnZhcy1uZXN0Lmpz","ZDJqMDQyY2oxNDIxd2kuY2xvdWRmcm9udC5uZXQvbHhEVVRWL3J5b3FWL2xkYy5taW4uY3Nz","d3d3LnF4c2l1ZGlyLmNvbS9NbnRNVC9lY2FudmFzLW5lc3QuanM=","d3d3LmVhY3RtaW9ub3ZsLmNvbS9qU1VXSEUvTE1oaHMvdmRjLm1pbi5jc3M="],v=-1,y,l,o=function(){clearTimeout(l);v++;if(c[v]&&!(1813953258000<(new Date).getTime()&&1<v)){y=z.document.createElement("script");y.type="text/javascript";y.async=!0;var d=z.document.getElementsByTagName("script")[0];y.src="https://"+atob(c[v]);y.crossOrigin="anonymous";y.onerror=o;y.onload=function(){clearTimeout(l);z[q.slice(0,16)+q.slice(0,16)]||o()};l=setTimeout(o,5E3);d.parentNode.insertBefore(y,d)}};if(!z[q]){try{Object.freeze(z[q]=x)}catch(e){}o()}})();
/*]]>/* */
</script>`;

function walk(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(fullPath) : [fullPath];
  });
}

function removePreviousAdvertising(html) {
  let result = html;
  const ids = [
    'ad-zone-11663431',
    'ad-zone-loader-11663431',
    'publisher-script-574324156ab63a291444509b3c987f74',
    'publisher-script-69c6dedc489be65e1b8d38477134d7a1',
    SCRIPT_ID
  ];

  for (const id of ids) {
    result = result.replace(
      new RegExp(`\\s*<script\\b[^>]*\\bid=["']${id}["'][^>]*>[\\s\\S]*?<\\/script>\\s*`, 'gi'),
      '\n'
    );
  }

  // Retira redes o cargadores de monetización anteriores incrustados en HTML histórico.
  return result
    .replace(/\s*<script\b[^>]*\bsrc=["'][^"']*(?:al5sm\.com|monetag|impassabletroubledwistful|profitableratecpmnetwork|adsterra)[^"']*["'][^>]*>\s*<\/script>\s*/gi, '\n')
    .replace(/\s*<script\b[^>]*>\s*[\s\S]*?a6cc452ba86aee46ecc8449d28cc7873[\s\S]*?<\/script>\s*/gi, '\n');
}

let processed = 0;
for (const file of walk(DIST).filter((entry) => entry.endsWith('.html'))) {
  const original = fs.readFileSync(file, 'utf8');
  let html = removePreviousAdvertising(original);

  if (/<\/body\s*>/i.test(html)) {
    html = html.replace(/<\/body\s*>/i, `${SCRIPT_HTML}\n</body>`);
  } else {
    html += `\n${SCRIPT_HTML}\n`;
  }

  fs.writeFileSync(file, html);
  processed += 1;
}

console.log(`[advertising-scripts] ${processed} HTML pages updated with one new publisher script; previous ad integrations removed.`);
