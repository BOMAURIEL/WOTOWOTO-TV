import React from "react";

export default function MovieCard({ movie, onSelect, toggleFavorite, isFavorite }) {
  return (
    <div className="bg-gray-900 rounded-xl overflow-hidden relative hover:scale-105 transition cursor-pointer">
      <img
        src={movie.thumbnail}
        alt={movie.title}
        className="w-full h-64 object-cover"
        onClick={() => onSelect(movie)}
      />
      <button
        onClick={(e) => {
          e.stopPropagation();
          toggleFavorite(movie);
        }}
        className={`absolute top-2 right-2 text-xl ${
          isFavorite ? "text-red-500" : "text-white"
        }`}
      >
        ♥
      </button>
      <div className="p-2 text-white text-sm truncate">{movie.title}</div>
    </div>
  );
}
