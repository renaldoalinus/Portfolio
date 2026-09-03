import { defineCollection, z } from 'astro:content';

// A "content collection" = a folder of Markdown files that all share
// the same shape. Here we define what fields every project needs.
// The `z.` bits validate your input, so if you forget a field or make
// a typo, the site tells you clearly instead of breaking silently.
const projects = defineCollection({
  type: 'content',
  schema: z.object({
    title:     z.string(),                 // the case study headline
    company:   z.string(),                 // employer / client — used to GROUP on the homepage
    role:      z.string(),                 // your role on this project
    timeframe: z.coerce.string(),          // e.g. "2023" — coerce so a bare year works too
    summary:   z.string(),                 // one line under the title
    // Headline impact numbers, shown as a band under the project title.
    // Outcomes only — targets and research findings do not belong here.
    metrics:   z.array(z.object({ value: z.string(), label: z.string() })).default([]),
    // Optional qualifier for the band, e.g. how the numbers were measured.
    metricsNote: z.string().optional(),
    tags:      z.array(z.string()).default([]),
    // Ordering + emphasis on the homepage.
    order:     z.number().default(99),     // lower = higher up within its company
    featured:  z.boolean().default(false), // featured tier gets larger treatment
    // Visual placeholder tint (0–360). Feeds the generated cover art
    // (npm run covers) and the accent on the case-study page.
    hue:       z.number().default(265),
    // The project's opening image, shown full-width above the body. This is
    // the presentation cover from the original Adobe deck, not a content
    // figure — projects whose first image is mid-article simply have none.
    cover:     z.string().optional(),
    // Case-study page accent color (eyebrow, highlights) and card thumbnail.
    accent:    z.string().default('#8fa8e8'),
    thumb:     z.string().optional(),
    draft:     z.boolean().default(false), // hide from the site while WIP
  }),
});

// Metadata about each company, so the homepage chapter headers can
// show your role + dates without repeating it on every project.
const companies = defineCollection({
  type: 'data',
  schema: z.object({
    name:      z.string(),
    role:      z.string(),
    timeframe: z.string(),
    blurb:     z.string(),
    order:     z.number().default(99),     // controls chapter order on homepage
  }),
});

export const collections = { projects, companies };
