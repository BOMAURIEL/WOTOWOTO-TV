import { useState, useEffect } from "react";

export function useProgress() {
  const [progressList, setProgressList] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("progressList")) || [];
    setProgressList(saved);
  }, []);

  const saveProgress = (item, position) => {
    const updated = [
      ...progressList.filter((p) => p.id !== item.id),
      { ...item, progress: position },
    ];
    setProgressList(updated);
    localStorage.setItem("progressList", JSON.stringify(updated));
  };

  return { progressList, saveProgress };
}
