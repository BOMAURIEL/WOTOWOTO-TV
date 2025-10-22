import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

export function useProgress() {
  const { user } = useAuth();
  const storageKey = user?.username ? `progressList:${user.username}` : "progressList:guest";
  const [progressList, setProgressList] = useState([]);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey)) || [];
      setProgressList(saved);
    } catch {
      setProgressList([]);
    }
  }, [storageKey]);

  const saveProgress = (item, position, totalDuration) => {
    const progress = Number(position) || 0;
    const total = Number(totalDuration);
    const progressPercent = Number.isFinite(total) && total > 0 ? Math.min(100, Math.max(0, Math.round((progress / total) * 100))) : undefined;
    const updated = [
      ...progressList.filter((p) => p.id !== item.id),
      { ...item, progress, totalDuration: Number.isFinite(total) ? total : undefined, progressPercent },
    ];
    setProgressList(updated);
    try { localStorage.setItem(storageKey, JSON.stringify(updated)); } catch {}
  };

  return { progressList, saveProgress };
}
