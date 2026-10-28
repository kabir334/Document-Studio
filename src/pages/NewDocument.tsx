import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useSearchParams } from 'react-router-dom'
import { TemplatePicker } from '../components/TemplatePicker'
import { JsonEditor } from '../components/JsonEditor'
import { DocumentPreview } from '../components/DocumentPreview'
import { BlockList } from '../components/BlockList'
import { BlockProperties } from '../components/BlockProperties'
import { templates, getTemplateById } from '../templates'
import { parseJson } from '../services/parseJson'
import { buildDocument } from '../services/buildDocument'
import { renderHtml } from '../services/renderHtml'
import { exportPdfFromHtml } from '../services/exportPdf'
import { saveDocument } from '../services/savedDocuments'
import { resolveStatus, validateDocument } from '../services/validateDocument'
import { createBlock, documentTitle } from '../domain/blocks'
import type { Block, DocumentModel, DocumentStatus } from '../domain/document'
import {
  initHistory,
  pushHistory,
  redoHistory,
  resetHistory,
  undoHistory,
  type HistoryState,
} from '../hooks/documentHistory'

type LocationState = {
  json?: string
  document?: DocumentModel
  status?: DocumentStatus
} | null

function StatusBadge({ status }: { status: DocumentStatus }) {
  const styles: Record<DocumentStatus, string> = {
    draft: 'bg-slate-700 text-slate-200',
    ready: 'bg-emerald-900/70 text-emerald-300',
    exported: 'bg-blue-900/70 text-blue-300',
  }
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${styles[status]}`}>
      {status}
    </span>
  )
}

export function NewDocument() {
  const [searchParams, setSearchParams] = useSearchParams()
  const location = useLocation()
  const state = location.state as LocationState

  const paramTemplate = searchParams.get('template')
  const initialId =
    paramTemplate && getTemplateById(paramTemplate) ? paramTemplate : templates[0].id

  const [templateId, setTemplateId] = useState(initialId)
  const [jsonInput, setJsonInput] = useState('')
  const [exporting, setExporting] = useState(false)
  const [saveMessage, setSaveMessage] = useState<string | null>(null)
  const [exportError, setExportError] = useState<string | null>(null)
  const [layoutEdited, setLayoutEdited] = useState(false)
  const [exported, setExported] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [showJson, setShowJson] = useState(true)
  const [history, setHistory] = useState<HistoryState<DocumentModel | null>>(initHistory(null))

  const template = getTemplateById(templateId) ?? templates[0]

  useEffect(() => {
    if (paramTemplate && getTemplateById(paramTemplate)) {
      setTemplateId(paramTemplate)
    }
  }, [paramTemplate])

  useEffect(() => {
    if (!state) return
    if (state.json) setJsonInput(state.json)
    if (state.document) {
      setHistory(resetHistory(state.document))
      setLayoutEdited(true)
      setExported(state.status === 'exported')
      setSelectedIndex(0)
    }
    window.history.replaceState({}, '')
  }, [state])

  const jsonResult = useMemo(() => {
    if (!jsonInput.trim()) {
      return { error: undefined as string | undefined, generated: null as DocumentModel | null }
    }
    const parsed = parseJson(jsonInput)
    if (!parsed.ok) {
      return { error: parsed.error, generated: null }
    }
    const built = buildDocument(template, parsed.data)
    if (!built.ok) {
      return { error: built.error, generated: null }
    }
    return { error: undefined, generated: built.document }
  }, [jsonInput, template])

  const working = layoutEdited ? history.present : jsonResult.generated
  const issues = working ? validateDocument(working) : []
  const status = working
    ? resolveStatus(issues, exported)
    : 'draft'

  const html = working ? renderHtml(working) : null
  const selectedBlock =
    working && selectedIndex !== null ? working.blocks[selectedIndex] : undefined

  const commit = (next: DocumentModel) => {
    setExported(false)
    setSaveMessage(null)
    setExportError(null)
    setHistory((current) => {
      const seed = layoutEdited && current.present ? current : initHistory(working)
      return pushHistory(seed, next)
    })
    setLayoutEdited(true)
  }

  const updateBlocks = (blocks: Block[]) => {
    if (!working) return
    commit({ ...working, blocks })
  }

  const handleTemplateChange = (id: string) => {
    setTemplateId(id)
    setSearchParams({ template: id })
    setJsonInput('')
    setLayoutEdited(false)
    setExported(false)
    setHistory(resetHistory(null))
    setSelectedIndex(null)
    setSaveMessage(null)
    setExportError(null)
  }

  const handleLoadSample = () => {
    setJsonInput(JSON.stringify(template.sampleData, null, 2))
    setLayoutEdited(false)
    setExported(false)
    setHistory(resetHistory(null))
    setSelectedIndex(0)
    setSaveMessage(null)
  }

  const handleRebuild = () => {
    if (!jsonResult.generated) return
    setLayoutEdited(false)
    setExported(false)
    setHistory(resetHistory(null))
    setSelectedIndex(0)
    setSaveMessage(null)
  }

  const handleExport = async () => {
    if (!working || !html || issues.length > 0) return
    setExporting(true)
    setExportError(null)
    try {
      await exportPdfFromHtml(html, working.filename)
      setExported(true)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'PDF export failed.'
      setExportError(message)
    } finally {
      setExporting(false)
    }
  }

  const handleSaveDraft = () => {
    if (!working) return
    saveDocument({
      title: documentTitle(working.blocks, template.name),
      templateId: template.id,
      json: jsonInput,
      document: working,
      status,
    })
    setSaveMessage('Draft saved to My documents.')
  }

  const handleAdd = (type: Block['type']) => {
    if (!working) return
    const insertAt = selectedIndex === null ? working.blocks.length : selectedIndex + 1
    const blocks = [...working.blocks]
    blocks.splice(insertAt, 0, createBlock(type))
    updateBlocks(blocks)
    setSelectedIndex(insertAt)
  }

  const handleMove = (index: number, direction: -1 | 1) => {
    if (!working) return
    const next = index + direction
    if (next < 0 || next >= working.blocks.length) return
    const blocks = [...working.blocks]
    const [item] = blocks.splice(index, 1)
    blocks.splice(next, 0, item)
    updateBlocks(blocks)
    setSelectedIndex(next)
  }

  const handleDelete = (index: number) => {
    if (!working) return
    const blocks = working.blocks.filter((_, i) => i !== index)
    updateBlocks(blocks)
    setSelectedIndex(blocks.length === 0 ? null : Math.min(index, blocks.length - 1))
  }

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const mod = event.ctrlKey || event.metaKey
      if (!mod) return
      if (event.key.toLowerCase() === 'z' && !event.shiftKey) {
        event.preventDefault()
        setHistory((current) => undoHistory(current))
        setLayoutEdited(true)
        setExported(false)
      }
      if (event.key.toLowerCase() === 'y' || (event.key.toLowerCase() === 'z' && event.shiftKey)) {
        event.preventDefault()
        setHistory((current) => redoHistory(current))
        setExported(false)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <div className="flex h-full min-h-0 flex-col gap-6 p-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm text-slate-500">Workspace / New document</p>
          <div className="mt-1 flex items-center gap-3">
            <h2 className="text-2xl font-semibold text-white">New document</h2>
            <StatusBadge status={status} />
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => {
              setHistory((current) => undoHistory(current))
              setExported(false)
            }}
            disabled={!layoutEdited || history.past.length === 0}
            className="rounded-lg border border-slate-600 px-3 py-2 text-sm text-slate-200 hover:bg-slate-800 disabled:opacity-40"
          >
            Undo
          </button>
          <button
            type="button"
            onClick={() => {
              setHistory((current) => redoHistory(current))
              setExported(false)
            }}
            disabled={!layoutEdited || history.future.length === 0}
            className="rounded-lg border border-slate-600 px-3 py-2 text-sm text-slate-200 hover:bg-slate-800 disabled:opacity-40"
          >
            Redo
          </button>
          <button
            type="button"
            onClick={handleSaveDraft}
            disabled={!working}
            className="rounded-lg border border-slate-600 px-4 py-2 text-sm text-slate-200 hover:bg-slate-800 disabled:opacity-40"
          >
            Save draft
          </button>
          <Link
            to="/templates"
            className="rounded-lg px-4 py-2 text-sm text-slate-400 hover:text-slate-200"
          >
            Browse templates
          </Link>
        </div>
      </div>

      {saveMessage && <p className="text-sm text-emerald-400">{saveMessage}</p>}
      {layoutEdited && (
        <p className="text-sm text-amber-300">
          Layout edited. Preview follows the block list.{' '}
          <button type="button" className="underline" onClick={handleRebuild} disabled={!jsonResult.generated}>
            Rebuild from JSON
          </button>
        </p>
      )}

      <div className="grid min-h-0 flex-1 grid-cols-1 gap-6 lg:grid-cols-[minmax(300px,38%)_1fr]">
        <div className="flex min-h-0 flex-col gap-4 overflow-auto">
          <div className="rounded-xl border border-slate-800 bg-slate-900/30 p-5">
            <TemplatePicker
              templates={templates}
              selectedId={templateId}
              onSelect={handleTemplateChange}
            />
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/30 p-5">
            <button
              type="button"
              className="mb-3 text-sm text-slate-400 hover:text-slate-200"
              onClick={() => setShowJson((v) => !v)}
            >
              {showJson ? 'Hide JSON' : 'Show JSON'}
            </button>
            {showJson && (
              <JsonEditor
                value={jsonInput}
                onChange={(v) => {
                  setJsonInput(v)
                  setSaveMessage(null)
                  if (!layoutEdited) setExported(false)
                }}
                onLoadSample={handleLoadSample}
                error={jsonResult.error}
              />
            )}
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/30 p-5">
            <BlockList
              blocks={working?.blocks ?? []}
              selectedIndex={selectedIndex}
              onSelect={setSelectedIndex}
              onMove={handleMove}
              onDelete={handleDelete}
              onAdd={handleAdd}
            />
          </div>

          {selectedBlock && (
            <div className="rounded-xl border border-slate-800 bg-slate-900/30 p-5">
              <BlockProperties
                block={selectedBlock}
                onChange={(block) => {
                  if (!working || selectedIndex === null) return
                  const blocks = working.blocks.map((item, i) =>
                    i === selectedIndex ? block : item,
                  )
                  updateBlocks(blocks)
                }}
              />
            </div>
          )}
        </div>

        <div className="min-h-[480px] rounded-xl border border-slate-800 bg-slate-900/30 p-5">
          <DocumentPreview
            html={html}
            onExport={handleExport}
            exporting={exporting}
            canExport={Boolean(html) && issues.length === 0}
            issues={working ? issues : ['Load sample JSON or generate a document first.']}
            exportError={exportError}
          />
        </div>
      </div>
    </div>
  )
}
