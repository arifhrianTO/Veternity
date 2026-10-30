// Helper URL file storage terpusat.
// Origin diturunkan dari VITE_API_BASE_URL agar otomatis mengikuti environment
// (lokal maupun production) tanpa hardcode localhost.
const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";
const STORAGE_ORIGIN = API_BASE.replace(/\/api\/?$/, "");

/**
 * Bangun URL publik untuk file di storage Laravel.
 * - null/undefined  -> fallback
 * - URL absolut / path /images  -> dipakai apa adanya
 * - path relatif storage         -> `${origin}/storage/${path}`
 */
export function storageUrl(path, fallback = "/images/user.png") {
  if (!path) return fallback;
  if (path.startsWith("http") || path.startsWith("/images")) return path;
  return `${STORAGE_ORIGIN}/storage/${path}`;
}

export { STORAGE_ORIGIN };