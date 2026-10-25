import type { DocumentModel } from '../domain/document'
import type { Template } from '../domain/template'

function requireString(data: Record<string, unknown>, key: string): string {
  const value = data[key]
  if (typeof value !== 'string' || value.trim() === '') {
    throw new Error(`"${key}" must be a non-empty string`)
  }
  return value
}

function requireStringArray(data: Record<string, unknown>, key: string): string[] {
  const value = data[key]
  if (!Array.isArray(value) || value.length === 0) {
    throw new Error(`"${key}" must be a non-empty array of strings`)
  }
  if (!value.every((item) => typeof item === 'string')) {
    throw new Error(`"${key}" must contain only strings`)
  }
  return value
}

function buildSimpleReport(data: Record<string, unknown>): DocumentModel {
  return {
    title: requireString(data, 'title'),
    author: requireString(data, 'author'),
    date: requireString(data, 'date'),
    summary: requireString(data, 'summary'),
    items: requireStringArray(data, 'items'),
  }
}

export const simpleReportTemplate: Template = {
  id: 'simple-report',
  name: 'Simple Report',
  description: 'A basic report with title, author, summary, and a list of items.',
  fields: [
    { key: 'title', label: 'Title', type: 'string', required: true },
    { key: 'author', label: 'Author', type: 'string', required: true },
    { key: 'date', label: 'Date', type: 'string', required: true },
    { key: 'summary', label: 'Summary', type: 'string', required: true },
    { key: 'items', label: 'Items', type: 'string[]', required: true },
  ],
  build: buildSimpleReport,
}
