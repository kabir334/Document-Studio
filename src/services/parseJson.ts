export type ParseResult =
  | { ok: true; data: Record<string, unknown> }
  | { ok: false; error: string }

export function parseJson(input: string): ParseResult {
  const trimmed = input.trim()
  if (!trimmed) {
    return { ok: false, error: 'JSON input is empty' }
  }

  try {
    const parsed: unknown = JSON.parse(trimmed)
    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
      return { ok: false, error: 'JSON must be an object' }
    }
    return { ok: true, data: parsed as Record<string, unknown> }
  } catch {
    return { ok: false, error: 'Invalid JSON syntax' }
  }
}
