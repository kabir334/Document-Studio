import type { Block } from '../domain/document'
import {
  DEFAULT_CUSTOM_COLORS,
  type CustomTemplateColors,
  type CustomTemplateDef,
  isValidHexColor,
} from '../domain/customTemplate'
import type { Template } from '../domain/template'
import { slugFilename } from '../templates/helpers'
import {
  buildCustomDocumentOrThrow,
  buildFieldsFromKeys,
  buildSampleData,
  collectPlaceholderKeys,
} from './templatePlaceholders'

const STORAGE_KEY = 'document-studio-custom-templates'
const MAX_BLOCKS = 50

function readAll(): CustomTemplateDef[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as CustomTemplateDef[]
    return Array.isArray(parsed) ? parsed.filter(isValidStoredDef) : []
  } catch {
    return []
  }
}

function writeAll(defs: CustomTemplateDef[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(defs))
}

function isValidStoredDef(def: CustomTemplateDef): boolean {
  return (
    typeof def.id === 'string' &&
    def.id.startsWith('custom-') &&
    typeof def.name === 'string' &&
    Array.isArray(def.blocks) &&
    def.blocks.length <= MAX_BLOCKS &&
    typeof def.filenameBase === 'string'
  )
}

export function listCustomTemplates(): CustomTemplateDef[] {
  return readAll().sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  )
}

export function getCustomTemplate(id: string): CustomTemplateDef | undefined {
  return readAll().find((d) => d.id === id)
}

export type SaveCustomTemplateInput = {
  id?: string
  name: string
  description?: string
  blocks: Block[]
  colors: CustomTemplateColors
  filenameBase: string
}

export type SaveCustomResult =
  | { ok: true; def: CustomTemplateDef }
  | { ok: false; error: string }

export function validateCustomTemplateInput(
  input: SaveCustomTemplateInput,
): SaveCustomResult | { ok: true } {
  const name = input.name.trim()
  if (!name) {
    return { ok: false, error: 'Template name is required.' }
  }
  if (input.blocks.length === 0) {
    return { ok: false, error: 'Add at least one block.' }
  }
  if (input.blocks.length > MAX_BLOCKS) {
    return { ok: false, error: `At most ${MAX_BLOCKS} blocks allowed.` }
  }
  const hasHeading = input.blocks.some(
    (b) => b.type === 'heading' && b.text.trim() !== '',
  )
  if (!hasHeading) {
    return { ok: false, error: 'Add at least one heading with text or a placeholder.' }
  }
  const colors = input.colors
  for (const [label, value] of Object.entries(colors)) {
    if (value && typeof value === 'string' && !isValidHexColor(value)) {
      return { ok: false, error: `Invalid color for ${label}. Use #RRGGBB format.` }
    }
  }
  const base = input.filenameBase.trim() || slugFilename(name)
  if (!base) {
    return { ok: false, error: 'Filename base is required.' }
  }
  return { ok: true }
}

export function saveCustomTemplate(input: SaveCustomTemplateInput): SaveCustomResult {
  const validation = validateCustomTemplateInput(input)
  if (!validation.ok && 'error' in validation) {
    return validation
  }

  const now = new Date().toISOString()
  const name = input.name.trim()
  const filenameBase = slugFilename(input.filenameBase.trim() || name)
  const colors: CustomTemplateColors = {
    ...DEFAULT_CUSTOM_COLORS,
    ...input.colors,
  }

  const existing = input.id ? getCustomTemplate(input.id) : undefined
  const def: CustomTemplateDef = {
    id: existing?.id ?? `custom-${crypto.randomUUID()}`,
    name,
    description: input.description?.trim() || 'Custom template',
    blocks: input.blocks,
    colors,
    filenameBase,
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
  }

  const all = readAll().filter((d) => d.id !== def.id)
  all.unshift(def)
  writeAll(all)
  return { ok: true, def }
}

export function deleteCustomTemplate(id: string): void {
  writeAll(readAll().filter((d) => d.id !== id))
}

export function customDefToTemplate(def: CustomTemplateDef): Template {
  const keys = collectPlaceholderKeys(def.blocks)
  const fields = buildFieldsFromKeys(keys)
  const sampleData = buildSampleData(keys, def.blocks)

  return {
    id: def.id,
    name: def.name,
    description: def.description,
    fields,
    sampleData,
    build: (data: Record<string, unknown>) => {
      const merged = keys.length === 0 ? data : { ...sampleData, ...data }
      return buildCustomDocumentOrThrow(
        {
          blocks: def.blocks,
          colors: def.colors,
          filenameBase: def.filenameBase,
        },
        merged,
      )
    },
  }
}

export const BUILT_IN_IDS = new Set([
  'monthly-report',
  'invoice',
  'certificate',
  'proposal',
])

export function isBuiltInTemplateId(id: string): boolean {
  return BUILT_IN_IDS.has(id)
}