import React from "react";
import MovieCard from "./MovieCard";

export default function Section({ title, data, onSelect, favorites, toggleFavorite }) {
  return (
    <div className="mb-10">
      <h2 className="text-2xl font-semibold mb-4">{title}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {data.map((movie) => (
          <MovieCard
            key={movie.id}
            movie={movie}
            onSelect={onSelect}
            toggleFavorite={toggleFavorite}
            isFavorite={favorites.some((f) => f.id === movie.id)}
          />
        ))}
      </div>
    </div>
  );
}
