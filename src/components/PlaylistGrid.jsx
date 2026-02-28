import React, { useState } from 'react'

function PlaylistGrid({ title, items, likedSongIds = [], onToggleLike, onAddToPlaylist, playlists = [] }) {
  const [showPlaylistMenu, setShowPlaylistMenu] = useState(null)

  const handleAddToPlaylist = (playlistId, itemId) => {
    if (onAddToPlaylist) {
      onAddToPlaylist(playlistId, itemId)
    }
    setShowPlaylistMenu(null)
  }

  return (
    <section className="mb-8">
      <h2 className="mb-4 text-xl font-semibold">{title}</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {items.map((item) => {
          const isLiked = likedSongIds.includes(item.id)

          return (
            <div
              key={item.id}
              className="group relative flex flex-col rounded-md bg-zinc-900/60 p-3 text-left transition hover:bg-zinc-800"
            >
              <div className="relative">
                {item.thumbnail ? (
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="mb-3 aspect-square w-full rounded-md object-cover shadow-lg"
                  />
                ) : (
                  <div
                    className={`mb-3 aspect-square w-full rounded-md bg-gradient-to-br ${item.color}`}
                  />
                )}

                {/* Action buttons - show on hover */}
                <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  {/* Like button */}
                  {onToggleLike && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        onToggleLike(item.id)
                      }}
                      className="p-2 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-sm transition"
                      title="Like"
                    >
                      <svg
                        className={`h-6 w-6 ${
                          isLiked
                            ? 'fill-emerald-500 text-emerald-500'
                            : 'fill-none text-white'
                        }`}
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                      </svg>
                    </button>
                  )}

                  {/* Add to playlist button */}
                  {onAddToPlaylist && (
                    <div className="relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          if (playlists.length === 0) {
                            alert('Create a playlist first by clicking "Create Playlist" in the sidebar!')
                            return
                          }
                          setShowPlaylistMenu(showPlaylistMenu === item.id ? null : item.id)
                        }}
                        className="p-2 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-sm transition"
                        title={playlists.length === 0 ? "Create a playlist first" : "Add to playlist"}
                      >
                        <svg
                          className="h-6 w-6 text-white"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                        </svg>
                      </button>

                      {/* Playlist dropdown */}
                      {showPlaylistMenu === item.id && playlists.length > 0 && (
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
                                  handleAddToPlaylist(playlist.id, item.id)
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
                  )}
                </div>
              </div>

              <div className="mb-1 text-sm font-semibold text-zinc-50">
                {item.title}
              </div>
              <div className="line-clamp-2 text-xs text-zinc-400">
                {item.description}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

export default PlaylistGrid

