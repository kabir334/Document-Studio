import type { Template } from '../domain/template'
import {
  customDefToTemplate,
  isBuiltInTemplateId,
  listCustomTemplates,
} from '../services/customTemplates'
import { monthlyReportTemplate } from './monthlyReport'
import { invoiceTemplate } from './invoice'
import { certificateTemplate } from './certificate'
import { proposalTemplate } from './proposal'

export const templates: Template[] = [
  monthlyReportTemplate,
  invoiceTemplate,
  certificateTemplate,
  proposalTemplate,
]

export function getAllTemplates(): Template[] {
  const custom = listCustomTemplates().map(customDefToTemplate)
  return [...templates, ...custom]
}

export function getTemplateById(id: string): Template | undefined {
  const builtIn = templates.find((t) => t.id === id)
  if (builtIn) return builtIn
  const def = listCustomTemplates().find((d) => d.id === id)
  return def ? customDefToTemplate(def) : undefined
}

export { isBuiltInTemplateId }

export {
  monthlyReportTemplate,
  invoiceTemplate,
  certificateTemplate,
  proposalTemplate,
}