#!/usr/bin/env node
'use strict';

/**
 * Sustituye las integraciones publicitarias anteriores por el script solicitado
 * explícitamente por el propietario del sitio. Mantiene exactamente una copia
 * del anuncio en cada página estática.
 */
const fs = require('fs');
const path = require('path');

const DIST = path.join(__dirname, '..', 'dist');
const SCRIPT_ID = 'quge5-ad-script-276903';
const SCRIPT_HTML = '<script id="quge5-ad-script-276903" src="https://quge5.com/88/tag.min.js" data-zone="276903" async data-cfasync="false"></script>';

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
    'aclib',
    'quge5-ad-script-276903'
  ];

  for (const id of ids) {
    result = result.replace(
      new RegExp(`\\s*<script\\b[^>]*\\bid=["']${id}["'][^>]*>[\\s\\S]*?<\\/script>\\s*`, 'gi'),
      '\n'
    );
  }

  return result
    .replace(/\s*<script\b[^>]*\bsrc=["'][^"']*(?:acscdn\.com|adbpage\.com|quge5\.com|al5sm\.com|monetag|impassabletroubledwistful|profitableratecpmnetwork|adsterra|popads)[^"']*["'][^>]*>\s*<\/script>\s*/gi, '\n')
    .replace(/\s*<script\b[^>]*>\s*[\s\S]*?(?:a6cc452ba86aee46ecc8449d28cc7873|zxsbhnljps|aclib\.runAutoTag|popads)[\s\S]*?<\/script>\s*/gi, '\n');
}

if (!fs.existsSync(DIST)) throw new Error(`No existe la salida estática: ${DIST}`);
let processed = 0;
for (const file of walk(DIST).filter((entry) => entry.endsWith('.html'))) {
  const original = fs.readFileSync(file, 'utf8');
  let html = removePreviousAdvertising(original);

  if (/<\/head\s*>/i.test(html)) {
    html = html.replace(/<\/head\s*>/i, `${SCRIPT_HTML}\n</head>`);
  } else if (/<head\b[^>]*>/i.test(html)) {
    html = html.replace(/<head\b[^>]*>/i, `$&\n${SCRIPT_HTML}`);
  } else if (/<body\b[^>]*>/i.test(html)) {
    html = html.replace(/<body\b[^>]*>/i, `${SCRIPT_HTML}\n$&`);
  } else {
    html = `${SCRIPT_HTML}\n${html}`;
  }

  fs.writeFileSync(file, html);
  processed += 1;
}

console.log(`[advertising-scripts] ${processed} HTML pages updated with quge5.com zone 276903; previous advertising integrations removed.`);
