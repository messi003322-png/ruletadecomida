#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const DIST = path.resolve(__dirname, '..', 'dist');
const ZONE_ID = '11663431';
const SCRIPT_URL = 'https://al5sm.com/tag.min.js';
const BLOCK = `<script id="ad-zone-${ZONE_ID}">(function(){var existing=document.getElementById('ad-zone-loader-${ZONE_ID}');if(existing)return;var s=document.createElement('script');s.id='ad-zone-loader-${ZONE_ID}';s.dataset.zone='${ZONE_ID}';s.src='${SCRIPT_URL}';s.async=true;(document.body||document.documentElement).appendChild(s);})();</script>`;

if (!fs.existsSync(DIST)) {
  console.error('[ad-zone] dist no existe; ejecuta el build antes.');
  process.exit(1);
}

let scanned = 0;
let changed = 0;

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(file);
      continue;
    }
    if (!entry.isFile() || !file.endsWith('.html')) continue;

    scanned += 1;
    const original = fs.readFileSync(file, 'utf8');
    let html = original
      .replace(/\s*<script\b[^>]*id=["']ad-zone-11663431["'][^>]*>[\s\S]*?<\/script>\s*/gi, '\n')
      .replace(/\s*<script\b[^>]*>\s*\(function\(s\)\{s\.dataset\.zone=['"]11663431['"],s\.src=['"]https:\/\/al5sm\.com\/tag\.min\.js['"]\}\)\(\[document\.documentElement, document\.body\]\.filter\(Boolean\)\.pop\(\)\.appendChild\(document\.createElement\(['"]script['"]\)\)\)<\/script>\s*/gi, '\n');

    if (!/<\/body>/i.test(html)) {
      console.warn(`[ad-zone] Sin </body>: ${file}`);
      continue;
    }

    html = html.replace(/<\/body>/i, `  ${BLOCK}\n</body>`);
    if (html !== original) {
      fs.writeFileSync(file, html);
      changed += 1;
    }
  }
}

walk(DIST);
console.log(`[ad-zone] ${changed}/${scanned} páginas HTML integradas con la zona ${ZONE_ID}.`);
