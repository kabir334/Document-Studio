import { BLOCK_TYPES } from '../domain/blocks'
import type { Block } from '../domain/document'

const descriptions: Record<Block['type'], string> = {
  heading: 'Titles and section labels. Level 1 is the main document title.',
  paragraph: 'Body text for summaries, addresses, and explanations.',
  callout: 'Highlighted quote or summary with a colored left border.',
  list: 'Bullet or numbered lists for steps, highlights, or timelines.',
  table: 'Rows and columns for metrics, line items, or deliverables.',
  meta: 'Label/value pairs such as dates, authors, or billing details.',
  total: 'Prominent amount or investment line at the end of a document.',
}

export function Components() {
  return (
    <div className="flex flex-col gap-8 p-8">
      <div>
        <p className="text-sm text-app-subtle">Design / Components</p>
        <h2 className="mt-1 text-2xl font-semibold text-app-heading">Components</h2>
        <p className="mt-1 max-w-2xl text-app-muted">
          Building blocks used inside templates. Edit them on the New document page after
          generating from JSON.
        </p>
      </div>

      <ul className="grid max-w-3xl gap-4 sm:grid-cols-2">
        {BLOCK_TYPES.map((type) => (
          <li
            key={type}
            className="rounded-xl border border-app bg-app-card p-5"
          >
            <p className="text-sm font-medium capitalize text-app-heading">{type}</p>
            <p className="mt-2 text-sm text-app-muted">{descriptions[type]}</p>
            <p className="mt-3 text-xs text-app-subtle">Used in report, invoice, proposal, and certificate layouts.</p>
          </li>
        ))}
      </ul>
    </div>
  )
}