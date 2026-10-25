import type { DocumentModel } from './document'

export interface FieldDef {
  key: string
  label: string
  type: 'string' | 'string[]' | 'object[]'
  required: boolean
}

export interface Template {
  id: string
  name: string
  description: string
  fields: FieldDef[]
  sampleData: Record<string, unknown>
  build: (data: Record<string, unknown>) => DocumentModel
}
