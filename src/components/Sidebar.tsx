import type { ComponentType } from 'react'
import { NavLink } from 'react-router-dom'
import {
  NavIconComponents,
  NavIconDataSources,
  NavIconDocuments,
  NavIconLogo,
  NavIconNewDocument,
  NavIconOverview,
  NavIconPreferences,
  NavIconTemplates,
} from './navIcons'
import { ThemeSelector } from './ThemeSelector'

interface NavItem {
  label: string
  path: string
  icon: ComponentType<{ className?: string }>
}

interface NavGroup {
  title: string
  items: NavItem[]
}

const navGroups: NavGroup[] = [
  {
    title: 'Workspace',
    items: [
      { label: 'Overview', path: '/', icon: NavIconOverview },
      { label: 'New document', path: '/new', icon: NavIconNewDocument },
      { label: 'My documents', path: '/documents', icon: NavIconDocuments },
    ],
  },
  {
    title: 'Design',
    items: [
      { label: 'Templates', path: '/templates', icon: NavIconTemplates },
      { label: 'Components', path: '/components', icon: NavIconComponents },
      { label: 'Data sources', path: '/data-sources', icon: NavIconDataSources },
    ],
  },
  {
    title: 'Settings',
    items: [{ label: 'Preferences', path: '/preferences', icon: NavIconPreferences }],
  },
]

export function Sidebar() {
  return (
    <aside className="flex h-full w-[3.75rem] shrink-0 flex-col border-r border-app bg-app-sidebar px-2 py-4 md:w-56 md:px-4 md:py-6">
      <div className="mb-6 flex justify-center px-0 md:mb-8 md:justify-start md:px-2">
        <NavIconLogo className="h-7 w-7 text-app-heading md:hidden" aria-hidden />
        <h1 className="hidden text-lg font-semibold text-app-heading md:block">Document Studio</h1>
      </div>

      <nav className="flex flex-1 flex-col gap-4 overflow-y-auto md:gap-6">
        {navGroups.map((group, groupIndex) => (
          <div key={group.title}>
            {groupIndex > 0 && (
              <div className="mb-2 border-t border-app md:hidden" aria-hidden />
            )}
            <p className="mb-2 hidden px-2 text-xs font-medium uppercase tracking-wider text-app-subtle md:block">
              {group.title}
            </p>
            <ul className="flex flex-col gap-0.5">
              {group.items.map((item) => {
                const Icon = item.icon
                return (
                  <li key={item.path}>
                    <NavLink
                      to={item.path}
                      title={item.label}
                      aria-label={item.label}
                      className={({ isActive }) =>
                        `flex items-center gap-3 rounded-lg transition-colors md:px-3 md:py-2 ${
                          isActive
                            ? 'bg-app-nav-active text-app-heading'
                            : 'text-app-muted hover:bg-app-hover-muted hover:text-app'
                        } justify-center p-2.5 md:justify-start`
                      }
                    >
                      <Icon className="h-5 w-5 shrink-0" />
                      <span className="hidden text-sm md:inline">{item.label}</span>
                    </NavLink>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="mt-4 border-t border-app pt-3 md:mt-6 md:px-2 md:pt-4">
        <div className="flex flex-col items-center gap-2 md:flex-row md:items-center md:justify-between md:gap-3">
          <span className="hidden text-sm text-app-muted md:inline">Theme</span>
          <ThemeSelector compact />
        </div>
      </div>
    </aside>
  )
}