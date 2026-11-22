import { useLocation } from 'react-router-dom'

const labels: Record<string, string> = {
  '/documents': 'My documents',
  '/templates': 'Templates',
  '/components': 'Components',
  '/data-sources': 'Data sources',
  '/preferences': 'Preferences',
}

export function ComingSoon() {
  const { pathname } = useLocation()
  const label = labels[pathname] ?? 'This feature'

  return (
    <div className="flex h-full items-center justify-center p-8">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-app-heading">{label}</h2>
        <p className="mt-2 text-sm text-app-muted">Coming soon — this area is planned for a future phase.</p>
      </div>
    </div>
  )
}