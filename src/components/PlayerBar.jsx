import React from 'react'

function parseDurationToSeconds(duration) {
  if (!duration || typeof duration !== 'string') return 0
  const [m, s] = duration.split(':').map(Number)
  if (Number.isNaN(m) || Number.isNaN(s)) return 0
  return m * 60 + s
}

function progressToPercent(currentLabel, durationLabel) {
  const currentSeconds = parseDurationToSeconds(currentLabel)
  const totalSeconds = parseDurationToSeconds(durationLabel)
  if (!totalSeconds) return 0
  return Math.min(100, (currentSeconds / totalSeconds) * 100)
}

function PlayerBar({
  currentSong,
  isPlaying,
  progress,
  onPlayPause,
  onNext,
  onPrev,
}) {
  const title = currentSong?.title ?? 'Select a song'
  const artist = currentSong?.artist ?? ''
  const duration = currentSong?.duration ?? '--:--'
  const currentTimeLabel = currentSong ? progress : '0:00'

  return (
    <footer className="fixed bottom-0 left-0 right-0 flex h-20 items-center justify-between border-t border-zinc-800 bg-gradient-to-t from-black to-zinc-950/95 px-4 text-sm text-zinc-200">
      {/* Current track */}
      <div className="flex min-w-0 items-center gap-3">
        <div className="h-14 w-14 rounded-sm bg-emerald-500" />
        <div className="min-w-0">
          <div className="truncate text-sm">{title}</div>
          {artist && (
            <div className="truncate text-xs text-zinc-400">{artist}</div>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="flex w-[40%] flex-col items-center gap-1">
        <div className="flex items-center gap-4 text-xs text-zinc-200">
          <button
            className="text-zinc-400 hover:text-zinc-100"
            onClick={onPrev}
          >
            {'<<'}
          </button>
          <button
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-black text-xs font-semibold"
            onClick={onPlayPause}
            disabled={!currentSong}
          >
            {isPlaying ? '❚❚' : '▶'}
          </button>
          <button
            className="text-zinc-400 hover:text-zinc-100"
            onClick={onNext}
          >
            {'>>'}
          </button>
        </div>
        <div className="flex w-full items-center gap-2 text-[10px] text-zinc-400">
          <span>{currentTimeLabel}</span>
          <div className="relative h-1 flex-1 rounded-full bg-zinc-700">
            <div
              className="absolute inset-y-0 left-0 rounded-full bg-emerald-400"
              style={{ width: `${currentSong ? progressToPercent(progress, duration) : 0}%` }}
            />
          </div>
          <span>{duration}</span>
        </div>
      </div>

      {/* Extra controls */}
      <div className="flex items-center gap-3 text-xs text-zinc-400">
        <button className="hover:text-zinc-100">Lyric</button>
        <button className="hover:text-zinc-100">Queue</button>
        <button className="hover:text-zinc-100">Devices</button>
        <div className="flex w-24 items-center gap-1">
          <span className="text-[10px]">🔊</span>
          <div className="relative h-1 flex-1 rounded-full bg-zinc-700">
            <div className="absolute inset-y-0 left-0 w-2/3 rounded-full bg-zinc-300" />
          </div>
        </div>
      </div>
    </footer>
  )
}

export default PlayerBar

