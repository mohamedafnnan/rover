# DAWN · Deployment

DAWN compiles to a fully static bundle. Any host that can serve HTML + JS + JSON works.

## Build

```bash
npm install
npm run build
```

`dist/` contains everything: `index.html`, chunked JS, CSS, and the `content/` JSON files.

## Local preview

```bash
npm run preview
```

Serves `dist/` on `http://localhost:4173` for a smoke-test before deploying.

## Deploy targets

### Netlify

```bash
netlify deploy --prod --dir=dist
```

Or drag `dist/` into the Netlify UI. No build settings required.

### Vercel

```bash
vercel --prod
```

Or connect the repo — Vercel auto-detects Vite (`framework: vite`, output `dist`).

### GitHub Pages

Set `base` in `vite.config.js` to your repo path (e.g. `/dawn-3d/`) before building. Push `dist/` to the `gh-pages` branch.

### Cloudflare Pages

Framework preset **Vite**, build command `npm run build`, output directory `dist`.

### Custom / nginx

```
server {
  root  /var/www/dawn-3d/dist;
  index index.html;
  location /content/ { add_header Cache-Control "public, max-age=300"; }
  location /assets/  { add_header Cache-Control "public, max-age=31536000, immutable"; }
  location / {
    try_files $uri /index.html;
  }
}
```

## Runtime notes

- The team portraits, sponsor logos, and rover photos are pulled directly from `https://fisatrover.in` at runtime. The site expects an internet connection.
- If `fisatrover.in` ever goes offline, mirror its `images/` folder into `/public/media/` and adjust URLs in `content/team.json`, `content/sponsors.json`, `content/rover.json`, `content/gallery.json` (one search-and-replace).
- Recommended cache policy: `content/*.json` for 5 minutes (so a content edit is live in minutes), everything else in `assets/` with a year-long immutable header (Vite fingerprints filenames).

## Health checks

After deploy, confirm:

- `GET /` returns HTML in < 300 ms.
- `GET /content/team.json` returns valid JSON with the current roster.
- `?a11y=1` renders the full plain-HTML view.
- Boot overlay disappears within 3 s on a mid-range laptop.
