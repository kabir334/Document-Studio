import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  deleteSavedDocument,
  listSavedDocuments,
  type SavedDocument,
} from '../services/savedDocuments'
import { getTemplateById } from '../templates'

export function MyDocuments() {
  const [docs, setDocs] = useState<SavedDocument[]>([])
  const navigate = useNavigate()

  const refresh = () => setDocs(listSavedDocuments())

  useEffect(() => {
    refresh()
  }, [])

  const handleDelete = (id: string) => {
    deleteSavedDocument(id)
    refresh()
  }

  const handleOpen = (doc: SavedDocument) => {
    navigate(`/new?template=${doc.templateId}`, {
      state: { json: doc.json, document: doc.document, status: doc.status },
    })
  }

  return (
    <div className="page-shell">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm text-app-subtle">Workspace / My documents</p>
          <h2 className="mt-1 text-xl font-semibold text-app-heading md:text-2xl">My documents</h2>
          <p className="mt-1 text-app-muted">Saved drafts stored in this browser.</p>
        </div>
        <Link
          to="/new"
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500"
        >
          New document
        </Link>
      </div>

      {docs.length === 0 ? (
        <div className="rounded-xl border border-dashed border-app-dashed p-8 text-center text-app-muted md:p-12">
          No saved documents yet. Create a document and use Save draft on the New document page.
        </div>
      ) : (
        <ul className="flex w-full max-w-3xl flex-col gap-3">
          {docs.map((doc) => {
            const templateName = getTemplateById(doc.templateId)?.name ?? doc.templateId
            return (
              <li
                key={doc.id}
                className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-app bg-app-card px-5 py-4"
              >
                <div>
                  <p className="font-medium text-app-heading">{doc.title}</p>
                  <p className="text-sm text-app-subtle">
                    {templateName}
                    {doc.status ? ` · ${doc.status}` : ''}
                    {' · '}
                    {new Date(doc.updatedAt ?? doc.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleOpen(doc)}
                    className="rounded-lg border border-app-dashed px-3 py-1.5 text-sm text-app hover:bg-app-hover"
                  >
                    Open
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(doc.id)}
                    className="rounded-lg px-3 py-1.5 text-sm text-red-400 hover:bg-app-hover"
                  >
                    Delete
                  </button>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}