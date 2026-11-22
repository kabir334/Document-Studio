import { BLOCK_TYPES, blockLabel } from '../domain/blocks'
import type { Block } from '../domain/document'

interface BlockListProps {
  blocks: Block[]
  selectedIndex: number | null
  onSelect: (index: number) => void
  onMove: (index: number, direction: -1 | 1) => void
  onDelete: (index: number) => void
  onAdd: (type: Block['type']) => void
}

export function BlockList({
  blocks,
  selectedIndex,
  onSelect,
  onMove,
  onDelete,
  onAdd,
}: BlockListProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-medium text-app">Blocks</span>
        <select
          className="rounded-md border border-app bg-app-input px-2 py-1 text-xs text-app"
          defaultValue=""
          onChange={(e) => {
            const value = e.target.value as Block['type']
            if (value) onAdd(value)
            e.target.value = ''
          }}
        >
          <option value="" disabled>
            Add block…
          </option>
          {BLOCK_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      {blocks.length === 0 ? (
        <p className="text-xs text-app-subtle">Generate from JSON, then add or edit blocks.</p>
      ) : (
        <ul className="flex max-h-64 flex-col gap-1 overflow-auto">
          {blocks.map((block, index) => (
            <li
              key={`${block.type}-${index}`}
              className={`flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm ${
                selectedIndex === index ? 'bg-app-nav-active text-app-heading' : 'text-app'
              }`}
            >
              <button
                type="button"
                className="min-w-0 flex-1 truncate text-left"
                onClick={() => onSelect(index)}
              >
                <span className="mr-2 text-xs uppercase text-app-subtle">{block.type}</span>
                {blockLabel(block)}
              </button>
              <button
                type="button"
                className="px-1 text-app-subtle hover:text-app-heading"
                onClick={() => onMove(index, -1)}
                disabled={index === 0}
              >
                ↑
              </button>
              <button
                type="button"
                className="px-1 text-app-subtle hover:text-app-heading"
                onClick={() => onMove(index, 1)}
                disabled={index === blocks.length - 1}
              >
                ↓
              </button>
              <button
                type="button"
                className="px-1 text-app-subtle hover:text-red-400"
                onClick={() => onDelete(index)}
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}