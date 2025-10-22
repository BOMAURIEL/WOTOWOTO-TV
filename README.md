# WotoWoto TV

React + Vite streaming UI with TMDB-powered browse/search, player page, carousels, and per‑user lists (local). TailwindCSS for styling.

**Quick Start**
- `npm install`
- `npm run dev`

**Environment**
- Create `.env` with: `VITE_TMDB_API_KEY=your_tmdb_api_key`
- Example file: `WOTOWOTO-TV/.env.example`
- PWA manifest: `WOTOWOTO-TV/public/manifest.json`

**Routes**
- `/` Home feed with carousels and search
- `/:mediaType/:id` Details page (movie or tv)
- `/play?src=...&title=...&id=...` direct embed source
- `/play?tmdbId=...&mediaType=movie` TMDB movie embed
- `/play?tmdbId=...&mediaType=tv&season=..&episode=..` TMDB TV embed

**Features**
- Debounced search (local + TMDB) with “Load more” pagination
- Home carousels: Trending, Popular, top Genres (TMDB Discover)
- Details: overview, genres, “Because You Watched” recs
- TV seasons/episodes with still thumbnails and runtimes
- Player page with safe postMessage handling and progress save
- Per‑user favorites and continue watching (namespaced localStorage)
- Mini progress bar on cards; hero uses TMDB backdrops when available
- Subtitles preference selector (stored per user)
- Basic SEO meta + manifest for installability

**Controls**
- Carousels: hover arrows, drag to scroll (mouse/touch), Arrow keys when focused
- Click TMDB items → Details; local items with `source` → Player
- Navbar: type a username to sign in; My List toggles favorites view

**Key Files**
- App entry: `WOTOWOTO-TV/src/main.jsx`, `WOTOWOTO-TV/src/App.jsx`
- Home/feed: `WOTOWOTO-TV/src/pages/Home.jsx`
- Details: `WOTOWOTO-TV/src/pages/Details.jsx`
- Player: `WOTOWOTO-TV/src/pages/Player.jsx`
- TMDB API: `WOTOWOTO-TV/src/api/tmdb.js`
- Favorites/Progress: `WOTOWOTO-TV/src/hooks/useFavorites.js`, `WOTOWOTO-TV/src/hooks/useProgress.js`
- Auth + Settings: `WOTOWOTO-TV/src/context/AuthContext.jsx`, `WOTOWOTO-TV/src/hooks/useSettings.js`

**Notes & Limitations**
- No server backend; accounts are client‑side only (localStorage)
- TMDB provides metadata/posters, not streams; playback uses external embeds
- Replace image placeholders in `WOTOWOTO-TV/src/assets` as needed
