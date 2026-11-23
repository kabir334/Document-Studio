import { useEffect, useMemo, useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { BlockList } from '../components/BlockList'
import { BlockProperties } from '../components/BlockProperties'
import { createBlock } from '../domain/blocks'
import {
  DEFAULT_CUSTOM_COLORS,
  type CustomTemplateColors,
} from '../domain/customTemplate'
import type { Block } from '../domain/document'
import {
  initHistory,
  pushHistory,
  redoHistory,
  undoHistory,
  type HistoryState,
} from '../hooks/documentHistory'
import {
  getCustomTemplate,
  isBuiltInTemplateId,
  saveCustomTemplate,
} from '../services/customTemplates'
import { loadPreferences } from '../services/preferences'
import { renderHtml } from '../services/renderHtml'
import {
  buildCustomDocument,
  buildSampleData,
  collectPlaceholderKeys,
} from '../services/templatePlaceholders'
import { slugFilename } from '../templates/helpers'

function ColorField({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (value: string) => void
}) {
  return (
    <label className="flex items-center gap-3 text-sm">
      <span className="w-28 shrink-0 text-app-muted">{label}</span>
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-9 w-12 cursor-pointer rounded border border-app bg-transparent"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 rounded-lg border border-app bg-app-input px-2 py-1.5 font-mono text-xs text-app"
        maxLength={7}
      />
    </label>
  )
}

const STARTER_BLOCKS: Block[] = [
  { type: 'heading', text: '{{title}}', level: 1 },
  { type: 'paragraph', text: '{{summary}}' },
]

export function CustomTemplateEditor({ mode }: { mode: 'create' | 'edit' }) {
  const { id } = useParams()
  const navigate = useNavigate()

  if (mode === 'edit') {
    if (!id || isBuiltInTemplateId(id) || !id.startsWith('custom-')) {
      return <Navigate to="/templates" replace />
    }
    const loaded = getCustomTemplate(id)
    if (!loaded) {
      return <Navigate to="/templates" replace />
    }
  }

  const existingDef = mode === 'edit' && id ? getCustomTemplate(id) : undefined

  return (
    <CustomTemplateEditorForm
      key={existingDef?.id ?? 'new'}
      mode={mode}
      existingDef={existingDef}
      onSaved={() => navigate('/templates')}
    />
  )
}

function CustomTemplateEditorForm({
  mode,
  existingDef,
  onSaved,
}: {
  mode: 'create' | 'edit'
  existingDef?: ReturnType<typeof getCustomTemplate>
  onSaved: () => void
}) {
  const prefs = loadPreferences()

  const [name, setName] = useState(existingDef?.name ?? '')
  const [description, setDescription] = useState(existingDef?.description ?? '')
  const [filenameBase, setFilenameBase] = useState(existingDef?.filenameBase ?? '')
  const [colors, setColors] = useState<CustomTemplateColors>(
    existingDef?.colors ?? { ...DEFAULT_CUSTOM_COLORS },
  )
  const [history, setHistory] = useState<HistoryState<Block[]>>(() =>
    initHistory(existingDef?.blocks ?? [...STARTER_BLOCKS]),
  )
  const [selectedIndex, setSelectedIndex] = useState<number | null>(0)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [filenameTouched, setFilenameTouched] = useState(Boolean(existingDef?.filenameBase))

  const blocks = history.present

  useEffect(() => {
    if (filenameTouched) return
    const slug = slugFilename(name)
    if (slug) setFilenameBase(slug)
  }, [name, filenameTouched])

  const placeholderKeys = useMemo(() => collectPlaceholderKeys(blocks), [blocks])

  const previewDoc = useMemo(() => {
    const keys = collectPlaceholderKeys(blocks)
    const data = buildSampleData(keys, blocks)
    const result = buildCustomDocument(
      { blocks, colors, filenameBase: filenameBase || 'preview' },
      keys.length > 0 ? data : {},
    )
    if (result.ok) return result.document
    return {
      theme: 'custom' as const,
      filename: 'preview.pdf',
      blocks,
      customColors: colors,
    }
  }, [blocks, colors, filenameBase])

  const html = useMemo(
    () => renderHtml(previewDoc, { footerText: `Preview · ${prefs.studioName}` }),
    [previewDoc, prefs.studioName],
  )

  const updateBlocks = (next: Block[]) => {
    setHistory((current) => pushHistory(current, next))
  }

  const handleSave = () => {
    setSaveError(null)
    const result = saveCustomTemplate({
      id: existingDef?.id,
      name,
      description,
      blocks,
      colors,
      filenameBase,
    })
    if (!result.ok) {
      setSaveError(result.error)
      return
    }
    onSaved()
  }

  const selectedBlock = selectedIndex !== null ? blocks[selectedIndex] : undefined

  const setColor = (key: keyof CustomTemplateColors, value: string) => {
    setColors((c) => ({ ...c, [key]: value }))
  }

  return (
    <div className="page-shell flex h-full min-h-0 flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm text-app-subtle">Design / Templates</p>
          <h2 className="mt-1 text-xl font-semibold text-app-heading md:text-2xl">
            {mode === 'create' ? 'Create template' : 'Edit template'}
          </h2>
          <p className="mt-1 max-w-2xl text-sm text-app-muted">
            Compose blocks and colors. Use placeholders like{' '}
            <span className="font-mono text-app">{'{{fieldName}}'}</span> in text for JSON data.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setHistory((c) => undoHistory(c))}
            disabled={history.past.length === 0}
            className="rounded-lg border border-app-dashed px-3 py-2 text-sm text-app hover:bg-app-hover disabled:opacity-40"
          >
            Undo
          </button>
          <button
            type="button"
            onClick={() => setHistory((c) => redoHistory(c))}
            disabled={history.future.length === 0}
            className="rounded-lg border border-app-dashed px-3 py-2 text-sm text-app hover:bg-app-hover disabled:opacity-40"
          >
            Redo
          </button>
          <Link
            to="/templates"
            className="rounded-lg px-4 py-2 text-sm text-app-muted hover:text-app"
          >
            Cancel
          </Link>
          <button
            type="button"
            onClick={handleSave}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500"
          >
            Save template
          </button>
        </div>
      </div>

      {saveError && <p className="text-sm text-red-400">{saveError}</p>}

      <div className="grid min-h-0 flex-1 grid-cols-1 gap-6 lg:grid-cols-[minmax(300px,38%)_1fr]">
        <div className="flex min-h-0 flex-col gap-4 overflow-auto">
          <div className="rounded-xl border border-app bg-app-card p-4 md:p-5">
            <p className="text-sm font-medium text-app">Template details</p>
            <DetailFields
              name={name}
              setName={setName}
              description={description}
              setDescription={setDescription}
              filenameBase={filenameBase}
              setFilenameBase={(v) => {
                setFilenameTouched(true)
                setFilenameBase(v)
              }}
            />
          </div>

          <div className="rounded-xl border border-app bg-app-card p-4 md:p-5">
            <p className="mb-3 text-sm font-medium text-app">Document colors</p>
            <div className="flex flex-col gap-3">
              <ColorField
                label="Primary"
                value={colors.primary}
                onChange={(v) => setColor('primary', v)}
              />
              <ColorField
                label="Table header"
                value={colors.tableHeader}
                onChange={(v) => setColor('tableHeader', v)}
              />
              <ColorField
                label="Callout border"
                value={colors.calloutBorder}
                onChange={(v) => setColor('calloutBorder', v)}
              />
              <ColorField
                label="Total bar"
                value={colors.totalBackground}
                onChange={(v) => setColor('totalBackground', v)}
              />
              <ColorField
                label="Page background"
                value={colors.pageBackground ?? '#ffffff'}
                onChange={(v) => setColor('pageBackground', v)}
              />
            </div>
          </div>

          <div className="rounded-xl border border-app bg-app-card p-4 md:p-5">
            <p className="mb-2 text-xs text-app-muted">
              Data fields detected:{' '}
              {placeholderKeys.length > 0 ? placeholderKeys.join(', ') : 'none (static template)'}
            </p>
            <BlockList
              blocks={blocks}
              selectedIndex={selectedIndex}
              onSelect={setSelectedIndex}
              onMove={(index, direction) => {
                const next = index + direction
                if (next < 0 || next >= blocks.length) return
                const copy = [...blocks]
                const [item] = copy.splice(index, 1)
                copy.splice(next, 0, item)
                updateBlocks(copy)
                setSelectedIndex(next)
              }}
              onDelete={(index) => {
                const copy = blocks.filter((_, i) => i !== index)
                updateBlocks(copy)
                setSelectedIndex(copy.length === 0 ? null : Math.min(index, copy.length - 1))
              }}
              onAdd={(type) => {
                const insertAt = selectedIndex === null ? blocks.length : selectedIndex + 1
                const copy = [...blocks]
                copy.splice(insertAt, 0, createBlock(type))
                updateBlocks(copy)
                setSelectedIndex(insertAt)
              }}
            />
            {selectedBlock && (
              <div className="mt-4 border-t border-app pt-4">
                <BlockProperties
                  block={selectedBlock}
                  onChange={(block) => {
                    if (selectedIndex === null) return
                    const copy = [...blocks]
                    copy[selectedIndex] = block
                    updateBlocks(copy)
                  }}
                />
              </div>
            )}
          </div>
        </div>

        <PreviewPanel html={html} className="min-h-[480px]" />
      </div>
    </div>
  )
}

