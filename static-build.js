const fs = require('fs');
const path = require('path');
const AdmZip = require('adm-zip');

const sourceZip = path.join(process.cwd(), 'sitio_usuario_estatico.zip');
const outputDir = path.join(process.cwd(), 'dist');

if (!fs.existsSync(sourceZip)) {
  throw new Error('No se encontró sitio_usuario_estatico.zip.');
}

fs.rmSync(outputDir, { recursive: true, force: true });
fs.mkdirSync(outputDir, { recursive: true });

const zip = new AdmZip(sourceZip);
const entries = zip.getEntries();

for (const entry of entries) {
  const normalized = entry.entryName.replace(/\\/g, '/');
  if (normalized.startsWith('/') || normalized.split('/').includes('..')) {
    throw new Error(`Ruta no permitida en el ZIP: ${entry.entryName}`);
  }
}

zip.extractAllTo(outputDir, true);

for (const required of ['index.html', 'sitemap.xml', 'robots.txt']) {
  if (!fs.existsSync(path.join(outputDir, required))) {
    throw new Error(`El ZIP no contiene el archivo obligatorio: ${required}`);
  }
}

console.log(`Sitio estático del usuario publicado: ${entries.length} entradas extraídas en dist/.`);
