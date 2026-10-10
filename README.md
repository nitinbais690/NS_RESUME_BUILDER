# NS Studio — Resume Builder

**Live demo → [ns-resume-builder.vercel.app](https://ns-resume-builder.vercel.app)**

Build a polished, professional resume in minutes, right in your browser. NS Studio gives you a live preview, six layouts, writing tips, a job-description matcher, real PDF export and shareable links. Everything is stored on your device, so your resume never touches a server.

---

## Contents

- [Highlights](#highlights)
- [Features](#features)
- [Keyboard shortcuts](#keyboard-shortcuts)
- [Privacy & data](#privacy--data)
- [Tech stack](#tech-stack)
- [Getting started](#getting-started)
- [Deploying to Vercel](#deploying-to-vercel)
- [Project structure](#project-structure)
- [How it works](#how-it-works)
- [Testing](#testing)
- [Troubleshooting](#troubleshooting)
- [License](#license)

---

## Highlights

- **Live preview.** The A4 resume updates as you type and scales to fit any screen.
- **Six layouts, including ATS-safe.** The ATS layout downloads as a true PDF with selectable text.
- **Writing help.** Tips on every bullet, a job-description match score and a completeness checklist.
- **Smooth editing.** Drag to reorder, click the preview to jump to a field, and fast keyboard shortcuts.
- **Several resumes.** Keep tailored versions, back them up as JSON, and share a read-only link.
- **Works everywhere.** Phone and tablet layouts, dark mode, and accessible, labelled form fields.

---

## Features

### Layouts & styling

| Layout | Best for |
| --- | --- |
| **Classic** | Sidebar + main column; traditional roles |
| **Modern** | Single column with bold section separators |
| **Minimalist** | High whitespace, content first |
| **Executive** | Main content left, sidebar right; formal and dense |
| **Creative** | Asymmetric grid with visual flair |
| **ATS-safe** | Plain single column that applicant tracking systems parse reliably |

- **Themes.** Burgundy, Blue, Teal and Purple, plus a **custom accent color** picker.
- **Fonts.** Inter, Roboto or Arial, with a **font size** slider from 80% to 125%.
- **QR code (optional).** A small code in the header that links to your LinkedIn or GitHub.
- **Dark mode** for the editor: System, Light or Dark. The resume itself always stays white, because that's what gets printed.

### Writing help

- **Bullet tips** appear under each Key Impact and description line. They flag bullets with no numbers, weak openers ("Responsible for…", "Worked on…"), "I/we", and bullets that are too long or too short.
- **Job match.** Paste a job ad to get a keyword match score, the keywords you're missing (one click adds them to Skills), and suggestions. It runs entirely in your browser.
- **Completeness checklist.** Click the progress ring for concrete next steps, such as "Add 1 more skill · +10%". Each step links to the right form section.

### Editing

- **Drag to reorder** Key Impact, Skills, Tools, Experience, Projects, Education and Certifications, by mouse, touch or keyboard.
- **Click to edit.** Click any part of the preview to open that section and focus the exact field.
- **Undo / redo** for every content change.
- **Section navigation.** An icon rail on desktop; a swipeable row of section buttons on phones and tablets.

### Export & sharing

- **Download PDF.**
  - The *ATS-safe* layout is rendered by **react-pdf**: real text, standard Helvetica, and entries that never split across pages.
  - The styled layouts use the browser's print dialog ("Save as PDF"), which keeps the exact on-screen design.
- **One-page check.** A badge shows whether the resume fits on one A4 page. It draws dashed lines where pages break and offers a one-click **Shrink text**.
- **Multiple resumes.** Keep versions like "Mobile Lead" and "Frontend". You can create blank, duplicate, rename and delete them from the resume menu in the top bar.
- **Export / import JSON** to back up a resume or move it to another browser.
- **Read-only share link.** The whole resume is packed into the link itself (see [Privacy & data](#privacy--data)). People who open it can download a PDF or make their own editable copy.

### Responsive

- **Desktop (≥ 1024px):** the editor and preview sit side by side.
- **Phone & tablet:** one pane at a time. A floating button switches between Edit and Preview and shows your progress through the sections. Inputs use 16px text so iOS doesn't zoom in when you tap a field.

---

## Keyboard shortcuts

| Shortcut | Action |
| --- | --- |
| <kbd>⌘/Ctrl</kbd> + <kbd>Z</kbd> | Undo |
| <kbd>⌘/Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>Z</kbd> (or <kbd>Ctrl</kbd> + <kbd>Y</kbd>) | Redo |
| <kbd>Enter</kbd> in a Skill / Tool / Impact row | Add the next row and move to it |
| <kbd>Shift</kbd> + <kbd>Enter</kbd> in an Impact | New line inside the same bullet |
| <kbd>Backspace</kbd> in an empty row | Remove the row and go back to the previous one |
| <kbd>↑</kbd> / <kbd>↓</kbd> at the start/end of a row | Move to the previous / next row |
| <kbd>Space</kbd> on a ⋮⋮ handle, then <kbd>↑</kbd>/<kbd>↓</kbd>, <kbd>Space</kbd> | Reorder with the keyboard (<kbd>Esc</kbd> cancels) |
| <kbd>Esc</kbd> | Close menus and dialogs |

---

## Privacy & data

- **Nothing is uploaded.** Your resumes, settings and the last job ad you pasted are saved in your browser's `localStorage` under the key `ns_cv_resume_data`.
- **Job match runs locally.** It's keyword analysis in the browser; no AI service or API is called.
- **Share links carry the data themselves.** The resume is compressed into the part of the link after `#`, and browsers never send that part to the server. Anyone who has the link can read the resume, so share it like you'd share the PDF. A link is a snapshot: after you edit, create a new link.
- **Clearing your browser data deletes your resumes.** Use **Export as JSON** from the resume menu to keep a backup.

---

## Tech stack

| Concern | Choice |
| --- | --- |
| Language | TypeScript (strict mode) |
| UI | React 19 |
| Routing | React Router 7 (form sections, `/view` share page) |
| State | Zustand with `persist` (localStorage, versioned migrations) |
| Styling | SCSS + CSS custom properties (themes, dark mode) |
| PDF | `@react-pdf/renderer` (ATS layout, lazy-loaded) · `react-to-print` (styled layouts) |
| Drag & drop | `@dnd-kit` |
| Sharing | `lz-string` (link compression) · `qrcode` |
| Icons | `lucide-react` |
| Tooling | Vite · Vitest + Testing Library · ESLint · Prettier |
| Hosting | Vercel (static) |

---

## Getting started

### Prerequisites

- **Node.js 22+** (Vite 8 needs at least 20.19; `package.json` declares `>=22`)
- **Yarn 1** (the repo uses `yarn.lock`)

### Install & run

```bash
yarn install
```

```bash
yarn start
```

Then open http://localhost:3000.

### Scripts

| Command | What it does |
| --- | --- |
| `yarn start` / `yarn dev` | Start the Vite dev server on port 3000 |
| `yarn build` | Type-check, then build for production into `build/` |
| `yarn preview` | Serve the production build locally |
| `yarn test` | Run tests in watch mode (Vitest) |
| `yarn test:run` | Run all tests once |
| `yarn lint` | Lint with ESLint |
| `yarn format` | Format with Prettier |

---

## Deploying to Vercel

The app is a static Vite build. [`vercel.json`](vercel.json) already sets:

- the build command (`yarn build`)
- the output folder (`build/`)
- a rewrite rule so links like `/view` and `/impact` work when opened directly

### One-time setup

```bash
npm i -g vercel
```

```bash
vercel login
```

```bash
vercel link
```

`vercel link` connects this folder to the existing Vercel project by creating `.vercel/`, which is already git-ignored.

Then in the Vercel dashboard, go to **Project → Settings → Build & Deployment**:

- Set **Framework Preset** to **Vite** (or **Other**).
- Make sure **Node.js Version** is **22.x**.

### Every release

1. Check that the tests pass and the build works:

   ```bash
   yarn test:run && yarn build
   ```

2. Deploy a preview. It gets its own URL so you can check it first:

   ```bash
   vercel
   ```

3. Publish to production:

   ```bash
   vercel --prod
   ```

### Optional: deploy automatically on push

In **Project → Settings → Git**, connect `nitinbais690/NS_RESUME_BUILDER`. From then on, every push to `main` goes to production, and every other branch or pull request gets a preview URL.

---

## Project structure

```
.
├── index.html              # Vite entry; applies the saved color scheme before first paint
├── vite.config.ts          # Vite + Vitest config (output folder: build/)
├── vercel.json             # Vercel build settings + SPA rewrite
├── public/                 # Favicons, manifest, robots.txt
└── src/
    ├── main.tsx            # React root + global styles
    ├── App/
    │   ├── components/     # AppShell, AppBar, ResumeMenu, ShareDialog, JobMatchDialog,
    │   │                   # SharedView (/view), PreviewPane, CompletenessBar, SectionRail, …
    │   ├── hooks/          # useColorScheme, useJumpToField, useContentHeight, usePreviewScale, …
    │   ├── sections/       # CVCustomizer (style popover), DownloadButton
    │   └── styles/         # main.scss (shell), features.scss (newer UI), _mixins.scss
    ├── features/
    │   ├── ResumeForm/     # Form steps, sections, shared inputs, drag & drop, bullet tips
    │   ├── ResumeTemplate/ # On-screen resume + per-layout section order (layoutConfig.ts)
    │   └── ResumePdf/      # react-pdf ATS document + export (loaded only when needed)
    ├── lib/                # Pure, tested logic: resumeIO, share, bulletLint, jobMatch,
    │                       # completeness, pageFit
    ├── store/              # Zustand store: resumes, style, undo history, persistence
    ├── constants/          # Themes, fonts, layouts, factories, storage key
    ├── data/               # Sample resume shown on first visit
    ├── global.scss         # Design tokens, light/dark palettes, base styles
    └── types.ts            # Shared domain types
```

---

## How it works

**State.** A single [Zustand store](src/store/useResumeStore.ts) holds every resume.

- The *active* resume's content (`resumeData`) and style (`theme`, `layout`, `fontFamily`, `accentColor`, `fontScale`, `qrTarget`) sit at the top level, so components read them directly.
- All saved versions live in a `resumes` map. Switching resumes swaps the active one in and out, and clears the undo history.
- The store is saved to `localStorage` with a schema `version`. Older single-resume saves are migrated automatically into the first resume.

**Styling.** SCSS with CSS custom properties.

- Dark mode overrides the color tokens under `html[data-color-scheme="dark"]`.
- The resume sheet is pinned back to the light palette, so the preview and printouts always look right.

**PDF.**

- Styled layouts print the live preview with `react-to-print`.
- The ATS layout is rebuilt with `@react-pdf/renderer` primitives for real text and proper page breaks. react-pdf (about 1.2 MB) is its own chunk, loaded only when someone downloads an ATS PDF.

**Share links.**

- The format is `/view#<data>`, where `<data>` is the resume and its style, compressed with `lz-string`.
- On open, the data is validated and cleaned up (`normalizeResumeData` / `normalizeStyle`), so a tampered or truncated link can't break the page.

**Backup files.** JSON exports use this format:

```json
{
  "app": "ns-studio-resume",
  "version": 1,
  "name": "Mobile Lead",
  "style": { "theme": "default", "layout": "classic", "fontFamily": "Inter, sans-serif", "accentColor": null, "fontScale": 1, "qrTarget": "none" },
  "data": { "Contact": { "Name": "…" }, "About Me": "…", "Key Impact": ["…"], "Experience": [] }
}
```

Unknown keys are dropped and missing fields are filled with defaults, so hand-edited files still load.

---

## Testing

Tests use **Vitest**, **Testing Library** and **jsdom**:

```bash
yarn test:run
```

They cover:

- the store: editing, undo/redo, reordering, multiple resumes, and migrating old saves
- JSON import/export and share-link round trips
- bullet tips, job matching, the completeness checklist and the page-fit math
- form accessibility (labels linked to fields) and the keyboard flow
- react-pdf output (a valid A4 PDF that breaks long content onto more pages)

---

## Troubleshooting

| Problem | Fix |
| --- | --- |
| `yarn start` fails or the old dev server misbehaves | Stop any old `react-scripts` server on port 3000, then run `yarn install` and `yarn start` again. |
| `The specified token is not valid` (Vercel) | Run `vercel login` again. |
| Vercel build fails with a Node or Vite error | Set **Node.js Version** to 22.x and **Framework Preset** to Vite in the project settings. |
| Refreshing `/view` or a form step shows a 404 | Make sure `vercel.json`, with its `rewrites` rule, is committed. |
| A share link says it has no resume | The link was cut off when it was copied. Copy it again with the dialog's **Copy** button. |
| The resume spills onto page 2 | Use **Shrink text** on the badge, lower **Size** in Customize, or tighten long bullets. |
| My resumes disappeared | `localStorage` was cleared (private window, cleared site data, or another browser). Import your JSON backup. |

---

## License

Private project. All rights reserved.
