import type { DocumentModel } from '../domain/document'
import type { Template } from '../domain/template'

export type BuildResult =
  | { ok: true; document: DocumentModel }
  | { ok: false; error: string }

export function buildDocument(
  template: Template,
  data: Record<string, unknown>,
): BuildResult {
  try {
    const document = template.build(data)
    return { ok: true, document }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to build document'
    return { ok: false, error: message }
  }
}
