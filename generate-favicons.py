from pathlib import Path
from PIL import Image

OUT = Path.cwd() / "dist"
source = OUT / "logo.png"

if not source.exists():
    raise SystemExit("No se encontró dist/logo.png para generar los iconos del sitio.")

image = Image.open(source).convert("RGBA")

# La imagen se ajusta a un lienzo cuadrado transparente, conservando siempre el logotipo completo.
def make_icon(size: int) -> Image.Image:
    canvas = Image.new("RGBA", (size, size), (255, 255, 255, 0))
    source_copy = image.copy()
    source_copy.thumbnail((int(size * 0.88), int(size * 0.88)), Image.Resampling.LANCZOS)
    offset = ((size - source_copy.width) // 2, (size - source_copy.height) // 2)
    canvas.alpha_composite(source_copy, offset)
    return canvas

sizes = {
    "favicon-16x16.png": 16,
    "favicon-32x32.png": 32,
    "favicon-48x48.png": 48,
    "apple-touch-icon.png": 180,
    "android-chrome-192x192.png": 192,
    "android-chrome-512x512.png": 512,
}

icons = {}
for filename, size in sizes.items():
    icon = make_icon(size)
    icon.save(OUT / filename, "PNG", optimize=True)
    icons[size] = icon

# favicon.ico ofrece el fallback que Chrome busca automáticamente en la raíz del dominio.
icons[32].save(OUT / "favicon.ico", format="ICO", sizes=[(16, 16), (32, 32), (48, 48)])
print("Favicons generados desde el logotipo de Ruleta de Comida.")
