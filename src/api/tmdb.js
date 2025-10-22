const TMDB_BASE = "https://api.themoviedb.org/3";
export const TMDB_IMG = {
  poster: (path) => (path ? `https://image.tmdb.org/t/p/w500${path}` : ""),
  backdrop: (path) => (path ? `https://image.tmdb.org/t/p/w1280${path}` : ""),
};

function getKey() {
  return import.meta.env.VITE_TMDB_API_KEY;
}

async function tmdb(path, params = {}) {
  const apiKey = getKey();
  if (!apiKey) throw new Error("TMDB API key missing");
  const url = new URL(TMDB_BASE + path);
  url.searchParams.set("api_key", apiKey);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`TMDB ${res.status}`);
  return res.json();
}

export async function searchMulti(query, page = 1) {
  const data = await tmdb("/search/multi", { query, page, include_adult: "false" });
  return {
    results: (data.results || []).filter(r => r.media_type === 'movie' || r.media_type === 'tv'),
    page: data.page,
    total_pages: data.total_pages,
  };
}

export async function getDetails(mediaType, id) {
  const data = await tmdb(`/${mediaType}/${id}`, { append_to_response: "recommendations,similar" });
  const recs = (data.recommendations?.results?.length ? data.recommendations.results : data.similar?.results) || [];
  return { data, recommendations: recs };
}

export function mapToCard(item) {
  const mediaType = item.media_type || (item.first_air_date ? 'tv' : 'movie');
  const tmdbId = item.id;
  return {
    id: `${mediaType}:${tmdbId}`,
    tmdbId,
    type: mediaType,
    title: item.title || item.name,
    description: item.overview || "",
    thumbnail: TMDB_IMG.poster(item.poster_path),
    backdrop: TMDB_IMG.backdrop(item.backdrop_path),
  };
}

export function mapDetails(mediaType, data) {
  return {
    id: `${mediaType}:${data.id}`,
    tmdbId: data.id,
    type: mediaType,
    title: data.title || data.name,
    description: data.overview || "",
    poster: TMDB_IMG.poster(data.poster_path),
    backdrop: TMDB_IMG.backdrop(data.backdrop_path),
    release_date: data.release_date || data.first_air_date,
    genres: (data.genres || []).map(g => g.name),
    runtime: data.runtime || (data.episode_run_time?.[0] ?? null),
    rating: data.vote_average,
    seasons: mediaType === 'tv' ? (data.seasons || []).map(s => ({
      season_number: s.season_number,
      name: s.name,
      episode_count: s.episode_count,
      poster: TMDB_IMG.poster(s.poster_path),
    })) : undefined,
  };
}

export async function getTrending(type = 'all', window = 'week') {
  const data = await tmdb(`/trending/${type}/${window}`);
  return data.results || [];
}

export async function getPopular(mediaType = 'movie', page = 1) {
  const data = await tmdb(`/${mediaType}/popular`, { page });
  return data.results || [];
}

export async function getGenres(mediaType = 'movie') {
  const data = await tmdb(`/genre/${mediaType}/list`);
  return data.genres || [];
}

export async function discoverByGenre(mediaType = 'movie', genreId, page = 1) {
  const data = await tmdb(`/discover/${mediaType}`, { with_genres: String(genreId), page });
  return data.results || [];
}

export async function getTvSeason(tvId, seasonNumber) {
  const data = await tmdb(`/tv/${tvId}/season/${seasonNumber}`);
  return data.episodes || [];
}

export function imgStill(path) {
  return path ? `https://image.tmdb.org/t/p/w300${path}` : "";
}
