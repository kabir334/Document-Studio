import type { CertificateAccent } from '../domain/document'

export interface AppPreferences {
  defaultTemplateId: string
  defaultCertificateAccent: CertificateAccent
  studioName: string
}

const STORAGE_KEY = 'document-studio-preferences'

export const DEFAULT_PREFERENCES: AppPreferences = {
  defaultTemplateId: 'monthly-report',
  defaultCertificateAccent: 'navy',
  studioName: 'Document Studio',
}

export function loadPreferences(): AppPreferences {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_PREFERENCES
    const parsed = JSON.parse(raw) as Partial<AppPreferences>
    return { ...DEFAULT_PREFERENCES, ...parsed }
  } catch {
    return DEFAULT_PREFERENCES
  }
}

export function savePreferences(prefs: AppPreferences): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs))
}
