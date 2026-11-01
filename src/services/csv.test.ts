import { describe, expect, it } from 'vitest'
import { csvToJsonObject, mergeCsvIntoTemplateData, parseCsv } from './csv'

describe('parseCsv', () => {
  it('parses headers and rows', () => {
    const result = parseCsv('name,value\nSprint goals,9/10')
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.headers).toEqual(['name', 'value'])
      expect(result.rows).toHaveLength(1)
    }
  })

  it('rejects empty input', () => {
    expect(parseCsv('').ok).toBe(false)
  })
})

describe('mergeCsvIntoTemplateData', () => {
  it('maps multi-row invoice CSV to lineItems', () => {
    const csv = parseCsv(
      'description,quantity,unitPrice\nWork,1,100\nSupport,2,50',
    )
    expect(csv.ok).toBe(true)
    if (!csv.ok) return
    const data = mergeCsvIntoTemplateData('invoice', {}, csv.headers, csv.rows)
    expect(Array.isArray(data.lineItems)).toBe(true)
    expect((data.lineItems as unknown[]).length).toBe(2)
  })

  it('flattens single row to object fields', () => {
    const csv = parseCsv('recipientName,courseTitle\nJordan Lee,Cloud')
    expect(csv.ok).toBe(true)
    if (!csv.ok) return
    const data = csvToJsonObject(csv.headers, csv.rows) as Record<string, unknown>
    expect(data.recipientName).toBe('Jordan Lee')
  })
})
