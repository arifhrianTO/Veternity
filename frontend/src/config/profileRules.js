/**
 * Mapping field wajib per role.
 * Field yang tidak ada di sini = tidak wajib untuk role tersebut.
 */
export const REQUIRED_FIELDS_BY_ROLE = {
  admin: ["foto_profil"],
  koperasi: ["foto_profil", "nik", "rekening", "provinsi_id", "kota_id", "kode_pos"],
  petani: ["foto_profil", "nik", "rekening", "provinsi_id", "kota_id", "kode_pos"],
  nelayan: ["foto_profil", "nik", "rekening", "provinsi_id", "kota_id", "kode_pos"],
  petani_binaan: ["foto_profil", "nik", "rekening", "provinsi_id", "kota_id", "kode_pos", "koperasi_id"],
  nelayan_binaan: ["foto_profil", "nik", "rekening", "provinsi_id", "kota_id", "kode_pos", "koperasi_id"],
  pembeli: ["foto_profil", "provinsi_id", "kota_id", "kode_pos"],
};

/**
 * Mapping role → home redirect path.
 */
export const ROLE_HOME = {
  petani: "/petani/dashboard",
  petani_binaan: "/petani/dashboard",
  nelayan: "/nelayan/dashboard",
  nelayan_binaan: "/nelayan/dashboard",
  koperasi: "/koperasi/dashboard",
  admin: "/admin/dashboard",
  pembeli: "/pembeli/marketplace",
};

export function checkProfileComplete(userData) {
  if (!userData) return false;
  const requiredFields = REQUIRED_FIELDS_BY_ROLE[userData.role] || [];
  return requiredFields.every((field) => Boolean(userData[field]));
}