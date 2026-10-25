# Document Studio

A local document-generation app for creating structured documents from templates and JSON data. Built as a personal engineering practice project.

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## POC workflow

1. Open the app and go to **New document**
2. Select the **Simple Report** template
3. Click **Load sample** to fill example JSON
4. See the live preview update
5. Click **Export PDF** to download the document

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
