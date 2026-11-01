import { NavLink } from 'react-router-dom'

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
