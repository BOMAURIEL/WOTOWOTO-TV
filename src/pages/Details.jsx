import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import noImage from "../assets/no-image.jpg";
import { useFavorites } from "../hooks/useFavorites";
import { getDetails, mapDetails, mapToCard, getTvSeason, imgStill } from "../api/tmdb";
import Section from "../components/Section";
import { formatRuntime } from "../utils/formatters";

export default function Details() {
  const { mediaType, id } = useParams();
  const navigate = useNavigate();
  const { favorites, toggleFavorite } = useFavorites();
  const [query, setQuery] = useState("");
  const [detail, setDetail] = useState(null);
  const [recs, setRecs] = useState([]);
  const [season, setSeason] = useState(1);
  const [episodes, setEpisodes] = useState([]);
  const isTv = useMemo(() => mediaType === 'tv', [mediaType]);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const { data, recommendations } = await getDetails(mediaType, id);
        if (!active) return;
        setDetail(mapDetails(mediaType, data));
        setRecs(recommendations.map(mapToCard));
        if (mediaType === 'tv') {
          const firstSeason = (data.seasons || []).find(s => s.season_number > 0)?.season_number || 1;
          setSeason(firstSeason);
        }
      } catch (_) {
        // If TMDB fails or key missing, fallback to home
      }
    })();
    return () => { active = false; };
  }, [mediaType, id]);

  useEffect(() => {
    let active = true;
    (async () => {
      if (!isTv || !detail?.tmdbId) return;
      try {
        const eps = await getTvSeason(detail.tmdbId, season);
        if (!active) return;
        setEpisodes(eps || []);
      } catch {}
    })();
    return () => { active = false; };
  }, [isTv, detail?.tmdbId, season]);

  const favoriteIds = new Set(favorites.map(f => f.id));

  return (
    <div className="bg-black min-h-screen text-white pb-10">
      <Navbar
        query={query}
        setQuery={setQuery}
        onSearch={(q) => navigate(`/?q=${encodeURIComponent(q)}`)}
        onToggleFavorites={() => navigate("/?view=list")}
      />

      <div className="pt-20 px-4">
        {detail && (
          <div className="flex flex-col md:flex-row gap-6">
            <img
              src={detail.poster || noImage}
              alt={detail.title}
              className="w-full md:w-64 rounded-lg object-cover"
            />
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">{detail.title}</h1>
              <div className="text-gray-400 text-sm mb-3">
                {detail.release_date} {detail.genres?.length ? "• " + detail.genres.join(", ") : ""}
              </div>
              <p className="text-gray-200 mb-4">{detail.description}</p>
              <div className="flex gap-3">
                <button
                  onClick={() => toggleFavorite({ id: detail.id, title: detail.title, thumbnail: detail.poster, type: detail.type })}
                  className="bg-gray-800 px-4 py-2 rounded-lg hover:bg-gray-700"
                >
                  {favoriteIds.has(detail.id) ? "♥ In My List" : "＋ Add to My List"}
                </button>
                {detail.type === 'movie' && (
                  <button
                    onClick={() => navigate(`/play?${new URLSearchParams({ tmdbId: String(detail.tmdbId), mediaType: 'movie', title: detail.title }).toString()}`)}
                    className="bg-red-600 px-4 py-2 rounded-lg hover:bg-red-700"
                  >
                    ▶ Play
                  </button>
                )}
                <button
                  onClick={() => navigate(-1)}
                  className="bg-gray-700 px-4 py-2 rounded-lg hover:bg-gray-600"
                >
                  Back
                </button>
              </div>
            </div>
          </div>
        )}

        {isTv && detail && (
          <div className="mt-8">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xl font-semibold">Episodes</h2>
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-400">Season</label>
                <select
                  className="bg-gray-800 px-2 py-1 rounded"
                  value={season}
                  onChange={(e) => setSeason(Number(e.target.value))}
                >
                  {detail.seasons?.filter(s => s.season_number > 0).map(s => (
                    <option key={s.season_number} value={s.season_number}>
                      {s.season_number}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {episodes.map(ep => {
                const thumb = imgStill(ep.still_path) || noImage;
                const rt = Number.isFinite(ep.runtime) ? formatRuntime(ep.runtime) : "";
                return (
                  <button
                    key={ep.id}
                    onClick={() => navigate(`/play?${new URLSearchParams({ tmdbId: String(detail.tmdbId), mediaType: 'tv', season: String(season), episode: String(ep.episode_number), title: `${detail.title} S${season}E${ep.episode_number}` }).toString()}`)}
                    className="bg-gray-800 rounded overflow-hidden text-left hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-red-600"
                  >
                    <img src={thumb} alt={ep.name} className="w-full h-28 object-cover" />
                    <div className="p-2">
                      <div className="text-sm font-medium">S{season} · E{ep.episode_number} {rt && <span className="text-xs text-gray-400">• {rt}</span>}</div>
                      <div className="text-xs text-gray-300 truncate" title={ep.name}>{ep.name}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {recs.length > 0 && (
          <div className="mt-10">
            <Section
              title="Because You Watched"
              data={recs}
              onSelect={(item) => navigate(`/${item.type}/${item.tmdbId}`)}
              favoriteIds={favoriteIds}
              toggleFavorite={toggleFavorite}
            />
          </div>
        )}
      </div>
    </div>
  );
}
