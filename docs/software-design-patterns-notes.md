Software Design Patterns — Learning Notes

Purpose of this document

This is a personal learning log for design patterns and related ideas. It is not only about Document Studio, but when we try a pattern in that project, we can note it here as a real example.

Patterns are listed by category. Most entries start empty and get filled as I study them or use them in code. Language is kept simple on purpose.

Last updated: October 2026


How to use each pattern entry

For each pattern below, you can add over time:

- What it is (short definition)
- Typical scenario (when it helps)
- Trade-offs (costs, when not to use it)
- Document Studio example (if we used or plan to use it here)
- Other notes (courses, books, mistakes)


CREATIONAL PATTERNS

Focus: how objects are created when creation is not as simple as calling new once.


Factory Method

- What it is:
  (Add later.)

- Typical scenario:
  You have a type (e.g. “document component”) and several concrete kinds. Creation logic should stay in one place so the rest of the app asks for “the right kind” without a long if/else chain everywhere.

- Trade-offs:
  (Add later.)

- Document Studio example:
  Planned for Phase 2 when we have multiple component types (heading, table, paragraph). The UI or template builder would ask for a component by kind; a factory (or small registry) returns the right object.

- Other notes:
  (Add later.)


Abstract Factory

- What it is:
  (Add later.)

- Typical scenario:
  (Add later.)

- Trade-offs:
  (Add later.)

- Document Studio example:
  (Add later — maybe when we have families of related pieces, e.g. invoice kit vs report kit.)

- Other notes:
  (Add later.)


Builder

- What it is:
  (Add later.)

- Typical scenario:
  Building a complex object step by step (many optional parts) without a constructor with ten parameters.

- Trade-offs:
  (Add later.)

- Document Studio example:
  Possible when a document is assembled from many sections and options (metadata, sections, footer, export settings). Not needed in Phase 1 POC.

- Other notes:
  (Add later.)


Singleton

- What it is:
  A class that allows only one instance in the application, often with global access.

- Typical scenario:
  Sometimes used for configuration, logging, or a cache. Easy to overuse.

- Trade-offs:
  Harder to test, hidden dependencies, global state. Often dependency injection or passing a single shared instance explicitly is clearer.

- Document Studio example:
  We did not use Singleton in the POC. App settings might later be a normal object passed through React context or a small module, not a global singleton, unless there is a clear reason.

- Other notes:
  See also “Singleton Overuse” under Anti-patterns.


Prototype

- What it is:
  (Add later.)

- Typical scenario:
  (Add later.)

- Trade-offs:
  (Add later.)

- Document Studio example:
  (Add later — e.g. duplicate a template or document as a starting point.)

- Other notes:
  (Add later.)


BEHAVIORAL PATTERNS

Focus: how objects communicate and how behavior is assigned or changed.


Chain of Responsibility (CoR)

- What it is:
  (Add later.)

- Typical scenario:
  A pipeline of steps (validate, transform, generate) where each step can pass work to the next.

- Trade-offs:
  (Add later.)

- Document Studio example:
  Possible for validation before export: check JSON → check template fields → check document model. Not formalized yet in Phase 1.

- Other notes:
  (Add later.)


Command

- What it is:
  (Add later.)

- Typical scenario:
  User actions (add block, delete, move, change property) stored as objects so you can undo, redo, or queue work.

- Trade-offs:
  (Add later.)

- Document Studio example:
  Planned for Phase 3 editor with undo/redo.

- Other notes:
  (Add later.)


Mediator

- What it is:
  (Add later.)

- Typical scenario:
  Many UI parts need to talk; instead of each part knowing every other part, they talk through one mediator.

- Trade-offs:
  (Add later.)

- Document Studio example:
  (Add later — if template picker, property panel, and preview become hard to wire.)

- Other notes:
  (Add later.)


Observer

- What it is:
  When one object changes, others that depend on it get notified without tight coupling.

- Typical scenario:
  Data or document model changes → preview and validation update.

