# NS Studio — Resume Builder

**Live demo → [ns-resume-builder.vercel.app](https://ns-resume-builder.vercel.app)**

NS Studio is a responsive, single-page web app for creating professional, polished resumes in minutes. It offers a live, side-by-side preview, deep visual customization (layouts, themes, typography), and high-fidelity PDF export — all running entirely in the browser, with your data saved locally so nothing is ever sent to a server.

---

## Features

### Multiple Layouts
Six structural layouts, each defining how sections flow across the page:

- **Classic** — timeless sidebar + main-column hierarchy for traditional roles.
- **Modern** — single-column stacked layout with bold section separators.
- **Minimalist** — clean, high-whitespace, content-first design.
- **Executive** — content on the left, sidebar on the right; formal and dense.
- **Creative** — asymmetric grid to showcase visual flair.
- **ATS-safe** — plain single column that applicant tracking systems parse reliably; downloads as a real PDF (react-pdf) with selectable text and clean page breaks.

### Theming & Typography
- **4 themes** — Default (burgundy), Blue, Teal, Purple — plus a **custom accent color** picker.
- **3 font families** — Inter, Roboto, Arial — and a **font size** slider (80–125%).
- **Dark mode** for the editor (System / Light / Dark). The resume itself always stays print-white.
- Optional **QR code** in the resume header linking to your LinkedIn or GitHub.

### Writing Help
- **Bullet tips** flag missing numbers, weak openers ("Responsible for…"), first person, and bullets that are too long or too short.
- **Job match** — paste a job ad to get a keyword match score, missing keywords (one click adds them to Skills) and suggestions. Runs entirely on your device.
- **Completeness checklist** — the progress ring opens a list of next steps ("Add 1 more skill · +10%").

### Smooth Editing
- **Drag to reorder** impacts, skills, tools, experience, projects, education and certifications (mouse, touch or keyboard).
- **Click the preview** to jump straight to that field in the form.
- **Keyboard flow** — Enter adds the next bullet, Backspace on an empty one removes it, ⌘Z / ⌘⇧Z undo and redo.

### Live Preview & Export
- **Real-time preview** — the resume updates instantly as you type.
- **Auto-fit scaling** — the A4 sheet scales to fit any viewport width.
- **PDF export** — styled layouts use the browser print pipeline (exact on-screen design); the ATS layout renders a true PDF with react-pdf.
- **One-page check** — a badge shows whether the resume fits one A4 page, with page-break guides and a one-click "Shrink text".

### Resumes, Backup & Sharing
- **Multiple resumes** — keep versions like "Mobile Lead" and "Frontend"; create blank, duplicate, rename, delete.
- **Export / import JSON** — back up a resume or move it to another browser.
- **Read-only share link** — the whole resume is compressed into the link's `#hash` (never sent to a server). Viewers can download a PDF or make an editable copy.
- Everything is saved to `localStorage`; older saves migrate automatically.

### Responsive
- Desktop shows the editor and preview side by side with a section icon rail.
- On smaller screens, a bottom tab bar toggles between the editor and preview panes.

---

## Tech Stack

| Concern | Choice |
| --- | --- |
| Language | TypeScript (strict mode) |
| UI | React 19 |
| Routing | React Router 7 (section navigation + `?pane` state) |
| State | Zustand with `persist` middleware (localStorage) |
| Styling | SCSS with CSS variables (theme injection via `data-theme`) |
| PDF / Print | `@react-pdf/renderer` (ATS, lazy-loaded), `react-to-print` (styled layouts) |
| Drag & drop | `@dnd-kit` |
| Sharing | `lz-string` (link compression), `qrcode` |
| Icons | `lucide-react` |
| Tooling | Vite, Vitest + Testing Library, ESLint, Prettier |

---

## Getting Started

```bash
# install dependencies
yarn install

# start the dev server (http://localhost:3000)
yarn start

# production build (type-checks first, outputs to build/)
yarn build

# tests (watch mode / single run)
yarn test
yarn test:run

# lint / format
yarn lint
yarn format
```

---

## Deploying to Vercel

The app is a static Vite build. `vercel.json` already sets the build command (`yarn build`), the output folder (`build/`) and the SPA rewrite so routes like `/view` and `/impact` work when opened directly. The Node version comes from `engines` in `package.json` (Vite needs Node 20.19+).

### One-time setup

```bash
# install the CLI (skip if `vercel --version` works)
npm i -g vercel

# log in (opens the browser)
vercel login

# link this folder to the existing project (creates .vercel/, already git-ignored)
vercel link
```

In the Vercel dashboard → **Project → Settings → Build & Deployment**, set **Framework Preset** to **Vite** (or **Other**). `vercel.json` overrides the build command and output folder either way.

### Every release

```bash
# 1. make sure it builds and tests pass locally
yarn test:run
yarn build

# 2. deploy a preview (gets its own URL to check first)
vercel

# 3. promote to production (ns-resume-builder.vercel.app)
vercel --prod
```

### Optional: auto-deploy on push

In the dashboard → **Project → Settings → Git**, connect `nitinbais690/NS_RESUME_BUILDER`. After that, every push to `main` deploys to production and every other branch or PR gets a preview URL, so the CLI steps above are only needed for manual deploys.

### Troubleshooting

| Problem | Fix |
| --- | --- |
| `The specified token is not valid` | Run `vercel login` again. |
| Build fails with a Node/Vite version error | Check **Settings → Build & Deployment → Node.js Version** is 22.x (or remove the override so `engines` applies). |
| Refreshing `/view` or a form step shows 404 | Make sure `vercel.json` (with the `rewrites` rule) is committed. |
| Old version still showing | Hard-refresh; the HTML isn't cached, but the browser may hold the old tab. |

---

## Project Structure

```
src/
├── App/                # App shell, top bar, panes, responsive layout
│   ├── components/      # AppShell, AppBar, ResumeMenu, ShareDialog, JobMatchDialog, SharedView, …
│   ├── hooks/          # usePaneMode, usePreviewScale, useJumpToField, useColorScheme, …
│   └── sections/       # CVCustomizer, DownloadButton
├── features/
│   ├── ResumeForm/      # Editor: form steps, sections, shared inputs, drag & drop
│   ├── ResumeTemplate/  # Rendered resume + layout configuration
│   └── ResumePdf/       # react-pdf ATS document + export
├── lib/                # Pure logic: import/export, share links, bullet tips, job match, page fit
├── store/              # Zustand store (multiple resumes, style, history)
├── constants/          # Themes, fonts, storage keys
├── data/               # Seed resume data
└── types.ts            # Shared domain types
```

---

## License

Private project. All rights reserved.
