import React from 'react'

function PlaylistGrid({ title, items }) {
  return (
    <section className="mb-8">
      <h2 className="mb-4 text-xl font-semibold">{title}</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {items.map((item) => (
          <button
            key={item.id}
            className="group flex flex-col rounded-md bg-zinc-900/60 p-3 text-left transition hover:bg-zinc-800"
          >
            <div
              className={`mb-3 aspect-square w-full rounded-md bg-gradient-to-br ${item.color}`}
            />
            <div className="mb-1 text-sm font-semibold text-zinc-50">
              {item.title}
            </div>
            <div className="line-clamp-2 text-xs text-zinc-400">
              {item.description}
            </div>
          </button>
        ))}
      </div>
    </section>
  )
}

export default PlaylistGrid

