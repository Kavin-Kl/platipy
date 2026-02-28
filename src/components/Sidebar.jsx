import React from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { House } from 'lucide-react'
import { Search } from 'lucide-react'
import { Library } from 'lucide-react'
import { Plus } from 'lucide-react'
import { Heart } from 'lucide-react'
import platypus from "../assets/platypus.jpg"

function Sidebar({ activeView, onChangeView, onCreatePlaylist, onOpenLiked }) {
    const { logout, currentUser } = useAuth()
    const navigate = useNavigate()

    const handleLogout = async () => {
        try {
            await logout()
            navigate('/login')
        } catch (error) {
            console.error('Failed to logout:', error)
        }
    }

    return (
        <aside className="flex h-screen w-64 flex-col bg-black text-zinc-200 px-4 py-6">
            {/* Logo */}
            <div className="mb-6 flex items-center gap-2 px-2">
                <img src="src/assets/platypus.jpg" alt="Platipy" className="h-10 w-10  rounded-full" />
                <span className="text-lg font-semibold tracking-tight">Platipy</span>
            </div>

            {/* Primary navigation */}
            <nav className="space-y-1 text-sm font-medium">
                <button
                    className={`flex w-full items-center gap-3 rounded-md px-2 py-2 hover:bg-zinc-800 ${activeView === 'home' ? 'text-white' : 'text-zinc-300'}`}
                    onClick={() => onChangeView && onChangeView('home')}
                >
                    <House />
                    <span>Home</span>
                </button>
                <button
                    className={`flex w-full items-center gap-3 rounded-md px-2 py-2 hover:bg-zinc-800 ${activeView === 'search' ? 'text-white' : 'text-zinc-300'}`}
                    onClick={() => onChangeView && onChangeView('search')}
                >
                    <Search />
                    <span>Search</span>
                </button>
                <button
                    className={`flex w-full items-center gap-3 rounded-md px-2 py-2 hover:bg-zinc-800 ${activeView === 'library' ? 'text-white' : 'text-zinc-300'}`}
                    onClick={() => onChangeView && onChangeView('library')}
                >
                    <Library />
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
                    <Plus />
                    <span>Create Playlist</span>
                </button>
                <button
                    className="flex w-full items-center gap-3 rounded-md px-2 py-2 text-zinc-300 hover:bg-zinc-800"
                    onClick={() => {
                        if (onOpenLiked) onOpenLiked()
                    }}
                >
                    <Heart />
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
            <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 rounded-md bg-zinc-900 px-3 py-2">
                    <div className="h-7 w-7 rounded-full bg-emerald-500 flex items-center justify-center text-xs font-bold text-white">
                        {currentUser?.email?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-white truncate">
                            {currentUser?.email || 'User'}
                        </p>
                    </div>
                </div>
                <button
                    onClick={handleLogout}
                    className="w-full rounded-md bg-zinc-800 px-3 py-2 text-xs font-medium text-zinc-300 hover:bg-zinc-700 hover:text-white transition"
                >
                    Log out
                </button>
            </div>
        </aside>
    )
}

export default Sidebar