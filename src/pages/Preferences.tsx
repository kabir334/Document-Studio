import { useEffect, useState } from 'react'
import { templates } from '../templates'
import type { CertificateAccent } from '../domain/document'
import {
  DEFAULT_PREFERENCES,
  loadPreferences,
  savePreferences,
  type AppPreferences,
} from '../services/preferences'

const ACCENTS: { id: CertificateAccent; label: string; className: string }[] = [
  { id: 'navy', label: 'Navy', className: 'bg-[#1e3a5f]' },
  { id: 'forest', label: 'Forest', className: 'bg-[#14532d]' },
  { id: 'burgundy', label: 'Burgundy', className: 'bg-[#7f1d1d]' },
  { id: 'gold', label: 'Gold', className: 'bg-[#92400e]' },
]

export function Preferences() {
  const [prefs, setPrefs] = useState<AppPreferences>(DEFAULT_PREFERENCES)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    setPrefs(loadPreferences())
  }, [])

  const handleSave = () => {
    savePreferences(prefs)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="page-shell">
      <div>
        <p className="text-sm text-app-subtle">Settings / Preferences</p>
        <h2 className="mt-1 text-xl font-semibold text-app-heading md:text-2xl">Preferences</h2>
        <p className="mt-1 text-app-muted">Defaults and branding for new documents.</p>
      </div>

      <div className="flex w-full max-w-lg flex-col gap-5 rounded-xl border border-app bg-app-card p-4 md:p-6">
        <label className="flex flex-col gap-2 text-sm text-app">
          Default template
          <select
            className="rounded-lg border border-app bg-app-input px-3 py-2 text-app"
            value={prefs.defaultTemplateId}
            onChange={(e) => setPrefs({ ...prefs, defaultTemplateId: e.target.value })}
          >
            {templates.map((t) => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
        </label>

        <div>
          <p className="text-sm text-app">Default certificate color</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {ACCENTS.map((accent) => (
              <button
                key={accent.id}
                type="button"
                onClick={() => setPrefs({ ...prefs, defaultCertificateAccent: accent.id })}
                className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm ${
                  prefs.defaultCertificateAccent === accent.id
                    ? 'border-blue-500 text-app-heading'
                    : 'border-app text-app-muted'
                }`}
              >
                <span className={`h-4 w-4 rounded-full ${accent.className}`} />
                {accent.label}
              </button>
            ))}
          </div>
        </div>

        <label className="flex flex-col gap-2 text-sm text-app">
          Footer / studio name
          <input
            className="rounded-lg border border-app bg-app-input px-3 py-2 text-app"
            value={prefs.studioName}
            onChange={(e) => setPrefs({ ...prefs, studioName: e.target.value })}
          />
        </label>

        <button
          type="button"
          onClick={handleSave}
          className="self-start rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500"
        >
          Save preferences
        </button>
        {saved && <p className="text-sm text-emerald-400">Saved.</p>}
      </div>
    </div>
  )
}