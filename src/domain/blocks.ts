import type { Block } from './document'

export const BLOCK_TYPES: Block['type'][] = [
  'heading',
  'paragraph',
  'callout',
  'list',
  'table',
  'meta',
  'total',
]

export function createBlock(type: Block['type']): Block {
  switch (type) {
    case 'heading':
      return { type: 'heading', text: 'Heading', level: 2 }
    case 'paragraph':
      return { type: 'paragraph', text: '' }
    case 'callout':
      return { type: 'callout', text: '' }
    case 'list':
      return { type: 'list', items: [''], ordered: false }
    case 'table':
      return { type: 'table', columns: ['Column 1', 'Column 2'], rows: [['', '']] }
    case 'meta':
      return { type: 'meta', items: [{ label: 'Label', value: '' }] }
    case 'total':
      return { type: 'total', label: 'Total', value: '' }
  }
}

export function blockLabel(block: Block): string {
  switch (block.type) {
    case 'heading':
      return block.text || 'Heading'
    case 'paragraph':
      return block.text || 'Paragraph'
    case 'callout':
      return block.text || 'Callout'
    case 'list':
      return `${block.items.length} item${block.items.length === 1 ? '' : 's'}`
    case 'table':
      return `${block.columns.length} cols × ${block.rows.length} rows`
    case 'meta':
      return `${block.items.length} field${block.items.length === 1 ? '' : 's'}`
    case 'total':
      return block.label || 'Total'
  }
}

export function documentTitle(blocks: Block[], fallback: string): string {
  const heading = blocks.find((b) => b.type === 'heading')
  if (heading && heading.type === 'heading' && heading.text.trim()) {
    return heading.text.trim()
  }
  return fallback
}
