import { useMemo, useState } from 'react'
import sampleData from '../data/sampleReport.json'
import { TemplatePicker } from '../components/TemplatePicker'
import { JsonEditor } from '../components/JsonEditor'
import { DocumentPreview } from '../components/DocumentPreview'
import { templates, getTemplateById } from '../templates'
import { parseJson } from '../services/parseJson'
import { buildDocument } from '../services/buildDocument'
import { renderHtml } from '../services/renderHtml'
import { exportPdf } from '../services/exportPdf'

export function NewDocument() {
  const [templateId, setTemplateId] = useState(templates[0].id)
  const [jsonInput, setJsonInput] = useState('')
  const [exporting, setExporting] = useState(false)

  const template = getTemplateById(templateId) ?? templates[0]

  const { html, error } = useMemo(() => {
    if (!jsonInput.trim()) {
      return { html: null, error: undefined }
    }

    const parsed = parseJson(jsonInput)
    if (!parsed.ok) {
      return { html: null, error: parsed.error }
    }

    const built = buildDocument(template, parsed.data)
    if (!built.ok) {
      return { html: null, error: built.error }
    }

    return { html: renderHtml(built.document), error: undefined }
  }, [jsonInput, template])

  const handleLoadSample = () => {
    setJsonInput(JSON.stringify(sampleData, null, 2))
  }

  const handleExport = async (element: HTMLElement) => {
    setExporting(true)
    try {
      await exportPdf(element, 'simple-report.pdf')
    } catch {
      alert('PDF export failed. The preview is still available.')
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className="flex h-full flex-col gap-6 p-8">
      <div>
        <p className="text-sm text-slate-500">Workspace / New document</p>
        <h2 className="mt-1 text-2xl font-semibold text-white">New document</h2>
      </div>

      <div className="grid flex-1 grid-cols-3 gap-6 min-h-0">
        <div className="rounded-xl border border-slate-800 bg-slate-900/30 p-5">
          <TemplatePicker
            templates={templates}
            selectedId={templateId}
            onSelect={setTemplateId}
          />
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/30 p-5">
          <JsonEditor
            value={jsonInput}
            onChange={setJsonInput}
            onLoadSample={handleLoadSample}
            error={error}
          />
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/30 p-5">
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
