import React, { useState } from "react";
import PetaniSidebar from "../../components/petani/PetaniSidebar";
import { ChevronRight, ChevronLeft } from "lucide-react";

const mockProducts = [
  { id: 1, category: "Beras Premium", img: "/images/beras.png", stock: "50 Kg", price: "Rp 14.000 / kg", harvestDate: "01-01-25", shelfLife: "7 Hari", status: "Aktif" },
  { id: 2, category: "Beras Organik", img: "/images/beras.png", stock: "30 Kg", price: "Rp 16.000 / kg", harvestDate: "02-01-25", shelfLife: "7 Hari", status: "Aktif" },
  { id: 3, category: "Beras Merah", img: "/images/beras.png", stock: "20 Kg", price: "Rp 18.000 / kg", harvestDate: "03-01-25", shelfLife: "14 Hari", status: "Aktif" },
  { id: 4, category: "Ikan Nila Fresh", img: "/images/ikan1.png", stock: "15 Kg", price: "Rp 35.000 / kg", harvestDate: "04-01-25", shelfLife: "2 Hari", status: "Aktif" },
  { id: 5, category: "Beras Premium", img: "/images/beras.png", stock: "50 Kg", price: "Rp 14.000 / kg", harvestDate: "01-01-25", shelfLife: "7 Hari", status: "Aktif" },
  { id: 6, category: "Beras Premium", img: "/images/beras.png", stock: "50 Kg", price: "Rp 14.000 / kg", harvestDate: "01-01-25", shelfLife: "7 Hari", status: "Aktif" },
  { id: 7, category: "Beras Premium", img: "/images/beras.png", stock: "50 Kg", price: "Rp 14.000 / kg", harvestDate: "01-01-25", shelfLife: "7 Hari", status: "Aktif" },
  { id: 8, category: "Beras Premium", img: "/images/beras.png", stock: "50 Kg", price: "Rp 14.000 / kg", harvestDate: "01-01-25", shelfLife: "7 Hari", status: "Aktif" },
];

export default function ProdukPage() {
  const [page, setPage] = useState(1);
  const itemsPerPage = 4;
  const totalPages = Math.ceil(mockProducts.length / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const currentProducts = mockProducts.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="min-h-screen bg-white font-[Montserrat] text-slate-900">
      <div className="flex max-w-[1440px] mx-auto py-8 gap-6 px-4">
        <PetaniSidebar />

        {/* Outer Container Wrapper */}
        <div className="flex-1 bg-[rgba(222,236,225,0.19)] border border-[rgba(0,154,38,0.19)] rounded-[20px] p-8 min-h-[971px] relative">
          
          {/* Top Header */}
          <div className="flex items-center justify-between border-b border-[#029154] pb-4 mb-6">
            <h2 className="text-[24px] font-semibold text-[#005941]">Produk saya</h2>
            <img src="/images/ikan1.png" alt="avatar" className="w-12 h-12 rounded-full border border-slate-100 object-cover" />
          </div>

          {/* Sub Header (Deskripsi & Tombol Tambah) */}
          <div className="flex items-center justify-between mb-4">
            <p className="text-[14px] text-slate-500">Kelola produk hasil panen anda</p>
            <button className="bg-[#006638] hover:bg-[#005941] text-white px-5 py-2 rounded-[10px] font-semibold transition text-[15px]">
              Tambah +
            </button>
          </div>

          {/* Inner Table Card Container */}
          <div className="bg-white/50 border border-[#029154] shadow-[0_0_4px_rgba(0,0,0,0.25)] rounded-[20px] p-6">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[16px] font-bold text-[#273B4A] border-b-2 border-black/[0.13]">
                    <th className="pb-4 px-2">Foto Produk</th>
                    <th className="pb-4 px-2">Kategori</th>
                    <th className="pb-4 px-2">Stok</th>
                    <th className="pb-4 px-2">Harga Harapan</th>
                    <th className="pb-4 px-2">Tanggal Panen</th>
                    <th className="pb-4 px-2">Masa Layak</th>
                    <th className="pb-4 px-2">Status</th>
                    <th className="pb-4 px-2 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {currentProducts.map((p) => (
                    <tr key={p.id} className="border-b border-black/[0.13] last:border-b-0">
                      <td className="py-4 px-2">
                        <img src={p.img} alt={p.category} className="w-[83px] h-[55px] object-cover rounded-[5px]" />
                      </td>
                      <td className="py-4 px-2 text-[16px] font-semibold text-[#273B4A]">
                        {p.category}
                      </td>
                      <td className="py-4 px-2 text-[16px] font-semibold text-[#273B4A]">{p.stock}</td>
                      <td className="py-4 px-2 text-[16px] font-semibold text-[#273B4A]">{p.price}</td>
                      <td className="py-4 px-2 text-[16px] font-semibold text-[#273B4A]">{p.harvestDate}</td>
                      <td className="py-4 px-2 text-[16px] font-semibold text-[#273B4A]">{p.shelfLife}</td>
                      <td className="py-4 px-2">
                        <span className="inline-flex items-center justify-center px-3 py-1 rounded-[12px] bg-[rgba(105,255,120,0.19)] border border-[#008A1E] text-[14px] font-semibold text-[#006638]">
                          {p.status}
                        </span>
                      </td>
                      <td className="py-4 px-2">
                        <div className="flex items-center justify-center gap-2">
                          <button className="p-2 rounded-lg bg-sky-50 border border-sky-200 hover:bg-sky-100 transition flex items-center justify-center">
                            <img src="/images/write.png" alt="Edit" className="w-5 h-5 object-contain" />
                          </button>
                          <button className="p-2 rounded-lg bg-rose-50 border border-rose-200 hover:bg-rose-100 transition flex items-center justify-center">
                            <img src="/images/delete.png" alt="Delete" className="w-5 h-5 object-contain" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Bottom Pagination Info & Controls */}
          <div className="flex items-center justify-between mt-6 px-2">
            <span className="text-[16px] font-semibold text-black/[0.51]">
              Menampilkan {startIndex + 1}-{Math.min(startIndex + itemsPerPage, mockProducts.length)} dari {mockProducts.length} produk
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                disabled={page === 1}
                className="w-8 h-8 flex items-center justify-center disabled:opacity-30"
              >
                <ChevronLeft className="w-5 h-5 text-black/[0.43]" />
              </button>

              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index}
                  onClick={() => setPage(index + 1)}
                  className={`w-[40px] h-[40px] rounded-[5px] text-[24px] font-semibold flex items-center justify-center transition ${
                    page === index + 1
                      ? "bg-[#006638] text-white"
                      : "bg-white border border-[#006638] text-[#006638] hover:bg-[#006638]/5"
                  }`}
                >
                  {index + 1}
                </button>
              ))}

              <button
                onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={page === totalPages}
                className="w-8 h-8 flex items-center justify-center disabled:opacity-30"
              >
                <ChevronRight className="w-5 h-5 text-black/[0.43]" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}