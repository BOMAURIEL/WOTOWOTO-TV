import React, { useEffect, useRef } from "react";

export default function PlayerModal({ movie, onClose, onProgressSave }) {
  if (!movie) return null;

  const iframeRef = useRef(null);

  useEffect(() => {
    const handleMessage = (event) => {
      try {
        const allowedOrigins = ["https://www.vidking.net", "https://vidking.net"];
        if (!allowedOrigins.includes(event.origin)) return;
        if (!iframeRef.current || event.source !== iframeRef.current.contentWindow) return;

        const data = typeof event.data === "string" ? JSON.parse(event.data) : event.data;
        if (data?.data?.event === "timeupdate") {
          const position = data.data.currentTime;
          onProgressSave(movie, position);
        }
      } catch (_) {}
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [movie]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
      <div className="w-full max-w-4xl bg-black rounded-lg overflow-hidden">
        <iframe
          ref={iframeRef}
          src={movie.source}
          width="100%"
          height="500"
          allowFullScreen
          frameBorder="0"
          title={movie.title}
        ></iframe>
      </div>
      <button
        onClick={onClose}
        className="absolute top-5 right-5 bg-red-600 px-3 py-1 rounded-lg text-white"
      >
        ✕
      </button>
    </div>
  );
}
