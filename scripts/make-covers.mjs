#!/usr/bin/env node
/* ============================================================
   COVER ART GENERATOR
   ------------------------------------------------------------
   Reads every project in src/content/projects/*.md and writes
   an abstract SVG cover to public/covers/<slug>.svg.

   These are PLACEHOLDERS with intent: on-palette, hand-composed,
   and keyed to each project's `hue:` value so the work list reads
   as a family rather than five random pictures.

   To swap in a real screenshot later, either:
     a) drop a real image at public/covers/<slug>.svg (or .jpg and
        set `cover: /covers/<slug>.jpg` in the project frontmatter), or
     b) set `cover:` in the .md frontmatter to any path you like.

   Run:  npm run covers
   ============================================================ */

import { readdirSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = join(root, 'src/content/projects');
const OUT = join(root, 'public/covers');

const W = 1600;
const H = 1000;

/* --- tiny deterministic RNG so output never changes between runs --- */
function seeded(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return () => {
    h += 0x6d2b79f5;
    let t = h;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* --- palette derived from the project hue, anchored to brand peach ---
   TWO stops only, and every cover lands on the same blush. Rotating the
   hue across three saturated stops sends the midpoint through vivid
   magenta, which is off-brand — the real gradient (from the portrait) is
   a DESATURATED lavender drifting into peach. Letting sRGB interpolate
   between two low-chroma stops reproduces that softness. */
/* The brand arc runs lavender (245°) → blush (22°) the long way round,
   i.e. through violet and pink. Hues in the OTHER wedge (22°–245°:
   green, teal, blue) interpolate toward peach through mud, which reads
   off-brand instantly. Snap any stray hue to the nearer end of the arc
   so no project can land outside the palette. */
function brandHue(hue) {
  const h = ((hue % 360) + 360) % 360;
  if (h > 22 && h < 245) return h < 133.5 ? 22 : 245;
  return h;
}

function pal(hue) {
  return {
    a: `hsl(${brandHue(hue)} 52% 87%)`, // project hue — light, low chroma
    b: '#f6d3c4',                        // --blush, the constant landing point
    ink: '#14121c',
  };
}

const wht = (o) => `rgba(255,255,255,${o})`;
const ink = (o) => `rgba(20,18,28,${o})`;

/* ============================================================
   COMPOSITION ARCHETYPES
   Each is asymmetric on purpose — centred compositions are the
   generated-art tell. Each bleeds off at least one edge.
   ============================================================ */

// Layered planes receding — for systems / architecture stories.
function strata(p, r) {
  let s = '';
  for (let i = 0; i < 5; i++) {
    const y = 200 + i * 132;
    const w = 620 + i * 210 + r() * 70;
    // Third plane is ink — without a dark anchor the stack reads as a
    // loading skeleton rather than a composition.
    if (i === 2) {
      s += `<rect x="${-60 + i * 26}" y="${y}" width="${w * 0.62}" height="94" rx="47" fill="${ink(0.74)}"/>`;
      continue;
    }
    s += `<rect x="${-60 + i * 26}" y="${y}" width="${w}" height="94" rx="47" fill="${wht(0.62 - i * 0.07)}"/>`;
  }
  s += `<circle cx="1300" cy="${300 + r() * 90}" r="132" fill="${wht(0.4)}"/>`;
  return `<g transform="rotate(-4 800 500)">${s}</g>`;
}

// Modular grid, partially filled — for design-system work.
function lattice(p, r) {
  const cols = 7, rows = 4, cell = 122, gap = 26;
  const x0 = 620, y0 = 210;
  let s = '';
  for (let c = 0; c < cols; c++) {
    for (let w = 0; w < rows; w++) {
      const x = x0 + c * (cell + gap);
      const y = y0 + w * (cell + gap);
      const v = r();
      if (v < 0.34) continue;
      const rx = v > 0.86 ? cell / 2 : 18;
      s += `<rect x="${x}" y="${y}" width="${cell}" height="${cell}" rx="${rx}" fill="${wht(0.28 + v * 0.4)}"/>`;
    }
  }
  // one ink cell as the focal accent
  s += `<rect x="${x0 + 2 * (cell + gap)}" y="${y0 + (cell + gap)}" width="${cell}" height="${cell}" rx="18" fill="${ink(0.72)}"/>`;
  return s;
}

// Concentric arcs bleeding off-canvas — for flows / journeys.
function arc(p, r) {
  const cx = 210, cy = 880;
  let s = '';
  for (let i = 0; i < 4; i++) {
    const rad = 340 + i * 210;
    s += `<circle cx="${cx}" cy="${cy}" r="${rad}" fill="none" stroke="${wht(0.5 - i * 0.09)}" stroke-width="${58 - i * 8}"/>`;
  }
  s += `<circle cx="1210" cy="286" r="128" fill="${ink(0.75)}"/>`;
  s += `<circle cx="1408" cy="470" r="46" fill="${wht(0.62)}"/>`;
  return s;
}

// Staggered bars — for data / analytics stories.
function cadence(p, r) {
  const n = 12, bw = 74, gap = 34, base = 830;
  const x0 = 430;
  let s = '';
  for (let i = 0; i < n; i++) {
    const h = 120 + r() * 520;
    const x = x0 + i * (bw + gap);
    s += `<rect x="${x}" y="${base - h}" width="${bw}" height="${h}" rx="37" fill="${wht(0.3 + r() * 0.42)}"/>`;
  }
  const hi = 4;
  s += `<rect x="${x0 + hi * (bw + gap)}" y="${base - 640}" width="${bw}" height="640" rx="37" fill="${ink(0.72)}"/>`;
  return s;
}

// Nested rotating frames, pushed off the top-right corner — for brand work.
// Deliberately NOT centred: a centred concentric composition with a dot in
// the middle is the single most recognisable generated-art tell.
function aperture(p, r) {
  const cx = 1180, cy = 300;
  let s = '';
  for (let i = 0; i < 6; i++) {
    const sz = 900 - i * 132;
    s += `<rect x="${cx - sz / 2}" y="${cy - sz / 2}" width="${sz}" height="${sz}" rx="${52 + i * 12}"
            fill="none" stroke="${wht(0.5 - i * 0.06)}" stroke-width="${32 - i * 3}"
            transform="rotate(${i * 6 - 14} ${cx} ${cy})"/>`;
  }
  // Counterweight in the opposite corner, so the frame has somewhere to sit.
  s += `<rect x="140" y="700" width="360" height="112" rx="56" fill="${ink(0.7)}"/>`;
  s += `<rect x="140" y="856" width="196" height="112" rx="56" fill="${wht(0.55)}"/>`;
  return s;
}

const ARCHETYPES = [strata, lattice, arc, cadence, aperture];

/* ============================================================ */

function svg(slug, hue, index) {
  const p = pal(hue);
  const r = seeded(slug);
  const art = ARCHETYPES[index % ARCHETYPES.length](p, r);
  const id = slug.replace(/[^a-z0-9]/gi, '');

  // Vary the gradient axis per project so the set doesn't read as one
  // image recoloured five times.
  const gx = r() > 0.5 ? 1 : 0;
  const gy = 0.15 + r() * 0.85;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img">
  <defs>
    <linearGradient id="g${id}" x1="${1 - gx}" y1="0" x2="${gx}" y2="${gy.toFixed(2)}">
      <stop offset="0%" stop-color="${p.a}"/>
      <stop offset="100%" stop-color="${p.b}"/>
    </linearGradient>
    <radialGradient id="v${id}" cx="34%" cy="26%" r="86%">
      <stop offset="0%" stop-color="rgba(255,255,255,.42)"/>
      <stop offset="100%" stop-color="rgba(255,255,255,0)"/>
    </radialGradient>
    <filter id="n${id}" x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" stitchTiles="stitch"/>
      <feColorMatrix type="saturate" values="0"/>
    </filter>
    <clipPath id="c${id}"><rect width="${W}" height="${H}"/></clipPath>
  </defs>

  <g clip-path="url(#c${id})">
    <rect width="${W}" height="${H}" fill="url(#g${id})"/>
    <rect width="${W}" height="${H}" fill="url(#v${id})"/>
    ${art}
    <rect width="${W}" height="${H}" filter="url(#n${id})" opacity="0.055" style="mix-blend-mode:multiply"/>
  </g>
</svg>
`;
}

/* --- read frontmatter, write files --- */
mkdirSync(OUT, { recursive: true });

const files = readdirSync(SRC).filter((f) => f.endsWith('.md')).sort();
let n = 0;

files.forEach((file, i) => {
  const slug = file.replace(/\.md$/, '');
  const raw = readFileSync(join(SRC, file), 'utf8');
  const fm = raw.split('---')[1] ?? '';
  const hue = Number((fm.match(/^hue:\s*(\d+)/m) ?? [])[1] ?? 265);

  writeFileSync(join(OUT, `${slug}.svg`), svg(slug, hue, i));
  n++;
  console.log(`  ✓ ${slug}.svg  (hue ${hue}, ${ARCHETYPES[i % ARCHETYPES.length].name})`);
});

console.log(`\nWrote ${n} cover${n === 1 ? '' : 's'} to public/covers/`);
