# YOU-ONE Fastening Systems — website

A static rebuild of [youonefastening.com](http://www.youonefastening.com/) as a fast,
modern, dependency-free site ready for GitHub Pages.

> The original was a WordPress site (3clicks theme + Revolution Slider). This version is
> plain HTML/CSS/JS — no build step, no database, no plugins to keep patched.

## Pages

| File | Purpose |
| --- | --- |
| `index.html` | Home — hero, seven product families, company intro, capabilities, factory gallery |
| `products.html` | Full catalog with sticky section nav: every gauge, crown and type |
| `about.html` | Company story, capabilities, milestones, photo gallery, all three locations |
| `contact.html` | Inquiry form + head office, sales office and factory details |
| `404.html` | Not-found page (GitHub Pages serves this automatically) |

## Structure

```
.
├── index.html · products.html · about.html · contact.html · 404.html
├── assets/
│   ├── css/style.css      # complete design system (tokens, components, responsive)
│   ├── js/main.js         # nav, scroll-reveal, scroll-spy, contact form
│   └── img/
│       ├── brand/         # logos
│       ├── products/      # product photography
│       └── factory/       # plant photos
├── .nojekyll              # tells GitHub Pages to serve files as-is
├── robots.txt · sitemap.xml
```

## Publishing to GitHub Pages

```bash
git add -A
git commit -m "Rebuild YOU-ONE website as a static site"
git branch -M main
git remote add origin https://github.com/<user>/<repo>.git
git push -u origin main
```

Then in the repository: **Settings → Pages → Source: Deploy from a branch → `main` / `/ (root)`**.

The site goes live at `https://<user>.github.io/<repo>/` in a minute or two.

### Using the real domain

To serve it at `www.youonefastening.com`:

1. Add a file named `CNAME` at the repo root containing exactly `www.youonefastening.com`.
2. At the DNS provider, point `www` to `<user>.github.io` with a CNAME record.
3. In **Settings → Pages**, enter the custom domain and tick **Enforce HTTPS**.

## Local preview

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

## Contact form

The form is static, so it has no server. On submit it opens the visitor's email client with
everything pre-filled and addressed to `fastener@naver.com` (see `data-mailto-form` in
`contact.html`).

To receive submissions as real email instead, sign up at [Formspree](https://formspree.io)
and change the form tag in `contact.html`:

```html
<form action="https://formspree.io/f/YOUR_ID" method="POST">
```

then delete the `data-mailto-form` attribute so `main.js` stops intercepting the submit.

## Editing content

- **Colours, spacing, type** — the `:root` block at the top of `assets/css/style.css`.
  The whole site keys off `--accent` (`#ff6a13`), so one line restyles it.
- **Products** — each family in `products.html` is one `<article class="cat-block">`
  with `<div class="spec-group">` lists inside. Copy a block to add a family.
- **Navigation** — the header markup is duplicated across the four pages; edit
  `index.html` first, then mirror the `<header>` and `.mobile-nav` blocks.
- **Images** — drop new files into `assets/img/products/` and reference them by path.

## Notes

- No external JavaScript dependencies. Only Google Fonts is loaded from a CDN.
- Fully responsive down to 360px, with a dedicated mobile nav.
- Respects `prefers-reduced-motion`.
- Includes Open Graph/Twitter cards and Organization structured data for search engines.
