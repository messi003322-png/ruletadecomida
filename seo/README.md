# Pack SEO CTR + AI Overviews

## Contenido

| Archivo | Uso |
|---------|-----|
| `titles-descriptions-ciudades.json` | Titles y meta descriptions optimizados para CTR |
| `city-table-faq-snippet.html` | Tabla + FAQ semántico para páginas de ciudad |
| `apply-titles.md` | Instrucciones de aplicación |

## Objetivo
- Más **clics** (mejor CTR en Search Console)
- Más **impresiones** (contenido estructurado que Google/IA puede citar)
- Sin técnicas de riesgo

## Próximo paso técnico
Integrar un post-procesador en `static-build.js` que:
1. Lea el JSON de titles.
2. Inyecte tabla + FAQ en HTML de ciudades (reemplazando `{{CIUDAD}}`).
3. Actualice title y description en el head.
