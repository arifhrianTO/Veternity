import { useUserContext } from "../context/userContextBase";

/**
 * Hook profil user terpusat.
 * Semua komponen membaca dari satu context yang sama sehingga perubahan
 * profil langsung tercermin di seluruh halaman tanpa reload.
 */
export function useUser() {
  return useUserContext().user;
}

export const clearUserCache = () => {
  sessionStorage.removeItem("current_user");
  sessionStorage.removeItem("guard_user");
  localStorage.removeItem("user");
};