// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

// GitHub Pages serves this repo at https://theobreorg.github.io/automation/.
// SITE_BASE lets local previews and other hosts (e.g. Netlify, a custom domain) build at "/".
const base = process.env.SITE_BASE ?? '/automation';

export default defineConfig({
  site: process.env.SITE_URL ?? 'https://theobreorg.github.io',
  base,
  trailingSlash: 'ignore',
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
  },
});
