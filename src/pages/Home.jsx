import React, { useEffect, useState, useRef } from 'react'
import '../tailwind.css'
import Sidebar from '../components/Sidebar'
import TopBar from '../components/TopBar'
import PlaylistGrid from '../components/PlaylistGrid'
import SongTable from '../components/SongTable'
import PlayerBar from '../components/PlayerBar'
import { madeForYou, recentPlaylists, songs as initialSongs } from '../sampleData'
import Genius from '../services/Genius'
import YouTube from '../services/YouTube'
import { useAuth } from '../contexts/AuthContext'
import { db } from '../firebase'
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc, query, where } from 'firebase/firestore'

function Home() {
  const { currentUser } = useAuth()
  const [view, setView] = useState('home')
  const [currentSong, setCurrentSong] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentSeconds, setCurrentSeconds] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(100)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [searchError, setSearchError] = useState('')
  const [currentVideoSrc, setCurrentVideoSrc] = useState(null)
  const [playlists, setPlaylists] = useState([])
  const [activePlaylistId, setActivePlaylistId] = useState(null)
  const [likedSongIds, setLikedSongIds] = useState([])
  const [songs, setSongs] = useState(initialSongs)
  const [currentVideoId, setCurrentVideoId] = useState(null)
  const [isLoadingVideo, setIsLoadingVideo] = useState(false)
  const [currentSongIndex, setCurrentSongIndex] = useState(-1)
  const [showPlaylistMenu, setShowPlaylistMenu] = useState(null)
  const playerRef = useRef(null)
  const ytPlayerRef = useRef(null)
  const progressIntervalRef = useRef(null)

  // Load YouTube IFrame API
  useEffect(() => {
    // Load YouTube IFrame API script
    if (!window.YT) {
      const tag = document.createElement('script')
      tag.src = 'https://www.youtube.com/iframe_api'
      const firstScriptTag = document.getElementsByTagName('script')[0]
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag)
    }

    // Set up YouTube API ready callback
    window.onYouTubeIframeAPIReady = () => {
      console.log('YouTube IFrame API Ready')
    }
  }, [])

  // Load user playlists and liked songs from Firestore
  useEffect(() => {
    if (!currentUser) return

    const loadUserData = async () => {
      try {
        // Load playlists
        const playlistsQuery = query(
          collection(db, 'playlists'),
          where('userId', '==', currentUser.uid)
        )
        const playlistsSnapshot = await getDocs(playlistsQuery)
        const userPlaylists = playlistsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        setPlaylists(userPlaylists)

        // Load liked songs
        const likedQuery = query(
          collection(db, 'likedSongs'),
          where('userId', '==', currentUser.uid)
        )
        const likedSnapshot = await getDocs(likedQuery)
        const likedIds = likedSnapshot.docs.map((doc) => doc.data().songId)
        setLikedSongIds(likedIds)
      } catch (error) {
        console.error('Error loading user data:', error)
      }
    }

    loadUserData()
  }, [currentUser])

  // Initialize YouTube Player when video ID changes
  useEffect(() => {
    if (!currentVideoId || !window.YT) return

    // Clean up previous player
    if (ytPlayerRef.current) {
      ytPlayerRef.current.destroy()
    }

    // Create new player
    ytPlayerRef.current = new window.YT.Player('youtube-player', {
      videoId: currentVideoId,
      playerVars: {
        autoplay: 1,
        controls: 0,
        disablekb: 1,
        fs: 0,
        modestbranding: 1,
        playsinline: 1,
      },
      events: {
        onReady: (event) => {
          event.target.setVolume(volume)
          event.target.playVideo()
          setDuration(event.target.getDuration())

          // Start progress tracking
          if (progressIntervalRef.current) {
            clearInterval(progressIntervalRef.current)
          }
          progressIntervalRef.current = setInterval(() => {
            if (ytPlayerRef.current && ytPlayerRef.current.getCurrentTime) {
              const current = ytPlayerRef.current.getCurrentTime()
              setCurrentSeconds(Math.floor(current))
            }
          }, 1000)
        },
        onStateChange: (event) => {
          if (event.data === window.YT.PlayerState.PLAYING) {
            setIsPlaying(true)
          } else if (event.data === window.YT.PlayerState.PAUSED) {
            setIsPlaying(false)
          } else if (event.data === window.YT.PlayerState.ENDED) {
            handleNext()
          }
        },
      },
    })

    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current)
      }
    }
  }, [currentVideoId])

  // Update volume when changed
  useEffect(() => {
    if (ytPlayerRef.current && ytPlayerRef.current.setVolume) {
      ytPlayerRef.current.setVolume(volume)
    }
  }, [volume])

  const handlePlayPause = () => {
    if (!ytPlayerRef.current) return

    if (isPlaying) {
      ytPlayerRef.current.pauseVideo()
    } else {
      ytPlayerRef.current.playVideo()
    }
  }

  const handleNext = () => {
    if (currentSongIndex < songs.length - 1) {
      const nextSong = songs[currentSongIndex + 1]
      const query = `${nextSong.title} ${nextSong.artist}`
      playFromYouTube(query, nextSong, currentSongIndex + 1)
    } else {
      // Loop back to first song
      const firstSong = songs[0]
      const query = `${firstSong.title} ${firstSong.artist}`
      playFromYouTube(query, firstSong, 0)
    }
  }

  const handlePrev = () => {
    if (currentSongIndex > 0) {
      const prevSong = songs[currentSongIndex - 1]
      const query = `${prevSong.title} ${prevSong.artist}`
      playFromYouTube(query, prevSong, currentSongIndex - 1)
    } else {
      // Loop to last song
      const lastSong = songs[songs.length - 1]
      const query = `${lastSong.title} ${lastSong.artist}`
      playFromYouTube(query, lastSong, songs.length - 1)
    }
  }

  const handleVolumeChange = (newVolume) => {
    setVolume(newVolume)
  }

  const formatSeconds = (value) => {
    const m = Math.floor(value / 60)
    const s = value % 60
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  const progressLabel = formatSeconds(currentSeconds)
  const durationLabel = formatSeconds(duration)

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

  const playFromYouTube = async (query, fallbackSong, songIndex) => {
    if (fallbackSong) {
      setCurrentSong(fallbackSong)
    }

    if (songIndex !== undefined) {
      setCurrentSongIndex(songIndex)
    } else {
      // Find the song index
      const idx = songs.findIndex((s) => s.id === fallbackSong?.id)
      setCurrentSongIndex(idx !== -1 ? idx : -1)
    }

    setIsLoadingVideo(true)
    setIsPlaying(false)
    setCurrentSeconds(0)

    try {
      // Search YouTube for the video
      const videoId = await YouTube.searchVideo(query)

      if (videoId) {
        setCurrentVideoId(videoId)
        console.log('Playing video:', videoId, 'for query:', query)
      } else {
        console.error('No video found for:', query)
        // Fallback: open YouTube search in new tab
        const encoded = encodeURIComponent(query)
        window.open(`https://www.youtube.com/results?search_query=${encoded}`, '_blank')
      }
    } catch (error) {
      console.error('Error searching YouTube:', error)
      // Fallback: open YouTube search in new tab
      const encoded = encodeURIComponent(query)
      window.open(`https://www.youtube.com/results?search_query=${encoded}`, '_blank')
    } finally {
      setIsLoadingVideo(false)
    }
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

  const handleCreatePlaylist = async () => {
    if (!currentUser) return

    try {
      const nextIndex = playlists.length + 1
      const newPlaylist = {
        userId: currentUser.uid,
        name: `My Playlist #${nextIndex}`,
        description: 'New playlist',
        color: 'bg-emerald-500',
        songIds: [],
        createdAt: new Date().toISOString(),
      }

      const docRef = await addDoc(collection(db, 'playlists'), newPlaylist)
      const createdPlaylist = { id: docRef.id, ...newPlaylist }

      setPlaylists((prev) => [...prev, createdPlaylist])
      setActivePlaylistId(createdPlaylist.id)
      setView('library')
    } catch (error) {
      console.error('Error creating playlist:', error)
    }
  }

  const handleOpenLikedSongs = () => {
    setActivePlaylistId('liked')
    setView('library')
  }

  const handleToggleLike = async (songId) => {
    if (!currentUser) return

    try {
      if (likedSongIds.includes(songId)) {
        // Unlike
        const likedQuery = query(
          collection(db, 'likedSongs'),
          where('userId', '==', currentUser.uid),
          where('songId', '==', songId)
        )
        const snapshot = await getDocs(likedQuery)
        snapshot.forEach(async (docSnapshot) => {
          await deleteDoc(doc(db, 'likedSongs', docSnapshot.id))
        })
        setLikedSongIds((prev) => prev.filter((id) => id !== songId))
      } else {
        // Like
        await addDoc(collection(db, 'likedSongs'), {
          userId: currentUser.uid,
          songId,
          createdAt: new Date().toISOString(),
        })
        setLikedSongIds((prev) => [...prev, songId])
      }
    } catch (error) {
      console.error('Error toggling like:', error)
    }
  }

  const handleAddToPlaylist = async (playlistId, songId) => {
    if (!currentUser) return

    try {
      const playlistRef = doc(db, 'playlists', playlistId)
      const playlist = playlists.find((p) => p.id === playlistId)

      if (playlist) {
        // Check if song already in playlist
        if (playlist.songIds.includes(songId)) {
          console.log('Song already in playlist')
          return
        }

        // Add song to playlist
        const updatedSongIds = [...playlist.songIds, songId]
        await updateDoc(playlistRef, {
          songIds: updatedSongIds,
        })

        // Update local state
        setPlaylists((prev) =>
          prev.map((p) =>
            p.id === playlistId ? { ...p, songIds: updatedSongIds } : p
          )
        )
      }
    } catch (error) {
      console.error('Error adding song to playlist:', error)
    }
  }

  const activePlaylist =
    activePlaylistId === 'liked'
      ? {
          id: 'liked',
          name: 'Liked Songs',
          description: 'All songs you love',
          color: 'bg-emerald-500',
          songIds: likedSongIds,
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
              <PlaylistGrid
                title="Made for you"
                items={madeForYou}
                likedSongIds={likedSongIds}
                onToggleLike={handleToggleLike}
                onAddToPlaylist={handleAddToPlaylist}
                playlists={playlists}
              />
              <PlaylistGrid
                title="Recently played"
                items={recentPlaylists}
                likedSongIds={likedSongIds}
                onToggleLike={handleToggleLike}
                onAddToPlaylist={handleAddToPlaylist}
                playlists={playlists}
              />
              <SongTable
                songs={songs}
                currentSongId={currentSong?.id}
                likedSongIds={likedSongIds}
                playlists={playlists}
                onSongSelect={(song) =>
                  playFromYouTube(`${song.title} ${song.artist}`, song)
                }
                onToggleLike={handleToggleLike}
                onAddToPlaylist={handleAddToPlaylist}
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
                  likedSongIds={likedSongIds}
                  playlists={playlists}
                  onSongSelect={(song) =>
                    playFromYouTube(`${song.title} ${song.artist}`, song)
                  }
                  onToggleLike={handleToggleLike}
                  onAddToPlaylist={handleAddToPlaylist}
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
                {searchResults.map((song) => {
                  const isLiked = likedSongIds.includes(song.id)

                  return (
                    <div
                      key={song.id}
                      className="group relative flex flex-col rounded-md bg-zinc-900/60 p-3 text-left transition hover:bg-zinc-800"
                    >
                      <div
                        className="relative cursor-pointer"
                        onClick={() => handleSearchResultClick(song)}
                      >
                        {song.thumbnail && (
                          <img
                            src={song.thumbnail}
                            alt={song.title}
                            className="mb-3 aspect-video w-full rounded-md object-cover"
                          />
                        )}

                        {/* Action buttons - show on hover */}
                        <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          {/* Like button */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleToggleLike(song.id)
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

                          {/* Add to playlist button */}
                          <div className="relative">
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                if (playlists.length === 0) {
                                  alert('Create a playlist first by clicking "Create Playlist" in the sidebar!')
                                  return
                                }
                                // Toggle playlist menu for this song
                                const menuKey = `search-${song.id}`
                                setShowPlaylistMenu(showPlaylistMenu === menuKey ? null : menuKey)
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
                            {showPlaylistMenu === `search-${song.id}` && playlists.length > 0 && (
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
                                        handleAddToPlaylist(playlist.id, song.id)
                                        setShowPlaylistMenu(null)
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
                        </div>
                      </div>

                      <div className="mb-1 line-clamp-2 text-sm font-semibold text-zinc-50">
                        {song.title}
                      </div>
                      <div className="text-xs text-zinc-400">
                        {song.primaryArtist}
                      </div>
                    </div>
                  )
                })}
              </div>
            </section>
          )}
        </main>

        <PlayerBar
          currentSong={currentSong}
          isPlaying={isPlaying}
          progress={progressLabel}
          duration={durationLabel}
          volume={volume}
          onPlayPause={handlePlayPause}
          onNext={handleNext}
          onPrev={handlePrev}
          onVolumeChange={handleVolumeChange}
        />

        {/* Hidden YouTube Player */}
        <div className="pointer-events-none fixed bottom-0 right-0 h-0 w-0 opacity-0">
          <div id="youtube-player" ref={playerRef}></div>
        </div>

        {/* Loading indicator */}
        {isLoadingVideo && (
          <div className="fixed bottom-24 left-1/2 -translate-x-1/2 rounded-full bg-zinc-800 px-4 py-2 text-sm text-white shadow-lg">
            <div className="flex items-center gap-2">
              <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Loading song...
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Home
