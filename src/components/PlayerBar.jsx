import React, { useState } from 'react'
import { Pause } from 'lucide-react'
import { Play } from 'lucide-react'
import { SkipBack } from 'lucide-react'
import { SkipForward } from 'lucide-react'

function PlayerBar({
  currentSong,
  isPlaying,
  progress,
  duration,
  volume,
  onPlayPause,
  onNext,
  onPrev,
  onVolumeChange,
}) {
  const title = currentSong?.title ?? 'Select a song'
  const artist = currentSong?.artist ?? ''
  const currentTimeLabel = progress || '0:00'
  const durationLabel = duration || '--:--'

  // Calculate progress percentage
  const parseTime = (timeStr) => {
    const [m, s] = timeStr.split(':').map(Number)
    return (m || 0) * 60 + (s || 0)
  }

  const currentSeconds = parseTime(currentTimeLabel)
  const totalSeconds = parseTime(durationLabel)
  const progressPercent = totalSeconds > 0 ? (currentSeconds / totalSeconds) * 100 : 0

  return (
    <footer className="fixed bottom-0 left-0 right-0 flex h-20 items-center justify-between border-t border-zinc-800 bg-gradient-to-t from-black to-zinc-950/95 px-4 text-sm text-zinc-200">
      {/* Current track */}
      <div className="flex min-w-0 items-center gap-3">
        {currentSong?.thumbnail ? (
          <img
            src={currentSong.thumbnail}
            alt={title}
            className="h-14 w-14 rounded object-cover"
          />
        ) : (
          <div className="h-14 w-14 rounded-sm bg-emerald-500 flex items-center justify-center">
            <svg className="h-8 w-8 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
            </svg>
          </div>
        )}
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
            <SkipBack className='h-4 w-4' />
          </button>
          <button
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-black text-xs font-semibold"
            onClick={onPlayPause}
            disabled={!currentSong}
          >
            {isPlaying ? <Pause className='h-4 w-4 ' /> : <Play className='h-4 w-4' />}
          </button>
          <button
            className="text-zinc-400 hover:text-zinc-100"
            onClick={onNext}
          >
            <SkipForward className='h-4 w-4' />
          </button>
        </div>
        <div className="flex w-full items-center gap-2 text-[10px] text-zinc-400">
          <span>{currentTimeLabel}</span>
          <div className="relative h-1 flex-1 rounded-full bg-zinc-700">
            <div
              className="absolute inset-y-0 left-0 rounded-full bg-emerald-400"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span>{durationLabel}</span>
        </div>
      </div>

      {/* Extra controls */}
      <div className="flex items-center gap-3 text-xs text-zinc-400">
        <button className="hover:text-zinc-100">Lyric</button>
        <button className="hover:text-zinc-100">Queue</button>
        <button className="hover:text-zinc-100">Devices</button>
        <div className="flex w-24 items-center gap-1">
          <span className="text-[10px]">{volume === 0 ? '🔇' : volume < 50 ? '🔉' : '🔊'}</span>
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={(e) => onVolumeChange && onVolumeChange(Number(e.target.value))}
            className="h-1 w-full cursor-pointer appearance-none rounded-full bg-zinc-700 [&::-webkit-slider-thumb]:h-2 [&::-webkit-slider-thumb]:w-2 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white hover:[&::-webkit-slider-thumb]:bg-emerald-400"
            style={{
              background: `linear-gradient(to right, #34d399 0%, #34d399 ${volume}%, #3f3f46 ${volume}%, #3f3f46 100%)`,
            }}
          />
        </div>
      </div>
    </footer>
  )
}

export default PlayerBar

