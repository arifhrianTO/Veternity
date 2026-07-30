import React, { useState } from "react";
import Sidebar from "../../components/layout/Sidebar";
import {
  Search,
  Plus,
  Edit3,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function LogistikPage() {
  const [logistics, setLogistics] = useState([
    {
      id: 1,
      no: 1,
      nama: "JNT Express",
      area: "Jawa Barat",
      status: "Aktif",
    },
    {
      id: 2,
      no: 1,
      nama: "JNT Express",
      area: "Jawa Barat",
      status: "Aktif",
    },
    {
      id: 3,
      no: 1,
      nama: "JNT Express",
      area: "Jawa Barat",
      status: "Aktif",
    },
    {
      id: 4,
      no: 1,
      nama: "JNT Express",
      area: "Jawa Barat",
      status: "Aktif",
    },
    {
      id: 5,
      no: 1,
      nama: "JNT Express",
      area: "Jawa Barat",
      status: "Aktif",
    },
    {
      id: 6,
      no: 1,
      nama: "JNT Express",
      area: "Jawa Barat",
      status: "Aktif",
    },
  ]);

  const [search, setSearch] = useState("");

  const handleDelete = (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus logistik ini?")) {
      setLogistics(logistics.filter((item) => item.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-white font-[Montserrat] text-slate-900">
      <div className="flex w-full min-h-screen p-4 pl-[304px]">
        
        {/* AdminSidebar Komponen */}
        <Sidebar />

        {/* Area Konten Utama */}
        <div className="flex-1 bg-[rgba(222,236,225,0.19)] border border-[rgba(0,154,38,0.19)] rounded-[20px] p-8 relative">
          
          {/* Header Panel */}
          <div className="flex items-center justify-between pb-6 mb-6 border-b border-[#029154]">
            <h1 className="text-[24px] font-semibold text-[#005941]">Logistik</h1>
            <div className="w-10 h-10 rounded-full bg-[#C1E0FF] flex items-center justify-center text-[#0184FE]">
              <span className="font-bold">A</span>
            </div>
          </div>

          {/* Control Bar (Search & Tambah) */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#006638]" />
              <input
                type="text"
                placeholder="Cari Logistik..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-2.5 rounded-full border border-[#006638] text-sm text-[#006638] placeholder-[#006638] focus:outline-none bg-white"
              />
            </div>

            <button className="flex items-center gap-2 bg-gradient-to-r from-[#006638] to-[#029154] hover:opacity-90 text-white font-semibold px-5 py-2.5 rounded-lg text-sm transition shadow-sm self-end sm:self-auto">
              <span>Tambah</span>
              <Plus className="w-5 h-5" />
            </button>
          </div>

          {/* Table Container Card */}
          <div className="bg-white/60 border border-[#029154] rounded-2xl p-6 shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-[#273B4A] font-bold text-base">
                    <th className="py-3 px-4 w-16 text-center">No</th>
                    <th className="py-3 px-4 text-center">Nama Logistik</th>
                    <th className="py-3 px-4 text-center">Are Layanan</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4 text-center w-32">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/10">
                  {logistics.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/50 transition">
                      <td className="py-4 px-4 font-semibold text-[#273B4A] text-center">
                        {item.no}
                      </td>
                      <td className="py-4 px-4 font-semibold text-[#273B4A] text-center">
                        {item.nama}
                      </td>
                      <td className="py-4 px-4 font-semibold text-[#273B4A] text-center">
                        {item.area}
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className="inline-block bg-[rgba(0,174,43,0.19)] text-[#006638] border border-[#006638] text-xs font-semibold px-3 py-1 rounded-[3px]">
                          {item.status}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            title="Edit"
                            className="w-9 h-9 rounded-md bg-white border border-[#0220E1] text-[#0004ED] flex items-center justify-center shadow-sm hover:bg-blue-50 transition"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            title="Hapus"
                            className="w-9 h-9 rounded-md bg-white border border-[#E10206] text-[#FF0000] flex items-center justify-center shadow-sm hover:bg-red-50 transition"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 text-sm text-black/50 font-semibold">
              <div>Menampilkan 1-6 dari 8 produk</div>
              <div className="flex items-center gap-2">
                <button className="p-2 text-black/40 hover:text-black transition">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button className="w-9 h-9 rounded-md bg-[#006638] text-white font-semibold flex items-center justify-center">
                  1
                </button>
                <button className="w-9 h-9 rounded-md bg-white border border-[#006638] text-[#006638] font-semibold flex items-center justify-center hover:bg-slate-50">
                  2
                </button>
                <button className="p-2 text-black/40 hover:text-black transition">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
