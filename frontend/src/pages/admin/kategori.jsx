import { useState } from "react";
import Sidebar from "../../components/layout/Sidebar";
import {
  Search,
  Plus,
  Edit3,
  Trash2,
  ChevronLeft,
  ChevronRight,
  X,
  UploadCloud,
  Loader2
} from "lucide-react";

export default function KategoriPage() {
  const [categories, setCategories] = useState([
    {
      id: 1,
      no: 1,
      nama: "Ikan",
      gambar: "/images/ikan.png",
      jumlah: 30,
    },
    {
      id: 2,
      no: 2,
      nama: "Sayur",
      gambar: "/images/sayur.png",
      jumlah: 30,
    },
    {
      id: 3,
      no: 3,
      nama: "Sayur",
      gambar: "/images/sayur.png",
      jumlah: 30,
    },
    {
      id: 4,
      no: 4,
      nama: "Sayur",
      gambar: "/images/sayur.png",
      jumlah: 30,
    },
    {
      id: 5,
      no: 5,
      nama: "Sayur",
      gambar: "/images/sayur.png",
      jumlah: 30,
    },
  ]);

  const [search, setSearch] = useState("");

  // States for Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  // State for Selected Category & Form Data
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const initialFormState = {
    nama: "",
    jumlah: 0,
    gambar: null
  };
  const [formData, setFormData] = useState(initialFormState);
  const [imagePreview, setImagePreview] = useState(null);

  // Helper functions to open modals
  const openAddModal = () => {
    setFormData(initialFormState);
    setImagePreview(null);
    setIsAddModalOpen(true);
  };

  const openEditModal = (category) => {
    setSelectedCategory(category);
    setFormData({
      nama: category.nama,
      jumlah: category.jumlah,
      gambar: null // biarkan null jika tidak diubah
    });
    setImagePreview(category.gambar);
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (category) => {
    setSelectedCategory(category);
    setIsDeleteModalOpen(true);
  };

  const closeAllModals = () => {
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
    setIsDeleteModalOpen(false);
    setSelectedCategory(null);
    setFormData(initialFormState);
    setImagePreview(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, gambar: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API Call
    setTimeout(() => {
      const newCategory = {
        id: categories.length + 1,
        no: categories.length + 1,
        nama: formData.nama,
        gambar: imagePreview || "/images/placeholder-category.png",
        jumlah: parseInt(formData.jumlah) || 0
      };
      setCategories([...categories, newCategory]);
      setIsSubmitting(false);
      closeAllModals();
    }, 500);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API Call
    setTimeout(() => {
      setCategories(categories.map(c => c.id === selectedCategory.id ? { 
        ...c, 
        nama: formData.nama,
        jumlah: parseInt(formData.jumlah),
        gambar: imagePreview || c.gambar 
      } : c));
      setIsSubmitting(false);
      closeAllModals();
    }, 500);
  };

  const handleDeleteSubmit = () => {
    setIsSubmitting(true);
    // Simulate API Call
    setTimeout(() => {
      setCategories(categories.filter((item) => item.id !== selectedCategory.id));
      setIsSubmitting(false);
      closeAllModals();
    }, 500);
  };

  return (
    <div className="min-h-screen bg-white font-['Montserrat'] text-slate-900">
      <div className="flex w-full min-h-screen p-4 pl-[304px]">
        
        {/* AdminSidebar Komponen */}
        <Sidebar />

        {/* Area Konten Utama */}
        <div className="flex-1 bg-[rgba(222,236,225,0.19)] border border-[rgba(0,154,38,0.19)] rounded-[20px] p-8 relative">
          
          {/* Header Panel */}
          <div className="flex items-center justify-between pb-6 mb-6 border-b border-[#029154]">
            <h1 className="text-[24px] font-semibold text-[#005941]">Kategori</h1>
            <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-100 flex items-center justify-center bg-[#C1E0FF]">
              <img
                src="/images/admin-avatar.png"
                alt="Admin Avatar"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/images/user.png";
                }}
              />
            </div>
          </div>

          {/* Control Bar (Search & Tambah) */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#006638]" />
              <input
                type="text"
                placeholder="Cari kategori..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-2.5 rounded-full border border-[#006638] text-sm text-[#006638] placeholder-[#006638] focus:outline-none bg-white"
              />
            </div>

            <button onClick={openAddModal} className="flex items-center gap-2 bg-gradient-to-r from-[#006638] to-[#029154] hover:opacity-90 text-white font-semibold px-5 py-2.5 rounded-lg text-sm transition shadow-sm self-end sm:self-auto">
              <span>Tambah</span>
              <Plus className="w-5 h-5" />
            </button>
          </div>

          {/* Table Container Card */}
          <div className="bg-white/60 border border-[#029154] rounded-2xl p-6 shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-[#273B4A] font-bold text-base border-b-2 border-black/10">
                    <th className="pb-3 px-4 w-16 text-center">No</th>
                    <th className="pb-3 px-4 text-center">Nama</th>
                    <th className="pb-3 px-4 text-center">Gambar</th>
                    <th className="pb-3 px-4 text-center">Jumlah</th>
                    <th className="pb-3 px-4 text-center w-32">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/50 transition border-b border-black/10 last:border-0">
                      <td className="py-2 px-4 font-semibold text-[#273B4A] text-center">
                        {item.no}
                      </td>
                      <td className="py-2 px-4 font-semibold text-[#273B4A] text-center">
                        {item.nama}
                      </td>
                      <td className="py-2 px-4 text-center">
                        <div className="flex justify-center">
                          <img
                            src={item.gambar}
                            alt={item.nama}
                            className="w-12 h-12 object-cover rounded-md border border-slate-100"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "/images/placeholder-category.png";
                            }}
                          />
                        </div>
                      </td>
                      <td className="py-2 px-4 font-semibold text-[#273B4A] text-center">
                        {item.jumlah}
                      </td>
                      <td className="py-2 px-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => openEditModal(item)}
                            title="Edit"
                            className="w-9 h-9 rounded-md bg-white border border-[#0220E1] text-[#0004ED] flex items-center justify-center shadow-sm hover:bg-blue-50 transition"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => openDeleteModal(item)}
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

      {/* ======================= MODAL TAMBAH KATEGORI ======================= */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-[20px] w-full max-w-[500px] overflow-hidden shadow-2xl border border-slate-200 flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
              <h3 className="text-[18px] font-bold text-[#005941]">Tambah Kategori Baru</h3>
              <button onClick={closeAllModals} className="text-slate-400 hover:text-slate-600 transition">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 text-[14px]">
              <form onSubmit={handleAddSubmit} className="space-y-4">
                {/* Upload Image */}
                <div className="flex flex-col items-center">
                  <label className="w-32 h-32 border-2 border-dashed border-slate-300 rounded-[12px] bg-slate-50 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-slate-100 hover:border-[#006638] transition group overflow-hidden relative">
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover absolute inset-0" />
                    ) : (
                      <>
                        <UploadCloud className="w-8 h-8 text-[#006638] mb-2 group-hover:scale-110 transition" />
                        <span className="text-[12px] text-slate-500">Unggah Gambar</span>
                      </>
                    )}
                    <input type="file" className="hidden" accept="image/png, image/jpeg, image/jpg" onChange={handleImageChange} />
                  </label>
                </div>

                <div>
                  <label className="block text-[#273B4A] font-semibold mb-1">Nama Kategori</label>
                  <input type="text" name="nama" value={formData.nama} onChange={handleInputChange} required className="w-full px-4 py-2 border border-slate-300 rounded-[10px] focus:outline-none focus:border-[#006638]" placeholder="Misal: Ikan Laut" />
                </div>
                <div>
                  <label className="block text-[#273B4A] font-semibold mb-1">Jumlah Item (Opsional)</label>
                  <input type="number" name="jumlah" value={formData.jumlah} onChange={handleInputChange} className="w-full px-4 py-2 border border-slate-300 rounded-[10px] focus:outline-none focus:border-[#006638]" />
                </div>
                
                <div className="flex gap-3 pt-4">
                  <button type="button" onClick={closeAllModals} disabled={isSubmitting} className="flex-1 py-2.5 rounded-[10px] border border-slate-300 font-semibold text-slate-600 hover:bg-slate-100 transition disabled:opacity-50">
                    Batal
                  </button>
                  <button type="submit" disabled={isSubmitting} className="flex-1 py-2.5 rounded-[10px] bg-[#006638] font-semibold text-white hover:bg-[#00522d] transition shadow-sm disabled:opacity-50 flex items-center justify-center gap-2">
                    {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                    Simpan
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ======================= MODAL EDIT KATEGORI ======================= */}
      {isEditModalOpen && selectedCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-[20px] w-full max-w-[500px] overflow-hidden shadow-2xl border border-slate-200 flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
              <h3 className="text-[18px] font-bold text-[#005941]">Edit Kategori</h3>
              <button onClick={closeAllModals} className="text-slate-400 hover:text-slate-600 transition">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 text-[14px]">
              <form onSubmit={handleEditSubmit} className="space-y-4">
                {/* Upload Image */}
                <div className="flex flex-col items-center">
                  <label className="w-32 h-32 border border-slate-200 rounded-[12px] bg-slate-50 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-slate-100 transition group overflow-hidden relative shadow-sm">
                    {imagePreview ? (
                      <>
                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover absolute inset-0" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                          <span className="text-white text-xs font-semibold px-2 py-1 bg-black/50 rounded-full">Ubah</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <UploadCloud className="w-8 h-8 text-[#006638] mb-2 group-hover:scale-110 transition" />
                        <span className="text-[12px] text-slate-500">Unggah Gambar</span>
                      </>
                    )}
                    <input type="file" className="hidden" accept="image/png, image/jpeg, image/jpg" onChange={handleImageChange} />
                  </label>
                </div>

                <div>
                  <label className="block text-[#273B4A] font-semibold mb-1">Nama Kategori</label>
                  <input type="text" name="nama" value={formData.nama} onChange={handleInputChange} required className="w-full px-4 py-2 border border-slate-300 rounded-[10px] focus:outline-none focus:border-[#006638]" />
                </div>
                <div>
                  <label className="block text-[#273B4A] font-semibold mb-1">Jumlah Item</label>
                  <input type="number" name="jumlah" value={formData.jumlah} onChange={handleInputChange} className="w-full px-4 py-2 border border-slate-300 rounded-[10px] focus:outline-none focus:border-[#006638]" />
                </div>
                
                <div className="flex gap-3 pt-4">
                  <button type="button" onClick={closeAllModals} disabled={isSubmitting} className="flex-1 py-2.5 rounded-[10px] border border-slate-300 font-semibold text-slate-600 hover:bg-slate-100 transition disabled:opacity-50">
                    Batal
                  </button>
                  <button type="submit" disabled={isSubmitting} className="flex-1 py-2.5 rounded-[10px] bg-[#006638] font-semibold text-white hover:bg-[#00522d] transition shadow-sm disabled:opacity-50 flex items-center justify-center gap-2">
                    {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                    Simpan Perubahan
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ======================= MODAL HAPUS KATEGORI ======================= */}
      {isDeleteModalOpen && selectedCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-[20px] w-full max-w-[400px] overflow-hidden shadow-2xl border border-slate-200 text-center p-8">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-sm">
              <Trash2 className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-[20px] font-bold text-[#273B4A] mb-2">Hapus Kategori?</h3>
            <p className="text-[14px] text-slate-500 mb-8 leading-relaxed">
              Apakah Anda yakin ingin menghapus kategori <strong>{selectedCategory.nama}</strong>? Semua produk terkait mungkin akan terpengaruh.
            </p>
            
            <div className="flex justify-center gap-3">
              <button onClick={closeAllModals} disabled={isSubmitting} className="flex-1 py-2.5 rounded-[10px] border border-slate-300 font-semibold text-slate-600 hover:bg-slate-100 transition disabled:opacity-50">
                Batal
              </button>
              <button onClick={handleDeleteSubmit} disabled={isSubmitting} className="flex-1 py-2.5 rounded-[10px] bg-red-500 font-semibold text-white hover:bg-red-600 transition shadow-sm disabled:opacity-50 flex items-center justify-center gap-2">
                {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
