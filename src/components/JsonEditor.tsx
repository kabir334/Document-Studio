interface JsonEditorProps {
  value: string
  onChange: (value: string) => void
  onLoadSample: () => void
  error?: string
}

export function JsonEditor({ value, onChange, onLoadSample, error }: JsonEditorProps) {
  return (
    <div className="flex h-full flex-col gap-3">
      <div className="flex items-center justify-between">
        <label htmlFor="json-input" className="text-sm font-medium text-slate-300">
          Data (JSON)
        </label>
        <button
          type="button"
          onClick={onLoadSample}
          className="rounded-md bg-slate-700 px-3 py-1 text-xs font-medium text-slate-200 transition-colors hover:bg-slate-600"
        >
          Load sample
        </button>
      </div>
      <textarea
        id="json-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        spellCheck={false}
        className="min-h-[200px] flex-1 resize-none rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 font-mono text-sm text-slate-200 focus:border-blue-500 focus:outline-none"
        placeholder='{ "title": "..." }'
      />
      {error && (
        <p className="text-xs text-red-400">{error}</p>
      )}
    </div>
  )
}
