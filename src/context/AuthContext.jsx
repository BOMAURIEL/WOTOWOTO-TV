import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const AuthContext = createContext({ user: null, login: () => {}, logout: () => {} });

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("auth:user");
      if (saved) setUser(JSON.parse(saved));
    } catch {}
  }, []);

  const login = (username) => {
    const u = { username: String(username || "").trim() || "guest" };
    setUser(u);
    try { localStorage.setItem("auth:user", JSON.stringify(u)); } catch {}
  };

  const logout = () => {
    setUser(null);
    try { localStorage.removeItem("auth:user"); } catch {}
  };

  const value = useMemo(() => ({ user, login, logout }), [user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}

