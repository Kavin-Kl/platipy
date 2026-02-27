import React, { useEffect, useState } from "react";
import { useAuth } from '../contexts/AuthContext';

function TopBar({ view, searchQuery, onSearchChange, onSearchSubmit }) {
  const { currentUser } = useAuth();
  const [initial, setInitial] = useState("");
  const [userName, setUserName] = useState("You");

  useEffect(() => {
    if (currentUser) {
      // Get user's display name or email
      const displayName = currentUser.displayName || currentUser.email?.split('@')[0] || 'User';
      const name = displayName.charAt(0).toUpperCase() + displayName.slice(1);

      setUserName(name);
      setInitial(displayName.charAt(0).toUpperCase());
    }
  }, [currentUser]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearchSubmit) {
      onSearchSubmit(searchQuery || "");
    }
  };

  const showSearch = view === "search";

  return (
    <div className="mb-6 flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {view === "library"
            ? "Your Library"
            : view === "search"
              ? "Search"
              : "Good afternoon"}
        </h1>

        <p className="mt-1 text-sm text-zinc-400">
          {view === "library"
            ? "All your playlists and liked tracks in one place."
            : view === "search"
              ? "Search tracks and start playing instantly."
              : "Here's some music picked just for you."}
        </p>
      </div>

      <div className="flex items-center gap-3">
        {showSearch && (
          <form
            onSubmit={handleSubmit}
            className="flex items-center gap-2 rounded-full bg-zinc-900 px-3 py-1.5"
          >
            <input
              value={searchQuery}
              onChange={(e) =>
                onSearchChange && onSearchChange(e.target.value)
              }
              placeholder="What do you want to listen to?"
              className="w-56 bg-transparent text-sm text-zinc-100 outline-none placeholder:text-zinc-500"
            />
            <button
              type="submit"
              className="rounded-full bg-emerald-500 px-3 py-1 text-xs font-semibold text-black hover:bg-emerald-400"
            >
              Search
            </button>
          </form>
        )}

        <button className="rounded-full bg-zinc-900 px-4 py-1.5 text-sm font-semibold text-zinc-200 hover:bg-zinc-800">
          Upgrade
        </button>

        {/* Avatar Button */}
        <button className="flex items-center gap-2 rounded-full bg-zinc-900 px-2 py-1 hover:bg-zinc-800">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500 text-sm font-semibold text-black">
            {initial || "U"}
          </span>
          <span className="text-sm font-medium truncate max-w-[100px]">{userName}</span>
        </button>
      </div>
    </div>
  );
}

export default TopBar;