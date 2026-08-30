#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const ENDPOINT = 'https://adbpage.com/adblock?v=3&format=js';
const CACHE_FILE = path.join(__dirname, 'vendor', 'adcash-anti-adblock.js');
const PUBLIC_FILE = path.join(__dirname, '..', 'dist', 'adcash-anti-adblock.js');
const TTL_MS = 5 * 60 * 1000;

fs.mkdirSync(path.dirname(CACHE_FILE), { recursive: true });

function isValidLibrary(source) {
  return typeof source === 'string'
    && source.length > 100
    && /aclib/i.test(source)
    && !/<html\b|<body\b/i.test(source);
}

async function main() {
  const cacheExists = fs.existsSync(CACHE_FILE);
  const cacheAge = cacheExists ? Date.now() - fs.statSync(CACHE_FILE).mtimeMs : Infinity;

  if (cacheAge < TTL_MS) {
    fs.copyFileSync(CACHE_FILE, PUBLIC_FILE);
    console.log(`[adcash-anti-adblock] using cache (${Math.round(cacheAge / 1000)}s old)`);
    return;
  }

  try {
    const response = await fetch(ENDPOINT, {
      headers: { 'User-Agent': 'ruletadecomida-build/1.0' },
      signal: AbortSignal.timeout(15000),
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const source = await response.text();
    if (!isValidLibrary(source)) throw new Error('respuesta no parece una librería Adcash válida');

    const temporary = `${CACHE_FILE}.tmp`;
    fs.writeFileSync(temporary, source.trim() + '\n', 'utf8');
    fs.renameSync(temporary, CACHE_FILE);
    fs.copyFileSync(CACHE_FILE, PUBLIC_FILE);
    console.log(`[adcash-anti-adblock] fetched and cached from ${ENDPOINT}`);
  } catch (error) {
    if (cacheExists && isValidLibrary(fs.readFileSync(CACHE_FILE, 'utf8'))) {
      fs.copyFileSync(CACHE_FILE, PUBLIC_FILE);
      console.warn(`[adcash-anti-adblock] fetch failed (${error.message}); using existing cache`);
      return;
    }
    throw new Error(`No se pudo obtener la librería y no existe un caché válido: ${error.message}`);
  }
}

main().catch((error) => {
  console.error(`[adcash-anti-adblock] ERROR: ${error.message}`);
  process.exitCode = 1;
});
