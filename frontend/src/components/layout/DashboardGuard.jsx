import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useUserContext } from "../../context/userContextBase";
import ProfileCompletionModal from "../common/ProfileCompletionModal";
import { checkProfileComplete, ROLE_HOME } from "../../config/profileRules";

export default function DashboardGuard({ allowedRoles }) {
  const { user, setUser, refreshUser } = useUserContext();
  const [status, setStatus] = useState("loading");
  const [verified, setVerified] = useState(false);

  // Verifikasi awal: pastikan data user terbaru diambil dari server sekali.
  useEffect(() => {
    let active = true;
    const run = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        if (active) setStatus("unauthenticated");
        return;
      }

      // Pakai cache dulu untuk render cepat, lalu verifikasi ke server.
      if (!user) {
        const fresh = await refreshUser();
        if (!active) return;
        if (!fresh) {
          setStatus("unauthenticated");
          return;
        }
      }
      if (active) setVerified(true);
    };
    run();
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Tentukan status setiap kali user / roles berubah.
  useEffect(() => {
    if (!verified || !user) return;
    // Komputasi status dilakukan di effect karena bergantung hasil verifikasi.
    if (allowedRoles && !allowedRoles.includes(user.role)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setStatus("unauthorized");
    } else if (checkProfileComplete(user)) {
      setStatus("complete");
    } else {
      setStatus("incomplete");
    }
  }, [verified, user, allowedRoles]);

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