interface DocumentPreviewProps {
  html: string | null
  onExport: () => void
  exporting: boolean
}

export function DocumentPreview({ html, onExport, exporting }: DocumentPreviewProps) {
  return (
    <div className="flex h-full flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-slate-300">Preview</span>
        <button
          type="button"
          onClick={onExport}
          disabled={!html || exporting}
          className="rounded-lg bg-blue-600 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {exporting ? 'Exporting…' : 'Export PDF'}
        </button>
      </div>

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
