const fs = require('fs');
const path = require('path');

const file = process.argv[2] || path.join(process.cwd(), 'data', 'local-places.json');
if (!fs.existsSync(file)) {
  console.log(`[validate-local-places] No hay datos locales todavía: ${file}`);
  process.exit(0);
}

const rows = JSON.parse(fs.readFileSync(file, 'utf8'));
if (!Array.isArray(rows)) throw new Error('Los datos locales deben ser un array JSON.');
const ids = new Set();
const errors = [];
for (const [i, row] of rows.entries()) {
  const prefix = `row ${i + 1}`;
  for (const key of ['id', 'name', 'city', 'source', 'lastVerifiedAt']) {
    if (typeof row[key] !== 'string' || !row[key].trim()) errors.push(`${prefix}: falta ${key}`);
  }
  if (ids.has(row.id)) errors.push(`${prefix}: id duplicado ${row.id}`);
  ids.add(row.id);
  if (!Number.isFinite(row.latitude) || row.latitude < -90 || row.latitude > 90) errors.push(`${prefix}: latitude inválida`);
  if (!Number.isFinite(row.longitude) || row.longitude < -180 || row.longitude > 180) errors.push(`${prefix}: longitude inválida`);
  if (Number.isNaN(Date.parse(row.lastVerifiedAt))) errors.push(`${prefix}: lastVerifiedAt no es ISO válido`);
}
if (errors.length) {
  console.error(`[validate-local-places] ${errors.length} errores`);
  console.error(errors.slice(0, 40).join('\n'));
  process.exit(1);
}
console.log(`[validate-local-places] OK: ${rows.length} registros con fuente, coordenadas y fecha de verificación.`);
