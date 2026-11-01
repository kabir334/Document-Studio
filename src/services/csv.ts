export type CsvParseResult =
  | { ok: true; headers: string[]; rows: string[][] }
  | { ok: false; error: string }

function parseLine(line: string): string[] {
  const fields: string[] = []
  let current = ''
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const ch = line[i]
    if (inQuotes) {
      if (ch === '"') {
        if (line[i + 1] === '"') {
          current += '"'
          i++
        } else {
          inQuotes = false
        }
      } else {
        current += ch
      }
    } else if (ch === '"') {
      inQuotes = true
    } else if (ch === ',') {
      fields.push(current.trim())
      current = ''
    } else {
      current += ch
    }
  }
  fields.push(current.trim())
  return fields
}

export function parseCsv(text: string): CsvParseResult {
  const trimmed = text.trim()
  if (!trimmed) {
    return { ok: false, error: 'CSV is empty' }
  }

  const lines = trimmed.split(/\r?\n/).filter((line) => line.trim() !== '')
  if (lines.length === 0) {
    return { ok: false, error: 'CSV has no rows' }
  }

  const headers = parseLine(lines[0])
  if (headers.every((h) => h === '')) {
    return { ok: false, error: 'CSV header row is empty' }
  }

  const rows = lines.slice(1).map(parseLine)
  return { ok: true, headers, rows }
}

export function csvRowToObject(headers: string[], row: string[]): Record<string, string> {
  const obj: Record<string, string> = {}
  headers.forEach((header, i) => {
    obj[header] = row[i] ?? ''
  })
  return obj
}

function parseNumber(value: string): number | string {
  const n = Number(value)
  return Number.isFinite(n) ? n : value
}

export function csvToJsonObject(
  headers: string[],
  rows: string[][],
): Record<string, unknown> {
  if (rows.length === 0) {
    const obj: Record<string, unknown> = {}
    headers.forEach((h) => {
      obj[h] = ''
    })
    return obj
  }

  if (rows.length === 1) {
    const obj: Record<string, unknown> = {}
    headers.forEach((h, i) => {
      obj[h] = parseNumber(rows[0][i] ?? '')
    })
    return obj
  }

  return { rows: rows.map((row) => csvRowToObject(headers, row)) }
}

const TEMPLATE_ARRAY_KEYS: Record<string, { key: string; mapRow: (row: Record<string, string>) => Record<string, unknown> }> =
  {
    invoice: {
      key: 'lineItems',
      mapRow: (row) => ({
        description: row.description ?? row.Description ?? row.item ?? '',
        quantity: parseNumber(row.quantity ?? row.qty ?? row.Qty ?? '1'),
        unitPrice: parseNumber(row.unitPrice ?? row.price ?? row.rate ?? '0'),
      }),
    },
    'monthly-report': {
      key: 'metrics',
      mapRow: (row) => ({
        name: row.name ?? row.metric ?? row.Metric ?? '',
        value: row.value ?? row.Value ?? '',
      }),
    },
    proposal: {
      key: 'deliverables',
      mapRow: (row) => ({
        item: row.item ?? row.deliverable ?? row.Deliverable ?? '',
        owner: row.owner ?? row.lead ?? row.Lead ?? '',
      }),
    },
  }

export function mergeCsvIntoTemplateData(
  templateId: string,
  baseData: Record<string, unknown>,
  headers: string[],
  rows: string[][],
): Record<string, unknown> {
  if (rows.length <= 1) {
    const flat = csvToJsonObject(headers, rows) as Record<string, unknown>
    return { ...baseData, ...flat }
  }

  const mapping = TEMPLATE_ARRAY_KEYS[templateId]
  if (!mapping) {
    const items = rows.map((row) => {
      const obj = csvRowToObject(headers, row)
      return Object.values(obj).filter(Boolean).join(' — ')
    })
    return { ...baseData, items }
  }

  const arrayData = rows.map((row) => mapping.mapRow(csvRowToObject(headers, row)))
  return { ...baseData, [mapping.key]: arrayData }
}
