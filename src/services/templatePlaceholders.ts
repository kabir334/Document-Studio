import type { Block } from '../domain/document'
import type { CustomTemplateColors, CustomTemplateDef } from '../domain/customTemplate'
import type { FieldDef } from '../domain/template'
import { slugFilename } from '../templates/helpers'

export const PLACEHOLDER_RE = /\{\{(\w+)\}\}/g

function collectStringsFromBlock(block: Block): string[] {
  switch (block.type) {
    case 'heading':
    case 'paragraph':
    case 'callout':
      return [block.text]
    case 'meta':
      return block.items.flatMap((item) => [item.label, item.value])
    case 'table':
      return [...block.columns, ...block.rows.flat()]
    case 'list':
      return block.items
    case 'total':
      return [block.label, block.value]
    default:
      return []
  }
}

export function collectPlaceholderKeys(blocks: Block[]): string[] {
  const keys = new Set<string>()
  for (const block of blocks) {
    for (const str of collectStringsFromBlock(block)) {
      const re = new RegExp(PLACEHOLDER_RE.source, 'g')
      let match: RegExpExecArray | null
      while ((match = re.exec(str)) !== null) {
        keys.add(match[1])
      }
    }
  }
  return [...keys]
}

export function buildFieldsFromKeys(keys: string[]): FieldDef[] {
  return keys.map((key) => ({
    key,
    label: key,
    type: 'string' as const,
    required: true,
  }))
}

function defaultSampleForKey(key: string): string {
  const spaced = key.replace(/([A-Z])/g, ' $1').replace(/[-_]/g, ' ')
  const title = spaced.charAt(0).toUpperCase() + spaced.slice(1).trim()
  return title || `Sample ${key}`
}

export function buildSampleData(keys: string[], blocks: Block[]): Record<string, unknown> {
  const data: Record<string, unknown> = {}
  for (const key of keys) {
    data[key] = defaultSampleForKey(key)
  }
  if (keys.length === 0) {
    return data
  }
  const preview = applyPlaceholders(blocks, data)
  for (const key of keys) {
    const re = new RegExp(`\\{\\{${key}\\}\\}`, 'g')
    for (const block of blocks) {
      for (const str of collectStringsFromBlock(block)) {
        if (re.test(str)) {
          const without = str.replace(re, '').trim()
          if (without) {
            data[key] = without
            break
          }
        }
      }
    }
  }
  void preview
  return data
}

function substituteString(str: string, data: Record<string, unknown>): string {
  return str.replace(PLACEHOLDER_RE, (_, key: string) => {
    const value = data[key]
    if (value === undefined || value === null) return `{{${key}}}`
    return String(value)
  })
}

export function applyPlaceholders(blocks: Block[], data: Record<string, unknown>): Block[] {
  return blocks.map((block) => {
    switch (block.type) {
      case 'heading':
        return { ...block, text: substituteString(block.text, data) }
      case 'paragraph':
      case 'callout':
        return { ...block, text: substituteString(block.text, data) }
      case 'meta':
        return {
          ...block,
          items: block.items.map((item) => ({
            label: substituteString(item.label, data),
            value: substituteString(item.value, data),
          })),
        }
      case 'table':
        return {
          ...block,
          columns: block.columns.map((c) => substituteString(c, data)),
          rows: block.rows.map((row) => row.map((cell) => substituteString(cell, data))),
        }
      case 'list':
        return {
          ...block,
          items: block.items.map((item) => substituteString(item, data)),
        }
      case 'total':
        return {
          ...block,
          label: substituteString(block.label, data),
          value: substituteString(block.value, data),
        }
      default:
        return block
    }
  })
}

function remainingPlaceholders(blocks: Block[]): string[] {
  const keys = new Set<string>()
  for (const block of blocks) {
    for (const str of collectStringsFromBlock(block)) {
      const re = new RegExp(PLACEHOLDER_RE.source, 'g')
      let match: RegExpExecArray | null
      while ((match = re.exec(str)) !== null) {
        keys.add(match[1])
      }
    }
  }
  return [...keys]
}

export function buildCustomDocument(
  def: Pick<CustomTemplateDef, 'blocks' | 'colors' | 'filenameBase'>,
  data: Record<string, unknown>,
): { ok: true; document: import('../domain/document').DocumentModel } | { ok: false; error: string } {
  const keys = collectPlaceholderKeys(def.blocks)
  const missing: string[] = []
  for (const key of keys) {
    const value = data[key]
    if (typeof value !== 'string' || value.trim() === '') {
      missing.push(key)
    }
  }
  if (missing.length > 0) {
    return { ok: false, error: `Missing or empty values for: ${missing.join(', ')}` }
  }

  const blocks = applyPlaceholders(def.blocks, data)
  const leftover = remainingPlaceholders(blocks)
  if (leftover.length > 0) {
    return { ok: false, error: `Unresolved placeholders: ${leftover.join(', ')}` }
  }

  const base = def.filenameBase.trim() || 'document'
  return {
    ok: true,
    document: {
      theme: 'custom',
      filename: `${slugFilename(base)}.pdf`,
      blocks,
      customColors: def.colors,
    },
  }
}

export function buildCustomDocumentOrThrow(
  def: Pick<CustomTemplateDef, 'blocks' | 'colors' | 'filenameBase'>,
  data: Record<string, unknown>,
): import('../domain/document').DocumentModel {
  const result = buildCustomDocument(def, data)
  if (!result.ok) throw new Error(result.error)
  return result.document
}

export function customColorsStyleVars(colors: CustomTemplateColors): string {
  const bg = colors.pageBackground ?? '#ffffff'
  return [
    `--doc-primary:${colors.primary}`,
    `--doc-table-header:${colors.tableHeader}`,
    `--doc-callout-border:${colors.calloutBorder}`,
    `--doc-total-bg:${colors.totalBackground}`,
    `--doc-page-bg:${bg}`,
  ].join(';')
}