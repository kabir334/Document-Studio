import type { Block } from '../domain/document'

interface BlockPropertiesProps {
  block: Block
  onChange: (block: Block) => void
}

const fieldClass =
  'w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-200 focus:border-blue-500 focus:outline-none'

export function BlockProperties({ block, onChange }: BlockPropertiesProps) {
  return (
    <div className="flex flex-col gap-3">
      <span className="text-sm font-medium text-slate-300">Properties</span>
      {block.type === 'heading' && (
        <>
          <input
            className={fieldClass}
            value={block.text}
            onChange={(e) => onChange({ ...block, text: e.target.value })}
          />
          <select
            className={fieldClass}
            value={block.level ?? 2}
            onChange={(e) =>
              onChange({ ...block, level: Number(e.target.value) as 1 | 2 | 3 })
            }
          >
            <option value={1}>Heading 1</option>
            <option value={2}>Heading 2</option>
            <option value={3}>Heading 3</option>
          </select>
        </>
      )}

      {(block.type === 'paragraph' || block.type === 'callout') && (
        <textarea
          className={`${fieldClass} min-h-24`}
          value={block.text}
          onChange={(e) => onChange({ ...block, text: e.target.value })}
        />
      )}

      {block.type === 'total' && (
        <>
          <input
            className={fieldClass}
            value={block.label}
            onChange={(e) => onChange({ ...block, label: e.target.value })}
            placeholder="Label"
          />
          <input
            className={fieldClass}
            value={block.value}
            onChange={(e) => onChange({ ...block, value: e.target.value })}
            placeholder="Value"
          />
        </>
      )}

      {block.type === 'list' && (
        <>
          <label className="flex items-center gap-2 text-xs text-slate-400">
            <input
              type="checkbox"
              checked={Boolean(block.ordered)}
              onChange={(e) => onChange({ ...block, ordered: e.target.checked })}
            />
            Numbered list
          </label>
          <textarea
            className={`${fieldClass} min-h-28`}
            value={block.items.join('\n')}
            onChange={(e) =>
              onChange({ ...block, items: e.target.value.split('\n') })
            }
          />
        </>
      )}

      {block.type === 'meta' && (
        <div className="flex flex-col gap-2">
          {block.items.map((item, i) => (
            <div key={i} className="grid grid-cols-[1fr_1fr_auto] gap-2">
              <input
                className={fieldClass}
                value={item.label}
                onChange={(e) => {
                  const items = block.items.map((row, idx) =>
                    idx === i ? { ...row, label: e.target.value } : row,
                  )
                  onChange({ ...block, items })
                }}
              />
              <input
                className={fieldClass}
                value={item.value}
                onChange={(e) => {
                  const items = block.items.map((row, idx) =>
                    idx === i ? { ...row, value: e.target.value } : row,
                  )
                  onChange({ ...block, items })
                }}
              />
              <button
                type="button"
                className="text-slate-500 hover:text-red-400"
                onClick={() =>
                  onChange({ ...block, items: block.items.filter((_, idx) => idx !== i) })
                }
              >
                ×
              </button>
            </div>
          ))}
          <button
            type="button"
            className="self-start text-xs text-blue-400 hover:text-blue-300"
            onClick={() =>
              onChange({ ...block, items: [...block.items, { label: '', value: '' }] })
            }
          >
            Add field
          </button>
        </div>
      )}

      {block.type === 'table' && (
        <TableEditor block={block} onChange={onChange} />
      )}
    </div>
  )
}

function TableEditor({
  block,
  onChange,
}: {
  block: Extract<Block, { type: 'table' }>
  onChange: (block: Block) => void
}) {
  const updateCell = (r: number, c: number, value: string) => {
    const rows = block.rows.map((row, ri) =>
      ri === r ? row.map((cell, ci) => (ci === c ? value : cell)) : row,
    )
    onChange({ ...block, rows })
  }

  return (
    <div className="flex flex-col gap-2 overflow-auto">
      <div className="flex gap-1">
        {block.columns.map((col, c) => (
          <input
            key={c}
            className={fieldClass}
            value={col}
            onChange={(e) => {
              const columns = block.columns.map((item, i) =>
                i === c ? e.target.value : item,
              )
              onChange({ ...block, columns })
            }}
          />
        ))}
      </div>
      {block.rows.map((row, r) => (
        <div key={r} className="flex gap-1">
          {row.map((cell, c) => (
            <input
              key={c}
              className={fieldClass}
              value={cell}
              onChange={(e) => updateCell(r, c, e.target.value)}
            />
          ))}
          <button
            type="button"
            className="text-slate-500 hover:text-red-400"
            onClick={() =>
              onChange({ ...block, rows: block.rows.filter((_, i) => i !== r) })
            }
          >
            ×
          </button>
        </div>
      ))}
      <button
        type="button"
        className="self-start text-xs text-blue-400 hover:text-blue-300"
        onClick={() =>
          onChange({
            ...block,
            rows: [...block.rows, block.columns.map(() => '')],
          })
        }
      >
        Add row
      </button>
    </div>
  )
}
