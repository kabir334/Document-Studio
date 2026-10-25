import type { Template } from '../domain/template'
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

export function getTemplateById(id: string): Template | undefined {
  return templates.find((t) => t.id === id)
}

export {
  monthlyReportTemplate,
  invoiceTemplate,
  certificateTemplate,
  proposalTemplate,
}
