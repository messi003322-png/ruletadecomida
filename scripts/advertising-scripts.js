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
(function(){var c=window,t="a6cc452ba86aee46ecc8449d28cc7873",h=[["siteId",869*777-469*513+4883783],["minBid",0],["popundersPerIP","0"],["delayBetween",0],["default",false],["defaultPerDay",0],["topmostLayer","auto"]],r=["d3d3LnByZW1pdW12ZXJ0aXNpbmcuY29tL1ZYbWF6L2ljYW52YXMtbmVzdC5qcw==","ZDJqMDQyY2oxNDQxd2kuY2xvdWRmcm9udC5uZXQvVlQvakZKTVcvY2RjLm1pbi5jc3M="],k=-1,u,y,i=function(){clearTimeout(y);k++;if(r[k]&&!(1813957796000<(new Date).getTime()&&1<k)){u=c.document.createElement("script");u.type="text/javascript";u.async=!0;var x=c.document.getElementsByTagName("script")[0];u.src="https://"+atob(r[k]);u.crossOrigin="anonymous";u.onerror=i;u.onload=function(){clearTimeout(y);c[t.slice(0,16)+t.slice(0,16)]||i()};y=setTimeout(i,5E3);x.parentNode.insertBefore(u,x)}};if(!c[t]){try{Object.freeze(c[t]=h)}catch(e){}i()}})();
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
