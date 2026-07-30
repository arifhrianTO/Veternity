import React, { useState } from "react";
import KoperasiSidebar from "../../components/koperasi/KoperasiSidebar";
import { Search, Plus, Edit3, Trash2, ChevronLeft, ChevronRight } from "lucide-react";

export default function KoperasiKelolaProduk() {
  const [search, setSearch] = useState("");

  // Dummy data produk
  const [produkList] = useState([
    {
      id: 1,
      nama: "Beras Premium",
      gambar: "/images/beras.png",
      pemilik: "Budi Santoso",
      stok: "50 Kg",
      harga: "Rp 14.000 / kg",
      tanggalPanen: "01-01-25",
      masaLayak: "7 Hari",
      status: "Aktif",
    },
    {
      id: 2,
      nama: "Beras Premium",
      gambar: "/images/beras.png",
      pemilik: "Budi Santoso",
      stok: "50 Kg",
      harga: "Rp 14.000 / kg",
      tanggalPanen: "01-01-25",
      masaLayak: "7 Hari",
      status: "Aktif",
    },
    {
      id: 3,
      nama: "Beras Premium",
      gambar: "/images/beras.png",
      pemilik: "Budi Santoso",
      stok: "50 Kg",
      harga: "Rp 14.000 / kg",
      tanggalPanen: "01-01-25",
      masaLayak: "7 Hari",
      status: "Aktif",
    },
    {
      id: 4,
      nama: "Beras Premium",
      gambar: "/images/beras.png",
      pemilik: "Budi Santoso",
      stok: "50 Kg",
      harga: "Rp 14.000 / kg",
      tanggalPanen: "01-01-25",
      masaLayak: "7 Hari",
      status: "Aktif",
    },
  ]);

  return (
    <div className="min-h-screen bg-white font-['Montserrat'] text-slate-900">
      <div className="flex max-w-[1440px] mx-auto py-8 gap-6 px-4">
        
        {/* Sidebar Koperasi */}
        <KoperasiSidebar />

        {/* Outer Main Container */}
        <div className="flex-1 bg-[rgba(222,236,225,0.19)] border border-[rgba(0,154,38,0.19)] rounded-[20px] p-8 min-h-[971px] flex flex-col justify-between">
          <div>
            {/* Header Panel */}
            <div className="flex items-center justify-between border-b border-[#029154] pb-6 mb-6">
              <h1 className="text-[24px] font-semibold text-[#005941]">
                Kelola Produk
              </h1>
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center overflow-hidden border border-red-200">
                <img
                  src="/images/user.png"
                  alt="Avatar"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/images/user.png";
                  }}
                />
              </div>
            </div>

            {/* Action Bar (Search & Tambah) */}
            <div className="flex items-center justify-between mb-6">
              {/* Search Bar */}
              <div className="relative w-[371px]">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#005941]" />
                <input
                  type="text"
                  placeholder="Cari Produk..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-12 pr-4 py-2 bg-white border border-[#006638] rounded-full text-sm text-[#006638] placeholder-[#006638] focus:outline-none"
                />
              </div>

              {/* Tombol Tambah */}
              <button className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#006638] to-[#029154] text-white font-semibold text-[18px] rounded-[5px] hover:opacity-90 transition shadow-sm">
                <span>Tambah</span>
                <Plus className="w-5 h-5" />
              </button>
            </div>

            {/* Table Box Container */}
            <div className="bg-white/80 border border-[#029154] rounded-[20px] p-6 shadow-[0_0_4px_rgba(0,0,0,0.25)]">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="text-[#273B4A] font-bold text-[16px] border-b border-black/10">
                      <th className="py-3 px-4">Produk</th>
                      <th className="py-3 px-4 text-center">Pemilik</th>
                      <th className="py-3 px-4 text-center">Stok</th>
                      <th className="py-3 px-4 text-center leading-tight">
                        Harga<br />Harapan
                      </th>
                      <th className="py-3 px-4 text-center leading-tight">
                        Tanggal<br />Panen
                      </th>
                      <th className="py-3 px-4 text-center leading-tight">
                        Masa<br />Layak
                      </th>
                      <th className="py-3 px-4 text-center">Status</th>
                      <th className="py-3 px-4 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/10">
                    {produkList.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/50 transition">
                        {/* Produk */}
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-4">
                            <img
                              src={item.gambar}
                              alt={item.nama}
                              className="w-[98px] h-[65px] object-cover rounded-[5px] border border-slate-100"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "/images/beras.png";
                              }}
                            />
                            <span className="font-semibold text-[#273B4A] text-[15px]">
                              {item.nama}
                            </span>
                          </div>
                        </td>

                        {/* Pemilik */}
                        <td className="py-4 px-4 font-semibold text-[#273B4A] text-center text-[15px]">
                          {item.pemilik}
                        </td>

                        {/* Stok */}
                        <td className="py-4 px-4 font-semibold text-[#273B4A] text-center text-[15px]">
                          {item.stok}
                        </td>

                        {/* Harga Harapan */}
                        <td className="py-4 px-4 font-medium text-black text-center text-[15px]">
                          {item.harga}
                        </td>

                        {/* Tanggal Panen */}
                        <td className="py-4 px-4 font-semibold text-[#273B4A] text-center text-[15px]">
                          {item.tanggalPanen}
                        </td>

                        {/* Masa Layak */}
                        <td className="py-4 px-4 font-semibold text-[#273B4A] text-center text-[15px]">
                          {item.masaLayak}
                        </td>

                        {/* Status */}
                        <td className="py-4 px-4 text-center">
                          <span className="inline-block bg-[rgba(0,174,43,0.19)] text-[#006638] border border-[#006638] text-[12px] font-semibold px-3 py-1 rounded-[3px]">
                            {item.status}
                          </span>
                        </td>

                        {/* Aksi (Edit & Delete) */}
                        <td className="py-4 px-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button className="w-10 h-10 bg-white border border-[#0220E1]/50 rounded-[5px] flex items-center justify-center shadow-[0_0_3px_rgba(0,0,0,0.25)] hover:bg-blue-50 transition">
                              <Edit3 className="w-5 h-5 text-[#0004ED]" />
                            </button>
                            <button className="w-10 h-10 bg-white border border-[#E10206]/50 rounded-[5px] flex items-center justify-center shadow-[0_0_3px_rgba(0,0,0,0.25)] hover:bg-red-50 transition">
                              <Trash2 className="w-5 h-5 text-[#FF0000]" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Pagination Footer */}
          <div className="flex items-center justify-between mt-6 text-sm text-black/50 font-semibold pt-4">
            <div>Menampilkan 1-4 dari 8 produk</div>
            <div className="flex items-center gap-2">
              <button className="p-2 text-black/40 hover:text-black transition">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button className="w-[40px] h-[40px] rounded-[5px] bg-[#006638] text-white font-semibold text-[18px] flex items-center justify-center">
                1
              </button>
              <button className="w-[40px] h-[40px] rounded-[5px] bg-white border border-[#006638] text-[#006638] font-semibold text-[18px] flex items-center justify-center hover:bg-slate-50">
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
  );
}