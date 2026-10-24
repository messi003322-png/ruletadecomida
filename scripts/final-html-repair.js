#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const OUT = path.join(process.cwd(), 'dist');
const HOME_TITLE = 'Ruleta de Comida: ¿Qué comer hoy? | Gira gratis';
const HOME_DESCRIPTION = '¿No sabes qué comer hoy? Gira la ruleta gratis y descubre una idea para desayunar, comer, merendar o cenar en segundos.';
const SITE = 'https://www.ruletadecomida.es';

function walk(dir, callback) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(file, callback);
    else if (/\.html$/i.test(entry.name)) callback(file);
  }
}

function escapeHtml(value) {
  return String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function trimAtWord(value, max) {
  const text = String(value || '').replace(/\s+/g, ' ').trim();
  if (text.length <= max) return text;
  const cut = text.slice(0, max - 1);
  const boundary = cut.lastIndexOf(' ');
  return (boundary > Math.floor(max * 0.65) ? cut.slice(0, boundary) : cut).trim().replace(/[|,:;\-\s]+$/, '') + '…';
}

function setMeta(html, kind, key, content) {
  const re = new RegExp('<meta\\b(?=[^>]*\\b' + kind + '=["\\\']' + key + '["\\\'])[^>]*>', 'gi');
  html = html.replace(re, '');
  const tag = '<meta ' + kind + '="' + key + '" content="' + escapeHtml(content) + '">';
  return html.replace(/<\/head\s*>/i, tag + '\n</head>');
}

if (!fs.existsSync(OUT)) throw new Error('No existe dist; ejecuta primero el build.');

let pages = 0;
let cssFixed = 0;
let robotsFixed = 0;
let titlesFixed = 0;

walk(OUT, (file) => {
  let html = fs.readFileSync(file, 'utf8');
  const original = html;
  const relative = path.relative(OUT, file).replace(/\\/g, '/');
  const isHome = relative.toLowerCase() === 'index.html';

  // Remove a malformed legacy ad-layout CSS fragment while preserving the valid
  // base styles and replacing the broken media queries with safe iframe sizing.
  html = html.replace(/<style\b([^>]*)>([\s\S]*?)<\/style>/gi, (whole, attrs, css) => {
    if (!/Sticky inferior solo móvil|Slot cerca del resultado/.test(css)) return whole;
    const marker = css.search(/\/\*\s*Slot cerca del resultado/i);
    if (marker < 0) return whole;
    const validPrefix = css.slice(0, marker).trimEnd();
    cssFixed++;
    return '<style' + attrs + '>' + validPrefix +
      '\n/* Keep third-party ad frames within the viewport without injecting broken layout rules. */\n' +
      'iframe[src*="nap5k"], iframe[src*="n6wxm"], iframe[src*="tag.min"] { max-width: 100% !important; }\n' +
      '</style>';
  });

  // Keep one robots directive. Preserve noindex if any existing directive requires it.
  const robots = [...html.matchAll(/<meta\b[^>]*\bname=["']robots["'][^>]*>/gi)].map(m => m[0]);
  if (robots.length !== 1 || (robots[0] && !/content=["'][^"']*max-image-preview:large/i.test(robots[0]))) {
    const preserveNoindex = robots.some(tag => /content=["'][^"']*\bnoindex\b/i.test(tag));
    html = html.replace(/<meta\b[^>]*\bname=["']robots["'][^>]*>\s*/gi, '');
    const value = preserveNoindex ? 'noindex,follow' : 'index,follow,max-image-preview:large';
    html = html.replace(/<\/head\s*>/i, '<meta name="robots" content="' + value + '">\n</head>');
    robotsFixed++;
  }

  // Remove empty legacy homepage section labels that add headings without useful content.
  if (isHome) {
    const beforeCleanup = html;
    html = html.replace(/<h2\\b[^>]*>\\s*(?:Sobre esta idea|Consejos prácticos|Preguntas sobre esta guía)\\s*<\\/h2>/gi, '');
    html = html.replace(/<p\\b[^>]*>\\s*Ideas locales\\s*<\\/p>/gi, '');
    if (html !== beforeCleanup) pages++;
  }

  // Replace the broken homepage title and make remaining titles safe for SERPs.
  const titleMatch = html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i);
  if (isHome) {
    const title = '<title>' + HOME_TITLE + '</title>';
    if (titleMatch) html = html.replace(/<title\b[^>]*>[\s\S]*?<\/title>/i, title);
    else html = html.replace(/<\/head\s*>/i, title + '\n</head>');
    html = setMeta(html, 'name', 'description', HOME_DESCRIPTION);
    html = setMeta(html, 'property', 'og:title', HOME_TITLE);
    html = setMeta(html, 'property', 'og:description', HOME_DESCRIPTION);
    html = setMeta(html, 'property', 'og:url', SITE + '/');
    if (!titleMatch || titleMatch[1] !== HOME_TITLE) titlesFixed++;
  } else if (titleMatch) {
    const cleaned = trimAtWord(titleMatch[1], 60);
    if (cleaned !== titleMatch[1]) {
      html = html.replace(/<title\b[^>]*>[\s\S]*?<\/title>/i, '<title>' + escapeHtml(cleaned) + '</title>');
      titlesFixed++;
    }
  }

  if (html !== original) {
    fs.writeFileSync(file, html, 'utf8');
    pages++;
  }
});

console.log('[final-html-repair] pages=' + pages + ' cssFixed=' + cssFixed + ' robotsFixed=' + robotsFixed + ' titlesFixed=' + titlesFixed);
