export function requireString(data: Record<string, unknown>, key: string): string {
  const value = data[key]
  if (typeof value !== 'string' || value.trim() === '') {
    throw new Error(`"${key}" must be a non-empty string`)
  }
  return value.trim()
}

export function optionalString(data: Record<string, unknown>, key: string): string {
  const value = data[key]
  if (value === undefined || value === null) return ''
  if (typeof value !== 'string') {
    throw new Error(`"${key}" must be a string`)
  }
  return value.trim()
}

export function requireStringArray(data: Record<string, unknown>, key: string): string[] {
  const value = data[key]
  if (!Array.isArray(value) || value.length === 0) {
    throw new Error(`"${key}" must be a non-empty array of strings`)
  }
  if (!value.every((item) => typeof item === 'string')) {
    throw new Error(`"${key}" must contain only strings`)
  }
  return value.map((s) => s.trim())
}

export function requireObjectArray(
  data: Record<string, unknown>,
  key: string,
): Record<string, unknown>[] {
  const value = data[key]
  if (!Array.isArray(value) || value.length === 0) {
    throw new Error(`"${key}" must be a non-empty array of objects`)
  }
  if (!value.every((item) => typeof item === 'object' && item !== null && !Array.isArray(item))) {
    throw new Error(`"${key}" must contain only objects`)
  }
  return value as Record<string, unknown>[]
}

export function formatMoney(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount)
}

export function slugFilename(base: string): string {
  return base
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}
