"""Generate src/styles/project-themes.ts.

Each project's hue was sampled from its own case-study images (near-greys
discarded) and reconciled with the company's brand colour. Every token is then
fitted to the WCAG 2.2 contrast ratio its role demands against that theme's
background — 4.5:1 for text, 3:1 for rules — by moving lightness the minimum
distance needed, leaving hue and saturation alone.

    python3 scripts/make-project-themes.py     # prints the ratio table
    node scripts/audit-contrast.mjs            # verifies the rendered pages

Edit SPECS here rather than editing the generated file: hand-tuning a colour
can quietly drop it below its threshold.
"""
import colorsys, json

# ---------- WCAG 2.2 relative luminance + contrast ratio ----------
def lin(c):
    c /= 255
    return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4

def lum(rgb):
    r, g, b = (lin(x) for x in rgb)
    return 0.2126 * r + 0.7152 * g + 0.0722 * b

def ratio(a, b):
    la, lb = lum(a), lum(b)
    hi, lo = max(la, lb), min(la, lb)
    return (hi + 0.05) / (lo + 0.05)

def hsl(h, s, l):
    r, g, b = colorsys.hls_to_rgb(h / 360, l, s)
    return (round(r * 255), round(g * 255), round(b * 255))

def hexs(rgb):
    return '#%02x%02x%02x' % rgb

def unhex(h):
    h = h.lstrip('#')
    return tuple(int(h[i:i+2], 16) for i in (0, 2, 4))

def fit(rgb_seed, bg, target, go_darker):
    """Walk a colour's lightness AWAY FROM its seed, the minimum distance needed
    to clear `target` against bg. Hue and saturation are untouched, so a brand
    colour still reads as itself."""
    r, g, b = (c / 255 for c in rgb_seed)
    h, l0, s = colorsys.rgb_to_hls(r, g, b)
    if ratio(hsl(h * 360, s, l0), bg) >= target:
        return hsl(h * 360, s, l0)                    # already fine, leave it
    step = -0.005 if go_darker else 0.005
    L = l0
    for _ in range(400):
        L += step
        if not (0 <= L <= 1):
            break
        cand = hsl(h * 360, s, L)
        if ratio(cand, bg) >= target:
            return cand
    return hsl(h * 360, s, 0.02 if go_darker else 0.98)

# hue = the project's own dominant hue (measured from its imagery, reconciled
# with the company's brand colour). mode = which way the page reads.
SPECS = [
    ('issuu-design-system',     248, 'dark',   '#F05A28'),
    ('issuu-pricing',           266, 'bright', '#F05A28'),
    ('issuu-onboarding',        235, 'bright', '#F05A28'),
    ('issuu-homepage-preview',  350, 'dark',   '#F05A28'),
    ('plusdental-checkout',     208, 'dark',   '#2AB3A6'),
    ('plusdental-clinic-app',   192, 'bright', '#2AB3A6'),
    ('plusdental-photo-upload', 168, 'bright', '#2AB3A6'),
    ('savedo-ui-redesign',      214, 'dark',   '#4A90E2'),
    ('vivy-design-system',      258, 'bright', '#4ECDC4'),
    ('vivy-medical-id',         174, 'bright', '#4ECDC4'),
    ('fitness-website',          82, 'dark',   '#FF6B35'),
]

out, report = {}, []
for slug, h, mode, accent in SPECS:
    if mode == 'dark':
        bg       = hsl(h, 0.26, 0.055)
        fgStrong = hsl(h, 0.06, 0.985)
        fg       = hsl(h, 0.08, 0.90)
        muted    = hsl(h, 0.12, 0.62)
        rule     = hsl(h, 0.14, 0.30)
    else:
        bg       = hsl(h, 0.42, 0.955)
        fgStrong = hsl(h, 0.55, 0.075)
        fg       = hsl(h, 0.40, 0.15)
        muted    = hsl(h, 0.26, 0.40)
        rule     = hsl(h, 0.22, 0.72)

    # Every token is fitted to the threshold its role demands, so compliance
    # does not depend on the hue happening to be forgiving.
    go_darker = (mode == 'bright')
    fgStrong = fit(fgStrong, bg, 4.5, go_darker)    # headings
    fg       = fit(fg,       bg, 4.5, go_darker)    # body text
    muted    = fit(muted,    bg, 4.5, go_darker)    # secondary text
    acc      = fit(unhex(accent), bg, 4.5, go_darker)
    rule     = fit(rule,     bg, 3.0, go_darker)    # borders: UI threshold

    checks = {
        'heading  (AA large 3.0 / AAA 4.5)': (ratio(fgStrong, bg), 4.5),
        'body     (AA 4.5 / AAA 7.0)':       (ratio(fg, bg),       4.5),
        'muted    (AA 4.5)':                 (ratio(muted, bg),    4.5),
        'accent   (AA 4.5)':                 (ratio(acc, bg),      4.5),
        'rule     (AA UI 3.0)':              (ratio(rule, bg),     3.0),
    }
    out[slug] = {'mode': mode, 'bg': hexs(bg), 'fgStrong': hexs(fgStrong),
                 'fg': hexs(fg), 'muted': hexs(muted), 'rule': hexs(rule),
                 'accent': hexs(acc),
                 'ratios': {k.split()[0]: round(v, 2) for k, (v, _) in checks.items()}}
    report.append((slug, mode, checks))

print(f'{"project":26} {"mode":7} ' + ' '.join(f'{k.split()[0]:>8}' for k in report[0][2]))
allpass = True
for slug, mode, checks in report:
    cells = []
    for k, (v, need) in checks.items():
        ok = v >= need
        allpass &= ok
        cells.append(f'{v:7.2f}{"" if ok else "!"}')
    print(f'{slug:26} {mode:7} ' + ' '.join(cells) + f'   bg {out[slug]["bg"]}  accent {out[slug]["accent"]}')
print('\nALL PASS WCAG AA:', allpass)
json.dump(out, open('themes.json', 'w'), indent=1)
