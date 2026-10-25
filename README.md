# Document Studio

A local document-generation app for creating structured documents from templates and JSON data. Built as a personal engineering practice project.

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Workflow

1. Open **New document** or pick a template under **Templates**
2. Click **Load sample** for realistic JSON for that template
3. Preview updates live; **Export PDF** when valid
4. **Save draft** stores work in **My documents** (browser local storage)

Templates: Monthly Status Report, Professional Invoice, Certificate of Completion, Project Proposal.

## Tests

```bash
npm run test
```

## Project structure

```
src/
  app/           App shell and routing
  pages/         Overview, New Document, Coming Soon
  components/    Sidebar, TemplatePicker, JsonEditor, DocumentPreview
  domain/        DocumentModel and Template types
  templates/     Template definitions (Simple Report)
  services/      parseJson, buildDocument, renderHtml, exportPdf
  data/          Sample JSON payload
docs/
  project-idea.md        Presentable project pitch
  features-overview.md   Feature list (POC vs future)
  concept-ui-mockup.html Concept UI for the New Document screen
```

## Tech stack

- React 19 + TypeScript + Vite
- Tailwind CSS 4
- html2pdf.js (client-side PDF export)
- React Router

## Documentation

- [Project idea](docs/project-idea.md) — what this project is and why
- [Features overview](docs/features-overview.md) — what's implemented vs planned
- [Engineering brief](../document-generation-project-brief.md) — full brainstorming notes

## Build

```bash
npm run build
npm run preview
```
