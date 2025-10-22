import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { searchMulti, mapToCard, getTrending, getPopular, getGenres, discoverByGenre } from "../api/tmdb";
import { movies, tvShows } from "../data/library";
import Navbar from "../components/Navbar";
import HeroBanner from "../components/HeroBanner";
import Section from "../components/Section";
import { useFavorites } from "../hooks/useFavorites";
import { useProgress } from "../hooks/useProgress";

export default function Home() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  // modal removed; playback handled in /play route
  const [query, setQuery] = useState(() => searchParams.get("q") || "");
  const [searchResults, setSearchResults] = useState([]);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [trendingTv, setTrendingTv] = useState([]);
  const [popularMovies, setPopularMovies] = useState([]);
  const [popularTv, setPopularTv] = useState([]);
  const [genreRows, setGenreRows] = useState([]); // [{title, items}]
  const [searchPage, setSearchPage] = useState(1);
  const [searchTotalPages, setSearchTotalPages] = useState(1);
  const [showFavorites, setShowFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem("showFavorites");
      return saved ? JSON.parse(saved) : false;
    } catch {
      return false;
    }
  });

  const { favorites, toggleFavorite } = useFavorites();
  const { progressList, saveProgress } = useProgress();

  const handleSearch = async (text) => {
    const qRaw = text.trim();
    if (!qRaw) {
      setSearchResults([]);
      setSearchParams((prev) => {
        prev.delete("q");
        return prev;
      }, { replace: true });
      return;
    }
    setSearchParams((prev) => {
      prev.set("q", qRaw);
      return prev;
    }, { replace: true });

    const q = qRaw.toLowerCase();
    const localResults = [...movies, ...tvShows].filter((item) =>
      item.title.toLowerCase().includes(q)
    );

    let remoteResults = [];
    try {
      if (import.meta.env.VITE_TMDB_API_KEY && qRaw.length >= 2) {
        const data = await searchMulti(qRaw, 1);
        remoteResults = data.results.map(mapToCard);
        setSearchPage(data.page);
        setSearchTotalPages(data.total_pages);
      }
    } catch {}

    setSearchResults([...remoteResults, ...localResults]);
  };

  // Debounce query-driven search for better UX
  useEffect(() => {
    const q = query.trim();
    const id = setTimeout(() => {
      if (q.length >= 2) {
        handleSearch(q);
      } else {
        setSearchResults([]);
      }
    }, 300);
    return () => clearTimeout(id);
  }, [query]);

  const loadMoreSearch = async () => {
    try {
      if (!import.meta.env.VITE_TMDB_API_KEY) return;
      if (searchPage >= searchTotalPages) return;
      const next = searchPage + 1;
      const data = await searchMulti(query.trim(), next);
      setSearchPage(data.page);
      setSearchResults(prev => [...prev, ...data.results.map(mapToCard)]);
    } catch {}
  };

  // Persist favorites view toggle
  useEffect(() => {
    try {
      localStorage.setItem("showFavorites", JSON.stringify(showFavorites));
    } catch {}
  }, [showFavorites]);

  // Optimize lookup for favorites
  const favoriteIds = useMemo(
    () => new Set(favorites.map((f) => f.id)),
    [favorites]
  );

  // Fetch TMDB feeds if key present
  useEffect(() => {
    let active = true;
    (async () => {
      if (!import.meta.env.VITE_TMDB_API_KEY) return;
      try {
        const [tMov, tTv, pMov, pTv] = await Promise.all([
          getTrending('movie', 'week'),
          getTrending('tv', 'week'),
          getPopular('movie', 1),
          getPopular('tv', 1),
        ]);
        if (!active) return;
        setTrendingMovies(tMov.map(mapToCard));
        setTrendingTv(tTv.map(mapToCard));
        setPopularMovies(pMov.map(mapToCard));
        setPopularTv(pTv.map(mapToCard));
      } catch {}
    })();
    return () => { active = false; };
  }, []);

  // Genre rows (a few top genres)
  useEffect(() => {
    let active = true;
    (async () => {
      if (!import.meta.env.VITE_TMDB_API_KEY) return;
      try {
        const genres = await getGenres('movie');
        const top = genres.slice(0, 4); // first few rows
        const rows = await Promise.all(top.map(async (g) => {
          const items = (await discoverByGenre('movie', g.id, 1)).map(mapToCard);
          return { title: g.name, items };
        }));
        if (!active) return;
        setGenreRows(rows);
      } catch {}
    })();
    return () => { active = false; };
  }, []);

  return (
    <div className="bg-black min-h-screen text-white pb-10">
      <Navbar
        query={query}
        setQuery={setQuery}
        onSearch={handleSearch}
        onToggleFavorites={() => setShowFavorites(!showFavorites)}
      />


      <div className="pt-20">
        <HeroBanner
          movies={(trendingMovies.length > 0 ? trendingMovies : movies)}
          onSelect={(m) => (
            m.tmdbId
              ? navigate(`/${m.type}/${m.tmdbId}`)
              : m.source
              ? navigate(`/play?${new URLSearchParams({ src: m.source, title: m.title, id: m.id }).toString()}`)
              : null
          )}
        />
        <div className="px-4 mt-8">
          {showFavorites ? (
            <Section
              title="My List"
              data={favorites}
              onSelect={(item) => (
                item.tmdbId
                  ? navigate(`/${item.type}/${item.tmdbId}`)
                  : item.source
                  ? navigate(`/play?${new URLSearchParams({ src: item.source, title: item.title, id: item.id }).toString()}`)
                  : null
              )}
              favoriteIds={favoriteIds}
              toggleFavorite={toggleFavorite}
            />
          ) : searchResults.length > 0 ? (
            <>
              <Section
                title={`Search Results for "${query}"`}
                data={searchResults}
                onSelect={(item) => (
                  item.tmdbId
                    ? navigate(`/${item.type}/${item.tmdbId}`)
                    : item.source
                    ? navigate(`/play?${new URLSearchParams({ src: item.source, title: item.title, id: item.id }).toString()}`)
                    : null
                )}
                favoriteIds={favoriteIds}
                toggleFavorite={toggleFavorite}
              />
              {searchPage < searchTotalPages && (
                <div className="flex justify-center mt-4">
                  <button onClick={loadMoreSearch} className="bg-gray-800 hover:bg-gray-700 rounded px-4 py-2 text-sm">
                    Load more
                  </button>
                </div>
              )}
            </>
          ) : (
            <>
              {genreRows.map(row => (
                <Section
                  key={row.title}
                  title={row.title}
                  data={row.items}
                  onSelect={(item) => (item.tmdbId ? navigate(`/${item.type}/${item.tmdbId}`) : null)}
                  favoriteIds={favoriteIds}
                  toggleFavorite={toggleFavorite}
                />
              ))}
              {trendingMovies.length > 0 && (
                <Section
                  title="Trending Movies"
                  data={trendingMovies}
                  onSelect={(item) => (item.tmdbId ? navigate(`/${item.type}/${item.tmdbId}`) : null)}
                  favoriteIds={favoriteIds}
                  toggleFavorite={toggleFavorite}
                />
              )}
              {trendingTv.length > 0 && (
                <Section
                  title="Trending TV"
                  data={trendingTv}
                  onSelect={(item) => (item.tmdbId ? navigate(`/${item.type}/${item.tmdbId}`) : null)}
                  favoriteIds={favoriteIds}
                  toggleFavorite={toggleFavorite}
                />
              )}
              {popularMovies.length > 0 && (
                <Section
                  title="Popular Movies"
                  data={popularMovies}
                  onSelect={(item) => (item.tmdbId ? navigate(`/${item.type}/${item.tmdbId}`) : null)}
                  favoriteIds={favoriteIds}
                  toggleFavorite={toggleFavorite}
                />
              )}
              {popularTv.length > 0 && (
                <Section
                  title="Popular TV"
                  data={popularTv}
                  onSelect={(item) => (item.tmdbId ? navigate(`/${item.type}/${item.tmdbId}`) : null)}
                  favoriteIds={favoriteIds}
                  toggleFavorite={toggleFavorite}
                />
              )}
              {progressList.length > 0 && (
                <Section
                  title="Continue Watching"
                  data={progressList}
                  onSelect={(item) => (
                    item.tmdbId
                      ? navigate(`/${item.type}/${item.tmdbId}`)
                      : item.source
                      ? navigate(`/play?${new URLSearchParams({ src: item.source, title: item.title, id: item.id }).toString()}`)
                      : null
                  )}
                  favoriteIds={favoriteIds}
                  toggleFavorite={toggleFavorite}
                />
              )}
              <Section
                title="Movies"
                data={movies}
                onSelect={(item) => (
                  item.tmdbId
                    ? navigate(`/${item.type}/${item.tmdbId}`)
                    : item.source
                    ? navigate(`/play?${new URLSearchParams({ src: item.source, title: item.title, id: item.id }).toString()}`)
                    : null
                )}
                favoriteIds={favoriteIds}
                toggleFavorite={toggleFavorite}
              />
              <Section
                title="TV Shows"
                data={tvShows}
                onSelect={(item) => (
                  item.tmdbId
                    ? navigate(`/${item.type}/${item.tmdbId}`)
                    : item.source
                    ? navigate(`/play?${new URLSearchParams({ src: item.source, title: item.title, id: item.id }).toString()}`)
                    : null
                )}
                favoriteIds={favoriteIds}
                toggleFavorite={toggleFavorite}
              />
            </>
          )}
        </div>
      </div>
      {/* Player modal removed in favor of dedicated /play route */}
    </div>
  );
}
