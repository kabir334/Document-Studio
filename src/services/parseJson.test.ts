import { describe, expect, it } from 'vitest'
import { parseJson } from './parseJson'

describe('parseJson', () => {
  it('rejects empty input', () => {
    expect(parseJson('')).toEqual({ ok: false, error: 'JSON input is empty' })
  })

  it('rejects invalid syntax', () => {
    expect(parseJson('{ bad')).toEqual({ ok: false, error: 'Invalid JSON syntax' })
  })

  it('rejects non-object root', () => {
    expect(parseJson('[]')).toEqual({ ok: false, error: 'JSON must be an object' })
  })

  it('parses a valid object', () => {
    const result = parseJson('{"title":"Test"}')
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.data.title).toBe('Test')
    }
  })
})
