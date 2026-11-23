import { describe, expect, it } from 'vitest'
import type { Block } from '../domain/document'
import { DEFAULT_CUSTOM_COLORS } from '../domain/customTemplate'
import {
  applyPlaceholders,
  buildCustomDocument,
  buildSampleData,
  collectPlaceholderKeys,
} from './templatePlaceholders'

const blocks: Block[] = [
  { type: 'heading', text: '{{title}}', level: 1 },
  { type: 'meta', items: [{ label: 'Date', value: '{{date}}' }] },
  {
    type: 'table',
    columns: ['Item', 'Amount'],
    rows: [['{{item}}', '{{amount}}']],
  },
]

describe('collectPlaceholderKeys', () => {
  it('collects unique keys from mixed blocks', () => {
    expect(collectPlaceholderKeys(blocks).sort()).toEqual(
      ['amount', 'date', 'item', 'title'].sort(),
    )
  })
})

describe('applyPlaceholders', () => {
  it('substitutes nested structures', () => {
    const data = { title: 'Hello', date: '2026-01-01', item: 'Widget', amount: '$10' }
    const out = applyPlaceholders(blocks, data)
    expect(out[0]).toMatchObject({ type: 'heading', text: 'Hello' })
    const meta = out[1]
    expect(meta.type).toBe('meta')
    if (meta.type === 'meta') {
      expect(meta.items[0].value).toBe('2026-01-01')
    }
    const table = out[2]
    expect(table.type).toBe('table')
    if (table.type === 'table') {
      expect(table.rows[0]).toEqual(['Widget', '$10'])
    }
  })
})

describe('buildCustomDocument', () => {
  it('errors on missing required values', () => {
    const result = buildCustomDocument(
      { blocks, colors: DEFAULT_CUSTOM_COLORS, filenameBase: 'test' },
      { title: 'Only title' },
    )
    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.error).toContain('date')
    }
  })

  it('builds when all keys provided', () => {
    const keys = collectPlaceholderKeys(blocks)
    const data = buildSampleData(keys, blocks)
    const result = buildCustomDocument(
      { blocks, colors: DEFAULT_CUSTOM_COLORS, filenameBase: 'my-doc' },
      data,
    )
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.document.theme).toBe('custom')
      expect(result.document.blocks[0].type).toBe('heading')
      expect(result.document.filename).toBe('my-doc.pdf')
    }
  })

  it('allows static templates with no placeholders', () => {
    const staticBlocks: Block[] = [
      { type: 'heading', text: 'Static title', level: 1 },
      { type: 'paragraph', text: 'Body copy' },
    ]
    const result = buildCustomDocument(
      { blocks: staticBlocks, colors: DEFAULT_CUSTOM_COLORS, filenameBase: 'static' },
      {},
    )
    expect(result.ok).toBe(true)
  })
})