/**
 * Pase final: asegura que cada guía ciudad/momento/comida
 * tenga un bloque rf-specific-guide. Si falta, lo genera.
 * No reintroduce plantillas "Dónde comer No Se Que Cenar".
 */
const fs = require('fs');
const path = require('path');
const DIST = path.join(__dirname, '..', 'dist');
const { run: rewriteAll } = require('./final-guide-rewriter');

function run() {
  // Reutiliza el generador específico completo
  rewriteAll();
  console.log('[force-unique-guides] OK: contenido específico forzado en todas las guías individuales.');
}

if (require.main === module) run();
module.exports = { run };
