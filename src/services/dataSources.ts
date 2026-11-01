import { parseJson } from './parseJson'
import { csvToJsonObject, mergeCsvIntoTemplateData, parseCsv } from './csv'
import { getTemplateById } from '../templates'

const STORAGE_KEY = 'document-studio-data-sources'

export type DataSourceKind = 'json' | 'csv'

export interface StoredDataSource {
  id: string
  name: string
  kind: DataSourceKind
  text: string
  templateId?: string
  createdAt: string
}

function readAll(): StoredDataSource[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as StoredDataSource[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function writeAll(sources: StoredDataSource[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sources))
}

export function listDataSources(): StoredDataSource[] {
  return readAll().sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )
}

export function saveDataSource(
  source: Omit<StoredDataSource, 'id' | 'createdAt'>,
): StoredDataSource {
  const entry: StoredDataSource = {
    ...source,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  }
  const all = readAll()
  all.unshift(entry)
  writeAll(all)
  return entry
}

export function deleteDataSource(id: string): void {
  writeAll(readAll().filter((s) => s.id !== id))
}

export function getDataSource(id: string): StoredDataSource | undefined {
  return readAll().find((s) => s.id === id)
}

export type DataLoadResult =
  | { ok: true; json: string; data: Record<string, unknown> }
  | { ok: false; error: string }

export function loadDataFromSource(
  source: StoredDataSource,
  templateId: string,
): DataLoadResult {
  const template = getTemplateById(templateId)
  const base = template ? { ...template.sampleData } : {}

  if (source.kind === 'json') {
    const parsed = parseJson(source.text)
    if (!parsed.ok) return parsed
    const data = { ...base, ...parsed.data }
    return { ok: true, json: JSON.stringify(data, null, 2), data }
  }

  const csv = parseCsv(source.text)
  if (!csv.ok) return csv

  const data = mergeCsvIntoTemplateData(templateId, base, csv.headers, csv.rows)
  return { ok: true, json: JSON.stringify(data, null, 2), data }
}

export function parseUploadedFile(
  filename: string,
  text: string,
  templateId: string,
): DataLoadResult {
  const lower = filename.toLowerCase()
  if (lower.endsWith('.json')) {
    const parsed = parseJson(text)
    if (!parsed.ok) return parsed
    const template = getTemplateById(templateId)
    const data = template ? { ...template.sampleData, ...parsed.data } : parsed.data
    return { ok: true, json: JSON.stringify(data, null, 2), data }
  }

  if (lower.endsWith('.csv')) {
    const csv = parseCsv(text)
    if (!csv.ok) return csv
    const template = getTemplateById(templateId)
    const base = template ? { ...template.sampleData } : {}
    const data = mergeCsvIntoTemplateData(templateId, base, csv.headers, csv.rows)
    return { ok: true, json: JSON.stringify(data, null, 2), data }
  }

  return { ok: false, error: 'Use a .json or .csv file' }
}

export function previewSourceText(text: string, kind: DataSourceKind): string {
  if (kind === 'json') {
    const parsed = parseJson(text)
    if (!parsed.ok) return parsed.error
    return JSON.stringify(parsed.data, null, 2)
  }
  const csv = parseCsv(text)
  if (!csv.ok) return csv.error
  return JSON.stringify(csvToJsonObject(csv.headers, csv.rows), null, 2)
}
