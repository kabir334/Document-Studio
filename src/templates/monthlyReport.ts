import type { DocumentModel } from '../domain/document'
import type { Template } from '../domain/template'
import sampleReport from '../data/sampleReport.json'
import {
  requireString,
  requireStringArray,
  requireObjectArray,
  slugFilename,
} from './helpers'

function build(data: Record<string, unknown>): DocumentModel {
  const title = requireString(data, 'title')
  const period = requireString(data, 'period')
  const author = requireString(data, 'author')
  const team = requireString(data, 'team')
  const summary = requireString(data, 'summary')
  const highlights = requireStringArray(data, 'highlights')
  const metrics = requireObjectArray(data, 'metrics')
  const nextSteps = requireStringArray(data, 'nextSteps')

  const metricRows = metrics.map((m) => {
    const name = requireString(m, 'name')
    const value = requireString(m, 'value')
    return [name, value]
  })

  return {
    theme: 'report',
    filename: `${slugFilename(title)}.pdf`,
    blocks: [
      { type: 'heading', text: title, level: 1 },
      {
        type: 'meta',
        items: [
          { label: 'Period', value: period },
          { label: 'Author', value: author },
          { label: 'Team', value: team },
        ],
      },
      { type: 'heading', text: 'Executive summary', level: 2 },
      { type: 'callout', text: summary },
      { type: 'heading', text: 'Key highlights', level: 2 },
      { type: 'list', items: highlights },
      { type: 'heading', text: 'Metrics', level: 2 },
      { type: 'table', columns: ['Metric', 'Value'], rows: metricRows },
      { type: 'heading', text: 'Next steps', level: 2 },
      { type: 'list', items: nextSteps, ordered: true },
    ],
  }
}

export const monthlyReportTemplate: Template = {
  id: 'monthly-report',
  name: 'Monthly Status Report',
  description: 'Status report with summary, highlights, metrics, and next steps.',
  fields: [],
  sampleData: sampleReport as Record<string, unknown>,
  build,
}
