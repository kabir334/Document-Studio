import type { Template } from '../domain/template'
import { simpleReportTemplate } from './simpleReport'

export const templates: Template[] = [simpleReportTemplate]

export function getTemplateById(id: string): Template | undefined {
  return templates.find((t) => t.id === id)
}
