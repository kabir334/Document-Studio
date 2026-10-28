interface DocumentPreviewProps {
  html: string | null
  onExport: () => void
  exporting: boolean
  canExport?: boolean
  issues?: string[]
  exportError?: string | null
}

export function DocumentPreview({
  html,
  onExport,
  exporting,
  canExport = true,
  issues = [],
  exportError,
}: DocumentPreviewProps) {
  return (
    <div className="flex h-full flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-slate-300">Preview</span>
        <button
          type="button"
          onClick={onExport}
          disabled={!html || exporting || !canExport}
          className="rounded-lg bg-blue-600 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {exporting ? 'Exporting…' : 'Export PDF'}
        </button>
      </div>

      {issues.length > 0 && (
        <ul className="rounded-lg border border-amber-900/60 bg-amber-950/40 px-3 py-2 text-xs text-amber-200">
          {issues.map((issue) => (
            <li key={issue}>{issue}</li>
          ))}
        </ul>
      )}

      {exportError && (
        <p className="text-xs text-red-400">{exportError}</p>
      )}

      <div className="flex-1 overflow-hidden rounded-lg border border-slate-700 bg-white">
        {html ? (
          <iframe
            srcDoc={html}
            title="Document preview"
            className="h-full min-h-[320px] w-full border-0 bg-white"
            sandbox="allow-same-origin"
          />
        ) : (
          <div className="flex h-full min-h-[200px] items-center justify-center text-sm text-slate-400">
            Enter valid JSON to see a preview
          </div>
        )}
      </div>
    </div>
  )
}
