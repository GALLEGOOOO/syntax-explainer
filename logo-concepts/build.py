import math, cairosvg
from PIL import Image, ImageDraw, ImageFont
FG = '#f4f4f5'; BG = '#0b0b0f'

def hexpts(cx, cy, r):
    return [(cx + r*math.cos(math.radians(a)), cy + r*math.sin(math.radians(a))) for a in range(-90, 270, 60)]
def P(pts): return ' '.join(f'{x:.2f},{y:.2f}' for x, y in pts)

# Cada concepto: (defs, contenido) en un lienzo de 128x128, color FG
def c1():  # bocadillo de hover con caret recortado
    bubble = 'M34 28 H94 A14 14 0 0 1 108 42 V74 A14 14 0 0 1 94 88 H56 L38 104 V88 H34 A14 14 0 0 1 20 74 V42 A14 14 0 0 1 34 28 Z'
    caret = 'M59 44 H69 V72 H59 Z'
    return ('', f'<path d="{bubble} {caret}" fill="{FG}" fill-rule="evenodd"/>')
def c2():  # < i >
    s = f'fill="none" stroke="{FG}" stroke-width="11" stroke-linecap="round" stroke-linejoin="round"'
    return ('', f'<polyline points="40,40 18,64 40,88" {s}/><polyline points="88,40 110,64 88,88" {s}/>'
                f'<circle cx="64" cy="40" r="7.5" fill="{FG}"/><line x1="64" y1="60" x2="64" y2="90" {s}/>')
def c3():  # cubo isométrico con una faceta recortada y un punto
    cx, cy, r = 64, 64, 46
    h = hexpts(cx, cy, r)  # 0 arriba, 1 sup-dcha, 2 inf-dcha, 3 abajo, 4 inf-izq, 5 sup-izq
    C = (cx, cy)
    g = 3.2  # medio hueco entre caras
    def shrink(poly, k):  # encoge el polígono hacia su centroide
        mx = sum(p[0] for p in poly)/len(poly); my = sum(p[1] for p in poly)/len(poly)
        return [(mx+(x-mx)*k, my+(y-my)*k) for x, y in poly]
    top = shrink([h[5], h[0], h[1], C], 0.86)
    left = shrink([h[5], C, h[3], h[4]], 0.86)
    right = shrink([C, h[1], h[2], h[3]], 0.8)
    rmx = sum(p[0] for p in right)/4; rmy = sum(p[1] for p in right)/4
    return ('', f'<polygon points="{P(top)}" fill="{FG}"/>'
                f'<polygon points="{P(left)}" fill="{FG}" opacity="0.72"/>'
                f'<polygon points="{P(right)}" fill="none" stroke="{FG}" stroke-width="6" stroke-linejoin="round"/>'
                f'<circle cx="{rmx:.2f}" cy="{rmy:.2f}" r="7" fill="{FG}"/>')
def c4():  # I-beam con bocadillo pequeño
    s = f'fill="none" stroke="{FG}" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"'
    ibeam = (f'<path d="M30 40 Q42 40 46 50 Q50 40 62 40" {s}/>'
             f'<path d="M30 104 Q42 104 46 94 Q50 104 62 104" {s}/>'
             f'<line x1="46" y1="50" x2="46" y2="94" {s}/>')
    bub = 'M82 20 H100 A10 10 0 0 1 110 30 V44 A10 10 0 0 1 100 54 H90 L78 64 V53 A10 10 0 0 1 72 44 V30 A10 10 0 0 1 82 20 Z'
    return ('', ibeam + f'<path d="{bub}" fill="{FG}"/>')

NAMES = {1: ('hover-bubble', c1), 2: ('brackets-info', c2), 3: ('iso-facet', c3), 4: ('ibeam-bubble', c4)}
def svg(fn, bg):
    defs, body = fn()
    back = f'<rect width="128" height="128" rx="28" fill="{BG}"/>' if bg else ''
    return f'<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128"><defs>{defs}</defs>{back}{body}</svg>\n'

tiles = []
for i, (name, fn) in NAMES.items():
    for bg, suf in ((True, ''), (False, '-transparent')):
        base = f'{i}-{name}{suf}'
        s = svg(fn, bg); open(base + '.svg', 'w').write(s)
        cairosvg.svg2png(bytestring=s.encode(), write_to=base + '.png', output_width=512, output_height=512)
        if bg:
            cairosvg.svg2png(bytestring=s.encode(), write_to=f'/tmp/{i}-32.png', output_width=32, output_height=32)
            cairosvg.svg2png(bytestring=s.encode(), write_to=f'/tmp/{i}-16.png', output_width=16, output_height=16)

W, H = 4*300+40, 420
sheet = Image.new('RGB', (W, H), '#1c1c22'); d = ImageDraw.Draw(sheet)
try: font = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 26); sm = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 16)
except Exception: font = sm = ImageFont.load_default()
for k, (i, (name, _)) in enumerate(NAMES.items()):
    x = 20 + k*300
    big = Image.open(f'{i}-{name}.png').convert('RGBA').resize((240, 240), Image.LANCZOS)
    sheet.paste(big, (x+10, 60), big)
    d.text((x+10, 18), f'{i}  {name}', fill='#f4f4f5', font=font)
    s32 = Image.open(f'/tmp/{i}-32.png').convert('RGBA'); s16 = Image.open(f'/tmp/{i}-16.png').convert('RGBA')
    sheet.paste(s32, (x+10, 330), s32); sheet.paste(s16, (x+56, 338), s16)
    t = Image.open(f'{i}-{name}-transparent.png').convert('RGBA').resize((32, 32), Image.LANCZOS)
    sheet.paste(t, (x+86, 330), t)
    d.text((x+130, 336), '32 · 16 · sin fondo', fill='#9ca3af', font=sm)
sheet.save('sheet.png'); print('ok')
