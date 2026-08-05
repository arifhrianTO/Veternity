import { useState } from "react";
import { Search, ChevronDown, Store, Users, ArrowRight } from "lucide-react";
import { koperasiList, filters } from "../../data/mockData";

export default function KoperasiSection() {
  const [activeFilter, setActiveFilter] = useState("Semua");

  return (
    <section id="koperasi" className="max-w-7xl mx-auto px-20 pt-16 pb-20">
      <h1 className="text-3xl font-extrabold text-center mb-8 bg-gradient-to-r from-[#006638] to-[#69CA00] bg-clip-text text-transparent">
        Koperasi
      </h1>

      <div className="flex flex-col md:flex-row md:items-center gap-4 md:justify-between mb-8">
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari Koperasi..."
            className="w-full pl-10 pr-4 py-2.5 rounded-full border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-5 py-2 rounded-full text-sm font-semibold border transition-colors ${
                activeFilter === f
                  ? "bg-emerald-700 text-white border-emerald-700"
                  : "border-slate-200 text-slate-600 hover:border-emerald-400"
              }`}
            >
              {f}
            </button>
          ))}
          <button className="px-4 py-2 rounded-full border border-slate-200 text-sm font-semibold text-slate-600 inline-flex items-center gap-1 hover:border-emerald-400">
            Lokasi <ChevronDown className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
        {koperasiList.map((k, i) => (
          <div
            key={i}
            className="rounded-2xl border border-[#029154]/50 bg-[#00FF40]/[0.03] p-6 flex flex-col items-center text-center hover:shadow-sm transition-shadow"
          >
            <div
              className={`w-16 h-16 rounded-full ${k.avatar} flex items-center justify-center mb-3`}
            >
              <Store className="w-7 h-7 text-slate-500" />
            </div>
            <h4 className="font-bold text-slate-800">{k.name}</h4>
            <p className="text-xs text-slate-400 mb-2">{k.location}</p>
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold mb-3 ${k.tagColor}`}
            >
              {k.tag}
            </span>
            <span className="inline-flex items-center gap-1 text-xs text-slate-500 mb-4">
              <Users className="w-3.5 h-3.5" /> 150 anggota
            </span>
            <button className="w-full py-2 rounded-lg border border-emerald-600 text-emerald-700 text-sm font-semibold hover:bg-emerald-600 hover:text-white transition-colors">
              Lihat Detail
            </button>
          </div>
        ))}
      </div>

      <div className="flex justify-center mb-14">
        <button className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-[#029154] to-[#024D70] text-white font-semibold hover:opacity-90 transition-opacity">
          Lihat Selengkapnya <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <div className="flex justify-center">
        <div className="rounded-3xl bg-emerald-50 border border-[#00AE2B] p-8 flex flex-col sm:flex-row items-center gap-6 max-w-3xl">
          <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm">
            <Store className="w-9 h-9 text-emerald-700" />
          </div>
          <div className="text-center sm:text-left">
            <h3 className="font-bold text-lg text-[#006638] mb-1">
              Ingin Koperasi Anda Bergabung?
            </h3>
            <p className="text-sm text-[#006638] mb-4 max-w-xl">
              Bersama JALA, bantu anggota menjangkau pasar yang lebih
              luas melalui platform digital yang mudah, aman, dan terpercaya.
            </p>
            <button className="px-5 py-2.5 rounded-lg bg-[#005FA4] text-white text-sm font-semibold hover:bg-emerald-900 transition-colors">
              Daftarkan Koperasi Anda
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
