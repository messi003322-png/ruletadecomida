# Auditoría SEO P0 y monetización — estado 2026-08-29

## Alcance

Se mantiene la salida estática completa de **204.049 páginas HTML**. La estrategia conserva las URLs, sitemap indexado y rutas internas existentes; no se han aplicado técnicas black hat.

## Validaciones locales de esta iteración

| Control | Resultado |
|---|---:|
| HTML generado | 204.049 |
| Páginas con el nuevo integrador publicitario | 204.049 |
| Copias del identificador nuevo en `dist/index.html` | 1 |
| Referencias a Adsterra, Monetag, Adcash, JuicyAds y scripts publicitarios anteriores | 0 |
| Auditoría SEO: títulos, descripciones, canonical, H1, robots y schema de rating | PASS; 0 incidencias en los contadores auditados |
| Auditoría de sitemap | PASS; 5 sitemaps, 204.049 URLs únicas y host canónico correcto |
| Enlaces internos | PASS; 1.616.608 enlaces, 0 rotos |
| Sintaxis de `scripts/advertising-scripts.js` | PASS |

## Cambios de monetización

Se sustituyó el bloque publicitario anterior por el nuevo script ofuscado proporcionado por el propietario del sitio. El nuevo bloque usa `minBid=0`, `popundersPerIP=0` y el payload de `siteId` indicado en la solicitud. El integrador es idempotente: elimina integraciones históricas conocidas y deja una sola copia del nuevo bloque por página, al final del documento antes de `</body>`.

> La carga efectiva, el CPM y los ingresos dependen de la red, la demanda disponible, el consentimiento, el país del usuario, bloqueadores y las políticas de la plataforma. La presencia del script no garantiza un ingreso mínimo.

## Git y Vercel

| Elemento | Estado |
|---|---|
| Commit anterior | `39f9888` — integración publicitaria anterior |
| Commit pendiente | Sustitución del bloque nuevo solicitado en esta iteración |
| Rama | `main` |
| Repositorio | `messi003322-png/ruletadecomida` |
| Despliegue de integración | `dpl_89KSU6ZAmqoBjTzMcY25VR6SZ4Mm` |
| Despliegue final con auditoría | `dpl_6uV3PZUpspbs9q8mjquSxRrVSNgN` |
| Objetivo | `production` |
| Estado de integración anterior | `BUILDING` en la última consulta |
| Validación local del nuevo bloque | **PASS** |
| Estado del despliegue final | `QUEUED` en la última consulta |
| URL de despliegue | `https://ruletadecomidalisto-4tr0whyan-ruleta-de-comida.vercel.app/` |

La validación local alcanzó el mensaje `[advertising-scripts] 204049 HTML pages updated with one new publisher script; previous ad integrations removed.` No se observaron errores de compilación en el filtro de errores. La URL temporal respondió con redirección SSO de Vercel, por lo que la comprobación HTTP pública final queda pendiente de que el despliegue final pase a `READY`.

## Pendientes de verificación

Confirmar `READY` en Vercel y revisar la homepage pública en `https://www.ruletadecomida.es`, incluyendo la ruleta en móvil, la respuesta de los recursos JavaScript y la presencia del nuevo bloque publicitario. La indexación y los clics orgánicos deben medirse en Search Console; las cifras objetivo son escenarios, no garantías.
