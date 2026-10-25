import type { DocumentModel } from '../domain/document'
import type { Template } from '../domain/template'
import sampleCertificate from '../data/sampleCertificate.json'
import { requireString, slugFilename } from './helpers'

function build(data: Record<string, unknown>): DocumentModel {
  const recipientName = requireString(data, 'recipientName')
  const courseTitle = requireString(data, 'courseTitle')
  const completionDate = requireString(data, 'completionDate')
  const issuerName = requireString(data, 'issuerName')
  const issuerTitle = requireString(data, 'issuerTitle')
  const citation = requireString(data, 'citation')

  return {
    theme: 'certificate',
    filename: `certificate-${slugFilename(recipientName)}.pdf`,
    blocks: [
      { type: 'paragraph', text: 'Certificate of Completion' },
      { type: 'heading', text: recipientName, level: 1 },
      { type: 'paragraph', text: 'has successfully completed' },
      { type: 'heading', text: courseTitle, level: 2 },
      { type: 'callout', text: citation },
      {
        type: 'meta',
        items: [
          { label: 'Date', value: completionDate },
          { label: 'Issued by', value: issuerName },
          { label: 'Title', value: issuerTitle },
        ],
      },
    ],
  }
}

export const certificateTemplate: Template = {
  id: 'certificate',
  name: 'Certificate of Completion',
  description: 'Formal certificate for course or program completion.',
  fields: [],
  sampleData: sampleCertificate as Record<string, unknown>,
  build,
}
