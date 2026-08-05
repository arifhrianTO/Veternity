import { useState, useEffect } from "react";
import Sidebar from "../../components/layout/Sidebar";
import PageHeader from "../../components/layout/PageHeader";
import StatCard from "../../components/common/StatCard";
import { Users, Tag, ShoppingBag, Briefcase, Loader2 } from "lucide-react";
import api from "../../config/axios";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useUser } from "../../hooks/useUser";

export default function AdminDashboardPage() {
  const user = useUser();
  const [stats, setStats] = useState({
    total_pengguna: "0",
    total_kategori: "0",
    produk_aktif: "0",
    total_penjualan: "Rp 0"
  });
  const [grafik, setGrafik] = useState([]);
  const [topCategories, setTopCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/dashboard/admin")
      .then(res => {
        if (res.data) {
          if (res.data.stats) setStats(res.data.stats);
          if (res.data.grafik_transaksi) setGrafik(res.data.grafik_transaksi); // Data dari backend sudah urut terlama ke terbaru
          if (res.data.kategori_terlaris) setTopCategories(res.data.kategori_terlaris);
        }
      })
      .catch(err => console.error("Gagal load dashboard admin", err))
      .finally(() => setLoading(false));
  }, []);

  const adminMetrics = [
    {
      title: "Total Pengguna",
      value: stats.total_pengguna,
      subtitle: "Pengguna terdaftar",
      accent: "from-[#029154] to-[#00B467]",
      icon: Users,
    },
    {
      title: "Total Kategori",
      value: stats.total_kategori,
      subtitle: "Kategori produk",
      accent: "from-[#028391] to-[#00B1B4]",
      icon: Tag,
    },
    {
      title: "Produk Aktif",
      value: stats.produk_aktif,
      subtitle: "Produk",
      accent: "from-[#FF7700] to-[#FFB619]",
      icon: ShoppingBag,
    },
    {
      title: "Total Penjualan",
      value: stats.total_penjualan,
      subtitle: "Total bulan ini",
      accent: "from-[#0646C7] to-[#001FEC]",
      icon: Briefcase,
    },
  ];

  return (
    <div className="min-h-screen bg-white font-['Montserrat'] text-slate-900">
      <div className="flex w-full min-h-screen p-4 pl-[304px]">
        
        <Sidebar />

        <div className="flex-1 bg-[rgba(222,236,225,0.19)] border border-[rgba(0,154,38,0.19)] rounded-[20px] p-8 relative">
          
          <PageHeader title="Dashboard Admin" subtitle="Kelola pengguna, kategori, dan pemantauan transaksi platform" />

          {/* Banner Halo Selamat Datang */}
          <div className="mb-6 rounded-[20px] bg-gradient-to-r from-[#005941] via-[#008A1E] to-[#8AD035] p-6 text-white flex items-center justify-between overflow-hidden relative shadow-sm">
            <div className="z-10 max-w-[60%]">
              <p className="text-[15px] font-medium opacity-90">Halo, Selamat Datang</p>
              <h1 className="text-[28px] font-bold mt-1 mb-2 leading-tight">{user?.nama_lengkap || "Admin"}</h1>
              <p className="text-[14px] opacity-80 leading-relaxed">
                Kelola produk petani dan nelayan binaan bersama JALA.
              </p>
            </div>

            <div className="absolute right-4 bottom-0 h-full flex items-end pointer-events-none drop-shadow-xl">
              <img
                src="/images/admin.png"
                alt="Admin Banner"
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
              {/* Stat Cards Container */}
              <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-6">
                {adminMetrics.map((m) => (
                  <StatCard key={m.title} {...m} />
                ))}
              </div>

              {/* Section Charts & Tables */}
              <div className="grid gap-6 lg:grid-cols-12">
                
                {/* Grafik Transaksi */}
                <div className="lg:col-span-7 bg-white border border-[#029154] shadow-[0_0_4px_rgba(0,0,0,0.25)] rounded-[20px] p-6 min-h-[473px]">
                  <h3 className="text-[20px] font-semibold text-[#005941] mb-6">Grafik Penjualan (Juta Rupiah)</h3>
                  <div className="h-[350px] w-full">
                    {grafik.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={grafik} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                          <defs>
                            <linearGradient id="colorPenjualan" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#006638" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#006638" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                          <XAxis dataKey="bulan" axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 12}} dy={10} />
                          <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 12}} />
                          <Tooltip 
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            formatter={(value) => [`Rp ${value} Juta`, 'Penjualan']}
                          />
                          <Area type="monotone" dataKey="penjualan" stroke="#006638" strokeWidth={3} fillOpacity={1} fill="url(#colorPenjualan)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="flex h-full items-center justify-center text-slate-400">Belum ada data penjualan</div>
                    )}
                  </div>
                </div>

                {/* Kategori Terlaris */}
                <div className="lg:col-span-5 bg-white border border-[#029154] shadow-[0_0_4px_rgba(0,0,0,0.25)] rounded-[20px] p-6 min-h-[473px]">
                  <h3 className="text-[20px] font-semibold text-[#005941] mb-6">Kategori terlaris</h3>
                  <div className="space-y-4">
                    {topCategories.length > 0 ? topCategories.map((cat, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-100">
                        <div>
                          <p className="font-semibold text-slate-800 text-sm">{cat.nama}</p>
                          <p className="text-xs text-slate-500">{cat.transaksi} Transaksi</p>
                        </div>
                        <span className="text-xs font-bold text-[#005941] bg-emerald-100 px-2.5 py-1 rounded-full">
                          {cat.persentase}%
                        </span>
                      </div>
                    )) : (
                      <div className="text-center py-10 text-slate-400">Belum ada kategori terlaris</div>
                    )}
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
