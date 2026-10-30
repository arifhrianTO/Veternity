import { useCallback, useEffect, useState } from "react";
import api from "../config/axios";
import { UserContext, CACHE_KEY, GUARD_KEY } from "./userContextBase";

function readInitialUser() {
  try {
    const cached = sessionStorage.getItem(CACHE_KEY) || sessionStorage.getItem(GUARD_KEY);
    return cached ? JSON.parse(cached) : null;
  } catch {
    return null;
  }
}

export function UserProvider({ children }) {
  const [user, setUserState] = useState(readInitialUser);
  const [loading, setLoading] = useState(false);

  // Simpan user ke semua cache yang dipakai aplikasi agar konsisten.
  const persist = useCallback((next) => {
    setUserState(next);
    try {
      if (next) {
        sessionStorage.setItem(CACHE_KEY, JSON.stringify(next));
        sessionStorage.setItem(GUARD_KEY, JSON.stringify(next));
        localStorage.setItem("user", JSON.stringify(next));
      } else {
        sessionStorage.removeItem(CACHE_KEY);
        sessionStorage.removeItem(GUARD_KEY);
        localStorage.removeItem("user");
      }
    } catch {
      // abaikan kegagalan storage
    }
  }, []);

  const refreshUser = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      persist(null);
      return null;
    }
    setLoading(true);
    try {
      const response = await api.get("/user");
      persist(response.data);
      return response.data;
    } catch {
      return null;
    } finally {
      setLoading(false);
    }
  }, [persist]);

  const setUser = useCallback(
    (next) => {
      if (typeof next === "function") {
        setUserState((prev) => {
          const resolved = next(prev);
          persist(resolved);
          return resolved;
        });
      } else {
        persist(next);
      }
    },
    [persist]
  );

  // Fetch sekali saat mount bila belum ada cache / untuk memastikan data terbaru.
  useEffect(() => {
    if (!localStorage.getItem("token")) return;
    // Sinkronisasi data eksternal (server) ke context saat mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refreshUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <UserContext.Provider value={{ user, loading, setUser, refreshUser }}>
      {children}
    </UserContext.Provider>
  );
}