import React, { useState } from "react";
import Sidebar from "../../components/layout/Sidebar";
import { ChevronRight, ChevronLeft, Edit3, Trash2, Eye, X, UploadCloud } from "lucide-react";

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

  // States for Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  
  // State for Selected Product
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Helper functions to open modals
  const openDetailModal = (product) => {
    setSelectedProduct(product);
    setIsDetailModalOpen(true);
  };

  const openEditModal = (product) => {
    setSelectedProduct(product);
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (product) => {
    setSelectedProduct(product);
    setIsDeleteModalOpen(true);
  };

  const closeAllModals = () => {
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
    setIsDeleteModalOpen(false);
    setIsDetailModalOpen(false);
    setSelectedProduct(null);
  };

  return (
    <div className="min-h-screen bg-white font-[Montserrat] text-slate-900">
      <div className="flex w-full min-h-screen p-4 pl-[304px]">
        <Sidebar />

        {/* Outer Container Wrapper */}
        <div className="flex-1 bg-[rgba(222,236,225,0.19)] border border-[rgba(0,154,38,0.19)] rounded-[20px] p-8 relative">
          
          {/* Top Header */}
          <div className="flex items-center justify-between border-b border-[#029154] pb-4 mb-6">
            <h2 className="text-[24px] font-semibold text-[#005941]">Produk saya</h2>
            <img src="/images/ikan1.png" alt="avatar" className="w-10 h-10 rounded-full border border-slate-100 object-cover" />
          </div>

          {/* Sub Header (Deskripsi & Tombol Tambah) */}
          <div className="flex items-center justify-between mb-4">
            <p className="text-[14px] text-slate-500">Kelola produk hasil panen anda</p>
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="bg-[#006638] hover:bg-[#005941] text-white px-5 py-2 rounded-[10px] font-semibold transition text-[15px]"
            >
              Tambah +
            </button>
          </div>

          {/* Inner Table Card Container */}
          <div className="bg-white/50 border border-[#029154] shadow-[0_0_4px_rgba(0,0,0,0.25)] rounded-[20px] p-6">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[15px] font-bold text-[#273B4A] border-b-2 border-black/[0.13]">
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
                      <td className="py-4 px-2 text-[14px] font-semibold text-[#273B4A]">
                        {p.category}
                      </td>
                      <td className="py-4 px-2 text-[14px] font-semibold text-[#273B4A]">{p.stock}</td>
                      <td className="py-4 px-2 text-[14px] font-semibold text-[#273B4A]">{p.price}</td>
                      <td className="py-4 px-2 text-[14px] font-semibold text-[#273B4A]">{p.harvestDate}</td>
                      <td className="py-4 px-2 text-[14px] font-semibold text-[#273B4A]">{p.shelfLife}</td>
                      <td className="py-4 px-2">
                        <span className="inline-flex items-center justify-center px-3 py-1 rounded-[12px] bg-[rgba(105,255,120,0.19)] border border-[#008A1E] text-[13px] font-semibold text-[#006638]">
                          {p.status}
                        </span>
                      </td>
                      <td className="py-4 px-2">
                        <div className="flex items-center justify-center gap-2">
                          <button 
                            onClick={() => openDetailModal(p)}
                            className="p-2 rounded-lg bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 transition flex items-center justify-center text-[#006638]"
                            title="Detail"
                          >
                            <Eye className="w-5 h-5" />
                          </button>
                          <button 
                            onClick={() => openEditModal(p)}
                            className="p-2 rounded-lg bg-sky-50 border border-sky-200 hover:bg-sky-100 transition flex items-center justify-center text-sky-600"
                            title="Edit"
                          >
                            <Edit3 className="w-5 h-5" />
                          </button>
                          <button 
                            onClick={() => openDeleteModal(p)}
                            className="p-2 rounded-lg bg-rose-50 border border-rose-200 hover:bg-rose-100 transition flex items-center justify-center text-rose-600"
                            title="Hapus"
                          >
                            <Trash2 className="w-5 h-5" />
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
                  className={`w-[36px] h-[36px] rounded-[5px] text-[16px] font-semibold flex items-center justify-center transition ${
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

      {/* ======================= MODAL TAMBAH PRODUK ======================= */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-[20px] w-full max-w-[700px] overflow-hidden shadow-2xl border border-slate-200 flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 shrink-0">
              <h3 className="text-[18px] font-bold text-[#005941]">Tambah Produk Baru</h3>
              <button onClick={closeAllModals} className="text-slate-400 hover:text-slate-600 transition">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto custom-scrollbar flex flex-col sm:flex-row gap-6 text-[14px]">
              
              {/* Image Upload Area (Left) */}
              <div className="shrink-0 w-full sm:w-[250px] h-[200px] border-2 border-dashed border-slate-300 rounded-[12px] bg-slate-50 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-slate-100 hover:border-[#006638] transition group p-4">
                <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center mb-3 group-hover:scale-110 transition">
                  <UploadCloud className="w-6 h-6 text-[#006638]" />
                </div>
                <span className="font-semibold text-[#273B4A]">Klik untuk unggah foto produk</span>
                <span className="text-[12px] text-slate-500 mt-1">PNG, JPG, maksimal 5MB</span>
              </div>

              {/* Form Input Section (Right) */}
              <div className="flex-1 space-y-4">
                <div className="space-y-1">
                  <label className="font-semibold text-[#273B4A] text-[13px]">Kategori Produk</label>
                  <select className="w-full border border-slate-300 rounded-[10px] px-3 py-2 text-slate-700 focus:outline-none focus:border-[#006638] bg-white">
                    <option value="">Pilih Kategori...</option>
                    <option value="Beras Premium">Beras Premium</option>
                    <option value="Beras Organik">Beras Organik</option>
                    <option value="Beras Merah">Beras Merah</option>
                    <option value="Ikan Nila Fresh">Ikan Nila Fresh</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-semibold text-[#273B4A] text-[13px]">Stok</label>
                    <div className="flex items-center border border-slate-300 rounded-[10px] overflow-hidden focus-within:border-[#006638]">
                      <input type="number" className="w-full px-3 py-2 outline-none text-slate-700" placeholder="0" />
                      <span className="bg-slate-100 px-3 py-2 font-medium text-slate-500 border-l border-slate-300">Kg</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-[#273B4A] text-[13px]">Harga Harapan</label>
                    <div className="flex items-center border border-slate-300 rounded-[10px] overflow-hidden focus-within:border-[#006638]">
                      <span className="bg-slate-100 px-3 py-2 font-medium text-slate-500 border-r border-slate-300">Rp</span>
                      <input type="text" className="w-full px-3 py-2 outline-none text-slate-700" placeholder="0" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-semibold text-[#273B4A] text-[13px]">Tanggal Panen</label>
                    <input type="date" className="w-full border border-slate-300 rounded-[10px] px-3 py-2 text-slate-700 focus:outline-none focus:border-[#006638]" />
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-[#273B4A] text-[13px]">Masa Layak</label>
                    <div className="flex items-center border border-slate-300 rounded-[10px] overflow-hidden focus-within:border-[#006638]">
                      <input type="number" className="w-full px-3 py-2 outline-none text-slate-700" placeholder="0" />
                      <span className="bg-slate-100 px-3 py-2 font-medium text-slate-500 border-l border-slate-300">Hari</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-200 p-4 shrink-0 bg-slate-50 flex justify-end gap-3">
              <button onClick={closeAllModals} className="px-5 py-2.5 rounded-[10px] border border-slate-300 font-semibold text-slate-600 hover:bg-slate-100 transition">
                Batal
              </button>
              <button onClick={closeAllModals} className="px-5 py-2.5 rounded-[10px] bg-[#006638] font-semibold text-white hover:bg-[#00522d] transition shadow-sm">
                Simpan Produk
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================= MODAL EDIT PRODUK ======================= */}
      {isEditModalOpen && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-[20px] w-full max-w-[700px] overflow-hidden shadow-2xl border border-slate-200 flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 shrink-0">
              <h3 className="text-[18px] font-bold text-[#005941]">Edit Produk</h3>
              <button onClick={closeAllModals} className="text-slate-400 hover:text-slate-600 transition">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto custom-scrollbar flex flex-col sm:flex-row gap-6 text-[14px]">
              
              {/* Image Edit Section (Left) */}
              <div className="shrink-0 w-full sm:w-[250px] space-y-2">
                <div className="relative rounded-[12px] border border-slate-200 overflow-hidden group">
                  <img src={selectedProduct.img} alt="Product" className="w-full h-[200px] object-cover" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition cursor-pointer">
                    <div className="bg-white px-4 py-2 rounded-full font-semibold text-[#006638] text-[13px] shadow-md flex items-center gap-2">
                      <UploadCloud className="w-4 h-4" /> Ubah Foto
                    </div>
                  </div>
                </div>
                <p className="text-[12px] text-slate-500 text-center">Klik gambar untuk mengubah</p>
              </div>

              {/* Form Input Section (Right) */}
              <div className="flex-1 space-y-4">
                <div className="space-y-1">
                  <label className="font-semibold text-[#273B4A] text-[13px]">Kategori Produk</label>
                  <select defaultValue={selectedProduct.category} className="w-full border border-slate-300 rounded-[10px] px-3 py-2 text-slate-700 focus:outline-none focus:border-[#006638] bg-white">
                    <option value="Beras Premium">Beras Premium</option>
                    <option value="Beras Organik">Beras Organik</option>
                    <option value="Beras Merah">Beras Merah</option>
                    <option value="Ikan Nila Fresh">Ikan Nila Fresh</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-semibold text-[#273B4A] text-[13px]">Stok</label>
                    <div className="flex items-center border border-slate-300 rounded-[10px] overflow-hidden focus-within:border-[#006638]">
                      <input type="text" defaultValue={selectedProduct.stock.split(' ')[0]} className="w-full px-3 py-2 outline-none text-slate-700" />
                      <span className="bg-slate-100 px-3 py-2 font-medium text-slate-500 border-l border-slate-300">Kg</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-[#273B4A] text-[13px]">Harga Harapan</label>
                    <div className="flex items-center border border-slate-300 rounded-[10px] overflow-hidden focus-within:border-[#006638]">
                      <span className="bg-slate-100 px-3 py-2 font-medium text-slate-500 border-r border-slate-300">Rp</span>
                      <input type="text" defaultValue={selectedProduct.price.replace(/[^\d]/g, '')} className="w-full px-3 py-2 outline-none text-slate-700" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-semibold text-[#273B4A] text-[13px]">Tanggal Panen</label>
                    <input type="text" defaultValue={selectedProduct.harvestDate} className="w-full border border-slate-300 rounded-[10px] px-3 py-2 text-slate-700 focus:outline-none focus:border-[#006638]" />
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-[#273B4A] text-[13px]">Masa Layak</label>
                    <div className="flex items-center border border-slate-300 rounded-[10px] overflow-hidden focus-within:border-[#006638]">
                      <input type="text" defaultValue={selectedProduct.shelfLife.split(' ')[0]} className="w-full px-3 py-2 outline-none text-slate-700" />
                      <span className="bg-slate-100 px-3 py-2 font-medium text-slate-500 border-l border-slate-300">Hari</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-200 p-4 shrink-0 bg-slate-50 flex justify-end gap-3">
              <button onClick={closeAllModals} className="px-5 py-2.5 rounded-[10px] border border-slate-300 font-semibold text-slate-600 hover:bg-slate-100 transition">
                Batal
              </button>
              <button onClick={closeAllModals} className="px-5 py-2.5 rounded-[10px] bg-[#006638] font-semibold text-white hover:bg-[#00522d] transition shadow-sm">
                Simpan Perubahan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================= MODAL HAPUS PRODUK ======================= */}
      {isDeleteModalOpen && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-[20px] w-full max-w-[400px] overflow-hidden shadow-2xl border border-slate-200 text-center p-8">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-sm">
              <Trash2 className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-[20px] font-bold text-[#273B4A] mb-2">Hapus Produk?</h3>
            <p className="text-[14px] text-slate-500 mb-8 leading-relaxed">
              Apakah Anda yakin ingin menghapus produk <strong>{selectedProduct.category}</strong>? Tindakan ini tidak dapat dibatalkan.
            </p>
            
            <div className="flex justify-center gap-3">
              <button onClick={closeAllModals} className="flex-1 py-2.5 rounded-[10px] border border-slate-300 font-semibold text-slate-600 hover:bg-slate-100 transition">
                Batal
              </button>
              <button onClick={closeAllModals} className="flex-1 py-2.5 rounded-[10px] bg-red-500 font-semibold text-white hover:bg-red-600 transition shadow-sm">
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================= MODAL DETAIL PRODUK ======================= */}
      {isDetailModalOpen && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-[20px] w-full max-w-[650px] overflow-hidden shadow-2xl border border-slate-200 flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 shrink-0">
              <h3 className="text-[18px] font-bold text-[#005941]">Detail Produk</h3>
              <button onClick={closeAllModals} className="text-slate-400 hover:text-slate-600 transition">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 flex flex-col sm:flex-row gap-6">
              {/* Image Section (Left) */}
              <div className="rounded-[12px] border border-slate-200 p-2 bg-slate-50 shrink-0 w-full sm:w-[250px] h-fit">
                 <img src={selectedProduct.img} alt={selectedProduct.category} className="w-full h-[200px] object-cover rounded-[8px]" />
              </div>
              
              {/* Details Section (Right) */}
              <div className="flex-1 space-y-3">
                <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                  <span className="text-slate-500 text-[14px]">Kategori</span>
                  <span className="font-bold text-[#273B4A]">{selectedProduct.category}</span>
                </div>
                <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                  <span className="text-slate-500 text-[14px]">Stok Tersedia</span>
                  <span className="font-semibold text-[#273B4A]">{selectedProduct.stock}</span>
                </div>
                <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                  <span className="text-slate-500 text-[14px]">Harga Harapan</span>
                  <span className="font-bold text-[#006638]">{selectedProduct.price}</span>
                </div>
                <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                  <span className="text-slate-500 text-[14px]">Tanggal Panen</span>
                  <span className="font-semibold text-[#273B4A]">{selectedProduct.harvestDate}</span>
                </div>
                <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                  <span className="text-slate-500 text-[14px]">Masa Layak</span>
                  <span className="font-semibold text-[#273B4A]">{selectedProduct.shelfLife}</span>
                </div>
                <div className="flex justify-between items-center pt-1">
                  <span className="text-slate-500 text-[14px]">Status Produk</span>
                  <span className="inline-flex items-center justify-center px-3 py-1 rounded-[12px] bg-[rgba(105,255,120,0.19)] border border-[#008A1E] text-[13px] font-semibold text-[#006638]">
                    {selectedProduct.status}
                  </span>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-200 p-4 shrink-0 bg-slate-50 flex justify-end">
              <button onClick={closeAllModals} className="px-8 py-2.5 rounded-[10px] bg-[#273B4A] font-semibold text-white hover:bg-[#1f2f3b] transition">
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
