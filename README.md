# △ DevOps Portfolio

A fast, dependency-free portfolio site — **plain HTML, CSS & JS** — with a
minimal/premium aesthetic and high-craft motion (lerp smooth-scroll, a magnetic
custom cursor, split-text reveals, scroll-triggered animations, 3D tilt cards,
animated count-ups and a light/dark theme).

No framework, no build step. Just static files you can host anywhere.

```
portfolio/
├── index.html      # structure + content (edit me!)
├── styles.css      # design system + all animations
├── script.js       # interactions (cursor, smooth scroll, reveals…)
├── Dockerfile      # containerized nginx deploy
├── nginx.conf      # hardened static config
└── README.md
```

---

## 🚀 Preview locally

Any static server works. Pick one:

```bash
# Python (already on most machines)
python3 -m http.server 8080

# Node
npx serve .

# Docker (nginx, production-like)
docker build -t portfolio .
docker run --rm -p 8080:80 portfolio
```

Then open <http://localhost:8080>.

---

## ✏️ Make it yours

Everything you need to change is marked with `CUSTOMIZE:` comments in
`index.html`. The essentials:

| What | Where |
|------|-------|
| Name, title, meta/OG tags | top of `index.html` (`<head>`) |
| Nav logo / monogram | `.nav__logo` |
| Hero headline & intro | `.hero__title`, `.hero__lead` |
| Stats (years, uptime, deploys…) | `[data-count]` in the About section |
| Skills & tech tags | `.stack__grid` |
| Experience / timeline | `.timeline` |
| Projects | `.work__grid` |
| Email & socials | `.contact` + `.menu__foot` |

**Colors / accents** live as CSS variables at the top of `styles.css`:

```css
:root {
  --accent:   #7c5cff;  /* primary   */
  --accent-2: #23d5ab;  /* secondary */
  --accent-3: #ff7847;  /* tertiary  */
}
```

Change those three and the whole palette (gradients, glows, highlights)
updates. A `[data-theme="light"]` block right below defines the light theme.

**Animated count-ups** use data attributes:

```html
<span data-count="99.99" data-decimals="2" data-suffix="%">0</span>
```

---

## ☁️ Deploy

Because it's just static files, it drops onto anything. A few recipes:

### AWS S3 + CloudFront
```bash
aws s3 sync . s3://YOUR_BUCKET \
  --exclude "Dockerfile" --exclude "nginx.conf" --exclude "README.md" \
  --delete
# invalidate the CDN cache after each deploy
aws cloudfront create-invalidation --distribution-id YOUR_DIST_ID --paths "/*"
```

### GitHub Pages
Push these files to a repo and enable Pages (Settings → Pages → deploy from
branch `main` / root). Done.

### Netlify / Vercel / Cloudflare Pages
Drag-and-drop the folder, or connect the repo. Build command: *none*.
Publish directory: `.`

### Docker (any host / K8s)
```bash
docker build -t YOUR_REGISTRY/portfolio:latest .
docker push YOUR_REGISTRY/portfolio:latest
# then run it, or drop it in a Deployment + Service/Ingress
```

### Google Cloud / Azure
- **GCS**: `gsutil -m rsync -r -x 'Dockerfile|nginx.conf|README.md' . gs://YOUR_BUCKET`
  behind Cloud CDN.
- **Azure**: `az storage blob upload-batch -s . -d '$web'` on a Storage static
  website, front it with Azure CDN / Front Door.

---

## ♿ Accessibility & performance

- Respects `prefers-reduced-motion` — all heavy motion is disabled.
- Custom cursor / tilt / smooth-scroll are **desktop-only**; touch devices get
  native scrolling.
- Progressive enhancement: content is fully visible without JS.
- Zero runtime dependencies; fonts are the only external request (Google Fonts).
  Self-host them if you want a fully offline, single-origin build.

---

Built with HTML · CSS · JS.
