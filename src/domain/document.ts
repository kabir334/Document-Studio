export type DocumentTheme = 'report' | 'invoice' | 'certificate' | 'proposal'

export type Block =
  | { type: 'heading'; text: string; level?: 1 | 2 | 3 }
  | { type: 'paragraph'; text: string }
  | { type: 'meta'; items: { label: string; value: string }[] }
  | { type: 'callout'; text: string }
  | { type: 'table'; columns: string[]; rows: string[][] }
  | { type: 'list'; items: string[]; ordered?: boolean }
  | { type: 'total'; label: string; value: string }

export type DocumentStatus = 'draft' | 'ready' | 'exported'

export interface DocumentModel {
  theme: DocumentTheme
  filename: string
  blocks: Block[]
}
