import { Link } from 'react-router-dom'
import { templates } from '../templates'

export function Templates() {
  return (
    <div className="flex flex-col gap-8 p-8">
      <div>
        <p className="text-sm text-app-subtle">Design / Templates</p>
        <h2 className="mt-1 text-2xl font-semibold text-app-heading">Templates</h2>
        <p className="mt-1 text-app-muted">Choose a starting layout for a new document.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 max-w-4xl">
        {templates.map((t) => (
          <article
            key={t.id}
            className="flex flex-col rounded-xl border border-app bg-app-card p-6"
          >
            <h3 className="text-lg font-medium text-app-heading">{t.name}</h3>
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
    </div>
  )
}