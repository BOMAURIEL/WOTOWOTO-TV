import React, { useState } from "react";
import { movies, tvShows } from "../data/library";
import Navbar from "../components/Navbar";
import HeroBanner from "../components/HeroBanner";
import Section from "../components/Section";
import PlayerModal from "../components/PlayerModal";
import { useFavorites } from "../hooks/useFavorites";
import { useProgress } from "../hooks/useProgress";

export default function Home() {
  const [selected, setSelected] = useState(null);
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showFavorites, setShowFavorites] = useState(false);

  const { favorites, toggleFavorite } = useFavorites();
  const { progressList, saveProgress } = useProgress();

  const handleSearch = (text) => {
    const q = text.toLowerCase();
    const results = [...movies, ...tvShows].filter((item) =>
      item.title.toLowerCase().includes(q)
    );
    setSearchResults(results);
  };

  return (
    <div className="bg-black min-h-screen text-white pb-10">
      <Navbar
        query={query}
        setQuery={setQuery}
        onSearch={handleSearch}
        onToggleFavorites={() => setShowFavorites(!showFavorites)}
      />

      <div className="pt-20">
        <HeroBanner movies={movies} onSelect={setSelected} />
        <div className="px-4 mt-8">
          {showFavorites ? (
            <Section
              title="My List"
              data={favorites}
              onSelect={setSelected}
              favorites={favorites}
              toggleFavorite={toggleFavorite}
            />
          ) : searchResults.length > 0 ? (
            <Section
              title={`Search Results for "${query}"`}
              data={searchResults}
              onSelect={setSelected}
              favorites={favorites}
              toggleFavorite={toggleFavorite}
            />
          ) : (
            <>
              {progressList.length > 0 && (
                <Section
                  title="Continue Watching"
                  data={progressList}
                  onSelect={setSelected}
                  favorites={favorites}
                  toggleFavorite={toggleFavorite}
                />
              )}
              <Section
                title="Movies"
                data={movies}
                onSelect={setSelected}
                favorites={favorites}
                toggleFavorite={toggleFavorite}
              />
              <Section
                title="TV Shows"
                data={tvShows}
                onSelect={setSelected}
                favorites={favorites}
                toggleFavorite={toggleFavorite}
              />
            </>
          )}
        </div>
      </div>

      {selected && (
        <PlayerModal
          movie={selected}
          onClose={() => setSelected(null)}
          onProgressSave={saveProgress}
        />
      )}
    </div>
  );
}
