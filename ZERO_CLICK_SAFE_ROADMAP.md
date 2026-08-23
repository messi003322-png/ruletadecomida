# Zero-Click Dominion — Implementación segura

## ✅ Implementado / listo

1. **Feed Google Merchant Center**
   - Script: `scripts/generate-merchant-feed.js`
   - Ejecutar: `node scripts/generate-merchant-feed.js`
   - Genera cientos de productos (ciudades + ciudad/comida + intención)

2. **Checklist de indexación**
   - `INDEXING_CHECKLIST.md`

## 🔄 Pendiente de aplicar en el sitio (contenido)

- Mejorar hero copy (alta retención)
- Ruleta visual con CTAs de resultado más fuertes (botón tipo Glovo)
- Tablas HTML en páginas de ciudad (tiempo / presupuesto)
- FAQ semántico conciso al final de páginas clave

## ❌ No se implementa
- Reclamar perfiles de Google Maps abandonados (riesgo de spam/sanción)

## Cómo desplegar cambios de contenido
El sitio se construye desde `sitio_usuario_estatico.zip` vía `static-build.js`.
Para cambios estructurales grandes hay que actualizar el ZIP o ampliar el post-procesado del build.
