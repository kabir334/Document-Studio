# Document Studio — Project Idea

## What it is

**Document Studio** is a local application for creating structured documents from reusable templates and dynamic data. You pick a template, provide structured input (starting with JSON), preview the result, and export a finished document. It is a personal engineering practice project — not a commercial product — designed to grow incrementally from a small proof-of-concept into a richer document-creation workspace.

## Why this project

Software design principles are easiest to learn when they solve real problems in a codebase you actually maintain. Document generation is a good domain for that because it naturally combines:

- A **pipeline** (template + data → model → preview → export) that rewards clean separation of concerns
- A **UI** that can look like a real product while most features start as placeholders
- **Extensibility** — new templates, components, data sources, and output formats can be added one at a time
- **Architecture decisions** that become meaningful only after the second or third feature, not on day one

The goal is not to implement every design pattern. The goal is to recognize when a design problem appears, choose an approach with clear trade-offs, and evolve the architecture responsibly as requirements grow.

## How learning fits in

Each growth phase introduces capabilities that create genuine design questions:

| Phase | Capability | Engineering focus |
|-------|------------|-------------------|
| **POC** | One template, JSON input, preview, PDF export | Separation of concerns, simple abstractions, testable modules |
| **Phase 2** | Multiple templates, reusable sections/components | Object creation strategies, document tree structure, open for extension |
| **Phase 3** | Interactive editor, reorder, undo/redo | Communication between UI parts, state management, user actions as discrete operations |
| **Phase 4** | Multiple data sources and export formats | Adapting external inputs, separating document logic from rendering |
| **Phase 5** | Conditional content, themes, history | Traversing complex structures, lifecycle workflows, deeper refactoring |

Patterns and principles are introduced **when a feature needs them**, documented with the problem they solve and the alternatives considered.

## Constraints

- **Solo developer** — scope stays realistic for one person
- **Local and free** — no paid APIs, cloud hosting, or auth required
- **Start small** — the POC does one complete workflow end-to-end
- **Presentable** — the UI should look like a real app, even when some sidebar items are placeholders
- **Evolvable** — architecture should support growth without a full rewrite

## POC success criteria

The first version succeeds if:

1. A user can select a template, paste JSON, see a live preview, and download a PDF
2. The codebase separates parsing, building, rendering, and exporting into distinct modules
3. The sidebar communicates the future product direction
4. Everything runs locally with free, open-source tools

## Related documents

- [Features overview](./features-overview.md) — what the app does today vs. later
- [Engineering brief](../../document-generation-project-brief.md) — full brainstorming notes and long-term vision
