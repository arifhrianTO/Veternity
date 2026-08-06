import { useState, useEffect } from "react";
import { Leaf, Sailboat, ShoppingBag, ShoppingCart, Store } from "lucide-react";
import api from "../../config/axios";

const statConfig = [
  { key: "petani", icon: Leaf, label: "Petani Terdaftar", iconBg: "bg-emerald-100 text-emerald-600", valueColor: "text-emerald-700" },
  { key: "nelayan", icon: Sailboat, label: "Nelayan Terdaftar", iconBg: "bg-blue-100 text-blue-600", valueColor: "text-blue-700" },
  { key: "produk", icon: ShoppingBag, label: "Produk Terdaftar", iconBg: "bg-orange-100 text-orange-600", valueColor: "text-orange-600" },
  { key: "transaksi", icon: ShoppingCart, label: "Transaksi Sukses", iconBg: "bg-purple-100 text-purple-600", valueColor: "text-purple-700" },
  { key: "koperasi", icon: Store, label: "Koperasi Mitra", iconBg: "bg-red-100 text-red-500", valueColor: "text-red-600" },
];

const formatNumber = (val) =>
  typeof val === "number" ? val.toLocaleString("id-ID") : Number(val || 0).toLocaleString("id-ID");

export default function StatsBar() {
  const [stats, setStats] = useState({ petani: 0, nelayan: 0, produk: 0, transaksi: 0, koperasi: 0 });

  useEffect(() => {
    api
      .get("/home/stats")
      .then((res) => {
        if (res.data?.data) setStats(res.data.data);
      })
      .catch((err) => console.error("Gagal mengambil statistik:", err));
  }, []);

  return (
    <section className="relative z-20 max-w-7xl mx-auto px-6 -mt-10 mb-16">
      <div className="rounded-2xl border border-slate-100 shadow-sm bg-white px-6 py-6 flex flex-wrap justify-between gap-6">
        {statConfig.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.key} className="flex items-center gap-3">
              <div className={`w-11 h-11 rounded-full flex items-center justify-center ${s.iconBg}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <div className={`text-xl font-extrabold ${s.valueColor}`}>
                  {formatNumber(stats[s.key])}
                </div>
                <div className="text-xs text-slate-400 whitespace-nowrap">{s.label}</div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
