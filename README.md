# Vaishnavi Kedar — Design Portfolio

> Thoughtful digital experiences shaped by creativity, technology, and human connection.

🔗 **Live Website:** [https://vaishnvikedar6-jpg.github.io/design-portfolio-website/](https://vaishnvikedar6-jpg.github.io/design-portfolio-website/)

---

## 🛠️ Tech Stack

- **Framework:** React 19 + TypeScript + Vite
- **Styling:** Tailwind CSS + Radix UI primitives
- **Monorepo / Package Manager:** pnpm workspaces
- **Deployment:** GitHub Pages (via GitHub Actions)

---

## 💻 Local Development

1. **Install dependencies:**
   ```bash
   pnpm install
   ```

2. **Start development server:**
   ```bash
   pnpm --filter @workspace/vaishnavi-portfolio run dev
   ```

3. **Build for production:**
   ```bash
   pnpm --filter @workspace/vaishnavi-portfolio run build
   ```
   Output will be generated in `artifacts/vaishnavi-portfolio/dist/public`.

---

## 🚀 GitHub Pages Deployment

Every push to `main` triggers `.github/workflows/deploy.yml` to automatically build and deploy the portfolio to GitHub Pages.

To ensure GitHub Pages is enabled:
1. Go to repository **Settings** → **Pages**.
2. Under **Build and deployment** → **Source**, select **GitHub Actions**.
3. The site will publish to:
   `https://vaishnvikedar6-jpg.github.io/design-portfolio-website/`
