import { chromium } from '/Users/renaldo/.npm/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs';
const b = await chromium.launch({ executablePath: '/Users/renaldo/Library/Caches/ms-playwright/chromium-1200/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing' });
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
const slugs = ['issuu-design-system','issuu-pricing','issuu-onboarding','issuu-homepage-preview','plusdental-checkout','plusdental-clinic-app','plusdental-photo-upload','savedo-ui-redesign','vivy-design-system','vivy-medical-id','fitness-website'];

const helper = () => {
  // Let the browser parse any colour syntax (rgb, rgba, color(srgb ...),
  // color-mix output) by painting it and reading the pixel back.
  const cv = document.createElement('canvas'); cv.width = cv.height = 1;
  const ctx = cv.getContext('2d', { willReadFrequently: true });
  const px = (str) => {
    ctx.clearRect(0,0,1,1); ctx.fillStyle = '#000';
    ctx.fillStyle = str;
    if (ctx.fillStyle === '#000' && !/^#0{3,6}$|black|rgb\(0, 0, 0\)/i.test(str)) return null;
    ctx.clearRect(0,0,1,1); ctx.fillRect(0,0,1,1);
    const d = ctx.getImageData(0,0,1,1).data;
    return { rgb: [d[0], d[1], d[2]], a: d[3] / 255 };
  };
  const lin = c => { c/=255; return c<=0.04045 ? c/12.92 : Math.pow((c+0.055)/1.055, 2.4); };
  const lum = ([r,g,bl]) => 0.2126*lin(r)+0.7152*lin(g)+0.0722*lin(bl);
  const bgOf = el => {
    const stack = [];
    for (let n = el; n; n = n.parentElement) {
      const c = px(getComputedStyle(n).backgroundColor);
      if (!c || c.a === 0) continue;
      stack.push(c);
      if (c.a >= 0.999) break;
    }
    let base = stack.length && stack[stack.length-1].a >= 0.999 ? stack.pop().rgb : [255,255,255];
    for (let i = stack.length - 1; i >= 0; i--) {
      const { rgb, a } = stack[i];
      base = base.map((c, k) => rgb[k]*a + c*(1-a));
    }
    return base;
  };
  const ratio = (f,bg) => { const a=lum(f), c=lum(bg); const hi=Math.max(a,c), lo=Math.min(a,c); return (hi+0.05)/(lo+0.05); };
  const check = (sel, label) => {
    const el = document.querySelector(sel); if (!el) return null;
    const cs = getComputedStyle(el);
    const fg = px(cs.color); if (!fg) return null;
    const size = parseFloat(cs.fontSize), bold = parseInt(cs.fontWeight) >= 700;
    const isLarge = size >= 24 || (size >= 18.66 && bold);
    const req = isLarge ? 3.0 : 4.5;
    const r = ratio(fg.rgb, bgOf(el));
    return { label, px: Math.round(size), large: isLarge, ratio: +r.toFixed(2), req, pass: r >= req };
  };
  return [
    ['.case__title','title'], ['.case__subtitle','subtitle'], ['.case__content p','body'],
    ['.case__meta-label','meta label'], ['.case__meta-value','meta value'],
    ['.case__sidenav-item','rail active'], ['.case__sidenav-item:not(.is-active)','rail idle'],
    ['.case__sidenav-label','rail label'], ['.case__eyebrow','eyebrow/accent'],
    ['.case__stat-value','stat value'], ['.case__stat-label','stat caption'],
    ['.case__impact-head span','impact label'], ['.case__back','back link'],
  ].map(([s,l]) => check(s,l)).filter(Boolean);
};

let fails = [], total = 0;
for (const s of slugs) {
  await p.goto(`http://localhost:4321/work/${s}/`, { waitUntil: 'networkidle' });
  await p.waitForTimeout(250);
  const rows = await p.evaluate(helper);
  total += rows.length;
  const bad = rows.filter(r => !r.pass);
  bad.forEach(r => fails.push({ slug: s, ...r }));
  console.log(`${s.padEnd(24)} min ${Math.min(...rows.map(r=>r.ratio)).toFixed(2)}  (${rows.length} checks)${bad.length ? '  ← ' + bad.map(r=>`${r.label} ${r.ratio}`).join(', ') : ''}`);
}
console.log(`\n${total - fails.length}/${total} pass WCAG AA`);
if (fails.length) console.log(JSON.stringify(fails, null, 1));
await b.close();
