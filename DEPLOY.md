# Deploy (pick ONE — Option A takes ~2 minutes)

**A. Netlify drag-and-drop (easiest, no GitHub needed)**
1. Open https://app.netlify.com/drop and sign in.
2. Drag the folder `vaishnavi-portfolio-site` (the built site, from `site-build.zip`) onto the page.
3. Copy the `https://….netlify.app` link, open it in a private window, and test it.

**B. GitHub Pages (your repo `design-portfolio-website`)**
1. Replace the repo contents with this project and push to `main`.
2. Repo → Settings → Pages → Source: **GitHub Actions**.
3. The included workflow (`.github/workflows/deploy.yml`) builds and publishes automatically.
   Your link is https://vaishnvikedar6-jpg.github.io/design-portfolio-website/

**Local preview:** `pnpm install` then `pnpm --filter @workspace/vaishnavi-portfolio run dev`
**Local build:**   `pnpm --filter @workspace/vaishnavi-portfolio run build` → `artifacts/vaishnavi-portfolio/dist/public`
