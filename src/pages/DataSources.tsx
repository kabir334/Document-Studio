import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { templates } from '../templates'
import { useAllTemplates } from '../hooks/useAllTemplates'
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

const inputClass =
  'rounded-lg border border-app bg-app-input px-3 py-2 text-sm text-app'

export function DataSources() {
  const allTemplates = useAllTemplates()
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
    const tid = source.templateId ?? allTemplates[0]?.id ?? templates[0].id
    navigate(`/new?template=${tid}&source=${source.id}`)
  }

  return (
    <div className="page-shell">
      <div>
        <p className="text-sm text-app-subtle">Design / Data sources</p>
        <h2 className="mt-1 text-xl font-semibold text-app-heading md:text-2xl">Data sources</h2>
        <p className="mt-1 max-w-2xl text-app-muted">
          Import JSON or CSV, save it locally, and send it into a document. CSV with many rows
          maps to line items, metrics, or deliverables depending on the template.
        </p>
      </div>

      <div className="grid w-full max-w-4xl gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-app bg-app-card p-6">
          <h3 className="text-sm font-medium text-app-heading">Add source</h3>
          <div className="mt-4 flex flex-col gap-3">
            <input
              className={inputClass}
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <div className="flex flex-col gap-2 sm:flex-row">
              <select
                className={`flex-1 ${inputClass}`}
                value={kind}
                onChange={(e) => setKind(e.target.value as DataSourceKind)}
              >
                <option value="json">JSON</option>
                <option value="csv">CSV</option>
              </select>
              <select
                className={`flex-1 ${inputClass}`}
                value={templateId}
                onChange={(e) => setTemplateId(e.target.value)}
              >
                {allTemplates.map((t) => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>
            <label className="cursor-pointer rounded-lg border border-dashed border-app-dashed px-3 py-2 text-center text-xs text-app-muted hover:border-app">
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
              className={`min-h-40 font-mono text-xs ${inputClass}`}
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

        <div className="rounded-xl border border-app bg-app-card p-6">
          <h3 className="text-sm font-medium text-app-heading">Preview</h3>
          <pre className="mt-4 max-h-80 overflow-auto rounded-lg bg-app-code p-3 text-xs text-app">
            {preview ?? 'Paste data to preview parsed shape.'}
          </pre>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium text-app-heading">Saved sources</h3>
        {sources.length === 0 ? (
          <p className="mt-3 text-sm text-app-subtle">No saved sources yet.</p>
        ) : (
          <ul className="mt-3 flex max-w-3xl flex-col gap-2">
            {sources.map((source) => (
              <li
                key={source.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-app bg-app-card px-4 py-3"
              >
                <div>
                  <p className="font-medium text-app">{source.name}</p>
                  <p className="text-xs text-app-subtle">
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
                    className="rounded-lg px-3 py-1.5 text-sm text-red-400 hover:bg-app-hover"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <p className="text-sm text-app-subtle">
        Try the bundled invoice line-items CSV from the repo at{' '}
        <code className="text-app-muted">src/data/sampleInvoiceLines.csv</code>
      </p>
    </div>
  )
}