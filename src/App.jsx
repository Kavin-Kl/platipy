import React, { useEffect, useState } from 'react'
import './tailwind.css'
import Sidebar from './components/Sidebar'
import TopBar from './components/TopBar'
import PlaylistGrid from './components/PlaylistGrid'
import SongTable from './components/SongTable'
import PlayerBar from './components/PlayerBar'
import { madeForYou, recentPlaylists, songs } from './sampleData'
import Genius from './services/Genius'

function App() {
  const [view, setView] = useState('home') // 'home' | 'search' | 'library'
  const [currentSong, setCurrentSong] = useState(songs[0] || null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentSeconds, setCurrentSeconds] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [searchError, setSearchError] = useState('')
  const [currentVideoSrc, setCurrentVideoSrc] = useState(null)
  const [playlists, setPlaylists] = useState(() =>
    recentPlaylists.map((p) => ({
      id: p.id,
      name: p.title,
      description: p.description,
      color: p.color,
      songIds: songs.map((s) => s.id),
    })),
  )
  const [activePlaylistId, setActivePlaylistId] = useState(
    recentPlaylists[0]?.id ?? null,
  )

  // derive duration seconds
  const parseDurationToSeconds = (duration) => {
    if (!duration || typeof duration !== 'string') return 0
    const [m, s] = duration.split(':').map(Number)
    if (Number.isNaN(m) || Number.isNaN(s)) return 0
    return m * 60 + s
  }

  useEffect(() => {
    if (!isPlaying || !currentSong) return
    const total = parseDurationToSeconds(currentSong.duration)
    const interval = setInterval(() => {
      setCurrentSeconds((prev) => {
        if (prev + 1 >= total) {
          return total
        }
        return prev + 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [isPlaying, currentSong])

  useEffect(() => {
    // reset progress when song changes
    setCurrentSeconds(0)
  }, [currentSong])

  const handleSongSelect = (song) => {
    setCurrentSong(song)
    setIsPlaying(true)
  }

  const handlePlayPause = () => {
    if (!currentSong) return
    setIsPlaying((prev) => !prev)
  }

  const handleNext = () => {
    if (!currentSong) return
    const idx = songs.findIndex((s) => s.id === currentSong.id)
    const next = songs[(idx + 1) % songs.length]
    setCurrentSong(next)
    setIsPlaying(true)
  }

  const handlePrev = () => {
    if (!currentSong) return
    const idx = songs.findIndex((s) => s.id === currentSong.id)
    const prev = songs[(idx - 1 + songs.length) % songs.length]
    setCurrentSong(prev)
    setIsPlaying(true)
  }

  const formatSeconds = (value) => {
    const m = Math.floor(value / 60)
    const s = value % 60
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  const progressLabel =
    currentSong && currentSeconds ? formatSeconds(currentSeconds) : '0:00'

  const handleSearchSubmit = async (query) => {
    if (!query) return
    try {
      setSearchError('')
      const results = await Genius.getSongs(query)
      setSearchResults(results)
      if (!results.length) {
        setSearchError('No results found. Try a different search.')
      }
    } catch (err) {
      console.error(err)
      setSearchError(
        'Search failed. Check your Genius token or try again in a moment.',
      )
      setSearchResults([])
    }
  }

  const playFromYouTube = (query, fallbackSong) => {
    const encoded = encodeURIComponent(query)
    const src = `https://www.youtube.com/embed?search_query=${encoded}&autoplay=1`
    setCurrentVideoSrc(src)
    if (fallbackSong) {
      setCurrentSong(fallbackSong)
    }
    setIsPlaying(true)
  }

  const handleSearchResultClick = (song) => {
    const query = `${song.title} ${song.primaryArtist ?? ''}`
    playFromYouTube(query)
    setCurrentSong({
      id: song.id,
      title: song.title,
      artist: song.primaryArtist,
      album: 'Genius',
      duration: '--:--',
    })
  }

  const handleCreatePlaylist = () => {
    const nextIndex = playlists.length + 1
    const newPlaylist = {
      id: Date.now(),
      name: `My Playlist #${nextIndex}`,
      description: 'New playlist',
      color: 'bg-emerald-500',
      songIds: [],
    }
    setPlaylists((prev) => [...prev, newPlaylist])
    setActivePlaylistId(newPlaylist.id)
    setView('library')
  }

  const handleOpenLikedSongs = () => {
    setActivePlaylistId('liked')
    setView('library')
  }

  const activePlaylist =
    activePlaylistId === 'liked'
      ? {
          id: 'liked',
          name: 'Liked Songs',
          description: 'All songs you love',
          color: 'bg-emerald-500',
          songIds: songs.map((s) => s.id),
        }
      : playlists.find((p) => p.id === activePlaylistId) ?? playlists[0]

  const activePlaylistSongs = activePlaylist
    ? songs.filter((s) => activePlaylist.songIds.includes(s.id))
    : songs

  return (
    <div className="flex min-h-screen bg-zinc-950 text-white">
      <Sidebar
        activeView={view}
        onChangeView={setView}
        onCreatePlaylist={handleCreatePlaylist}
        onOpenLiked={handleOpenLikedSongs}
      />

      <div className="relative flex min-h-screen flex-1 flex-col pb-20">
        <main className="flex-1 overflow-y-auto bg-gradient-to-b from-zinc-900/80 via-zinc-900 to-black p-6">
          <TopBar
            view={view}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onSearchSubmit={handleSearchSubmit}
          />

          {view === 'home' && (
            <>
              <PlaylistGrid title="Made for you" items={madeForYou} />
              <PlaylistGrid title="Recently played" items={recentPlaylists} />
              <SongTable
                songs={songs}
                currentSongId={currentSong?.id}
                onSongSelect={(song) =>
                  playFromYouTube(`${song.title} ${song.artist}`, song)
                }
              />
            </>
          )}

          {view === 'library' && (
            <section className="mb-24 grid gap-6 lg:grid-cols-[260px,minmax(0,1fr)]">
              <div>
                <h2 className="mb-3 text-sm font-semibold text-zinc-400">
                  Your playlists
                </h2>
                <ul className="space-y-1 text-sm">
                  {playlists.map((p) => (
                    <li key={p.id}>
                      <button
                        onClick={() => setActivePlaylistId(p.id)}
                        className={`flex w-full items-center justify-between rounded-md px-2 py-1.5 text-left hover:bg-zinc-800 ${
                          activePlaylist?.id === p.id
                            ? 'bg-zinc-800 text-white'
                            : 'text-zinc-300'
                        }`}
                      >
                        <span className="truncate">{p.name}</span>
                      </button>
                    </li>
                  ))}
                  <li className="mt-2 border-t border-zinc-800 pt-2">
                    <button
                      onClick={handleOpenLikedSongs}
                      className={`flex w-full items-center justify-between rounded-md px-2 py-1.5 text-left hover:bg-zinc-800 ${
                        activePlaylistId === 'liked'
                          ? 'bg-zinc-800 text-white'
                          : 'text-zinc-300'
                      }`}
                    >
                      <span className="truncate">Liked Songs</span>
                    </button>
                  </li>
                </ul>
              </div>

              <div>
                <h2 className="mb-3 text-xl font-semibold">
                  {activePlaylist?.name ?? 'Your Library'}
                </h2>
                <p className="mb-4 text-sm text-zinc-400">
                  {activePlaylist?.description}
                </p>
                <SongTable
                  songs={activePlaylistSongs}
                  currentSongId={currentSong?.id}
                  onSongSelect={(song) =>
                    playFromYouTube(`${song.title} ${song.artist}`, song)
                  }
                />
              </div>
            </section>
          )}

          {view === 'search' && (
            <section className="mb-24">
              <h2 className="mb-4 text-xl font-semibold">Search results</h2>
              {searchError && (
                <p className="mb-3 text-sm text-red-400">{searchError}</p>
              )}
              {(!searchResults || searchResults.length === 0) && !searchError && (
                <p className="text-sm text-zinc-400">
                  Type something above and press Enter to search with Genius.
                </p>
              )}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {searchResults.map((song) => (
                  <button
                    key={song.id}
                    onClick={() => handleSearchResultClick(song)}
                    className="group flex flex-col rounded-md bg-zinc-900/60 p-3 text-left transition hover:bg-zinc-800"
                  >
                    {song.thumbnail && (
                      <img
                        src={song.thumbnail}
                        alt={song.title}
                        className="mb-3 aspect-video w-full rounded-md object-cover"
                      />
                    )}
                    <div className="mb-1 line-clamp-2 text-sm font-semibold text-zinc-50">
                      {song.title}
                    </div>
                    <div className="text-xs text-zinc-400">
                      {song.primaryArtist}
                    </div>
                  </button>
                ))}
              </div>
            </section>
          )}
        </main>

        <PlayerBar
          currentSong={currentSong}
          isPlaying={isPlaying}
          progress={progressLabel}
          onPlayPause={handlePlayPause}
          onNext={handleNext}
          onPrev={handlePrev}
        />
        {currentVideoSrc && (
          <div className="pointer-events-none fixed bottom-0 right-0 h-0 w-0 opacity-0">
            <iframe
              key={currentVideoSrc}
              title="YouTube Player"
              src={currentVideoSrc}
              allow="autoplay; encrypted-media"
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default App