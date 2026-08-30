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
const SCRIPT_ID = 'adcash-autotag-zxsbhnljps';
const LIBRARY_HTML = '<script id="aclib" type="text/javascript" src="/adcash-anti-adblock.js"></script>';
const AUTOTAG_HTML = `<script id="${SCRIPT_ID}" type="text/javascript">
    aclib.runAutoTag({
        zoneId: 'zxsbhnljps',
    });
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
    'adcash-autotag-zxsbhnljps',
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
    .replace(/\s*<script\b[^>]*\bsrc=["'][^"']*(?:acscdn\.com|adbpage\.com|al5sm\.com|monetag|impassabletroubledwistful|profitableratecpmnetwork|adsterra|popads)[^"']*["'][^>]*>\s*<\/script>\s*/gi, '\n')
    .replace(/\s*<script\b[^>]*>\s*[\s\S]*?(?:a6cc452ba86aee46ecc8449d28cc7873|zxsbhnljps|aclib\.runAutoTag|popads)[\s\S]*?<\/script>\s*/gi, '\n');
}

let processed = 0;
for (const file of walk(DIST).filter((entry) => entry.endsWith('.html'))) {
  const original = fs.readFileSync(file, 'utf8');
  let html = removePreviousAdvertising(original);

  if (/<\/head\s*>/i.test(html)) {
    html = html.replace(/<\/head\s*>/i, `${LIBRARY_HTML}\n</head>`);
  } else if (/<head\b[^>]*>/i.test(html)) {
    html = html.replace(/<head\b[^>]*>/i, `$&\n${LIBRARY_HTML}`);
  } else if (/<body\b[^>]*>/i.test(html)) {
    html = html.replace(/<body\b[^>]*>/i, `${LIBRARY_HTML}\n$&`);
  } else {
    html = `${LIBRARY_HTML}\n${html}`;
  }

  if (/<\/body\s*>/i.test(html)) {
    html = html.replace(/<\/body\s*>/i, `${AUTOTAG_HTML}\n</body>`);
  } else {
    html += `\n${AUTOTAG_HTML}\n`;
  }

  fs.writeFileSync(file, html);
  processed += 1;
}

console.log(`[advertising-scripts] ${processed} HTML pages updated with Adcash library and autotag zone zxsbhnljps; previous ad integrations removed.`);
