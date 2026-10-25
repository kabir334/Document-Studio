import { NavLink } from 'react-router-dom'

interface NavItem {
  label: string
  path: string
  placeholder?: boolean
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
      { label: 'My documents', path: '/documents', placeholder: true },
    ],
  },
  {
    title: 'Design',
    items: [
      { label: 'Templates', path: '/templates', placeholder: true },
      { label: 'Components', path: '/components', placeholder: true },
      { label: 'Data sources', path: '/data-sources', placeholder: true },
    ],
  },
  {
    title: 'Settings',
    items: [
      { label: 'Preferences', path: '/preferences', placeholder: true },
    ],
  },
]

export function Sidebar() {
  return (
    <aside className="flex h-full w-56 shrink-0 flex-col border-r border-slate-800 bg-[#13151d] px-4 py-6">
      <div className="mb-8 px-2">
        <h1 className="text-lg font-semibold text-white">Document Studio</h1>
      </div>

      <nav className="flex flex-1 flex-col gap-6">
        {navGroups.map((group) => (
          <div key={group.title}>
            <p className="mb-2 px-2 text-xs font-medium uppercase tracking-wider text-slate-500">
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
                          ? 'bg-slate-800 text-white'
                          : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                      }`
                    }
                  >
                    {item.label}
                    {item.placeholder && (
                      <span className="ml-1.5 text-xs text-slate-600">·</span>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  )
}
