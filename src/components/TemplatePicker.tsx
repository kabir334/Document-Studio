import type { Template } from '../domain/template'

interface TemplatePickerProps {
  templates: Template[]
  selectedId: string
  onSelect: (id: string) => void
}

export function TemplatePicker({ templates, selectedId, onSelect }: TemplatePickerProps) {
  const selected = templates.find((t) => t.id === selectedId)

  return (
    <div className="flex flex-col gap-3">
      <label htmlFor="template-select" className="text-sm font-medium text-app">
        Template
      </label>
      <select
        id="template-select"
        value={selectedId}
        onChange={(e) => onSelect(e.target.value)}
        className="rounded-lg border border-app bg-app-input px-3 py-2 text-sm text-app-heading focus:border-blue-500 focus:outline-none"
      >
        {templates.map((t) => (
          <option key={t.id} value={t.id}>{t.name}</option>
        ))}
      </select>
      {selected && (
        <p className="text-xs text-app-subtle">{selected.description}</p>
      )}
    </div>
  )
}