- Trade-offs:
  (Add later.)

- Document Studio example:
  Phase 1 uses React state and useMemo for preview updates, which is a form of reactive update. A explicit Observer pattern may appear if we move logic out of React into a plain domain model in later phases.

- Other notes:
  (Add later.)


Visitor

- What it is:
  (Add later.)

- Typical scenario:
  Many operations on a tree of different node types (render, validate, export) without adding every operation inside each node class.

- Trade-offs:
  (Add later.)

- Document Studio example:
  (Add later — when document is a tree of component types in Phase 2+.)

- Other notes:
  (Add later.)


Template Method

- What it is:
  (Add later.)

- Typical scenario:
  Several processes share the same steps but differ in one or two steps (e.g. same generate flow, different output format).

- Trade-offs:
  (Add later.)

- Document Studio example:
  (Add later — shared “generate document” steps with different render endings.)

- Other notes:
  (Add later.)


State

- What it is:
  (Add later.)

- Typical scenario:
  Object behavior changes when its lifecycle state changes (draft, generating, done, failed).

- Trade-offs:
  (Add later.)

- Document Studio example:
  Planned lightly in Phase 3 for document/export workflow.

- Other notes:
  (Add later.)


Strategy

- What it is:
  (Add later.)

- Typical scenario:
  Swap algorithms or behaviors at runtime (e.g. different export or layout strategies).

- Trade-offs:
  (Add later.)

- Document Studio example:
  (Add later — export format or data mapping strategies in Phase 4.)

- Other notes:
  (Add later.)


STRUCTURAL PATTERNS

Focus: how types and objects are composed and wrapped.


Adapter

- What it is:
  (Add later.)

- Typical scenario:
  A library or file format does not match your app’s interface; adapter translates so the rest of the app stays clean.

- Trade-offs:
  (Add later.)

- Document Studio example:
  Planned in Phase 4 for CSV vs JSON vs file upload — same “data for template” interface inside the app.

- Other notes:
  (Add later.)


Bridge

- What it is:
  (Add later.)

- Typical scenario:
  Split “what the document is” from “how it is rendered” so you can change renderers without changing the model.

- Trade-offs:
  (Add later.)

- Document Studio example:
  Phase 4 when PDF, HTML, and maybe DOCX share one document model.

- Other notes:
  (Add later.)


Composite

- What it is:
  Treat single objects and groups of objects the same way — often a tree (part / whole).

- Typical scenario:
  A document made of sections, each section made of blocks; operations work on the whole tree.

- Trade-offs:
  (Add later.)

- Document Studio example:
  Core idea for Phase 2 document model (document → sections → components).

- Other notes:
  (Add later.)


Decorator

- What it is:
  (Add later.)

- Typical scenario:
  Add behavior or output layers (watermark, footer, logging) without changing the core class.

- Trade-offs:
  (Add later.)

- Document Studio example:
  (Add later — optional export decorations.)

- Other notes:
  (Add later.)


Facade

- What it is:
  A simple interface in front of a more complex subsystem.

- Typical scenario:
  UI calls one “generate document” operation instead of parse, validate, build, render, export separately.

- Trade-offs:
  Can hide too much if the facade becomes a god object; keep it thin.

- Document Studio example:
  Phase 1 already separates parse, build, render, export in code. A small facade use case layer may appear when the UI grows, so pages do not orchestrate five imports. Not a formal Facade class yet.

- Other notes:
  Good contrast with God/Manager class anti-pattern.


Proxy

- What it is:
  (Add later.)

- Typical scenario:
  Lazy loading, caching, or access control in front of a real object.

- Trade-offs:
  (Add later.)

- Document Studio example:
  (Add later.)

- Other notes:
  (Add later.)


ANTI-PATTERNS

Focus: common bad habits, why they hurt, and what to do instead.


What are anti-patterns (general)

- They look like a quick fix but make code harder to change, test, or understand.
- Often appear when copying a pattern (e.g. Singleton) everywhere without a real need.
- Learning them helps you spot smell in your own code and refactor early.


