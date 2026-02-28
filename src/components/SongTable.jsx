import React, { useState } from 'react'

function SongTable({ songs, currentSongId, onSongSelect, likedSongIds = [], onToggleLike, onAddToPlaylist, playlists = [] }) {
  const [showPlaylistMenu, setShowPlaylistMenu] = useState(null)

  const handleAddToPlaylist = (playlistId) => {
    if (showPlaylistMenu && onAddToPlaylist) {
      onAddToPlaylist(playlistId, showPlaylistMenu)
    }
    setShowPlaylistMenu(null)
  }

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
              <th className="w-16 px-4 py-2 text-center"></th>
              <th className="w-16 px-4 py-2 text-center"></th>
              <th className="w-24 px-4 py-2 text-right">Time</th>
            </tr>
          </thead>
          <tbody>
            {songs.map((song, index) => {
              const isActive = song.id === currentSongId
              const isLiked = likedSongIds.includes(song.id)
              return (
                <tr
                  key={song.id}
                  className={`border-b border-zinc-900/60 text-sm ${
                    isActive
                      ? 'bg-zinc-800 text-emerald-300'
                      : 'text-zinc-200 hover:bg-zinc-800/80'
                  }`}
                >
                <td
                  className="px-4 py-2 text-zinc-400 cursor-pointer"
                  onClick={() => onSongSelect && onSongSelect(song)}
                >
                  {isActive ? '▶' : index + 1}
                </td>
                <td
                  className="px-4 py-3 cursor-pointer"
                  onClick={() => onSongSelect && onSongSelect(song)}
                >
                  <div className="flex items-center gap-3">
                    {song.thumbnail && (
                      <img
                        src={song.thumbnail}
                        alt={song.title}
                        className="h-10 w-10 rounded object-cover"
                      />
                    )}
                    <div className="flex flex-col">
                      <span className="text-sm">{song.title}</span>
                      <span className="text-xs text-zinc-400">{song.artist}</span>
                    </div>
                  </div>
                </td>
                <td
                  className="px-4 py-2 text-xs text-zinc-400 cursor-pointer"
                  onClick={() => onSongSelect && onSongSelect(song)}
                >
                  {song.album}
                </td>
                <td className="px-4 py-2 text-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onToggleLike && onToggleLike(song.id)
                    }}
                    className="group p-3 hover:scale-110 transition rounded-lg hover:bg-zinc-700/50"
                    title="Like"
                  >
                    <svg
                      className={`h-8 w-8 ${
                        isLiked
                          ? 'fill-emerald-500 text-emerald-500'
                          : 'fill-none text-zinc-300 group-hover:text-white'
                      }`}
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                  </button>
                </td>
                <td className="px-4 py-2 text-center relative">
                  <div className="relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        if (playlists.length === 0) {
                          alert('Create a playlist first by clicking "Create Playlist" in the sidebar!')
                          return
                        }
                        setShowPlaylistMenu(showPlaylistMenu === song.id ? null : song.id)
                      }}
                      className="group p-3 hover:scale-110 transition rounded-lg hover:bg-zinc-700/50"
                      title={playlists.length === 0 ? "Create a playlist first" : "Add to playlist"}
                    >
                      <svg
                        className="h-8 w-8 text-zinc-300 group-hover:text-white"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                      </svg>
                    </button>

                    {showPlaylistMenu === song.id && playlists.length > 0 && (
                      <div className="absolute right-0 top-full mt-1 z-50 w-48 rounded-md bg-zinc-800 shadow-lg border border-zinc-700">
                        <div className="py-1">
                          <div className="px-3 py-2 text-xs font-semibold text-zinc-400 border-b border-zinc-700">
                            Add to playlist
                          </div>
                          {playlists.map((playlist) => (
                            <button
                              key={playlist.id}
                              onClick={(e) => {
                                e.stopPropagation()
                                handleAddToPlaylist(playlist.id)
                              }}
                              className="w-full px-3 py-2 text-left text-sm text-zinc-200 hover:bg-zinc-700"
                            >
                              {playlist.name}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </td>
                <td
                  className="px-4 py-2 text-right text-xs text-zinc-400 cursor-pointer"
                  onClick={() => onSongSelect && onSongSelect(song)}
                >
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

