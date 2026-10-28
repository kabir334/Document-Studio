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
    <div className="flex flex-col gap-8 p-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm text-slate-500">Workspace / My documents</p>
          <h2 className="mt-1 text-2xl font-semibold text-white">My documents</h2>
          <p className="mt-1 text-slate-400">Saved drafts stored in this browser.</p>
        </div>
        <Link
          to="/new"
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500"
        >
          New document
        </Link>
      </div>

      {docs.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-700 p-12 text-center text-slate-400">
          No saved documents yet. Create a document and use Save draft on the New document page.
        </div>
      ) : (
        <ul className="flex max-w-3xl flex-col gap-3">
          {docs.map((doc) => {
            const templateName = getTemplateById(doc.templateId)?.name ?? doc.templateId
            return (
              <li
                key={doc.id}
                className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-800 bg-slate-900/40 px-5 py-4"
              >
                <div>
                  <p className="font-medium text-white">{doc.title}</p>
                  <p className="text-sm text-slate-500">
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
                    className="rounded-lg border border-slate-600 px-3 py-1.5 text-sm text-slate-200 hover:bg-slate-800"
                  >
                    Open
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(doc.id)}
                    className="rounded-lg px-3 py-1.5 text-sm text-red-400 hover:bg-slate-800"
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