God / Manager Class

- What goes wrong:
  One class or module does parsing, validation, UI logic, storage, export, and logging. Everything depends on it; changes are risky and tests are painful.

- Where it might show up:
  A single “DocumentService” that grew every time we added a feature.

- Better approach:
  Split by responsibility (parse, build, render, export already separate in Phase 1). UI stays thin and calls small services or a thin orchestrator.

- Document Studio example:
  We avoided this in the POC by splitting services. Watch this when adding Phase 2–3 features.

- My notes:
  (Add later.)


Singleton Overuse

- What goes wrong:
  Many globals; hidden dependencies; hard to test; unclear initialization order.

- Where it might show up:
  “Just make config / cache / template list a singleton.”

- Better approach:
  Create once at app startup and pass dependencies in, or use module scope with explicit exports, not getInstance() everywhere.

- Document Studio example:
  No singletons in current POC. Prefer explicit imports and React state/context for UI.

- My notes:
  (Add later.)


Overengineering

- What goes wrong:
  Plugin systems, abstract factories, and interfaces for things that have only one implementation.

- Where it might show up:
  Phase 1 if we had built a generic template engine before one working report.

- Better approach:
  YAGNI — implement the second template before abstracting “all templates.”

- Document Studio example:
  Phase 1 uses one template file and plain functions; abstraction waits for Phase 2.

- My notes:
  (Add later.)


Programming by Exception

- What goes wrong:
  Using exceptions for normal control flow (e.g. validation failures as throw/catch instead of clear result types).

- Where it might show up:
  JSON validation and template field checks.

- Better approach:
  Return success/error objects (Phase 1 parseJson and buildDocument use result types with ok/error).

- Document Studio example:
  parseJson returns { ok, data } or { ok, error }; template build catches build errors and returns messages for the UI.

- My notes:
  (Add later.)


Poltergeists

- What goes wrong:
  Classes that only delegate to another class and add no logic — extra noise.

- Where it might show up:
  Wrappers “for architecture” around one line of code.

- Better approach:
  Remove the middle layer or add real behavior.

- Document Studio example:
  (Add later if we notice useless wrappers.)

- My notes:
  (Add later.)


Boat Anchor

- What goes wrong:
  Keeping unused code, dependencies, or abstractions “for later.”

- Where it might show up:
  Old template experiments, unused export paths.

- Better approach:
  Delete or archive; use git history if we need it back.

- Document Studio example:
  (Add later.)

- My notes:
  (Add later.)


Interface Bloat

- What goes wrong:
  One huge interface forces every implementation to support methods it does not need.

- Where it might show up:
  A single “DataSource” interface with CSV, API, and DB methods when we only use JSON files.

- Better approach:
  Small interfaces (read data, list fields) composed as needed.

- Document Studio example:
  (Add later — Phase 4 data sources.)

- My notes:
  (Add later.)


Golden Hammer

- What goes wrong:
  Using one favorite pattern or tool for every problem.

- Where it might show up:
  Turning every creation point into a factory when a plain function is enough.

- Better approach:
  Match the solution to the problem size.

- Document Studio example:
  (Add later.)

- My notes:
  (Add later.)


Premature Optimization

- What goes wrong:
  Caching, pooling, or complex structures before measuring a real slowness.

- Where it might show up:
  Caching rendered PDFs before we have slow renders.

- Better approach:
  Make it correct and clear first; optimize when there is evidence.

- Document Studio example:
  No caching in POC; preview recalculates from JSON when input changes (fine for small docs).

- My notes:
  (Add later.)


PROGRESS SUMMARY (optional, update over time)

- Creational: started (Factory Method, Builder, Singleton — light notes)
- Behavioral: structure only; Observer and Command touched lightly in planning
- Structural: Facade and Composite noted with Document Studio links
- Anti-patterns: God class, Singleton overuse, Overengineering, Programming by Exception, Premature optimization — partial notes
