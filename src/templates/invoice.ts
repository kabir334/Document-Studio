import type { DocumentModel } from '../domain/document'
import type { Template } from '../domain/template'
import sampleInvoice from '../data/sampleInvoice.json'
import {
  requireString,
  requireObjectArray,
  formatMoney,
  slugFilename,
} from './helpers'

function build(data: Record<string, unknown>): DocumentModel {
  const issuerName = requireString(data, 'issuerName')
  const issuerAddress = requireString(data, 'issuerAddress')
  const issuerEmail = requireString(data, 'issuerEmail')
  const clientName = requireString(data, 'clientName')
  const clientAddress = requireString(data, 'clientAddress')
  const invoiceNumber = requireString(data, 'invoiceNumber')
  const invoiceDate = requireString(data, 'invoiceDate')
  const dueDate = requireString(data, 'dueDate')
  const currency = requireString(data, 'currency')
  const paymentNotes = requireString(data, 'paymentNotes')
  const taxRate = data.taxRate
  if (typeof taxRate !== 'number' || taxRate < 0) {
    throw new Error('"taxRate" must be a non-negative number')
  }
  const lineItems = requireObjectArray(data, 'lineItems')

  let subtotal = 0
  const rows: string[][] = []
  for (const item of lineItems) {
    const description = requireString(item, 'description')
    const qty = item.quantity
    const unitPrice = item.unitPrice
    if (typeof qty !== 'number' || qty <= 0) {
      throw new Error('Each line item needs a positive "quantity"')
    }
    if (typeof unitPrice !== 'number' || unitPrice < 0) {
      throw new Error('Each line item needs a non-negative "unitPrice"')
    }
    const lineTotal = qty * unitPrice
    subtotal += lineTotal
    rows.push([
      description,
      String(qty),
      formatMoney(unitPrice, currency),
      formatMoney(lineTotal, currency),
    ])
  }

  const tax = subtotal * (taxRate / 100)
  const total = subtotal + tax

  return {
    theme: 'invoice',
    filename: `invoice-${slugFilename(invoiceNumber)}.pdf`,
    blocks: [
      { type: 'heading', text: issuerName, level: 1 },
      { type: 'paragraph', text: `${issuerAddress} · ${issuerEmail}` },
      {
        type: 'meta',
        items: [
          { label: 'Bill to', value: clientName },
          { label: 'Address', value: clientAddress },
          { label: 'Invoice #', value: invoiceNumber },
          { label: 'Invoice date', value: invoiceDate },
          { label: 'Due date', value: dueDate },
        ],
      },
      { type: 'heading', text: 'Line items', level: 2 },
      {
        type: 'table',
        columns: ['Description', 'Qty', 'Unit price', 'Amount'],
        rows,
      },
      {
        type: 'paragraph',
        text: `Subtotal: ${formatMoney(subtotal, currency)} · Tax (${taxRate}%): ${formatMoney(tax, currency)}`,
      },
      { type: 'total', label: 'Amount due', value: formatMoney(total, currency) },
      { type: 'heading', text: 'Payment instructions', level: 2 },
      { type: 'paragraph', text: paymentNotes },
    ],
  }
}

export const invoiceTemplate: Template = {
  id: 'invoice',
  name: 'Professional Invoice',
  description: 'Invoice with line items, tax, totals, and payment notes.',
  fields: [],
  sampleData: sampleInvoice as Record<string, unknown>,
  build,
}
