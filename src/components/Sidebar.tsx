import { NavLink } from 'react-router-dom'
import { ThemeSelector } from './ThemeSelector'

interface NavItem {
  label: string
  path: string
}

interface NavGroup {
  title: string
  items: NavItem[]
}

const navGroups: NavGroup[] = [
  {
    title: 'Workspace',
    items: [
      { label: 'Overview', path: '/' },
      { label: 'New document', path: '/new' },
      { label: 'My documents', path: '/documents' },
    ],
  },
  {
    title: 'Design',
    items: [
      { label: 'Templates', path: '/templates' },
      { label: 'Components', path: '/components' },
      { label: 'Data sources', path: '/data-sources' },
    ],
  },
  {
    title: 'Settings',
    items: [{ label: 'Preferences', path: '/preferences' }],
  },
]

export function Sidebar() {
  return (
    <aside className="flex h-full w-56 shrink-0 flex-col border-r border-app bg-app-sidebar px-4 py-6">
      <div className="mb-8 px-2">
        <h1 className="text-lg font-semibold text-app-heading">Document Studio</h1>
      </div>

      <nav className="flex flex-1 flex-col gap-6">
        {navGroups.map((group) => (
          <div key={group.title}>
            <p className="mb-2 px-2 text-xs font-medium uppercase tracking-wider text-app-subtle">
              {group.title}
            </p>
            <ul className="flex flex-col gap-0.5">
              {group.items.map((item) => (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `block rounded-lg px-3 py-2 text-sm transition-colors ${
                        isActive
                          ? 'bg-app-nav-active text-app-heading'
                          : 'text-app-muted hover:bg-app-hover-muted hover:text-app'
                      }`
                    }
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      <div className="mt-6 border-t border-app px-2 pt-4">
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm text-app-muted">Theme</span>
          <ThemeSelector />
        </div>
      </div>
    </aside>
  )
}
