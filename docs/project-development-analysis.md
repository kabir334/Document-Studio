Document Studio — Development Plan and Status

Project summary

Document Studio is a local application for producing structured documents from templates and structured input data. The work is organized in four phases, from a minimal end-to-end flow to broader template, editing, and data capabilities. This document records the planned scope per phase and implementation status as development proceeds.

Last updated: October 2026


Phase 1 — Foundation and first working flow

Scope

Establish the application shell and deliver one complete path: select a template, supply data, preview the document, and export to PDF.

Features

- Project definition and documentation — Purpose, feature outline, and concept screens for the workspace. Status: Complete.

- Application navigation — Sidebar with workspace, design, and settings areas; placeholder entries for later phases. Status: Complete.

- Overview screen — Entry dashboard and path to create a new document. Status: Complete.

- New document workflow — Template selection, data input, live preview, and PDF export on one screen. Status: Complete.

- Simple Report template — Report layout with title, metadata, summary, and tabular items. Status: Complete.

- Document preview — Isolated preview styling so content remains readable in the UI and in exported PDF. Status: Complete.

- Core generation pipeline — Separation of data parsing, document assembly, HTML rendering, and export. Status: Complete.

- Unit tests for generation logic — Automated checks on parsing, assembly, and rendering. Status: Not started.

- Export and validation polish — Clear validation feedback; export disabled when data is invalid. Status: Not started.

Phase note

The proof-of-concept and primary user flow for Phase 1 are in place. Remaining items are quality and closure work before Phase 1 is marked complete.


Phase 2 — Templates and document building blocks

Scope

Support multiple document types and a structure built from reusable sections rather than a single fixed layout.

Features

- Additional templates — At least two further types (e.g. invoice, certificate, or proposal). Status: Not started.

- Templates area — Dedicated screen to browse templates and descriptions. Status: Not started.

- Component-based document model — Document represented as sections and blocks (headings, text, tables, lists). Status: Not started.

- Template registry — Central registration and selection of available templates. Status: Not started.

- My documents (initial) — Local list of saved or recently generated documents. Status: Not started.

Phase note

Depends on completion of Phase 1 closure items.


Phase 3 — Interactive editing

Scope

Allow structural changes in the interface: add, remove, and reorder content blocks, edit properties, and support undo for main actions.

Features

- Block editor — Add, remove, and reorder document sections or components. Status: Not started.

- Property editing — Edit fields for the selected block with preview updates. Status: Not started.

- Undo and redo — Reversible editing actions. Status: Not started.

- Document lifecycle states — Simple states such as draft, ready, and exported. Status: Not started.

- Pre-export validation — Checks for required content before export. Status: Not started.

Phase note

Planned after the component model from Phase 2 is stable.


Phase 4 — Data sources, exports, and settings

Scope

Broaden input and output options and complete key settings areas currently held as placeholders.

Features

- Data sources — JSON file and CSV input mapped to template fields. Status: Not started.

- Unified data access — Common handling of different input types behind one interface. Status: Not started.

- Additional export formats — HTML download; optional editable document export if feasible locally. Status: Not started.

- Shared layout for outputs — One document structure used across preview and export targets. Status: Not started.

- Preferences — Basic application defaults and export-related settings. Status: Not started.

- Optional extensions — Conditional content blocks, light branding, local generation history. Status: Not started.

Phase note

Final expansion phase; optional items may be reduced if schedule requires.


Overall phase status

- Phase 1: In progress
- Phase 2: Not started
- Phase 3: Not started
- Phase 4: Not started

Checkpoint — October 2026

Phase 1 delivery is largely complete (shell, new-document flow, Simple Report, preview, PDF). Open work: tests and validation/export polish before Phase 1 sign-off.
