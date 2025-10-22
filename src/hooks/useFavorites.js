import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

export function useFavorites() {
  const { user } = useAuth();
  const storageKey = user?.username ? `favorites:${user.username}` : "favorites:guest";
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey)) || [];
      setFavorites(saved);
    } catch {
      setFavorites([]);
    }
  }, [storageKey]);

  const toggleFavorite = (item) => {
    let updated;
    if (favorites.some((fav) => fav.id === item.id)) {
      updated = favorites.filter((fav) => fav.id !== item.id);
    } else {
      updated = [...favorites, item];
    }
    setFavorites(updated);
    try { localStorage.setItem(storageKey, JSON.stringify(updated)); } catch {}
  };

  return { favorites, toggleFavorite };
}
