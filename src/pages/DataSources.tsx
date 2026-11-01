import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { templates } from '../templates'
import {
  deleteDataSource,
  listDataSources,
  previewSourceText,
  saveDataSource,
  type DataSourceKind,
  type StoredDataSource,
} from '../services/dataSources'
import { parseJson } from '../services/parseJson'
import { parseCsv } from '../services/csv'

export function DataSources() {
  const navigate = useNavigate()
  const [sources, setSources] = useState<StoredDataSource[]>([])
  const [name, setName] = useState('')
  const [kind, setKind] = useState<DataSourceKind>('json')
  const [text, setText] = useState('')
  const [templateId, setTemplateId] = useState(templates[0].id)
  const [error, setError] = useState<string | null>(null)

  const refresh = () => setSources(listDataSources())

  useEffect(() => {
    refresh()
  }, [])

  const preview = useMemo(() => {
    if (!text.trim()) return null
    try {
      return previewSourceText(text, kind)
    } catch {
      return 'Could not preview'
    }
  }, [text, kind])

  const handleSave = () => {
    setError(null)
    if (!name.trim()) {
      setError('Name is required')
      return
    }
    if (!text.trim()) {
      setError('Paste or upload content first')
      return
    }
    if (kind === 'json') {
      const parsed = parseJson(text)
      if (!parsed.ok) {
        setError(parsed.error)
        return
      }
    } else {
      const parsed = parseCsv(text)
      if (!parsed.ok) {
        setError(parsed.error)
        return
      }
    }
    saveDataSource({ name: name.trim(), kind, text, templateId })
    setName('')
    setText('')
    refresh()
  }

  const handleFile = (file: File) => {
    const reader = new FileReader()
    reader.onload = () => {
      setText(String(reader.result ?? ''))
      if (file.name.toLowerCase().endsWith('.csv')) setKind('csv')
      if (file.name.toLowerCase().endsWith('.json')) setKind('json')
      if (!name) setName(file.name.replace(/\.[^.]+$/, ''))
    }
    reader.readAsText(file)
  }

  const handleUse = (source: StoredDataSource) => {
    const tid = source.templateId ?? templates[0].id
    navigate(`/new?template=${tid}&source=${source.id}`)
  }

  return (
    <div className="flex flex-col gap-8 p-8">
      <div>
        <p className="text-sm text-slate-500">Design / Data sources</p>
        <h2 className="mt-1 text-2xl font-semibold text-white">Data sources</h2>
        <p className="mt-1 max-w-2xl text-slate-400">
          Import JSON or CSV, save it locally, and send it into a document. CSV with many rows
          maps to line items, metrics, or deliverables depending on the template.
        </p>
      </div>

      <div className="grid max-w-4xl gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-6">
          <h3 className="text-sm font-medium text-white">Add source</h3>
          <div className="mt-4 flex flex-col gap-3">
            <input
              className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-200"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <div className="flex gap-2">
              <select
                className="flex-1 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-200"
                value={kind}
                onChange={(e) => setKind(e.target.value as DataSourceKind)}
              >
                <option value="json">JSON</option>
                <option value="csv">CSV</option>
              </select>
              <select
                className="flex-1 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-200"
                value={templateId}
                onChange={(e) => setTemplateId(e.target.value)}
              >
                {templates.map((t) => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>
            <label className="cursor-pointer rounded-lg border border-dashed border-slate-600 px-3 py-2 text-center text-xs text-slate-400 hover:border-slate-500">
              Upload .json or .csv
              <input
                type="file"
                accept=".json,.csv,text/csv,application/json"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) handleFile(file)
                }}
              />
            </label>
            <textarea
              className="min-h-40 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 font-mono text-xs text-slate-200"
              placeholder={kind === 'json' ? '{ "title": "..." }' : 'col1,col2\na,b'}
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            {error && <p className="text-xs text-red-400">{error}</p>}
            <button
              type="button"
              onClick={handleSave}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500"
            >
              Save source
            </button>
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-6">
          <h3 className="text-sm font-medium text-white">Preview</h3>
          <pre className="mt-4 max-h-80 overflow-auto rounded-lg bg-slate-950 p-3 text-xs text-slate-300">
            {preview ?? 'Paste data to preview parsed shape.'}
          </pre>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium text-white">Saved sources</h3>
        {sources.length === 0 ? (
          <p className="mt-3 text-sm text-slate-500">No saved sources yet.</p>
        ) : (
          <ul className="mt-3 flex max-w-3xl flex-col gap-2">
            {sources.map((source) => (
              <li
                key={source.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-800 bg-slate-900/30 px-4 py-3"
              >
                <div>
                  <p className="font-medium text-slate-200">{source.name}</p>
                  <p className="text-xs text-slate-500">
                    {source.kind.toUpperCase()} · {new Date(source.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleUse(source)}
                    className="rounded-lg bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-500"
                  >
                    Use in document
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      deleteDataSource(source.id)
                      refresh()
                    }}
                    className="rounded-lg px-3 py-1.5 text-sm text-red-400 hover:bg-slate-800"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <p className="text-sm text-slate-500">
        Try the bundled invoice line-items CSV from the repo at{' '}
        <code className="text-slate-400">src/data/sampleInvoiceLines.csv</code>
      </p>
    </div>
  )
}
