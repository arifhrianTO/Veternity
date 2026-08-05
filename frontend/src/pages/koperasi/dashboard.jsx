import { useEffect, useState } from "react";
import Sidebar from "../../components/layout/Sidebar";
import PageHeader from "../../components/layout/PageHeader";
import StatCard from "../../components/common/StatCard";
import api from "../../config/axios";
import { Wheat, Fish, ShoppingBag, Wallet, Loader2 } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const avatarFallback = (e) => {
  e.target.onerror = null;
  e.target.src = "/images/user.png";
};

const productImageFallback = (e) => {
  e.target.onerror = null;
  e.target.src = "/images/beras.png";
};

export default function KoperasiDashboard() {
  const [userName] = useState(() => {
    try {
      const raw = localStorage.getItem("user");
      if (raw) {
        const user = JSON.parse(raw);
        return user.nama_lengkap || "Koperasi Sejahtera";
      }
    } catch {
      // abaikan jika data user tidak valid
    }
    return "Koperasi Sejahtera";
  });

  const [stats, setStats] = useState({
    petaniBinaan: "0",
    nelayanBinaan: "0",
    produkAktif: "0",
    totalPenjualan: "Rp 0",
  });
  const [salesData, setSalesData] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    api
      .get("/dashboard/koperasi")
      .then((res) => {
        if (!active) return;
        const { stats, grafikPenjualan, penjualanTerbaik } = res.data || {};
        if (stats) setStats(stats);
        if (Array.isArray(grafikPenjualan)) {
          setSalesData(grafikPenjualan);
        }
        if (Array.isArray(penjualanTerbaik)) {
          setBestSellers(penjualanTerbaik);
        }
      })
      .catch(() => {
        // Biarkan kosong
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const dashboardMetrics = [
    { title: "Petani Binaan", value: stats.petaniBinaan, subtitle: "Total petani binaan", icon: Wheat, accent: "from-[#029154] to-[#00B467]" },
    { title: "Nelayan Binaan", value: stats.nelayanBinaan, subtitle: "Total nelayan binaan", icon: Fish, accent: "from-[#028391] to-[#00B1B4]" },
    { title: "Produk Aktif", value: stats.produkAktif, subtitle: "Produk", icon: ShoppingBag, accent: "from-[#FF7700] to-[#FFB619]" },
    { title: "Total Penjualan", value: stats.totalPenjualan, subtitle: "Total bulan ini", icon: Wallet, accent: "from-[#0646C7] to-[#001FEC]" },
  ];

  const bestSellersMapped = bestSellers.map((item, idx) => ({
    id: item.id ?? idx,
    name: item.nama || item.name || "Produk",
    weight: item.qty ? `${item.qty} kg terjual` : item.total || "Terjual",
    image: "/images/beras.png",
  }));

  return (
    <div className="min-h-screen bg-white font-['Montserrat'] text-slate-900">
      <div className="flex w-full min-h-screen p-4 pl-[304px]">

        {/* Sidebar Koperasi */}
        <Sidebar />

        {/* Outer Main Container */}
        <div className="flex-1 bg-[rgba(222,236,225,0.19)] border border-[rgba(0,154,38,0.19)] rounded-[20px] p-8 relative">

          <PageHeader title="Dashboard" subtitle="Ringkasan aktivitas dan performa koperasi Anda" />

          {/* Banner Welcome Card */}
          <div className="relative w-full bg-gradient-to-r from-[#024D70] via-[#017B46] to-[#ABE147] rounded-[20px] p-6 text-white flex justify-between items-center overflow-hidden mb-6 shadow-sm">
            <div className="z-10 max-w-[60%]">
              <h3 className="text-[16px] font-semibold leading-tight">
                Halo, Selamat Datang
              </h3>
              <h2 className="text-[26px] font-bold leading-tight my-1">
                {userName}!
              </h2>
              <p className="text-[14px] font-medium text-white/80 max-w-[420px]">
                Kelola produk petani dan nelayan binaan bersama JALA.
              </p>
            </div>

            {/* Karakter / Ilustrasi Koperasi */}
            <div className="absolute right-4 bottom-0 h-full flex items-end pointer-events-none drop-shadow-xl">
              <img
                src="/images/koperasi.png"
                alt="Koperasi Banner"
                className="h-[90%] md:h-[100%] object-contain object-bottom"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20 text-[#006638]">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
          ) : (
            <>
              {/* Stat Cards Grid (4 Cards) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {dashboardMetrics.map((m) => (
                  <StatCard key={m.title} {...m} />
                ))}
              </div>

              {/* Section Bawah: Grafik & Penjualan Terbaik */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

            {/* Grafik Penjualan Panel */}
            <div className="lg:col-span-8 bg-white border border-[#029154] rounded-[20px] p-6 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-[18px] font-semibold text-[#005941]">
                  Grafik penjualan
                </h2>
                <button className="text-sm text-[#006638] font-semibold hover:underline">Lihat semua+</button>
              </div>
              <div className="w-full flex-1 min-h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={salesData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorPenjualan" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#029154" stopOpacity={0.35} />
                        <stop offset="95%" stopColor="#029154" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                    <XAxis dataKey="bulan" tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} />
                    <Tooltip
                      formatter={(value) => [`Rp ${value} jt`, "Penjualan"]}
                      contentStyle={{ borderRadius: 10, border: "1px solid #e2e8f0", fontSize: 13 }}
                    />
                    <Area
                      type="monotone"
                      dataKey="penjualan"
                      stroke="#029154"
                      strokeWidth={2}
                      fill="url(#colorPenjualan)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Penjualan Terbaik Panel */}
            <div className="lg:col-span-4 bg-white border border-[#029154] rounded-[20px] p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-[18px] font-semibold text-[#005941]">
                  Penjualan terbaik
                </h2>
                <button className="text-sm text-[#006638] font-semibold hover:underline">Lihat semua+</button>
              </div>
              <div className="space-y-3">
                {bestSellersMapped.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 p-2.5 rounded-xl bg-white border border-slate-100 shadow-sm">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-[64px] h-[44px] object-cover rounded-[5px] border border-slate-100"
                      onError={productImageFallback}
                    />
                    <div className="flex flex-col">
                      <span className="font-semibold text-[14px] text-[#273B4A]">
                        {item.name}
                      </span>
                      <span className="font-semibold text-[13px] text-black/40">
                        {item.weight}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
          </>
          )}

        </div>
      </div>
    </div>
  );
}
