interface DocumentPreviewProps {
  html: string | null
  onExportPdf: () => void
  onExportHtml: () => void
  exporting: boolean
  canExport?: boolean
  issues?: string[]
  exportError?: string | null
}

export function DocumentPreview({
  html,
  onExportPdf,
  onExportHtml,
  exporting,
  canExport = true,
  issues = [],
  exportError,
}: DocumentPreviewProps) {
  return (
    <div className="flex h-full flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-sm font-medium text-app">Preview</span>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onExportHtml}
            disabled={!html || !canExport}
            className="rounded-lg border border-app-dashed px-2.5 py-1.5 text-xs text-app hover:bg-app-hover disabled:opacity-40 sm:px-3 sm:text-sm"
          >
            Download HTML
          </button>
          <button
            type="button"
            onClick={onExportPdf}
            disabled={!html || exporting || !canExport}
            className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-40 sm:px-4 sm:text-sm"
          >
            {exporting ? 'Exporting…' : 'Export PDF'}
          </button>
        </div>
      </div>

      {issues.length > 0 && (
        <ul className="rounded-lg border border-amber-900/60 bg-amber-950/40 px-3 py-2 text-xs text-amber-200">
          {issues.map((issue) => (
            <li key={issue}>{issue}</li>
          ))}
        </ul>
      )}

      {exportError && <p className="text-xs text-red-400">{exportError}</p>}

      <div className="flex-1 overflow-hidden rounded-lg border border-app bg-white">
        {html ? (
          <iframe
            srcDoc={html}
            title="Document preview"
            className="h-full min-h-[200px] w-full border-0 bg-white md:min-h-[320px]"
            sandbox="allow-same-origin"
          />
        ) : (
          <div className="flex h-full min-h-[200px] items-center justify-center text-sm text-app-muted">
            Enter valid JSON to see a preview
          </div>
        )}
      </div>
    </div>
  )
}