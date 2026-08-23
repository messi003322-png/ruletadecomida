# Checklist de indexación — Ruleta de Comida

## Estado actual (revisado 2026-08-23)

### robots.txt
- `User-agent: *` → `Allow: /`
- Solo bloquea `/_next/` y `/api/` (correcto)
- Sitemap declarado: `https://www.ruletadecomida.es/sitemap.xml`

### Sitemap
- ~1809 URLs presentes
- lastmod reciente (2026-08-22)
- Prioridades y changefreq configurados

### Respuestas HTTP
- Home y páginas de ciudad devuelven **200**
- Sin redirecciones problemáticas detectadas en las rutas principales
- Cache en edge de Vercel activo (bueno para TTFB)

### Meta tags (revisar en Search Console)
- Comprobar que **no** exista `noindex` en páginas públicas
- Canonicals deben apuntar a la URL canónica correcta (https, trailing slash consistente)
- Cada página de ciudad/comida debería tener title + description únicos

## Acciones recomendadas en Google Search Console
1. Verificar propiedad del dominio `ruletadecomida.es`
2. Enviar sitemap: `https://www.ruletadecomida.es/sitemap.xml`
3. Usar "Inspección de URLs" en home + 5-10 páginas de ciudad + 5 combinaciones comida/ciudad
4. Revisar informe de Cobertura / Páginas para detectar:
   - Excluidas por noindex
   - Detectadas pero no indexadas
   - Errores 4xx/5xx
   - Duplicados o soft 404
5. Solicitar indexación de las URLs prioritarias (Madrid, Barcelona, Valencia, Sevilla, etc.)

## Posibles mejoras de indexabilidad
- Asegurar que todas las páginas importantes tienen enlaces internos desde home y footer
- Evitar contenido demasiado thin en páginas de combinaciones
- Mantener lastmod actualizado cuando cambie contenido real
- No bloquear CSS/JS críticos (ya no se bloquean)
- Revisar que no haya `X-Robots-Tag: noindex` en headers (actualmente no hay)

## Merchant Center
- Generar feed con: `node scripts/generate-merchant-feed.js`
- Subir `merchant-center-products.json` (o convertir a CSV) en Merchant Center
- Revisar políticas de productos/servicios gratuitos antes de activar

## No hacer
- No reclamar perfiles de Google Maps de negocios cerrados
- No crear miles de páginas thin solo para el sitemap
