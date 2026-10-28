import { describe, expect, it } from 'vitest'
import type { DocumentModel } from '../domain/document'
import { resolveStatus, validateDocument } from './validateDocument'

const valid: DocumentModel = {
  theme: 'report',
  filename: 'test.pdf',
  blocks: [
    { type: 'heading', text: 'Title', level: 1 },
    { type: 'paragraph', text: 'Body' },
  ],
}

describe('validateDocument', () => {
  it('accepts a heading and filled paragraph', () => {
    expect(validateDocument(valid)).toEqual([])
  })

  it('requires a heading', () => {
    const issues = validateDocument({
      ...valid,
      blocks: [{ type: 'paragraph', text: 'Only body' }],
    })
    expect(issues.some((i) => i.toLowerCase().includes('heading'))).toBe(true)
  })

  it('rejects empty lists', () => {
    const issues = validateDocument({
      ...valid,
      blocks: [
        { type: 'heading', text: 'Title', level: 1 },
        { type: 'list', items: ['', ''] },
      ],
    })
    expect(issues.length).toBeGreaterThan(0)
  })
})

describe('resolveStatus', () => {
  it('is ready when valid and not exported', () => {
    expect(resolveStatus([], false)).toBe('ready')
  })

  it('is exported when valid after export', () => {
    expect(resolveStatus([], true)).toBe('exported')
  })

  it('is draft when invalid', () => {
    expect(resolveStatus(['empty'], true)).toBe('draft')
  })
})
