import { useEffect, useId, useRef, useState, type ReactNode } from 'react'
import type { ThemePreference } from '../theme/types'
import { useTheme } from '../theme/useTheme'

const OPTIONS: {
  id: ThemePreference
  label: string
  icon: (props: { className?: string }) => ReactNode
}[] = [
  {
    id: 'light',
    label: 'Light',
    icon: ({ className }) => (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
        />
      </svg>
    ),
  },
  {
    id: 'dark',
    label: 'Dark',
    icon: ({ className }) => (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21.752 15.002A9.72 9.72 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"
        />
      </svg>
    ),
  },
  {
    id: 'system',
    label: 'System',
    icon: ({ className }) => (
      <svg
        className={className}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.75}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d="M12 17v4" />
        <path d="m14.305 7.53.923-.382" />
        <path d="m15.228 4.852-.923-.383" />
        <path d="m16.852 3.228-.383-.924" />
        <path d="m16.852 8.772-.383.923" />
        <path d="m19.148 3.228.383-.924" />
        <path d="m19.53 9.696-.382-.924" />
        <path d="m20.772 4.852.924-.383" />
        <path d="m20.772 7.148.924.383" />
        <path d="M22 13v2a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7" />
        <path d="M8 21h8" />
        <circle cx="18" cy="6" r="3" />
      </svg>
    ),
  },
]

function labelFor(preference: ThemePreference): string {
  return OPTIONS.find((o) => o.id === preference)?.label ?? 'Dark'
}

export function ThemeSelector({ compact = false }: { compact?: boolean }) {
  const { preference, setPreference } = useTheme()
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const listId = useId()
  const current = OPTIONS.find((o) => o.id === preference) ?? OPTIONS[1]
  const CurrentIcon = current.icon

  useEffect(() => {
    if (!open) return
    const onPointerDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  const pick = (id: ThemePreference) => {
    setPreference(id)
    setOpen(false)
  }

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-label={compact ? `Theme: ${labelFor(preference)}` : undefined}
        onClick={() => setOpen((v) => !v)}
        className={`flex items-center rounded-lg border border-app bg-app-input text-sm text-app transition-colors hover:bg-app-hover-muted ${
          compact
            ? 'h-9 w-9 shrink-0 justify-center p-0 md:h-auto md:w-auto md:min-w-[7.5rem] md:justify-between md:gap-2 md:px-2.5 md:py-1.5'
            : 'min-w-[7.5rem] justify-between gap-2 px-2.5 py-1.5'
        }`}
      >
        <span className={`flex items-center ${compact ? 'md:gap-1.5' : 'gap-1.5'}`}>
          <CurrentIcon className="h-4 w-4 shrink-0 text-app-muted" />
          <span className={compact ? 'hidden text-app-heading md:inline' : 'text-app-heading'}>
            {labelFor(preference)}
          </span>
        </span>
        <svg
          className={`hidden h-3.5 w-3.5 shrink-0 text-app-subtle transition-transform md:block ${open ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </button>

      {open && (
        <div
          id={listId}
          role="listbox"
          aria-label="Theme"
          className={`absolute z-50 overflow-hidden rounded-xl border border-app bg-app-card-strong p-1 shadow-lg shadow-black/20 ${
            compact
              ? 'bottom-0 left-full mb-0 ml-2 min-w-[9.5rem] md:bottom-full md:left-0 md:right-0 md:mb-1.5 md:ml-0 md:min-w-0'
              : 'bottom-full left-0 right-0 mb-1.5'
          }`}
        >
          {OPTIONS.map((themeOption) => {
            const active = preference === themeOption.id
            const ThemeOptionIcon = themeOption.icon
            return (
              <button
                key={themeOption.id}
                type="button"
                role="option"
                aria-selected={active}
                onClick={() => pick(themeOption.id)}
                className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm transition-colors ${
                  active
                    ? 'bg-app-nav-active text-app-heading'
                    : 'text-app-muted hover:bg-app-hover-muted hover:text-app'
                }`}
              >
                <ThemeOptionIcon className="h-4 w-4 shrink-0" />
                <span className="flex-1">{themeOption.label}</span>
                {active && (
                  <svg className="h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                )}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}