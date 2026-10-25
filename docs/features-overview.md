# Document Studio — Features Overview

## Concept UI

- **Dashboard (Overview)** — see [`../../image.png`](../../image.png) at the project root
- **New document screen** — open [`concept-ui-mockup.html`](./concept-ui-mockup.html) in a browser

## App shell

The application uses a sidebar grouped into three areas:

### Workspace
- **Overview** — dashboard with document/template counts and quick-start action
- **New document** — the main POC workflow (template + data + preview)
- **My documents** — placeholder (coming soon)

### Design
- **Templates** — placeholder (coming soon; template selection lives on New document for now)
- **Components** — placeholder (coming soon)
- **Data sources** — placeholder (coming soon)

### Settings
- **Preferences** — placeholder (coming soon)

## POC features (implemented)

| Feature | Description |
|---------|-------------|
| Template selection | Choose from predefined templates (currently: Simple Report) |
| JSON input | Paste or edit JSON data in a text area |
| Load sample | One-click fill with example data |
| Live preview | Document renders in-browser as you type valid JSON |
| PDF export | Download the previewed document as a PDF file |

## Placeholder features

Sidebar items for My Documents, Templates, Components, Data Sources, and Preferences are visible but route to a "Coming soon" page. This shows the intended product shape without building those areas yet.

## Example JSON input

```json
{
  "title": "Monthly Report",
  "author": "Sample Author",
  "date": "2026-10-01",
  "summary": "Project progress summary.",
  "items": [
    "Development",
    "Testing",
    "Review"
  ]
}
```

## Future features by phase

### Phase 2 — Templates and components
- Multiple document templates (invoice, certificate, proposal)
- Reusable sections: headings, text blocks, tables, images
- Template library page

### Phase 3 — Interactive editor
- Add, remove, and reorder document sections
- Edit component properties with live preview
- Undo and redo

### Phase 4 — Data and output variety
- CSV and local file data sources
- Multiple export formats (DOCX, HTML download)
- Data source configuration UI

### Phase 5 — Advanced capabilities
- Conditional sections (show/hide based on data)
- Themes and branding
- Document versioning and generation history
