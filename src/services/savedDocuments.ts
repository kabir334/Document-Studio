import type { DocumentModel, DocumentStatus } from '../domain/document'

const STORAGE_KEY = 'document-studio-saved'

export interface SavedDocument {
  id: string
  title: string
  templateId: string
  json: string
  document?: DocumentModel
  status?: DocumentStatus
  createdAt: string
  updatedAt?: string
}

function readAll(): SavedDocument[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as SavedDocument[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function writeAll(docs: SavedDocument[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(docs))
}

export function listSavedDocuments(): SavedDocument[] {
  return readAll().sort((a, b) => {
    const aTime = new Date(a.updatedAt ?? a.createdAt).getTime()
    const bTime = new Date(b.updatedAt ?? b.createdAt).getTime()
    return bTime - aTime
  })
}

export function saveDocument(
  doc: Omit<SavedDocument, 'id' | 'createdAt' | 'updatedAt'>,
): SavedDocument {
  const now = new Date().toISOString()
  const entry: SavedDocument = {
    ...doc,
    id: crypto.randomUUID(),
    createdAt: now,
    updatedAt: now,
  }
  const all = readAll()
  all.unshift(entry)
  writeAll(all)
  return entry
}

export function deleteSavedDocument(id: string): void {
  writeAll(readAll().filter((d) => d.id !== id))
}

export function getSavedDocument(id: string): SavedDocument | undefined {
  return readAll().find((d) => d.id === id)
}
