interface JsonEditorProps {
  value: string
  onChange: (value: string) => void
  onLoadSample: () => void
  onLoadFile?: (file: File, text: string) => void
  error?: string
}

export function JsonEditor({
  value,
  onChange,
  onLoadSample,
  onLoadFile,
  error,
}: JsonEditorProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <label htmlFor="json-input" className="text-sm font-medium text-slate-300">
          Data (JSON)
        </label>
        <div className="flex gap-2">
          {onLoadFile && (
            <label className="cursor-pointer rounded-md bg-slate-700 px-3 py-1 text-xs font-medium text-slate-200 hover:bg-slate-600">
              Load file
              <input
                type="file"
                accept=".json,.csv,application/json,text/csv"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (!file) return
                  const reader = new FileReader()
                  reader.onload = () => {
                    onLoadFile(file, String(reader.result ?? ''))
                  }
                  reader.readAsText(file)
                  e.target.value = ''
                }}
              />
            </label>
          )}
          <button
            type="button"
            onClick={onLoadSample}
            className="rounded-md bg-slate-700 px-3 py-1 text-xs font-medium text-slate-200 transition-colors hover:bg-slate-600"
          >
            Load sample
          </button>
        </div>
      </div>
      <textarea
        id="json-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        spellCheck={false}
        className="min-h-[200px] flex-1 resize-none rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 font-mono text-sm text-slate-200 focus:border-blue-500 focus:outline-none"
        placeholder='{ "title": "..." }'
      />
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  )
}
