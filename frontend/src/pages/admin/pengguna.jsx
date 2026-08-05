import { useState, useEffect } from "react";
import Sidebar from "../../components/layout/Sidebar";
import PageHeader from "../../components/layout/PageHeader";
import api from "../../config/axios";
import { swalSuccess, swalError } from "../../utils/swal";

import {
  Search,
  Plus,
  ChevronDown,
  Edit3,
  Trash2,
  ChevronLeft,
  ChevronRight,
  X,
  Loader2
} from "lucide-react";

const roleLabels = {
  admin: "Admin",
  koperasi: "Koperasi",
  petani: "Petani",
  petani_binaan: "Petani (Binaan)",
  nelayan: "Nelayan",
  nelayan_binaan: "Nelayan (Binaan)",
  pembeli: "Pembeli",
};

export default function PenggunaPage() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedRoleFilter, setSelectedRoleFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);

  // States for Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  const [selectedUser, setSelectedUser] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const initialFormState = {
    nama_lengkap: "",
    email: "",
    no_hp: "",
    password: "",
    role: "petani",
    status: "Aktif"
  };
  const [formData, setFormData] = useState(initialFormState);

  const fetchUsers = () => {
    setLoading(true);
    const params = { page, search, role: selectedRoleFilter };
    api.get("/admin/users", { params })
      .then(res => {
        setUsers(res.data.data);
        setLastPage(res.data.last_page);
        setTotal(res.data.total);
      })
      .catch(err => console.error("Gagal load users", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    const t = setTimeout(fetchUsers, 300);
    return () => clearTimeout(t);
  }, [page, search, selectedRoleFilter]);

  const openAddModal = () => {
    setFormData(initialFormState);
    setIsAddModalOpen(true);
  };

  const openEditModal = (user) => {
    setSelectedUser(user);
    setFormData({
      nama_lengkap: user.nama_lengkap,
      email: user.email,
      no_hp: user.no_hp,
      password: "",
      role: user.role,
      status: user.status
    });
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (user) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  const closeAllModals = () => {
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
    setIsDeleteModalOpen(false);
    setSelectedUser(null);
    setFormData(initialFormState);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.post("/admin/users", formData);
      swalSuccess("Berhasil", "Pengguna berhasil ditambahkan");
      closeAllModals();
      fetchUsers();
    } catch (err) {
      swalError("Gagal", err.response?.data?.message || "Terjadi kesalahan saat menambah pengguna");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = { ...formData };
      if (!payload.password) delete payload.password;
      await api.put(`/admin/users/${selectedUser.id}`, payload);
      swalSuccess("Berhasil", "Pengguna berhasil diperbarui");
      closeAllModals();
      fetchUsers();
    } catch (err) {
      swalError("Gagal", err.response?.data?.message || "Terjadi kesalahan saat memperbarui pengguna");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteSubmit = async () => {
    setIsSubmitting(true);
    try {
      await api.delete(`/admin/users/${selectedUser.id}`);
      swalSuccess("Berhasil", "Pengguna berhasil dihapus");
      closeAllModals();
      fetchUsers();
    } catch (err) {
      swalError("Gagal", err.response?.data?.message || "Terjadi kesalahan saat menghapus pengguna");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white font-[Montserrat] text-slate-900">
      <div className="flex w-full min-h-screen p-4 pl-[304px]">
        <Sidebar />

        <div className="flex-1 bg-[rgba(222,236,225,0.19)] border border-[rgba(0,154,38,0.19)] rounded-[20px] p-8 relative">
          
          <PageHeader title="Pengguna" />

          {/* Control Bar (Search, Filter, Tambah) */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#006638]" />
              <input
                type="text"
                placeholder="Cari Pengguna..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="w-full pl-12 pr-4 py-2.5 rounded-full border border-[#006638] text-sm text-[#006638] placeholder-[#006638] focus:outline-none bg-white"
              />
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              <div className="relative">
                <select
                  value={selectedRoleFilter}
                  onChange={(e) => { setSelectedRoleFilter(e.target.value); setPage(1); }}
                  className="appearance-none bg-white border border-[#024D70] text-[#00378A] text-sm font-medium px-4 py-2 pr-10 rounded-lg focus:outline-none cursor-pointer"
                >
                  <option value="">Semua Role</option>
                  <option value="admin">Admin</option>
                  <option value="koperasi">Koperasi</option>
                  <option value="petani">Petani</option>
                  <option value="petani_binaan">Petani Binaan</option>
                  <option value="nelayan">Nelayan</option>
                  <option value="nelayan_binaan">Nelayan Binaan</option>
                  <option value="pembeli">Pembeli</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#00378A] pointer-events-none" />
              </div>

              <button onClick={openAddModal} className="flex items-center gap-2 bg-gradient-to-r from-[#006638] to-[#029154] hover:opacity-90 text-white font-semibold px-5 py-2 rounded-lg text-sm transition shadow-sm">
                <span>Tambah</span>
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Table Container Card */}
          <div className="bg-white/60 border border-[#029154] rounded-2xl p-6 shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-[#273B4A] font-bold text-base border-b-2 border-black/10">
                    <th className="pb-3 px-4 w-16">No</th>
                    <th className="pb-3 px-4">Nama</th>
                    <th className="pb-3 px-4">Email</th>
                    <th className="pb-3 px-4 text-center">Role</th>
                    <th className="pb-3 px-4">No HP</th>
                    <th className="pb-3 px-4 text-center">Status</th>
                    <th className="pb-3 px-4 text-center w-32">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan={7} className="py-8 text-center"><Loader2 className="w-6 h-6 animate-spin mx-auto text-[#006638]" /></td></tr>
                  ) : users.length === 0 ? (
                    <tr><td colSpan={7} className="py-8 text-center text-slate-500">Tidak ada pengguna ditemukan</td></tr>
                  ) : users.map((item, i) => (
                    <tr key={item.id} className="hover:bg-slate-50/50 transition border-b border-black/10 last:border-0">
                      <td className="py-3 px-4 font-semibold text-[#273B4A]">{(page - 1) * 5 + i + 1}</td>
                      <td className="py-3 px-4 font-semibold text-[#273B4A]">{item.nama_lengkap}</td>
                      <td className="py-3 px-4 font-medium text-slate-600">{item.email}</td>
                      <td className="py-3 px-4 text-center font-medium text-black">{roleLabels[item.role] || item.role}</td>
                      <td className="py-3 px-4 font-semibold text-[#273B4A]">{item.no_hp}</td>
                      <td className="py-3 px-4 text-center">
                        <span className={`inline-block border text-xs font-medium px-3 py-1 rounded ${item.status === 'Aktif' ? 'bg-[#00AE2B]/20 text-[#006638] border-[#006638]' : 'bg-red-50 text-red-600 border-red-300'}`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-center gap-2">
                          <button onClick={() => openEditModal(item)} title="Edit" className="w-9 h-9 rounded-md bg-white border border-[#0220E1] text-[#0004ED] flex items-center justify-center shadow-sm hover:bg-blue-50 transition">
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button onClick={() => openDeleteModal(item)} title="Hapus" className="w-9 h-9 rounded-md bg-white border border-[#E10206] text-[#FF0000] flex items-center justify-center shadow-sm hover:bg-red-50 transition">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {total > 0 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 text-sm text-black/50 font-semibold">
                <div>Total {total} pengguna</div>
                <div className="flex items-center gap-2">
                  <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="p-2 text-black/40 hover:text-black transition disabled:opacity-30">
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button className="w-9 h-9 rounded-md bg-[#006638] text-white font-semibold flex items-center justify-center">{page}</button>
                  <button onClick={() => setPage(p => Math.min(lastPage, p + 1))} disabled={page === lastPage} className="p-2 text-black/40 hover:text-black transition disabled:opacity-30">
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MODAL TAMBAH */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-[20px] w-full max-w-[500px] overflow-hidden shadow-2xl border border-slate-200 flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
              <h3 className="text-[18px] font-bold text-[#005941]">Tambah Pengguna Baru</h3>
              <button onClick={closeAllModals} className="text-slate-400 hover:text-slate-600 transition">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 text-[14px]">
              <form onSubmit={handleAddSubmit} className="space-y-4">
                <div>
                  <label className="block text-[#273B4A] font-semibold mb-1">Nama Lengkap</label>
                  <input type="text" name="nama_lengkap" value={formData.nama_lengkap} onChange={handleInputChange} required className="w-full px-4 py-2 border border-slate-300 rounded-[10px] focus:outline-none focus:border-[#006638]" />
                </div>
                <div>
                  <label className="block text-[#273B4A] font-semibold mb-1">Email</label>
                  <input type="email" name="email" value={formData.email} onChange={handleInputChange} required className="w-full px-4 py-2 border border-slate-300 rounded-[10px] focus:outline-none focus:border-[#006638]" />
                </div>
                <div>
                  <label className="block text-[#273B4A] font-semibold mb-1">Nomor HP</label>
                  <input type="text" name="no_hp" value={formData.no_hp} onChange={handleInputChange} required className="w-full px-4 py-2 border border-slate-300 rounded-[10px] focus:outline-none focus:border-[#006638]" />
                </div>
                <div>
                  <label className="block text-[#273B4A] font-semibold mb-1">Password</label>
                  <input type="password" name="password" value={formData.password} onChange={handleInputChange} required minLength={8} className="w-full px-4 py-2 border border-slate-300 rounded-[10px] focus:outline-none focus:border-[#006638]" />
                </div>
                <div>
                  <label className="block text-[#273B4A] font-semibold mb-1">Role</label>
                  <select name="role" value={formData.role} onChange={handleInputChange} className="w-full px-4 py-2 border border-slate-300 rounded-[10px] focus:outline-none focus:border-[#006638]">
                    {Object.entries(roleLabels).map(([val, label]) => (
                      <option key={val} value={val}>{label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[#273B4A] font-semibold mb-1">Status</label>
                  <select name="status" value={formData.status} onChange={handleInputChange} className="w-full px-4 py-2 border border-slate-300 rounded-[10px] focus:outline-none focus:border-[#006638]">
                    <option value="Aktif">Aktif</option>
                    <option value="Tidak Aktif">Tidak Aktif</option>
                  </select>
                </div>
                <div className="flex gap-3 pt-4">
                  <button type="button" onClick={closeAllModals} disabled={isSubmitting} className="flex-1 py-2.5 rounded-[10px] border border-slate-300 font-semibold text-slate-600 hover:bg-slate-100 transition disabled:opacity-50">Batal</button>
                  <button type="submit" disabled={isSubmitting} className="flex-1 py-2.5 rounded-[10px] bg-[#006638] font-semibold text-white hover:bg-[#00522d] transition shadow-sm disabled:opacity-50 flex items-center justify-center gap-2">
                    {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />} Simpan
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* MODAL EDIT */}
      {isEditModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-[20px] w-full max-w-[500px] overflow-hidden shadow-2xl border border-slate-200 flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
              <h3 className="text-[18px] font-bold text-[#005941]">Edit Pengguna</h3>
              <button onClick={closeAllModals} className="text-slate-400 hover:text-slate-600 transition">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 text-[14px]">
              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div>
                  <label className="block text-[#273B4A] font-semibold mb-1">Nama Lengkap</label>
                  <input type="text" name="nama_lengkap" value={formData.nama_lengkap} onChange={handleInputChange} required className="w-full px-4 py-2 border border-slate-300 rounded-[10px] focus:outline-none focus:border-[#006638]" />
                </div>
                <div>
                  <label className="block text-[#273B4A] font-semibold mb-1">Email</label>
                  <input type="email" name="email" value={formData.email} onChange={handleInputChange} required className="w-full px-4 py-2 border border-slate-300 rounded-[10px] focus:outline-none focus:border-[#006638]" />
                </div>
                <div>
                  <label className="block text-[#273B4A] font-semibold mb-1">Nomor HP</label>
                  <input type="text" name="no_hp" value={formData.no_hp} onChange={handleInputChange} required className="w-full px-4 py-2 border border-slate-300 rounded-[10px] focus:outline-none focus:border-[#006638]" />
                </div>
                <div>
                  <label className="block text-[#273B4A] font-semibold mb-1">Password Baru (Opsional)</label>
                  <input type="password" name="password" value={formData.password} onChange={handleInputChange} minLength={8} className="w-full px-4 py-2 border border-slate-300 rounded-[10px] focus:outline-none focus:border-[#006638]" placeholder="Kosongkan jika tidak ingin ganti" />
                </div>
                <div>
                  <label className="block text-[#273B4A] font-semibold mb-1">Role</label>
                  <select name="role" value={formData.role} onChange={handleInputChange} className="w-full px-4 py-2 border border-slate-300 rounded-[10px] focus:outline-none focus:border-[#006638]">
                    {Object.entries(roleLabels).map(([val, label]) => (
                      <option key={val} value={val}>{label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[#273B4A] font-semibold mb-1">Status</label>
                  <select name="status" value={formData.status} onChange={handleInputChange} className="w-full px-4 py-2 border border-slate-300 rounded-[10px] focus:outline-none focus:border-[#006638]">
                    <option value="Aktif">Aktif</option>
                    <option value="Tidak Aktif">Tidak Aktif</option>
                  </select>
                </div>
                <div className="flex gap-3 pt-4">
                  <button type="button" onClick={closeAllModals} disabled={isSubmitting} className="flex-1 py-2.5 rounded-[10px] border border-slate-300 font-semibold text-slate-600 hover:bg-slate-100 transition disabled:opacity-50">Batal</button>
                  <button type="submit" disabled={isSubmitting} className="flex-1 py-2.5 rounded-[10px] bg-[#006638] font-semibold text-white hover:bg-[#00522d] transition shadow-sm disabled:opacity-50 flex items-center justify-center gap-2">
                    {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />} Simpan
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* MODAL HAPUS */}
      {isDeleteModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-[20px] w-full max-w-[400px] overflow-hidden shadow-2xl border border-slate-200 text-center p-8">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-sm">
              <Trash2 className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-[20px] font-bold text-[#273B4A] mb-2">Hapus Pengguna?</h3>
            <p className="text-[14px] text-slate-500 mb-8 leading-relaxed">
              Apakah Anda yakin ingin menghapus pengguna <strong>{selectedUser.nama_lengkap}</strong>?
            </p>
            <div className="flex justify-center gap-3">
              <button onClick={closeAllModals} disabled={isSubmitting} className="flex-1 py-2.5 rounded-[10px] border border-slate-300 font-semibold text-slate-600 hover:bg-slate-100 transition disabled:opacity-50">Batal</button>
              <button onClick={handleDeleteSubmit} disabled={isSubmitting} className="flex-1 py-2.5 rounded-[10px] bg-red-500 font-semibold text-white hover:bg-red-600 transition shadow-sm disabled:opacity-50 flex items-center justify-center gap-2">
                {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />} Hapus
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
