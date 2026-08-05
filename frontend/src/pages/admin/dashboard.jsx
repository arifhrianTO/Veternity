import Sidebar from "../../components/layout/Sidebar";
import StatCard from "../../components/common/StatCard";
import { Users, Tag, ShoppingBag, Briefcase } from "lucide-react";

const adminMetrics = [
  {
    title: "Total Pengguna",
    value: "56",
    subtitle: "Pengguna aktif",
    accent: "from-[#029154] to-[#00B467]",
    icon: Users,
  },
  {
    title: "Total Kategori",
    value: "24",
    subtitle: "Kategori produk",
    accent: "from-[#028391] to-[#00B1B4]",
    icon: Tag,
  },
  {
    title: "Produk Aktif",
    value: "5",
    subtitle: "Produk",
    accent: "from-[#FF7700] to-[#FFB619]",
    icon: ShoppingBag,
  },
  {
    title: "Total Penjualan",
    value: "Rp 4.000.000",
    subtitle: "Total bulan ini",
    accent: "from-[#0646C7] to-[#001FEC]",
    icon: Briefcase,
  },
];

export default function AdminDashboardPage() {
  return (
    <div className="min-h-screen bg-white font-['Montserrat'] text-slate-900">
      <div className="flex w-full min-h-screen p-4 pl-[304px]">
        
        {/* Sidebar Admin */}
        <Sidebar />

          {/* Outer Container Wrapper */}
          <div className="flex-1 bg-[rgba(222,236,225,0.19)] border border-[rgba(0,154,38,0.19)] rounded-[20px] p-8 relative">
            
            {/* Top Header */}
            <div className="flex items-end justify-between border-b border-[#029154] pb-2 mb-6">
              <div>
                <h2 className="text-[24px] font-semibold text-[#005941]">Dashboard Admin</h2>
                <p className="text-[14px] text-slate-500">Kelola pengguna, kategori, dan pemantauan transaksi platform</p>
              </div>
              <div className="flex items-center gap-4 translate-y-[4px]">
                <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-100 translate-y-[4px]">
                  <img 
                    src="/images/ikan1.png" 
                  alt="Admin Avatar" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/images/user.png";
                  }} 
                />
              </div>
            </div>
          </div>

          {/* Banner Halo Selamat Datang */}
          <div className="mb-6 rounded-[20px] bg-gradient-to-r from-[#005941] via-[#008A1E] to-[#8AD035] p-6 text-white flex items-center justify-between overflow-hidden relative shadow-sm">
            <div className="z-10 max-w-[60%]">
              <p className="text-[15px] font-medium opacity-90">Halo, Selamat Datang</p>
              <h1 className="text-[28px] font-bold mt-1 mb-2 leading-tight">Admin</h1>
              <p className="text-[14px] opacity-80 leading-relaxed">
                Kelola produk petani dan nelayan binaan bersama JALA.
              </p>
            </div>

            {/* Karakter / Ilustrasi Admin */}
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
              <h3 className="text-[20px] font-semibold text-[#005941] mb-6">Grafik Transaksi</h3>
             
            </div>

            {/* Kategori Terlaris */}
            <div className="lg:col-span-5 bg-white border border-[#029154] shadow-[0_0_4px_rgba(0,0,0,0.25)] rounded-[20px] p-6 min-h-[473px]">
              <h3 className="text-[20px] font-semibold text-[#005941] mb-6">Kategori terlaris</h3>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
