const STORAGE_KEY = 'document-studio-saved'

export interface SavedDocument {
  id: string
  title: string
  templateId: string
  json: string
  createdAt: string
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
  return readAll().sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )
}

export function saveDocument(doc: Omit<SavedDocument, 'id' | 'createdAt'>): SavedDocument {
  const entry: SavedDocument = {
    ...doc,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
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
