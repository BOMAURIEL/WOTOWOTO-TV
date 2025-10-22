import React, { useEffect, useRef, useState } from "react";
import MovieCard from "./MovieCard";

export default function Section({ title, data, onSelect, favoriteIds = new Set(), toggleFavorite }) {
  const scrollerRef = useRef(null);
  const [drag, setDrag] = useState({ active: false, startX: 0, scrollLeft: 0 });

  const scrollBy = (dx) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: dx, behavior: 'smooth' });
  };

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const onDown = (e) => {
      setDrag({ active: true, startX: e.pageX || e.touches?.[0]?.pageX || 0, scrollLeft: el.scrollLeft });
    };
    const onMove = (e) => {
      if (!drag.active) return;
      const x = e.pageX || e.touches?.[0]?.pageX || 0;
      const walk = (x - drag.startX) * 1;
      el.scrollLeft = drag.scrollLeft - walk;
    };
    const onUp = () => setDrag((d) => ({ ...d, active: false }));

    el.addEventListener('mousedown', onDown);
    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onUp);
    el.addEventListener('mouseup', onUp);
    el.addEventListener('touchstart', onDown, { passive: true });
    el.addEventListener('touchmove', onMove, { passive: true });
    el.addEventListener('touchend', onUp);
    return () => {
      el.removeEventListener('mousedown', onDown);
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onUp);
      el.removeEventListener('mouseup', onUp);
      el.removeEventListener('touchstart', onDown);
      el.removeEventListener('touchmove', onMove);
      el.removeEventListener('touchend', onUp);
    };
  }, [drag.active, drag.startX, drag.scrollLeft]);
  return (
    <div className="mb-10 group">
      <h2 className="text-2xl font-semibold mb-4">{title}</h2>
      <div className="relative">
        <button
          aria-label="Scroll left"
          onClick={() => scrollBy(-600)}
          className="hidden md:block absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/60 hover:bg-black/80 p-2 rounded-full opacity-0 group-hover:opacity-100"
        >
          ‹
        </button>
        <div
          ref={scrollerRef}
          className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2 pr-2 focus:outline-none focus:ring-2 focus:ring-red-600"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'ArrowRight') scrollBy(400);
            if (e.key === 'ArrowLeft') scrollBy(-400);
          }}
        >
          {data.map((movie) => (
            <div key={movie.id} className="snap-start shrink-0 w-40 sm:w-48">
              <MovieCard
                movie={movie}
                onSelect={onSelect}
                toggleFavorite={toggleFavorite}
                isFavorite={favoriteIds.has(movie.id)}
              />
            </div>
          ))}
        </div>
        <button
          aria-label="Scroll right"
          onClick={() => scrollBy(600)}
          className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/60 hover:bg-black/80 p-2 rounded-full opacity-0 group-hover:opacity-100"
        >
          ›
        </button>
      </div>
    </div>
  );
}
