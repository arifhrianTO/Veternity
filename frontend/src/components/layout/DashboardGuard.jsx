import { useState, useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";
import api from "../../config/axios";
import ProfileCompletionModal from "../common/ProfileCompletionModal";

/**
 * Mapping field wajib per role.
 * Field yang tidak ada di sini = tidak wajib untuk role tersebut.
 */
const REQUIRED_FIELDS_BY_ROLE = {
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
 * Dipakai saat user akses route yang bukan milik role-nya.
 */
const ROLE_HOME = {
  petani: "/petani/dashboard",
  petani_binaan: "/petani/dashboard",
  nelayan: "/nelayan/dashboard",
  nelayan_binaan: "/nelayan/dashboard",
  koperasi: "/koperasi/dashboard",
  admin: "/admin/dashboard",
  pembeli: "/pembeli/marketplace",
};

export default function DashboardGuard({ allowedRoles }) {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState("loading"); // loading | unauthenticated | unauthorized | incomplete | complete
  const location = useLocation();

  const checkCompleteness = (userData) => {
    if (!userData) return false;

    const requiredFields = REQUIRED_FIELDS_BY_ROLE[userData.role] || [];

    for (const field of requiredFields) {
      if (!userData[field]) {
        return false;
      }
    }

    return true;
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setStatus("unauthenticated");
      return;
    }

    const fetchUser = async () => {
      try {
        const response = await api.get("/user");
        const userData = response.data;
        setUser(userData);

        // Cek role dulu sebelum cek completeness
        if (allowedRoles && !allowedRoles.includes(userData.role)) {
          setStatus("unauthorized");
          return;
        }

        if (checkCompleteness(userData)) {
          setStatus("complete");
        } else {
          setStatus("incomplete");
        }
      } catch (err) {
        console.error("Gagal verifikasi auth user", err);
        setStatus("unauthenticated");
      }
    };

    fetchUser();
  }, [location.pathname]);

  const handleProfileComplete = (updatedUser) => {
    setUser(updatedUser);
    setStatus("complete");
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center font-['Montserrat']">
        <Loader2 className="w-10 h-10 animate-spin text-[#006638]" />
        <span className="text-slate-500 text-sm mt-3 font-semibold">Memuat profil...</span>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return <Navigate to="/login" replace />;
  }

  // Redirect ke halaman sesuai role user jika akses route yang bukan haknya
  if (status === "unauthorized") {
    const homePath = ROLE_HOME[user?.role] || "/";
    return <Navigate to={homePath} replace />;
  }

  return (
    <>
      {status === "incomplete" && (
        <ProfileCompletionModal user={user} onComplete={handleProfileComplete} />
      )}
      <Outlet context={{ user }} />
    </>
  );
}

// Export supaya bisa dipakai di ProfileCompletionModal
export { REQUIRED_FIELDS_BY_ROLE };
