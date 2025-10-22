import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useSettings } from "../hooks/useSettings";
import SearchBar from "./SearchBar";

export default function Navbar({ query, setQuery, onSearch, onToggleFavorites }) {
  const { user, login, logout } = useAuth();
  const { settings, update } = useSettings();
  const [name, setName] = useState("");
  return (
    <header className="fixed top-0 left-0 w-full bg-black/70 backdrop-blur-md z-50 flex items-center justify-between px-6 py-3 shadow-lg">
      <Link to="/" className="text-red-600 text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-red-600 rounded">
        📺 WotoWoto-Tv
      </Link>

      <div className="flex-grow max-w-lg mx-6">
        <SearchBar query={query} setQuery={setQuery} onSearch={onSearch} />
      </div>

      <div className="flex items-center gap-4">
        <label className="text-sm text-gray-300 hidden sm:flex items-center gap-2">
          <span className="opacity-75">Subtitles</span>
          <select
            className="bg-gray-800 rounded px-2 py-1"
            value={settings.subtitles}
            onChange={(e) => update({ subtitles: e.target.value })}
          >
            <option value="off">Off</option>
            <option value="en">English</option>
            <option value="es">Español</option>
            <option value="fr">Français</option>
            <option value="pt">Português</option>
          </select>
        </label>
        <button
          onClick={onToggleFavorites}
          className="text-white hover:text-red-500 font-medium"
          aria-label="Toggle My List"
        >
          ♥ My List
        </button>
        {user ? (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-300">{user.username}</span>
            <button onClick={logout} className="bg-gray-700 hover:bg-gray-600 rounded px-2 py-1 text-sm">Sign out</button>
          </div>
        ) : (
          <form
            onSubmit={(e) => { e.preventDefault(); login(name); setName(""); }}
            className="flex items-center gap-2"
          >
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Username"
              className="bg-gray-800 rounded px-2 py-1 text-sm"
            />
            <button className="bg-gray-700 hover:bg-gray-600 rounded px-2 py-1 text-sm">Sign in</button>
          </form>
        )}
      </div>
    </header>
  );
}
