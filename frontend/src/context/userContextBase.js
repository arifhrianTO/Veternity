import { createContext, useContext } from "react";

export const UserContext = createContext(null);

export function useUserContext() {
  const ctx = useContext(UserContext);
  if (!ctx) {
    throw new Error("useUserContext harus dipakai di dalam UserProvider");
  }
  return ctx;
}

export const CACHE_KEY = "current_user";
export const GUARD_KEY = "guard_user";