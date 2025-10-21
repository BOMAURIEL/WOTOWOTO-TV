import React, { useEffect, useState } from "react";

export default function HeroBanner({ movies, onSelect }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % movies.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [movies]);

  if (!movies.length) return null;

  const movie = movies[current];

  return (
    <section
      className="relative h-[70vh] w-full flex items-end bg-black text-white overflow-hidden"
      style={{
        backgroundImage: `url(${movie.thumbnail})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
      <div className="relative z-10 p-8 max-w-2xl">
        <h1 className="text-4xl font-bold mb-4">{movie.title}</h1>
        <p className="text-gray-300 mb-6">{movie.description}</p>
        <button
          onClick={() => onSelect(movie)}
          className="bg-red-600 px-5 py-2 rounded-lg font-semibold hover:bg-red-700"
        >
          ▶ Watch Now
        </button>
      </div>
    </section>
  );
}
