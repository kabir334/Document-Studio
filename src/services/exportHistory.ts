const STORAGE_KEY = 'document-studio-export-history'
const MAX_ENTRIES = 20

export interface ExportHistoryEntry {
  id: string
  title: string
  format: 'pdf' | 'html'
  templateId: string
  at: string
}

function readAll(): ExportHistoryEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as ExportHistoryEntry[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function writeAll(entries: ExportHistoryEntry[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries.slice(0, MAX_ENTRIES)))
}

export function listExportHistory(): ExportHistoryEntry[] {
  return readAll()
}

export function recordExport(entry: Omit<ExportHistoryEntry, 'id' | 'at'>): void {
  const all = readAll()
  all.unshift({
    ...entry,
    id: crypto.randomUUID(),
    at: new Date().toISOString(),
  })
  writeAll(all)
}
