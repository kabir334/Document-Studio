interface JsonEditorProps {
  value: string
  onChange: (value: string) => void
  onLoadSample: () => void
  onLoadFile?: (file: File, text: string) => void
  error?: string
}

const secondaryBtn =
  'rounded-md bg-app-nav-active px-3 py-1 text-xs font-medium text-app transition-colors hover:bg-app-hover-solid'

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
        <label htmlFor="json-input" className="text-sm font-medium text-app">
          Data (JSON)
        </label>
        <div className="flex gap-2">
          {onLoadFile && (
            <label className={`cursor-pointer ${secondaryBtn}`}>
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
          <button type="button" onClick={onLoadSample} className={secondaryBtn}>
            Load sample
          </button>
        </div>
      </div>
      <textarea
        id="json-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        spellCheck={false}
        className="min-h-[200px] flex-1 resize-none rounded-lg border border-app bg-app-input px-3 py-2 font-mono text-sm text-app focus:border-blue-500 focus:outline-none"
        placeholder='{ "title": "..." }'
      />
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  )
}