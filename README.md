# NS Studio — Resume Builder

**Live demo → [ns-resume-builder.vercel.app](https://ns-resume-builder.vercel.app)**

NS Studio is a responsive, single-page web app for creating professional, polished resumes in minutes. It offers a live, side-by-side preview, deep visual customization (layouts, themes, typography), and high-fidelity PDF export — all running entirely in the browser, with your data saved locally so nothing is ever sent to a server.

---

## Features

### Multiple Layouts
Five distinct structural layouts, each defining how sections flow across the page:

- **Classic** — timeless sidebar + main-column hierarchy for traditional roles.
- **Modern** — single-column stacked layout with bold section separators.
- **Minimalist** — clean, high-whitespace, content-first design.
- **Executive** — content on the left, sidebar on the right; formal and dense.
- **Creative** — asymmetric grid to showcase visual flair.

### Theming & Typography
- **4 themes** — Default (burgundy), Blue, Teal, Purple — applied via CSS variables and a `data-theme` attribute, with smooth color transitions.
- **3 font families** — Inter, Roboto, Arial.

### Live Preview & Export
- **Real-time preview** — the resume updates instantly as you type.
- **Auto-fit scaling** — the A4 sheet scales to fit any viewport width.
- **PDF export** — print-quality export via the native browser print pipeline, preserving the selected layout, theme, and fonts.

### Persistence
- All content and customization (data, theme, layout, font) is saved to `localStorage`, so your progress survives refreshes. A one-click **Clear Progress** resets everything.

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
| PDF / Print | `react-to-print` |
| Icons | `lucide-react` |
| Tooling | Create React App (`react-scripts`), ESLint, Prettier |

---

## Getting Started

```bash
# install dependencies
yarn install

# start the dev server (http://localhost:3000)
yarn start

# production build
yarn build

# lint / format
yarn lint
yarn format
```

---

## Project Structure

```
src/
├── App/                # App shell, top bar, panes, responsive layout
│   ├── components/      # AppShell, AppBar, SectionRail, PreviewPane, MobileTabBar
│   ├── hooks/          # usePaneMode, usePreviewScale
│   └── sections/       # CVCustomizer, DownloadButton
├── features/
│   ├── ResumeForm/      # Editor: form steps, sections, shared inputs
│   └── ResumeTemplate/  # Rendered resume + layout configuration
├── store/              # Zustand store (resume data + UI settings)
├── constants/          # Themes, fonts, storage keys
├── data/               # Seed resume data
└── types.ts            # Shared domain types
```

---

## License

Private project. All rights reserved.
