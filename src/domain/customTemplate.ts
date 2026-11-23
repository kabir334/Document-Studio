import type { Block } from './document'

export interface CustomTemplateColors {
  primary: string
  tableHeader: string
  calloutBorder: string
  totalBackground: string
  pageBackground?: string
}

export const DEFAULT_CUSTOM_COLORS: CustomTemplateColors = {
  primary: '#1e3a5f',
  tableHeader: '#1e3a5f',
  calloutBorder: '#2563eb',
  totalBackground: '#1e3a5f',
  pageBackground: '#ffffff',
}

export interface CustomTemplateDef {
  id: string
  name: string
  description: string
  blocks: Block[]
  colors: CustomTemplateColors
  filenameBase: string
  createdAt: string
  updatedAt: string
}

export const HEX_COLOR_RE = /^#[0-9A-Fa-f]{6}$/

export function isValidHexColor(value: string): boolean {
  return HEX_COLOR_RE.test(value)
}