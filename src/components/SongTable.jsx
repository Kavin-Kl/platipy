import React from 'react'

function SongTable({ songs, currentSongId, onSongSelect }) {
  return (
    <section className="mb-24">
      <h2 className="mb-4 text-xl font-semibold">Popular songs</h2>
      <div className="overflow-hidden rounded-md bg-zinc-900/60">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-zinc-800 text-xs uppercase tracking-wide text-zinc-400">
            <tr>
              <th className="w-12 px-4 py-2">#</th>
              <th className="px-4 py-2">Title</th>
              <th className="px-4 py-2">Album</th>
              <th className="px-4 py-2 text-right">Time</th>
            </tr>
          </thead>
          <tbody>
            {songs.map((song, index) => {
              const isActive = song.id === currentSongId
              return (
                <tr
                  key={song.id}
                  onClick={() => onSongSelect && onSongSelect(song)}
                  className={`border-b border-zinc-900/60 text-sm ${
                    isActive
                      ? 'bg-zinc-800 text-emerald-300'
                      : 'text-zinc-200 hover:bg-zinc-800/80'
                  } cursor-pointer`}
                >
                <td className="px-4 py-2 text-zinc-400">
                  {isActive ? '▶' : index + 1}
                </td>
                <td className="px-4 py-2">
                  <div className="flex flex-col">
                    <span className="text-sm">{song.title}</span>
                    <span className="text-xs text-zinc-400">{song.artist}</span>
                  </div>
                </td>
                <td className="px-4 py-2 text-xs text-zinc-400">
                  {song.album}
                </td>
                <td className="px-4 py-2 text-right text-xs text-zinc-400">
                  {song.duration}
                </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export default SongTable

