import { useRef } from 'react'

interface DocumentPreviewProps {
  html: string | null
  onExport: (element: HTMLElement) => void
  exporting: boolean
}

export function DocumentPreview({ html, onExport, exporting }: DocumentPreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null)

  const handleExport = () => {
    const body = iframeRef.current?.contentDocument?.body
    if (body) {
      onExport(body)
    }
  }

  return (
    <div className="flex h-full flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-slate-300">Preview</span>
        <button
          type="button"
          onClick={handleExport}
          disabled={!html || exporting}
          className="rounded-lg bg-blue-600 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {exporting ? 'Exporting…' : 'Export PDF'}
        </button>
      </div>

      <div className="flex-1 overflow-hidden rounded-lg border border-slate-700 bg-white">
        {html ? (
          <iframe
            ref={iframeRef}
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
