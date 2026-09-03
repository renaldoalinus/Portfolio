// Per-project colour themes.
//
// Each project's hue comes from its own imagery — sampled across its
// case-study images, with near-greys discarded so only real colour votes
// count — reconciled with the company's brand colour. Every project's
// pictures are light (they are UI screenshots on white), so lightness could
// not tell them apart; hue is what actually differs, and mode alternates
// across the set so browsing does not read as one long page.
//
// Every colour below is fitted to the WCAG 2.2 contrast ratio its role
// demands, measured against that theme's own background:
//
//   headings, body, secondary text, accent   >= 4.5:1  (AA normal text)
//   rules and borders                        >= 3.0:1  (AA UI components)
//
// The fitting moves a colour's lightness the minimum distance needed and
// leaves hue and saturation alone, so a brand colour still reads as itself.
// Measured ratios are noted per theme. Regenerate rather than hand-edit:
// changing a value by hand can quietly break a threshold.

export interface ProjectTheme {
  mode: 'dark' | 'bright';
  bg: string;
  fgStrong: string;
  fg: string;
  muted: string;
  rule: string;
  accent: string;
}

export const projectThemes: Record<string, ProjectTheme> = {
  // 248° · heading 19.03:1 · body 15.43:1 · muted 6.55:1 · accent 5.81:1 · rule 3.01:1
  'issuu-design-system': {
    mode: 'dark',
    bg: '#0b0a12',
    fgStrong: '#fbfbfb',
    fg: '#e4e3e8',
    muted: '#9692aa',
    rule: '#5e5a77',
    accent: '#f05a28',
  },
  // 266° · heading 17.09:1 · body 14.8:1 · muted 6.51:1 · accent 4.51:1 · rule 3.07:1
  'issuu-pricing': {
    mode: 'bright',
    bg: '#f3eff8',
    fgStrong: '#12091e',
    fg: '#241736',
    muted: '#624b81',
    rule: '#9581ae',
    accent: '#c83c0e',
  },
  // 235° · heading 17.22:1 · body 15.05:1 · muted 6.69:1 · accent 4.5:1 · rule 3.06:1
  'issuu-onboarding': {
    mode: 'bright',
    bg: '#eff0f8',
    fgStrong: '#090a1e',
    fg: '#171936',
    muted: '#4b5081',
    rule: '#8387af',
    accent: '#c83c0e',
  },
  // 350° · heading 18.89:1 · body 15.39:1 · muted 6.76:1 · accent 5.77:1 · rule 3.02:1
  'issuu-homepage-preview': {
    mode: 'dark',
    bg: '#120a0c',
    fgStrong: '#fbfbfb',
    fg: '#e8e3e4',
    muted: '#aa9296',
    rule: '#73575b',
    accent: '#f05a28',
  },
  // 208° · heading 18.71:1 · body 15.45:1 · muted 7.16:1 · accent 7.47:1 · rule 3.01:1
  'plusdental-checkout': {
    mode: 'dark',
    bg: '#0a0e12',
    fgStrong: '#fbfbfb',
    fg: '#e3e6e8',
    muted: '#929faa',
    rule: '#53606d',
    accent: '#2ab3a6',
  },
  // 192° · heading 16.43:1 · body 12.84:1 · muted 4.57:1 · accent 4.53:1 · rule 3.04:1
  'plusdental-clinic-app': {
    mode: 'bright',
    bg: '#eff6f8',
    fgStrong: '#09191e',
    fg: '#172f36',
    muted: '#4b7681',
    rule: '#68949e',
    accent: '#1d7d74',
  },
  // 168° · heading 16.04:1 · body 12.1:1 · muted 4.6:1 · accent 4.58:1 · rule 3.04:1
  'plusdental-photo-upload': {
    mode: 'bright',
    bg: '#eff8f6',
    fgStrong: '#091e19',
    fg: '#17362f',
    muted: '#46796f',
    rule: '#62988d',
    accent: '#1d7d74',
  },
  // 214° · heading 18.71:1 · body 15.34:1 · muted 7.03:1 · accent 5.88:1 · rule 3.04:1
  'savedo-ui-redesign': {
    mode: 'dark',
    bg: '#0a0e12',
    fgStrong: '#fbfbfb',
    fg: '#e3e5e8',
    muted: '#929daa',
    rule: '#556070',
    accent: '#4a90e2',
  },
  // 258° · heading 17.14:1 · body 14.93:1 · muted 6.67:1 · accent 4.56:1 · rule 3.01:1
  'vivy-design-system': {
    mode: 'bright',
    bg: '#f2eff8',
    fgStrong: '#0f091e',
    fg: '#201736',
    muted: '#5b4b81',
    rule: '#9184b0',
    accent: '#227973',
  },
  // 174° · heading 16.01:1 · body 12.07:1 · muted 4.58:1 · accent 4.55:1 · rule 3.02:1
  'vivy-medical-id': {
    mode: 'bright',
    bg: '#eff8f7',
    fgStrong: '#091e1c',
    fg: '#173632',
    muted: '#467973',
    rule: '#629893',
    accent: '#237d77',
  },
  // 82° · heading 18.26:1 · body 15.31:1 · muted 7.81:1 · accent 6.67:1 · rule 3.03:1
  'fitness-website': {
    mode: 'dark',
    bg: '#0f120a',
    fgStrong: '#fbfbfb',
    fg: '#e6e8e3',
    muted: '#a1aa92',
    rule: '#5b644c',
    accent: '#ff6b35',
  },
};

// Projects without an entry fall back to the neutral dark the site started
// with, so a new project renders sensibly before it gets a theme.
export const fallbackTheme: ProjectTheme = {
  mode: 'dark',
  bg: '#0a0a0a',
  fgStrong: '#ffffff',
  fg: '#e8e8e8',
  muted: '#9a9a9a',
  rule: '#3a3a3a',
  accent: '#8fa8e8',
};