function DetailFields(props: {
  name: string
  setName: (v: string) => void
  description: string
  setDescription: (v: string) => void
  filenameBase: string
  setFilenameBase: (v: string) => void
}) {
  const fieldClass =
    'mt-1 w-full rounded-lg border border-app bg-app-input px-3 py-2 text-sm text-app focus:border-blue-500 focus:outline-none'
  return (
    <div className="mt-3 flex flex-col gap-3">
      <label className="text-xs text-app-muted">
        Name
        <input
          className={fieldClass}
          value={props.name}
          onChange={(e) => props.setName(e.target.value)}
          placeholder="My template"
        />
      </label>
      <label className="text-xs text-app-muted">
        Description
        <input
          className={fieldClass}
          value={props.description}
          onChange={(e) => props.setDescription(e.target.value)}
          placeholder="Short description"
        />
      </label>
      <label className="text-xs text-app-muted">
        Export filename base
        <input
          className={fieldClass}
          value={props.filenameBase}
          onChange={(e) => props.setFilenameBase(e.target.value)}
          placeholder="my-template"
        />
      </label>
    </div>
  )
}

function PreviewPanel({ html, className }: { html: string; className?: string }) {
  return (
    <div
      className={`flex min-h-0 flex-col rounded-xl border border-app bg-app-card p-4 md:p-5 ${className ?? ''}`}
    >
      <p className="mb-3 text-sm font-medium text-app">Preview</p>
      <div className="flex-1 overflow-hidden rounded-lg border border-app bg-white">
        <iframe
          srcDoc={html}
          title="Template preview"
          className="h-full min-h-[320px] w-full border-0 bg-white md:min-h-[480px]"
          sandbox="allow-same-origin"
        />
      </div>
    </div>
  )
}