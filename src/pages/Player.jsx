import React, { useRef, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useProgress } from "../hooks/useProgress";

export default function Player() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { saveProgress } = useProgress();

  const srcParam = params.get("src");
  const title = params.get("title") || "Now Playing";
  const id = params.get("id") || srcParam || "unknown";
  const mediaType = params.get("mediaType");
  const tmdbId = params.get("tmdbId");
  const season = params.get("season");
  const episode = params.get("episode");

  const iframeRef = useRef(null);

  useEffect(() => {
    const handleMessage = (event) => {
      try {
        const allowedOrigins = ["https://www.vidking.net", "https://vidking.net"]; // adjust if you add more providers
        if (!allowedOrigins.includes(event.origin)) return;
        if (!iframeRef.current || event.source !== iframeRef.current.contentWindow) return;

        const data = typeof event.data === "string" ? JSON.parse(event.data) : event.data;
        if (data?.data?.event === "timeupdate") {
          const position = data.data.currentTime;
          const duration = data.data.duration;
          saveProgress({ id, title, thumbnail: "", type: mediaType || "movie", source: finalSrc }, position, duration);
        }
      } catch (_) {}
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [id, title, mediaType, finalSrc]);
  
  const finalSrc = React.useMemo(() => {
    if (srcParam) return srcParam;
    if (tmdbId && mediaType === 'movie') {
      return `https://www.vidking.net/embed/movie/${tmdbId}`;
    }
    if (tmdbId && mediaType === 'tv') {
      const s = season || '1';
      const e = episode || '1';
      return `https://www.vidking.net/embed/tv/${tmdbId}/${s}/${e}`;
    }
    return "";
  }, [srcParam, tmdbId, mediaType, season, episode]);

  return (
    <div className="bg-black min-h-screen text-white">
      <Navbar
        query={""}
        setQuery={() => {}}
        onSearch={() => {}}
        onToggleFavorites={() => navigate("/")}
      />
      <div className="pt-20 px-4 pb-6 max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-xl font-semibold truncate">{title}</h1>
          <button onClick={() => navigate(-1)} className="bg-red-600 px-3 py-1 rounded-lg">Back</button>
        </div>
        {finalSrc ? (
          <div className="w-full bg-black rounded-lg overflow-hidden">
            <iframe
              ref={iframeRef}
              src={finalSrc}
              width="100%"
              height="600"
              allowFullScreen
              frameBorder="0"
              title={title}
            />
          </div>
        ) : (
          <div className="text-gray-400">No source provided.</div>
        )}
      </div>
    </div>
  );
}
