Document Studio — Development Plan and Status

Project summary

Document Studio is a local application for producing structured documents from templates and structured input data. The work is organized in four phases, from a minimal end-to-end flow to broader template, editing, and data capabilities. This document records the planned scope per phase and implementation status as development proceeds.

Last updated: November 2026


Phase 1 — Foundation and first working flow

Scope

Establish the application shell and deliver one complete path: select a template, supply data, preview the document, and export to PDF.

Features

- Project definition and documentation — Purpose, feature outline, and concept screens for the workspace. Status: Complete.

- Application navigation — Sidebar with workspace, design, and settings areas; placeholder entries for later phases. Status: Complete.

- Overview screen — Entry dashboard and path to create a new document. Status: Complete.

- New document workflow — Template selection, data input, live preview, and PDF export on one screen. Status: Complete.

- Document preview — Isolated preview styling so content remains readable in the UI and in exported PDF. Status: Complete.

- Core generation pipeline — Separation of data parsing, document assembly, HTML rendering, and export. Status: Complete.

- Unit tests for generation logic — Automated checks on parsing, assembly, and rendering. Status: Complete.

- Export and validation polish — Clear validation feedback; export disabled when data is invalid. Status: Complete.

Phase note

Phase 1 is complete.


Phase 2 — Templates and document building blocks

Scope

Support multiple document types and a structure built from reusable sections rather than a single fixed layout.

Features

- Additional templates — Monthly Status Report, Professional Invoice, Certificate of Completion, and Project Proposal. Status: Complete.

- Templates area — Dedicated screen to browse templates and open the new-document flow. Status: Complete.

- Component-based document model — Document represented as blocks (headings, paragraphs, meta, tables, lists, callouts, totals) with per-template themes. Status: Complete.

- Template registry — Central registration and selection of available templates. Status: Complete.

- My documents (initial) — Local browser storage for saved drafts; open and delete from a list. Status: Complete.

- Polished document output — Theme-specific layouts and explicit dark text on light backgrounds for preview and PDF. Status: Complete.

Phase note

Phase 2 is complete.


Phase 3 — Interactive editing

Scope

Allow structural changes in the interface: add, remove, and reorder content blocks, edit properties, and support undo for main actions.

Features

- Block editor — Add, remove, and reorder document sections or components. Status: Complete.

- Property editing — Edit fields for the selected block with preview updates. Status: Complete.

- Undo and redo — Reversible editing actions. Status: Complete.

- Document lifecycle states — Simple states such as draft, ready, and exported. Status: Complete.

- Pre-export validation — Checks for required content before export. Status: Complete.

- Playwright PDF export — Chromium print of the same HTML as preview; not a screenshot. Status: Complete.

Phase note

Phase 3 is complete. PDF export requires the local PDF server (started with the app).


Phase 4 — Data sources, exports, and settings

Scope

Broaden input and output options and complete key settings areas currently held as placeholders.

Features

- Data sources — JSON file and CSV input mapped to template fields; saved sources and use in document flow. Status: Complete.

- Unified data access — Common loaders for JSON paste, file upload, and saved sources. Status: Complete.

- Additional export formats — HTML download using the same rendered document as preview and PDF. Status: Complete.

- Shared layout for outputs — One HTML render path for preview, PDF, and HTML file. Status: Complete.

- Preferences — Default template, certificate color, and footer studio name. Status: Complete.

- Components catalog — Read-only reference page for block types. Status: Complete.

- Certificate color accents — Navy, forest, burgundy, and gold palettes on certificate output. Status: Complete.

- Generation history — Recent PDF and HTML exports on Overview. Status: Complete.

- Docker packaging — Single container serves the built UI and Playwright PDF API on port 8080. Status: Complete.

Phase note

Phase 4 is complete.


Overall phase status

- Phase 1: Complete
- Phase 2: Complete
- Phase 3: Complete
- Phase 4: Complete

Checkpoint — November 2026

Phase 4 delivered: data sources (JSON/CSV), HTML export, preferences and branding footer, certificate color accents, components catalog, export history, and Docker deployment.
