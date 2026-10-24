#!/usr/bin/env node
'use strict';

// Align the main heading with the actual meal moment in the URL.
// This repairs visible SEO mismatches such as /vitoria/almuerzo/hamburguesa-casera/
// showing an H1 that says "para cena en Vitoria".
const fs = require('fs');
const path = require('path');

const DIST = path.join(process.cwd(), 'dist');
const MOMENTS = {
  desayuno: 'desayuno',
  almuerzo: 'almuerzo',
  merienda: 'merienda',
  cena: 'cena',
  brunch: 'brunch',
  'media-manana': 'media mañana',
  noche: 'noche'
};

function walk(dir, callback) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name.startsWith('.') || entry.name === 'node_modules') continue;
      walk(file, callback);
    } else if (/\.html$/i.test(entry.name)) {
      callback(file);
    }
  }
}

if (!fs.existsSync(DIST)) throw new Error('No existe dist; ejecuta primero el build.');

let inspected = 0;
let repaired = 0;

walk(DIST, (file) => {
  const relative = path.relative(DIST, file).replace(/\\/g, '/');
  const parts = relative.split('/').filter(Boolean);
  // Only repair generated city/moment/food routes, not generic hubs or the homepage.
  if (parts.length < 4 || !Object.prototype.hasOwnProperty.call(MOMENTS, parts[1])) return;

  let html = fs.readFileSync(file, 'utf8');
  const original = html;
  const expected = MOMENTS[parts[1]];

  html = html.replace(/<h1\b[^>]*>[\s\S]*?<\/h1>/i, (heading) => {
    return heading.replace(
      /\bpara\s+(desayuno|almuerzo|merienda|cena|brunch|media\s+mañana|noche)\s+en\b/i,
      (match, oldMoment) => oldMoment.toLowerCase() === expected ? match : 'para ' + expected + ' en'
    );
  });

  inspected++;
  if (html !== original) {
    fs.writeFileSync(file, html, 'utf8');
    repaired++;
  }
});

console.log('[fix-route-heading-consistency] routes inspected=' + inspected + ' main headings repaired=' + repaired);
