import type { ThemePreference } from './types'

export const THEME_STORAGE_KEY = 'document-studio-theme'

export const DEFAULT_THEME_PREFERENCE: ThemePreference = 'dark'

export function loadThemePreference(): ThemePreference {
  try {
    const raw = localStorage.getItem(THEME_STORAGE_KEY)
    if (raw === 'light' || raw === 'dark' || raw === 'system') return raw
  } catch {
    /* ignore */
  }
  return DEFAULT_THEME_PREFERENCE
}

export function saveThemePreference(preference: ThemePreference): void {
  localStorage.setItem(THEME_STORAGE_KEY, preference)
}