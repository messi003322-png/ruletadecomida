/**
 * Verifica que no existan páginas-guía CLONADAS (mismo cuerpo completo).
 * No falla por frases plantilla compartidas entre miles de URLs.
 */
const fs = require('fs');
const path = require('path');
const DIST = path.join(__dirname, '..', 'dist');

function clean(s) {
  return String(s)
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[^;]+;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

function hash(s) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0).toString(16);
}

function run() {
  if (!fs.existsSync(DIST)) throw new Error('dist no existe');

  const seen = new Map();
  const clones = [];
  let n = 0;

  for (const file of fs.readdirSync(DIST, { recursive: true })) {
    if (!String(file).endsWith('.html')) continue;
    const parts = String(file).split(path.sep);
    // ciudad / momento / comida / index.html
    if (parts.length !== 4 || parts[3] !== 'index.html') continue;
    if (!/^(desayuno|almuerzo|merienda|cena)$/.test(parts[1])) continue;

    const p = path.join(DIST, file);
    const html = fs.readFileSync(p, 'utf8');
    const body = clean(html);
    if (body.length < 200) continue;

    const key = hash(body);
    n++;
    if (seen.has(key)) {
      clones.push(`${seen.get(key)} <-> ${p}`);
    } else {
      seen.set(key, p);
    }
  }

  if (clones.length) {
    throw new Error(
      `PÁGINAS CLONADAS: ${clones.length} guías con cuerpo idéntico. ` +
        clones.slice(0, 8).join(' | ')
    );
  }

  console.log(
    `[verify-content-uniqueness] OK: ${n} guías individuales sin clones de página completa.`
  );
}

if (require.main === module) run();
module.exports = { run };
