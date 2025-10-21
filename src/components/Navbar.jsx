import React from "react";
import SearchBar from "./SearchBar";

export default function Navbar({ query, setQuery, onSearch, onToggleFavorites }) {
  return (
    <header className="fixed top-0 left-0 w-full bg-black/70 backdrop-blur-md z-50 flex items-center justify-between px-6 py-3 shadow-lg">
      <span className="text-red-600 text-2xl font-bold">📺 WotoWoto-Tv</span>

      <div className="flex-grow max-w-lg mx-6">
        <SearchBar query={query} setQuery={setQuery} onSearch={onSearch} />
      </div>

      <button
        onClick={onToggleFavorites}
        className="text-white hover:text-red-500 font-medium"
      >
        ♥ My List
      </button>
    </header>
  );
}
