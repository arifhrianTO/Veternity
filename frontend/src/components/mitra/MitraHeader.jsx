import { storageUrl } from "../../config/storage";
import { useUser } from "../../hooks/useUser";

export default function MitraHeader() {
  const user = useUser();
  const nama = user?.nama_lengkap || "Mitra";
  const avatar = storageUrl(user?.foto_profil, "/images/ikan1.png");

  return (
    <header className="bg-gradient-to-r from-[#024D70] to-[#ABE147] rounded-2xl p-6 text-white flex items-center justify-between">
      <div>
        <p className="text-sm font-medium opacity-90">Halo, Selamat Datang</p>
        <h1 className="text-2xl font-bold">{nama}!</h1>
        <p className="text-sm opacity-90">Kelola hasil panen dan tingkatkan pendapatan anda bersama JALA.</p>
      </div>

      <div className="flex items-center gap-4">
        <div className="bg-white rounded-full p-1">
          <img
            src={avatar}
            alt={nama}
            className="w-12 h-12 rounded-full object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/images/ikan1.png";
            }}
          />
        </div>
      </div>
    </header>
  );
}