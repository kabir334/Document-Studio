import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { Block } from '../domain/document'
import { DEFAULT_CUSTOM_COLORS } from '../domain/customTemplate'
import {
  customDefToTemplate,
  deleteCustomTemplate,
  listCustomTemplates,
  saveCustomTemplate,
} from './customTemplates'
import { buildDocument } from './buildDocument'

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

const blocks: Block[] = [
  { type: 'heading', text: '{{title}}', level: 1 },
  { type: 'paragraph', text: 'Hello {{name}}' },
]

describe('customTemplates storage', () => {
  it('round-trips save list delete', () => {
    expect(listCustomTemplates()).toHaveLength(0)
    const saved = saveCustomTemplate({
      name: 'My letter',
      blocks,
      colors: DEFAULT_CUSTOM_COLORS,
      filenameBase: 'my-letter',
    })
    expect(saved.ok).toBe(true)
    if (!saved.ok) return
    expect(listCustomTemplates()).toHaveLength(1)
    expect(listCustomTemplates()[0].name).toBe('My letter')

    deleteCustomTemplate(saved.def.id)
    expect(listCustomTemplates()).toHaveLength(0)
  })
})

describe('customDefToTemplate', () => {
  it('builds via buildDocument', () => {
    const saved = saveCustomTemplate({
      name: 'Test',
      blocks,
      colors: DEFAULT_CUSTOM_COLORS,
      filenameBase: 'test',
    })
    expect(saved.ok).toBe(true)
    if (!saved.ok) return
    const template = customDefToTemplate(saved.def)
    const result = buildDocument(template, template.sampleData)
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.document.theme).toBe('custom')
      expect(result.document.blocks[0].type).toBe('heading')
    }
  })
})