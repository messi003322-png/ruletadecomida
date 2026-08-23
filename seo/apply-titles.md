# Cómo aplicar titles y descriptions optimizados

## Archivo de datos
`seo/titles-descriptions-ciudades.json`

## Aplicación manual (rápida)
1. Abre cada página listada en el JSON.
2. Sustituye el `<title>` por el valor `title`.
3. Sustituye o añade:
   ```html
   <meta name="description" content="...">
   ```
4. Mantén el canonical y `robots` = index,follow.

## Aplicación automática (recomendado)
Como el sitio se construye desde `sitio_usuario_estatico.zip`, la forma limpia es:
1. Extraer el ZIP.
2. Ejecutar un script de post-proceso que reemplace title/description según el path.
3. Volver a comprimir o dejar que `static-build.js` lo haga.

## Prioridad de aplicación (máximo impacto CTR)
1. Home `/`
2. `/madrid/` `/barcelona/` `/valencia/` `/sevilla/`
3. `/cena-rapida/` `/comida-barata/` `/que-cenar-hoy/` `/no-se-que-cenar/`
4. Resto de capitales

## Medición en Search Console
- Espera 7–14 días.
- Filtra por URL y compara CTR antes/después.
- Las queries con muchas impresiones y CTR bajo son las que más suben al mejorar title/description.
