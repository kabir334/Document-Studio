import type { DocumentModel } from '../domain/document'
import type { Template } from '../domain/template'
import sampleProposal from '../data/sampleProposal.json'
import {
  requireString,
  requireStringArray,
  requireObjectArray,
  slugFilename,
} from './helpers'

function build(data: Record<string, unknown>): DocumentModel {
  const projectTitle = requireString(data, 'projectTitle')
  const clientName = requireString(data, 'clientName')
  const preparedBy = requireString(data, 'preparedBy')
  const proposalDate = requireString(data, 'proposalDate')
  const executiveSummary = requireString(data, 'executiveSummary')
  const problem = requireString(data, 'problem')
  const scope = requireString(data, 'scope')
  const deliverables = requireObjectArray(data, 'deliverables')
  const timeline = requireStringArray(data, 'timeline')
  const investment = requireString(data, 'investment')

  const deliverableRows = deliverables.map((d) => {
    const item = requireString(d, 'item')
    const owner = requireString(d, 'owner')
    return [item, owner]
  })

  return {
    theme: 'proposal',
    filename: `proposal-${slugFilename(projectTitle)}.pdf`,
    blocks: [
      { type: 'heading', text: projectTitle, level: 1 },
      {
        type: 'paragraph',
        text: `Prepared for ${clientName} · ${preparedBy} · ${proposalDate}`,
      },
      { type: 'heading', text: 'Executive summary', level: 2 },
      { type: 'callout', text: executiveSummary },
      { type: 'heading', text: 'Problem', level: 2 },
      { type: 'paragraph', text: problem },
      { type: 'heading', text: 'Proposed scope', level: 2 },
      { type: 'paragraph', text: scope },
      { type: 'heading', text: 'Deliverables', level: 2 },
      { type: 'table', columns: ['Deliverable', 'Lead'], rows: deliverableRows },
      { type: 'heading', text: 'Timeline', level: 2 },
      { type: 'list', items: timeline, ordered: true },
      { type: 'heading', text: 'Investment', level: 2 },
      { type: 'total', label: 'Estimated investment', value: investment },
    ],
  }
}

export const proposalTemplate: Template = {
  id: 'proposal',
  name: 'Project Proposal',
  description: 'Client proposal with scope, deliverables, timeline, and investment.',
  fields: [],
  sampleData: sampleProposal as Record<string, unknown>,
  build,
}
