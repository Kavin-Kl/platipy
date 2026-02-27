import React from 'react'

function Sidebar({ activeView, onChangeView, onCreatePlaylist, onOpenLiked }) {
    return (
        <aside className="flex h-screen w-64 flex-col bg-black text-zinc-200 px-4 py-6">
            {/* Logo */}
            <div className="mb-6 flex items-center gap-2 px-2">
                <div className="h-8 w-8 rounded-full bg-emerald-500" />
                <span className="text-lg font-semibold tracking-tight">Platipy</span>
            </div>

            {/* Primary navigation */}
            <nav className="space-y-1 text-sm font-medium">
                <button
                    className={`flex w-full items-center gap-3 rounded-md px-2 py-2 hover:bg-zinc-800 ${activeView === 'home' ? 'text-white' : 'text-zinc-300'}`}
                    onClick={() => onChangeView && onChangeView('home')}
                >
                    <span className="inline-block h-5 w-5 rounded-sm bg-white" />
                    <span>Home</span>
                </button>
                <button
                    className={`flex w-full items-center gap-3 rounded-md px-2 py-2 hover:bg-zinc-800 ${activeView === 'search' ? 'text-white' : 'text-zinc-300'}`}
                    onClick={() => onChangeView && onChangeView('search')}
                >
                    <span className="inline-block h-5 w-5 rounded-sm bg-zinc-300" />
                    <span>Search</span>
                </button>
                <button
                    className={`flex w-full items-center gap-3 rounded-md px-2 py-2 hover:bg-zinc-800 ${activeView === 'library' ? 'text-white' : 'text-zinc-300'}`}
                    onClick={() => onChangeView && onChangeView('library')}
                >
                    <span className="inline-block h-5 w-5 rounded-sm bg-zinc-300" />
                    <span>Your Library</span>
                </button>
            </nav>

            {/* Divider */}
            <div className="my-4 h-px bg-zinc-800" />

            {/* Secondary actions */}
            <div className="space-y-1 text-sm font-medium">
                <button
                    className="flex w-full items-center gap-3 rounded-md px-2 py-2 text-zinc-300 hover:bg-zinc-800"
                    onClick={() => {
                        if (onCreatePlaylist) onCreatePlaylist()
                    }}
                >
                    <span className="inline-block h-5 w-5 rounded-sm bg-zinc-500" />
                    <span>Create Playlist</span>
                </button>
                <button
                    className="flex w-full items-center gap-3 rounded-md px-2 py-2 text-zinc-300 hover:bg-zinc-800"
                    onClick={() => {
                        if (onOpenLiked) onOpenLiked()
                    }}
                >
                    <span className="inline-block h-5 w-5 rounded-sm bg-emerald-500" />
                    <span>Liked Songs</span>
                </button>
            </div>

            {/* Playlist list */}
            <div className="mt-6 flex-1 overflow-y-auto border-t border-zinc-800 pt-4 text-sm text-zinc-400">
                <ul className="space-y-2">
                    <li className="cursor-pointer hover:text-zinc-100">Daily Mix 1</li>
                    <li className="cursor-pointer hover:text-zinc-100">Daily Mix 2</li>
                    <li className="cursor-pointer hover:text-zinc-100">Liked from Radio</li>
                    <li className="cursor-pointer hover:text-zinc-100">Chill Vibes</li>
                    <li className="cursor-pointer hover:text-zinc-100">Workout</li>
                    <li className="cursor-pointer hover:text-zinc-100">Focus</li>
                </ul>
            </div>

            {/* Footer */}
            <div className="mt-4 text-[11px] text-zinc-500">
                <button className="hover:text-zinc-300">Cookies</button>
                <span className="mx-1">•</span>
                <button className="hover:text-zinc-300">Privacy</button>
            </div>
        </aside>
    )
}

export default Sidebar