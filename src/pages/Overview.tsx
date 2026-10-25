import { Link } from 'react-router-dom'
import { templates } from '../templates'
import { listSavedDocuments } from '../services/savedDocuments'

export function Overview() {
  const docCount = listSavedDocuments().length
  const templateCount = templates.length

  return (
    <div className="flex flex-col gap-8 p-8">
      <div>
        <p className="text-sm text-slate-500">Workspace / Overview</p>
        <h2 className="mt-1 text-2xl font-semibold text-white">Document Studio</h2>
        <p className="mt-1 text-slate-400">Create and manage your documents.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 max-w-lg">
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600/20 text-blue-400">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p className="text-3xl font-bold text-white">{docCount}</p>
          <p className="text-sm text-slate-400">Saved documents</p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-600/20 text-emerald-400">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
            </svg>
          </div>
          <p className="text-3xl font-bold text-white">{templateCount}</p>
          <p className="text-sm text-slate-400">Templates</p>
        </div>
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-900/30 p-8">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-slate-800 text-slate-400">
            <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-medium text-white">Create a document</h3>
            <p className="mt-1 text-sm text-slate-400">Pick a template, add JSON data, preview, and export PDF.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              to="/new"
              className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-500"
            >
              New document
            </Link>
            <Link
              to="/templates"
              className="rounded-lg border border-slate-600 px-6 py-2.5 text-sm font-medium text-slate-200 hover:bg-slate-800"
            >
              View templates
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
