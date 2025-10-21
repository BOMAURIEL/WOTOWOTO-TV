import React from 'react'

export default function GenreFilter({ genres = [], selected = null, onSelect = () => {} }) {
  return (
    <div className="flex flex-wrap gap-2">
      {genres.map(g => (
        <button
          key={g}
          onClick={() => onSelect(g)}
          className={`text-xs px-2 py-1 rounded ${selected === g ? 'bg-indigo-600' : 'bg-gray-700'}`}
        >
          {g}
        </button>
      ))}
    </div>
  )
}
