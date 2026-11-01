# Document Studio

A local document-generation app for creating structured documents from templates and JSON or CSV data.

## Quick start (development)

```bash
npm install
npx playwright install chromium
npm run dev
```

Open [http://localhost:5173](http://localhost:5173). `npm run dev` runs Vite and the Playwright PDF server together.

## Docker (single container)

Build and run the app with UI + PDF export in one image:

```bash
docker compose up --build
```

Open [http://localhost:8080](http://localhost:8080). Chromium is included in the image; no separate `playwright install` on the host.

Production-style start without Docker:

```bash
npm run build
npm start
```

Serves the built app on port 8080 with PDF at `POST /api/pdf`.

## Workflow

1. **Templates** or **New document** — pick a layout
2. **Load sample**, **Load file** (.json / .csv), or use a saved **Data source**
3. Edit **blocks** (add, reorder, properties) — preview follows the block list
4. **Export PDF** (Playwright print, same HTML as preview) or **Download HTML**
5. **Save draft** — stores JSON, layout, and status in **My documents**
6. **Preferences** — default template, certificate color, footer name

Status: **Draft** (validation issues) → **Ready** (export enabled) → **Exported** after export.

## Certificate colors

On the certificate template, choose **Navy**, **Forest**, **Burgundy**, or **Gold** (frame and accents; text stays dark on light paper). Default color is set under **Preferences**.

## Data sources

Under **Design → Data sources**, paste or upload JSON/CSV, save, then **Use in document**. Multi-row CSV maps to invoice line items, report metrics, or proposal deliverables depending on the template.

## Tests

```bash
npm run test
```

## Tech stack

- React 19 + TypeScript + Vite + Tailwind CSS 4
- Playwright Chromium for PDF
- localStorage for drafts, sources, preferences, export history

## Documentation

- [Development plan and status](docs/project-development-analysis.md)
- [Project idea](docs/project-idea.md)
