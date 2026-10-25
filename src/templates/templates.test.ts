import { describe, expect, it } from 'vitest'
import { buildDocument } from '../services/buildDocument'
import { renderHtml } from '../services/renderHtml'
import {
  certificateTemplate,
  invoiceTemplate,
  monthlyReportTemplate,
  proposalTemplate,
} from './index'

const allTemplates = [
  monthlyReportTemplate,
  invoiceTemplate,
  certificateTemplate,
  proposalTemplate,
]

describe('templates build with sample data', () => {
  for (const template of allTemplates) {
    it(`${template.id} builds successfully`, () => {
      const result = buildDocument(template, template.sampleData)
      expect(result.ok).toBe(true)
      if (result.ok) {
        expect(result.document.blocks.length).toBeGreaterThan(0)
        expect(result.document.filename.endsWith('.pdf')).toBe(true)
      }
    })
  }
})

describe('template validation', () => {
  it('monthly report requires title', () => {
    const result = buildDocument(monthlyReportTemplate, { ...monthlyReportTemplate.sampleData, title: '' })
    expect(result.ok).toBe(false)
  })

  it('invoice requires line items', () => {
    const result = buildDocument(invoiceTemplate, { ...invoiceTemplate.sampleData, lineItems: [] })
    expect(result.ok).toBe(false)
  })

  it('certificate requires recipient', () => {
    const result = buildDocument(certificateTemplate, { ...certificateTemplate.sampleData, recipientName: '' })
    expect(result.ok).toBe(false)
  })

  it('proposal requires project title', () => {
    const result = buildDocument(proposalTemplate, { ...proposalTemplate.sampleData, projectTitle: '' })
    expect(result.ok).toBe(false)
  })
})

describe('renderHtml', () => {
  it('uses readable colors and includes document title', () => {
    const built = buildDocument(monthlyReportTemplate, monthlyReportTemplate.sampleData)
    expect(built.ok).toBe(true)
    if (!built.ok) return

    const html = renderHtml(built.document)
    expect(html).toContain('Monthly Status Report')
    expect(html).toContain('#111111')
    expect(html).toContain('#ffffff')
  })
})
