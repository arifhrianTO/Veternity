import { useState, useEffect } from "react";
import api from "../config/axios";

const CACHE_KEY = "current_user";

export function useUser() {
  const [user, setUser] = useState(() => {
    try {
      // Coba cache current_user dulu
      const cached = sessionStorage.getItem(CACHE_KEY);
      if (cached) return JSON.parse(cached);
      // Fallback ke cache dari DashboardGuard
      const guardCached = sessionStorage.getItem("guard_user");
      if (guardCached) return JSON.parse(guardCached);
      return null;
    } catch (error) {
      return null;
    }
  });

  useEffect(() => {
    if (user) return;

    let active = true;
    api
      .get("/user")
      .then((response) => {
        if (active) {
          setUser(response.data);
          sessionStorage.setItem(CACHE_KEY, JSON.stringify(response.data));
        }
      })
      .catch((error) => {
        console.error("Gagal mengambil user:", error);
      });
    return () => {
      active = false;
    };
  }, [user]);

  return user;
}

export const clearUserCache = () => {
  sessionStorage.removeItem(CACHE_KEY);
};
