import { useEffect, useState } from "react";
import Sidebar from "../../components/layout/Sidebar";
import api from "../../config/axios";
import { Wheat, Fish, ShoppingBag, Wallet } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const fallbackSales = [
  { bulan: "Agu", penjualan: 1.8 },
  { bulan: "Sep", penjualan: 2.4 },
  { bulan: "Okt", penjualan: 2.1 },
  { bulan: "Nov", penjualan: 3.2 },
  { bulan: "Des", penjualan: 2.8 },
  { bulan: "Jan", penjualan: 3.6 },
  { bulan: "Feb", penjualan: 4.0 },
];

const fallbackBestSellers = [
  { id: 1, nama: "Beras Premium", qty: 50, total: "Rp 2.500.000", image: "/images/beras.png" },
  { id: 2, nama: "Ikan Tuna", qty: 25, total: "Rp 1.800.000", image: "/images/ikan.png" },
  { id: 3, nama: "Cabai Rawit", qty: 10, total: "Rp 800.000", image: "/images/beras.png" },
  { id: 4, nama: "Tomat Segar", qty: 30, total: "Rp 600.000", image: "/images/beras.png" },
  { id: 5, nama: "Wortel", qty: 20, total: "Rp 400.000", image: "/images/beras.png" },
];

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
  const [salesData, setSalesData] = useState(fallbackSales);
  const [bestSellers, setBestSellers] = useState(fallbackBestSellers);

  useEffect(() => {
    let active = true;
    api
      .get("/dashboard/koperasi")
      .then((res) => {
        if (!active) return;
        const { stats, grafikPenjualan, penjualanTerbaik } = res.data || {};
        if (stats) setStats(stats);
        if (Array.isArray(grafikPenjualan) && grafikPenjualan.length > 0) {
          setSalesData(grafikPenjualan);
        }
        if (Array.isArray(penjualanTerbaik) && penjualanTerbaik.length > 0) {
          setBestSellers(penjualanTerbaik);
        }
      })
      .catch(() => {
        // Biarkan data fallback jika API gagal
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

          {/* Header Panel */}
          <div className="flex items-end justify-between border-b border-[#029154] pb-2 mb-6">
            <div>
              <h1 className="text-[24px] font-semibold text-[#005941]">Dashboard</h1>
              <p className="text-[14px] text-slate-500">
                Ringkasan aktivitas dan performa koperasi Anda
              </p>
            </div>
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center overflow-hidden border border-red-200 translate-y-[4px]">
              <img
                src="/images/user.png"
                alt="Avatar"
                className="w-full h-full object-cover"
                onError={avatarFallback}
              />
            </div>
          </div>

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
                Kelola produk petani dan nelayan binaan bersama TaniNelayan.
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

          {/* Stat Cards Grid (4 Cards) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {dashboardMetrics.map((m) => {
              const Icon = m.icon;
              return (
                <div key={m.title} className="bg-white rounded-[16px] border border-slate-100 shadow-[0_0_4px_rgba(0,0,0,0.25)] p-4 flex items-center justify-between gap-4">
                  <div>
                    <div className="text-[12px] font-medium text-[#004734]/60">{m.title}</div>
                    <div className="text-xl font-bold text-[#273B4A] my-0.5">{m.value}</div>
                    <div className="text-[11px] font-medium text-[#004734]/60">{m.subtitle}</div>
                  </div>
                  <div className={`w-11 h-11 rounded-full bg-gradient-to-b ${m.accent} flex items-center justify-center text-white shadow-md flex-shrink-0`}>
                    <Icon className="w-5 h-5" />
                  </div>
                </div>
              );
            })}
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

        </div>
      </div>
    </div>
  );
}
