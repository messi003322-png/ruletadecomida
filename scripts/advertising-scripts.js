#!/usr/bin/env node
'use strict';

/**
 * Sustituye la integración de monetización anterior por los dos scripts
 * proporcionados explícitamente por el propietario del sitio. Se ejecuta sobre
 * la salida estática para que cada página conserve exactamente una copia de
 * cada script.
 */
const fs = require('fs');
const path = require('path');

const DIST = path.join(__dirname, '..', 'dist');
const SCRIPTS = [
  {
    id: 'publisher-script-574324156ab63a291444509b3c987f74',
    src: 'https://impassabletroubledwistful.com/57/43/24/574324156ab63a291444509b3c987f74.js'
  },
  {
    id: 'publisher-script-69c6dedc489be65e1b8d38477134d7a1',
    src: 'https://pl31059734.profitableratecpmnetwork.com/69/c6/de/69c6dedc489be65e1b8d38477134d7a1.js'
  }
];

function walk(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(fullPath) : [fullPath];
  });
}

function removeKnownPublisherScripts(html) {
  let result = html;
  const ids = [
    'ad-zone-11663431',
    'ad-zone-loader-11663431',
    ...SCRIPTS.map(({ id }) => id)
  ];

  for (const id of ids) {
    result = result.replace(
      new RegExp(`\\s*<script\\b[^>]*\\bid=["']${id}["'][^>]*>[\\s\\S]*?<\\/script>\\s*`, 'gi'),
      '\n'
    );
  }

  // Elimina el tag anterior de Monetag tanto si procede del postprocesador
  // anterior como si estuviera incrustado en una plantilla histórica.
  result = result
    .replace(/\s*<script\b[^>]*\bsrc=["'][^"']*(?:al5sm\.com|monetag)[^"']*["'][^>]*>\s*<\/script>\s*/gi, '\n')
    .replace(/\s*<script\b[^>]*>\s*\(function\(s\)\{s\.dataset\.zone=['"]11663431['"],s\.src=['"]https:\/\/al5sm\.com\/tag\.min\.js['"]\}\)\(\[document\.documentElement,\s*document\.body\]\.filter\(Boolean\)\.pop\(\(\)\.appendChild\(document\.createElement\(['"]script['"]\)\)\)<\/script>\s*/gi, '\n');

  return result;
}

const block = SCRIPTS
  .map(({ id, src }) => `<script id="${id}" src="${src}"></script>`)
  .join('\n');

let processed = 0;
for (const file of walk(DIST).filter((entry) => entry.endsWith('.html'))) {
  const original = fs.readFileSync(file, 'utf8');
  let html = removeKnownPublisherScripts(original);

  if (/<\/body\s*>/i.test(html)) {
    html = html.replace(/<\/body\s*>/i, `${block}\n</body>`);
  } else {
    html += `\n${block}\n`;
  }

  fs.writeFileSync(file, html);
  processed += 1;
}

console.log(`[advertising-scripts] ${processed} HTML pages updated with ${SCRIPTS.length} publisher scripts; Monetag removed.`);
