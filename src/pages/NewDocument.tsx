import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useSearchParams } from 'react-router-dom'
import { TemplatePicker } from '../components/TemplatePicker'
import { JsonEditor } from '../components/JsonEditor'
import { DocumentPreview } from '../components/DocumentPreview'
import { templates, getTemplateById } from '../templates'
import { parseJson } from '../services/parseJson'
import { buildDocument } from '../services/buildDocument'
import { renderHtml } from '../services/renderHtml'
import { exportPdfFromHtml } from '../services/exportPdf'
import { saveDocument } from '../services/savedDocuments'

export function NewDocument() {
  const [searchParams, setSearchParams] = useSearchParams()
  const location = useLocation()
  const state = location.state as { json?: string; title?: string } | null

  const paramTemplate = searchParams.get('template')
  const initialId =
    paramTemplate && getTemplateById(paramTemplate) ? paramTemplate : templates[0].id

  const [templateId, setTemplateId] = useState(initialId)
  const [jsonInput, setJsonInput] = useState('')
  const [exporting, setExporting] = useState(false)
  const [saveMessage, setSaveMessage] = useState<string | null>(null)

  const template = getTemplateById(templateId) ?? templates[0]

  useEffect(() => {
    if (paramTemplate && getTemplateById(paramTemplate)) {
      setTemplateId(paramTemplate)
    }
  }, [paramTemplate])

  useEffect(() => {
    if (state?.json) {
      setJsonInput(state.json)
      window.history.replaceState({}, '')
    }
  }, [state?.json])

  const { html, error, document: builtDoc } = useMemo(() => {
    if (!jsonInput.trim()) {
      return { html: null, error: undefined, document: null }
    }

    const parsed = parseJson(jsonInput)
    if (!parsed.ok) {
      return { html: null, error: parsed.error, document: null }
    }

    const built = buildDocument(template, parsed.data)
    if (!built.ok) {
      return { html: null, error: built.error, document: null }
    }

    return {
      html: renderHtml(built.document),
      error: undefined,
      document: built.document,
    }
  }, [jsonInput, template])

  const handleTemplateChange = (id: string) => {
    setTemplateId(id)
    setSearchParams({ template: id })
    setJsonInput('')
    setSaveMessage(null)
  }

  const handleLoadSample = () => {
    setJsonInput(JSON.stringify(template.sampleData, null, 2))
    setSaveMessage(null)
  }

  const handleExport = async () => {
    if (!builtDoc || !html) return
    setExporting(true)
    try {
      await exportPdfFromHtml(html, builtDoc.filename)
    } catch {
      alert('PDF export failed. The preview is still available.')
    } finally {
      setExporting(false)
    }
  }

  const handleSaveDraft = () => {
    if (!jsonInput.trim() || error) return
    const parsed = parseJson(jsonInput)
    if (!parsed.ok) return
    const built = buildDocument(template, parsed.data)
    if (!built.ok) return

    const titleBlock = built.document.blocks.find(
      (b) => b.type === 'heading' && b.level === 1,
    )
    const title =
      titleBlock && titleBlock.type === 'heading'
        ? titleBlock.text
        : template.name

    saveDocument({
      title,
      templateId: template.id,
      json: jsonInput,
    })
    setSaveMessage('Draft saved to My documents.')
  }

  return (
    <div className="flex h-full min-h-0 flex-col gap-6 p-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm text-slate-500">Workspace / New document</p>
          <h2 className="mt-1 text-2xl font-semibold text-white">New document</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleSaveDraft}
            disabled={!html}
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

      {saveMessage && (
        <p className="text-sm text-emerald-400">{saveMessage}</p>
      )}

      <div className="grid min-h-0 flex-1 grid-cols-1 gap-6 lg:grid-cols-[minmax(280px,38%)_1fr]">
        <div className="flex flex-col gap-4">
          <div className="rounded-xl border border-slate-800 bg-slate-900/30 p-5">
            <TemplatePicker
              templates={templates}
              selectedId={templateId}
              onSelect={handleTemplateChange}
            />
          </div>
          <div className="min-h-[320px] flex-1 rounded-xl border border-slate-800 bg-slate-900/30 p-5">
            <JsonEditor
              value={jsonInput}
              onChange={(v) => {
                setJsonInput(v)
                setSaveMessage(null)
              }}
              onLoadSample={handleLoadSample}
              error={error}
            />
          </div>
        </div>

        <div className="min-h-[480px] rounded-xl border border-slate-800 bg-slate-900/30 p-5">
          <DocumentPreview
            html={html}
            onExport={handleExport}
            exporting={exporting}
          />
        </div>
      </div>
    </div>
  )
}
