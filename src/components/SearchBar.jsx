import React from "react";

export default function SearchBar({ query, setQuery, onSearch }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit} className="flex bg-gray-900 rounded-lg p-2">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search WotoWoto-Tv..."
        className="flex-grow bg-transparent text-white outline-none px-2"
      />
      <button type="submit" className="bg-red-600 px-3 py-1 rounded-lg text-white hover:bg-red-700">
        Search
      </button>
    </form>
  );
}
