import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "../../components/layout/Sidebar";
import StatCard from "../../components/common/StatCard";
import MitraOffers from "../../components/mitra/MitraOffers";
import MitraOrders from "../../components/mitra/MitraOrders";
import { Wheat, Briefcase, ShoppingBag, Clock } from "lucide-react";
import api from "../../config/axios";

export default function MitraDashboardPage() {
  const location = useLocation();
  const role = location.pathname.startsWith('/nelayan') ? 'nelayan' : 'petani';
  const RoleLabel = role === 'nelayan' ? 'Nelayan' : 'Petani';

  const [stats, setStats] = useState({
    totalHasilPanen: "0 KG",
    pendapatan: "Rp 0",
    produkAktif: "0",
    produkHampirKadaluarsa: "0"
  });
  const [latestOffers, setLatestOffers] = useState([]);
  const [latestOrders, setLatestOrders] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await api.get(`/dashboard/${role}`);
        setStats(response.data.stats);
        setLatestOffers(response.data.latestOffers);
        setLatestOrders(response.data.latestOrders);
      } catch (err) {
        console.error("Gagal mengambil data dashboard:", err);
      }
    };

    fetchDashboardData();
  }, []);

  const dashboardMetrics = [
    { title: "Hasil Panen", value: stats.totalHasilPanen, subtitle: "Total bulan ini", icon: Wheat, accent: "from-green-600 to-green-500" },
    { title: "Pendapatan", value: stats.pendapatan, subtitle: "Total bulan ini", icon: Briefcase, accent: "from-blue-600 to-blue-500" },
    { title: "Produk Aktif", value: stats.produkAktif, subtitle: "Produk", icon: ShoppingBag, accent: "from-orange-500 to-orange-400" },
    { title: "Produk Hampir Kadaluarsa", value: stats.produkHampirKadaluarsa, subtitle: "Produk", icon: Clock, accent: "from-red-600 to-red-500" },
  ];
  return (
    <div className="min-h-screen bg-white font-[Montserrat] text-slate-900">
      <div className="flex w-full min-h-screen p-4 pl-[304px]">
        <Sidebar />

        {/* Outer Container Wrapper */}
        <div className="flex-1 bg-[rgba(222,236,225,0.19)] border border-[rgba(0,154,38,0.19)] rounded-[20px] p-8 relative">
          {/* Top Header */}
          <div className="flex items-end justify-between border-b border-[#029154] pb-2 mb-6">
            <div>
              <h2 className="text-[24px] font-semibold text-[#005941]">
                Dashboard {RoleLabel}
              </h2>
              <p className="text-[14px] text-slate-500">
                Ringkasan aktivitas dan performa penjualan Anda
              </p>
            </div>
            <div className="flex items-center gap-4 translate-y-[4px]">
              <img
                src="/images/ikan1.png"
                alt="avatar"
                className="w-10 h-10 rounded-full border border-slate-100 object-cover"
              />
            </div>
          </div>

          {/* Banner Halo Selamat Datang */}
          <div className="mb-6 rounded-[20px] bg-gradient-to-r from-[#0B5F73] via-[#0A7B57] to-[#9BD63A] p-6 text-white flex items-center justify-between overflow-hidden relative shadow-sm">
            <div className="z-10 max-w-[60%]">
              <p className="text-[15px] font-medium opacity-90">
                Halo, Selamat Datang
              </p>
              <h1 className="text-[28px] font-bold mt-1 mb-2 leading-tight">
                Budi Santoso!
              </h1>
              <p className="text-[14px] opacity-80 leading-relaxed">
                Kelola hasil panen dan tingkatkan pendapatan anda bersama
                JALA.
              </p>
            </div>

            {/* Karakter / Ilustrasi Mitra */}
            <div className="absolute right-4 bottom-0 h-full flex items-end pointer-events-none drop-shadow-xl">
              <img
                src={`/images/${role}-banner.png`}
                alt={`${RoleLabel} Banner`}
                className="h-[90%] md:h-[100%] object-contain object-bottom"
                onError={(e) => {
                  // Fallback jika file gambar belum ada
                  e.target.style.display = "none";
                }}
              />
            </div>
          </div>

          {/* Stat Cards Container */}
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-6">
            {dashboardMetrics.map((m) => (
              <StatCard key={m.title} {...m} />
            ))}
          </div>

          {/* Offers & Orders Grid Section */}
          <div className="grid gap-6 lg:grid-cols-2">
            <MitraOffers offers={latestOffers} />
            <MitraOrders orders={latestOrders} />
          </div>
        </div>
      </div>
    </div>
  );
}
