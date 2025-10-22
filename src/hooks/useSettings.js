import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

export function useSettings() {
  const { user } = useAuth();
  const storageKey = user?.username ? `settings:${user.username}` : "settings:guest";
  const [settings, setSettings] = useState({ subtitles: "en" });

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey));
      if (saved) setSettings(saved);
    } catch {}
  }, [storageKey]);

  const update = (patch) => {
    const next = { ...settings, ...patch };
    setSettings(next);
    try { localStorage.setItem(storageKey, JSON.stringify(next)); } catch {}
  };

  return { settings, update };
}

