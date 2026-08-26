# Piloto SEO P0

## Cohorte inicial

La primera cohorte será **Madrid y Barcelona** porque permiten comparar dos mercados grandes con intenciones locales distintas. Se probarán diez familias de comida: **pizza, hamburguesa, sushi, kebab, tacos, burritos, paella, tapas, ramen y pasta**.

Cada familia se revisará en las cuatro intenciones de momento existentes —desayuno, almuerzo, merienda y cena—, pero solo se escalará una combinación cuando el texto, la elección gastronómica y los datos sean coherentes con ese momento.

## Muestra y control

La muestra inicial debe incluir las URL de ciudad/comida/momento y las variantes que ya reciban impresiones. Se seleccionará una cohorte de control equivalente, sin cambios de snippet durante el primer ciclo, para separar el efecto de la optimización del crecimiento general del sitio.

| Dimensión | Cohorte piloto | Cohorte de control |
|---|---|---|
| Ciudades | Madrid y Barcelona | Dos ciudades comparables no modificadas |
| Comidas | Diez familias prioritarias | Diez familias comparables |
| Cambios | Datos, copy, enlaces, schema válido y UX | Sin cambios de copy durante el periodo |
| Duración | 28 días desde publicación | 28 días |
| Métrica primaria | Clics orgánicos por URL y por consulta | Clics orgánicos por URL y por consulta |
| Guardarraíles | Errores 5xx/429, CTR, indexación, velocidad, rebote técnico | Mismos controles |

## Instrumentación

Cada URL debe registrar plantilla, ciudad, comida, momento, fecha de publicación, versión de contenido y variante de título. Search Console se analizará por URL y consulta. La analítica de producto separará visitas orgánicas de tráfico social, referencia, newsletter y directo.

El informe semanal incluirá impresiones, clics, CTR, posición media, consultas nuevas, URL indexadas, estado de sitemap, errores, velocidad y eventos de producto. Las anotaciones de despliegue deben registrar el commit y la fecha exacta.

## Regla de expansión

Se ampliará una plantilla cuando el piloto muestre mejora frente al control sin deteriorar indexación, velocidad, calidad visible ni errores. Si una plantilla aumenta impresiones pero reduce el CTR, se corrige el snippet antes de escalar. Si obtiene impresiones y clics pero la interacción es baja, se mejora el producto. Si no obtiene impresiones, se revisan intención, enlazado, autoridad, sitemap y cobertura antes de generar más variantes.

No se usarán clics artificiales, scraping de resultados de Google, reseñas inventadas, ratings falsos, cloaking, doorway pages, texto oculto ni enlaces pagados que transmitan ranking.

## Definition of done

El piloto se considerará técnicamente listo cuando las URL seleccionadas tengan un solo H1 principal, title y canonical coherentes, HTML útil sin depender de una interacción, schema que describa contenido visible, enlaces internos funcionales, sitemap correcto, respuesta estable y datos locales con fuente y fecha.
