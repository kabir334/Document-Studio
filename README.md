# Document Studio

A local document-generation app for creating structured documents from templates and JSON data. Built as a personal engineering practice project.

## Quick start

```bash
npm install
npx playwright install chromium
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

`npm run dev` starts Vite and a local Playwright PDF server together. Chromium is required once for high-quality PDF export (print, not a screenshot).

## Workflow

1. Open **New document** or pick a template under **Templates**
2. Click **Load sample** for realistic JSON for that template
3. Preview updates from the JSON until you edit the layout
4. Use **Blocks** to add, reorder, delete, and edit sections
5. **Undo** / **Redo** (Ctrl+Z / Ctrl+Y) reverse layout edits
6. **Export PDF** when the status is Ready (validation must pass)
7. **Save draft** stores JSON, layout, and status in **My documents**

Status:

- **Draft** — missing required content
- **Ready** — valid and exportable
- **Exported** — PDF created; editing returns to Draft or Ready

Templates: Monthly Status Report, Professional Invoice, Certificate of Completion, Project Proposal.

## Tests

```bash
npm run test
```

## Project structure

```
src/
  app/           App shell and routing
  pages/         Overview, New Document, Templates, My documents
  components/    Sidebar, editors, preview, block list
  domain/        DocumentModel, blocks
  templates/     Template definitions
  services/      parse, build, render, validate, PDF client, storage
  hooks/         Undo/redo history helpers
server/
  pdf-server.mjs Playwright PDF service
```

## Tech stack

- React 19 + TypeScript + Vite
- Tailwind CSS 4
- Playwright (Chromium) for PDF
- React Router

## Documentation

- [Project idea](docs/project-idea.md)
- [Features overview](docs/features-overview.md)
- [Development plan and status](docs/project-development-analysis.md)

## Build

```bash
npm run build
npm run preview
```

PDF export during `vite preview` still needs `npm run pdf-server` in another terminal.
