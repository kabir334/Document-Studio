import type { DocumentModel, DocumentStatus } from '../domain/document'

export function validateDocument(doc: DocumentModel): string[] {
  const issues: string[] = []
  const hasHeading = doc.blocks.some((b) => b.type === 'heading' && b.text.trim() !== '')
  if (!hasHeading) {
    issues.push('Add at least one heading with text.')
  }

  doc.blocks.forEach((block, index) => {
    const n = index + 1
    switch (block.type) {
      case 'heading':
        if (!block.text.trim()) issues.push(`Heading ${n} is empty.`)
        break
      case 'paragraph':
        if (!block.text.trim()) issues.push(`Paragraph ${n} is empty.`)
        break
      case 'callout':
        if (!block.text.trim()) issues.push(`Callout ${n} is empty.`)
        break
      case 'total':
        if (!block.label.trim() || !block.value.trim()) {
          issues.push(`Total ${n} needs a label and a value.`)
        }
        break
      case 'list':
        if (block.items.length === 0 || block.items.every((item) => item.trim() === '')) {
          issues.push(`List ${n} needs at least one item.`)
        }
        break
      case 'table':
        if (block.columns.length === 0 || block.columns.every((c) => c.trim() === '')) {
          issues.push(`Table ${n} needs column titles.`)
        }
        if (block.rows.length === 0) {
          issues.push(`Table ${n} needs at least one row.`)
        }
        break
      case 'meta':
        if (block.items.length === 0) {
          issues.push(`Details ${n} need at least one label and value.`)
        }
        break
    }
  })

  return issues
}

export function resolveStatus(issues: string[], exported: boolean): DocumentStatus {
  if (exported && issues.length === 0) return 'exported'
  if (issues.length === 0) return 'ready'
  return 'draft'
}
