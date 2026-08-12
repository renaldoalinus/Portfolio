// @ts-check
import { defineConfig } from 'astro/config';

// Astro's central config. Kept minimal on purpose — we'll add a `site`
// URL here once we know the final domain (needed for SEO + sitemaps).
export default defineConfig({
  // Prefetch pages on hover/viewport so navigation feels instant.
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'viewport',
  },
});
