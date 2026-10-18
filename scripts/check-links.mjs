// Verifies that every internal link and asset in the built site resolves to a file in dist/.
// External links are skipped so CI stays fast and offline-safe.
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const dist = process.argv[2] ?? 'dist';
const base = (process.env.SITE_BASE ?? '/automation').replace(/\/$/, '');

const htmlFiles = [];
const walk = (dir) => {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p);
    else if (p.endsWith('.html')) htmlFiles.push(p);
  }
};
walk(dist);

const ids = new Map(
  htmlFiles.map((f) => [f, new Set([...readFileSync(f, 'utf8').matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]))]),
);

const pageFor = (path) => {
  const clean = path.replace(/\/$/, '');
  const candidates = [join(dist, clean), join(dist, clean, 'index.html'), join(dist, `${clean}.html`)];
  return candidates.find((c) => existsSync(c) && statSync(c).isFile());
};

const broken = [];
for (const file of htmlFiles) {
  const html = readFileSync(file, 'utf8');
  for (const [, url] of html.matchAll(/\s(?:href|src)="([^"]+)"/g)) {
    if (/^(https?:|mailto:|tel:|data:|javascript:)/.test(url) || url.startsWith('//')) continue;
    if (url.startsWith('#')) {
      if (url.length > 1 && !ids.get(file).has(url.slice(1))) broken.push([file, url]);
      continue;
    }
    if (!url.startsWith('/')) continue;
    if (base && !url.startsWith(`${base}/`) && url !== base) {
      broken.push([file, `${url} (missing base ${base})`]);
      continue;
    }
    const [path, hash] = url.slice(base.length).split('#');
    const target = pageFor(path.split('?')[0] || '/');
    if (!target) broken.push([file, url]);
    else if (hash && target.endsWith('.html') && !ids.get(target)?.has(hash)) broken.push([file, url]);
  }
}

if (broken.length) {
  console.error(`Found ${broken.length} broken internal link(s):`);
  for (const [file, url] of broken) console.error(`  ${relative(dist, file)} → ${url}`);
  process.exit(1);
}
console.log(`Checked ${htmlFiles.length} page(s): all internal links resolve.`);
