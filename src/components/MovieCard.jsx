import React, { useRef } from "react";
import noImage from "../assets/no-image.jpg";

export default function MovieCard({ movie, onSelect, toggleFavorite, isFavorite }) {
  const imgRef = useRef(null);
  return (
    <div className="bg-gray-900 rounded-xl overflow-hidden relative hover:scale-105 transition cursor-pointer" title={movie.title}>
      <img
        ref={imgRef}
        src={movie.thumbnail}
        alt={movie.title}
        className="w-full h-64 object-cover"
        onClick={() => onSelect(movie)}
        onError={() => {
          if (imgRef.current) imgRef.current.src = noImage;
        }}
      />
      {typeof movie.progressPercent === 'number' && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-700">
          <div
            className="h-1 bg-red-500"
            style={{ width: `${Math.min(100, Math.max(0, movie.progressPercent || 0))}%` }}
          />
        </div>
      )}
      <button
        onClick={(e) => {
          e.stopPropagation();
          toggleFavorite(movie);
        }}
        aria-label={isFavorite ? "Remove from My List" : "Add to My List"}
        className={`absolute top-2 right-2 text-xl ${
          isFavorite ? "text-red-500" : "text-white"
        }`}
      >
        ♥
      </button>
      <div className="p-2 text-white text-sm truncate">{movie.title}</div>
      <div className="absolute left-2 top-2 bg-black/70 text-white text-[10px] px-1.5 py-0.5 rounded opacity-0 hover:opacity-100 pointer-events-none">
        {movie.type?.toUpperCase?.()}
      </div>
    </div>
  );
}
