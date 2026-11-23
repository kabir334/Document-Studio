import { describe, expect, it, vi, beforeEach } from 'vitest'
import type { Block } from '../domain/document'
import { DEFAULT_CUSTOM_COLORS } from '../domain/customTemplate'
import { buildDocument } from '../services/buildDocument'
import { customDefToTemplate, saveCustomTemplate } from '../services/customTemplates'
import { renderHtml } from '../services/renderHtml'

const store: Record<string, string> = {}

beforeEach(() => {
  Object.keys(store).forEach((k) => delete store[k])
  vi.stubGlobal('localStorage', {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => {
      store[key] = value
    },
    removeItem: (key: string) => {
      delete store[key]
    },
  })
})

describe('custom template integration', () => {
  it('builds, renders with CSS vars, and substitutes text', () => {
    const blocks: Block[] = [
      { type: 'heading', text: '{{title}}', level: 1 },
      { type: 'paragraph', text: 'Body for {{name}}' },
    ]
    const saved = saveCustomTemplate({
      name: 'Letter',
      blocks,
      colors: { ...DEFAULT_CUSTOM_COLORS, primary: '#336699' },
      filenameBase: 'letter',
    })
    expect(saved.ok).toBe(true)
    if (!saved.ok) return

    const template = customDefToTemplate(saved.def)
    const result = buildDocument(template, { title: 'Hi', name: 'Ada' })
    expect(result.ok).toBe(true)
    if (!result.ok) return

    const html = renderHtml(result.document)
    expect(html).toContain('Hi')
    expect(html).toContain('Ada')
    expect(html).toContain('--doc-primary:#336699')
    expect(html).toContain('custom-doc')
  })
})