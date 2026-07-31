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
  Loader2
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

  // States for Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  // State for Selected Logistic & Form Data
  const [selectedLogistic, setSelectedLogistic] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const initialFormState = {
    nama: "",
    area: "",
    status: "Aktif"
  };
  const [formData, setFormData] = useState(initialFormState);

  // Helper functions to open modals
  const openAddModal = () => {
    setFormData(initialFormState);
    setIsAddModalOpen(true);
  };

  const openEditModal = (logistic) => {
    setSelectedLogistic(logistic);
    setFormData({
      nama: logistic.nama,
      area: logistic.area,
      status: logistic.status
    });
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (logistic) => {
    setSelectedLogistic(logistic);
    setIsDeleteModalOpen(true);
  };

  const closeAllModals = () => {
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
    setIsDeleteModalOpen(false);
    setSelectedLogistic(null);
    setFormData(initialFormState);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API Call
    setTimeout(() => {
      const newLogistic = {
        id: logistics.length + 1,
        no: logistics.length + 1,
        ...formData
      };
      setLogistics([...logistics, newLogistic]);
      setIsSubmitting(false);
      closeAllModals();
    }, 500);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API Call
    setTimeout(() => {
      setLogistics(logistics.map(l => l.id === selectedLogistic.id ? { ...l, ...formData } : l));
      setIsSubmitting(false);
      closeAllModals();
    }, 500);
  };

  const handleDeleteSubmit = () => {
    setIsSubmitting(true);
    // Simulate API Call
    setTimeout(() => {
      setLogistics(logistics.filter((item) => item.id !== selectedLogistic.id));
      setIsSubmitting(false);
      closeAllModals();
    }, 500);
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
                    <th className="pb-3 px-4 text-center">Nama Logistik</th>
                    <th className="pb-3 px-4 text-center">Area Layanan</th>
                    <th className="pb-3 px-4 text-center">Status</th>
                    <th className="pb-3 px-4 text-center w-32">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {logistics.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/50 transition border-b border-black/10 last:border-0">
                      <td className="py-2 px-4 font-semibold text-[#273B4A] text-center">
                        {item.no}
                      </td>
                      <td className="py-2 px-4 font-semibold text-[#273B4A] text-center">
                        {item.nama}
                      </td>
                      <td className="py-2 px-4 font-semibold text-[#273B4A] text-center">
                        {item.area}
                      </td>
                      <td className="py-2 px-4 text-center">
                        <span className="inline-block bg-[rgba(0,174,43,0.19)] text-[#006638] border border-[#006638] text-xs font-semibold px-3 py-1 rounded-[3px]">
                          {item.status}
                        </span>
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

      {/* ======================= MODAL TAMBAH LOGISTIK ======================= */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-[20px] w-full max-w-[500px] overflow-hidden shadow-2xl border border-slate-200 flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
              <h3 className="text-[18px] font-bold text-[#005941]">Tambah Logistik Baru</h3>
              <button onClick={closeAllModals} className="text-slate-400 hover:text-slate-600 transition">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 text-[14px]">
              <form onSubmit={handleAddSubmit} className="space-y-4">
                <div>
                  <label className="block text-[#273B4A] font-semibold mb-1">Nama Logistik</label>
                  <input type="text" name="nama" value={formData.nama} onChange={handleInputChange} required className="w-full px-4 py-2 border border-slate-300 rounded-[10px] focus:outline-none focus:border-[#006638]" placeholder="Misal: JNT Express" />
                </div>
                <div>
                  <label className="block text-[#273B4A] font-semibold mb-1">Area Layanan</label>
                  <input type="text" name="area" value={formData.area} onChange={handleInputChange} required className="w-full px-4 py-2 border border-slate-300 rounded-[10px] focus:outline-none focus:border-[#006638]" placeholder="Misal: Jawa Barat" />
                </div>
                <div>
                  <label className="block text-[#273B4A] font-semibold mb-1">Status</label>
                  <select name="status" value={formData.status} onChange={handleInputChange} className="w-full px-4 py-2 border border-slate-300 rounded-[10px] focus:outline-none focus:border-[#006638]">
                    <option value="Aktif">Aktif</option>
                    <option value="Tidak Aktif">Tidak Aktif</option>
                  </select>
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

      {/* ======================= MODAL EDIT LOGISTIK ======================= */}
      {isEditModalOpen && selectedLogistic && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-[20px] w-full max-w-[500px] overflow-hidden shadow-2xl border border-slate-200 flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
              <h3 className="text-[18px] font-bold text-[#005941]">Edit Logistik</h3>
              <button onClick={closeAllModals} className="text-slate-400 hover:text-slate-600 transition">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 text-[14px]">
              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div>
                  <label className="block text-[#273B4A] font-semibold mb-1">Nama Logistik</label>
                  <input type="text" name="nama" value={formData.nama} onChange={handleInputChange} required className="w-full px-4 py-2 border border-slate-300 rounded-[10px] focus:outline-none focus:border-[#006638]" />
                </div>
                <div>
                  <label className="block text-[#273B4A] font-semibold mb-1">Area Layanan</label>
                  <input type="text" name="area" value={formData.area} onChange={handleInputChange} required className="w-full px-4 py-2 border border-slate-300 rounded-[10px] focus:outline-none focus:border-[#006638]" />
                </div>
                <div>
                  <label className="block text-[#273B4A] font-semibold mb-1">Status</label>
                  <select name="status" value={formData.status} onChange={handleInputChange} className="w-full px-4 py-2 border border-slate-300 rounded-[10px] focus:outline-none focus:border-[#006638]">
                    <option value="Aktif">Aktif</option>
                    <option value="Tidak Aktif">Tidak Aktif</option>
                  </select>
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

      {/* ======================= MODAL HAPUS LOGISTIK ======================= */}
      {isDeleteModalOpen && selectedLogistic && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-[20px] w-full max-w-[400px] overflow-hidden shadow-2xl border border-slate-200 text-center p-8">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-sm">
              <Trash2 className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-[20px] font-bold text-[#273B4A] mb-2">Hapus Logistik?</h3>
            <p className="text-[14px] text-slate-500 mb-8 leading-relaxed">
              Apakah Anda yakin ingin menghapus <strong>{selectedLogistic.nama}</strong>? Data logistik yang telah dihapus tidak dapat dikembalikan.
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
