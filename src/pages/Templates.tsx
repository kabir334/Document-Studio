import { useCallback, useState } from 'react'
import { Link } from 'react-router-dom'
import { templates } from '../templates'
import { deleteCustomTemplate, listCustomTemplates } from '../services/customTemplates'

export function Templates() {
  const [customVersion, setCustomVersion] = useState(0)
  const customTemplates = useCallback(() => listCustomTemplates(), [customVersion])()

  const handleDelete = (id: string, name: string) => {
    if (!window.confirm(`Delete template "${name}"? This cannot be undone.`)) return
    deleteCustomTemplate(id)
    setCustomVersion((v) => v + 1)
  }

  return (
    <div className="page-shell flex flex-col gap-10">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm text-app-subtle">Design / Templates</p>
          <h2 className="mt-1 text-xl font-semibold text-app-heading md:text-2xl">Templates</h2>
          <p className="mt-1 text-app-muted">Choose a starting layout for a new document.</p>
        </div>
        <Link
          to="/templates/new"
          className="inline-flex rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500"
        >
          Create template
        </Link>
      </div>

      <section>
        <h3 className="text-sm font-semibold uppercase tracking-wide text-app-subtle">
          Built-in templates
        </h3>
        <div className="mt-4 grid w-full max-w-4xl gap-4 sm:grid-cols-2">
          {templates.map((t) => (
            <article
              key={t.id}
              className="flex flex-col rounded-xl border border-app bg-app-card p-6"
            >
              <div className="flex items-center gap-2">
                <h4 className="text-lg font-medium text-app-heading">{t.name}</h4>
                <span className="rounded-full bg-app-input px-2 py-0.5 text-[10px] uppercase text-app-subtle">
                  Built-in
                </span>
              </div>
              <p className="mt-2 flex-1 text-sm text-app-muted">{t.description}</p>
              <Link
                to={`/new?template=${t.id}`}
                className="mt-4 inline-flex w-fit rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500"
              >
                Use template
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section>
        <h3 className="text-sm font-semibold uppercase tracking-wide text-app-subtle">
          Your templates
        </h3>
        {customTemplates.length === 0 ? (
          <div className="mt-4 max-w-lg rounded-xl border border-dashed border-app bg-app-card p-8 text-center">
            <p className="text-sm text-app-muted">No custom templates yet.</p>
            <Link
              to="/templates/new"
              className="mt-4 inline-flex rounded-lg border border-app-dashed px-4 py-2 text-sm text-app hover:bg-app-hover"
            >
              Build your first template
            </Link>
          </div>
        ) : (
          <div className="mt-4 grid w-full max-w-4xl gap-4 sm:grid-cols-2">
            {customTemplates.map((t) => (
              <article
                key={t.id}
                className="flex flex-col rounded-xl border border-app bg-app-card p-6"
              >
                <div className="flex items-center gap-2">
                  <h4 className="text-lg font-medium text-app-heading">{t.name}</h4>
                  <span className="rounded-full bg-violet-950/80 px-2 py-0.5 text-[10px] uppercase text-violet-300">
                    Custom
                  </span>
                </div>
                <p className="mt-2 flex-1 text-sm text-app-muted">{t.description}</p>
                <span
                  className="mt-2 inline-block h-3 w-3 rounded-full border border-app"
                  style={{ backgroundColor: t.colors.primary }}
                  title="Primary color"
                />
                <div className="mt-4 flex flex-wrap gap-2">
                  <Link
                    to={`/new?template=${t.id}`}
                    className="inline-flex rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500"
                  >
                    Use template
                  </Link>
                  <Link
                    to={`/templates/${t.id}/edit`}
                    className="inline-flex rounded-lg border border-app-dashed px-4 py-2 text-sm text-app hover:bg-app-hover"
                  >
                    Edit
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleDelete(t.id, t.name)}
                    className="inline-flex rounded-lg border border-red-900/50 px-4 py-2 text-sm text-red-400 hover:bg-red-950/40"
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}