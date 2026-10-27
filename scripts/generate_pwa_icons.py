from pathlib import Path
from PIL import Image, ImageDraw

root = Path(__file__).resolve().parents[1] / "public"

for size, name in [
    (192, "pwa-icon-192.png"),
    (512, "pwa-icon-512.png"),
    (512, "pwa-icon-maskable-512.png"),
    (180, "apple-touch-icon.png"),
]:
    scale = 4
    edge = size * scale
    image = Image.new("RGB", (edge, edge), "#111310")
    draw = ImageDraw.Draw(image)
    unit = edge / 64
    radius = round(14 * unit)
    draw.rounded_rectangle((0, 0, edge - 1, edge - 1), radius=radius, fill="#111310")
    orange = "#ff7849"
    line = round(5 * unit)
    points = [(15 * unit, 20 * unit), (27 * unit, 32 * unit), (15 * unit, 44 * unit)]
    draw.line(points, fill=orange, width=line, joint="curve")
    draw.line([(35 * unit, 44 * unit), (49 * unit, 44 * unit)], fill=orange, width=line)
    r = line / 2
    for x, y in [points[0], points[-1], (35 * unit, 44 * unit), (49 * unit, 44 * unit)]:
        draw.ellipse((x - r, y - r, x + r, y + r), fill=orange)
    image.resize((size, size), Image.Resampling.LANCZOS).save(root / name, optimize=True)
