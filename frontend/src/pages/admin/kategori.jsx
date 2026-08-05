import { useState, useEffect } from "react";
import Sidebar from "../../components/layout/Sidebar";
import PageHeader from "../../components/layout/PageHeader";
import {
  Search,
  Plus,
  Edit3,
  Trash2,
  X,
  UploadCloud,
  Loader2,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  Package,
} from "lucide-react";
import api from "../../config/axios";
import { swalSuccess, swalError } from "../../utils/swal";

const storageUrl = (path) => {
  if (!path) return "/images/placeholder-category.png";
  if (path.startsWith("http") || path.startsWith("/images")) return path;
  return `http://localhost:8000/storage/${path}`;
};

const tipeBadge = (tipe) =>
  tipe === "perikanan" ? (
    <span className="inline-flex items-center justify-center px-3 py-1 rounded-[12px] bg-[rgba(0,180,216,0.12)] border border-[#028391] text-[12px] font-semibold text-[#026E80]">
      Perikanan
    </span>
  ) : (
    <span className="inline-flex items-center justify-center px-3 py-1 rounded-[12px] bg-[rgba(105,255,120,0.19)] border border-[#008A1E] text-[12px] font-semibold text-[#006638]">
      Pertanian
    </span>
  );

export default function KategoriPage() {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [bapanasOptions, setBapanasOptions] = useState([]);
  const [search, setSearch] = useState("");
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;

  // ==================== STATE MODAL KATEGORI ====================
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categoryInitial = { nama_kategori: "", tipe: "pertanian", gambar: null };
  const [categoryForm, setCategoryForm] = useState(categoryInitial);
  const [categoryPreview, setCategoryPreview] = useState(null);

  // ==================== STATE MODAL KOMODITAS ====================
  const [isCommodityAddOpen, setIsCommodityAddOpen] = useState(false);
  const [isCommodityEditOpen, setIsCommodityEditOpen] = useState(false);
  const [isCommodityDeleteOpen, setIsCommodityDeleteOpen] = useState(false);
  const [selectedCommodity, setSelectedCommodity] = useState(null);
  const [isCommoditySubmitting, setIsCommoditySubmitting] = useState(false);

  const commodityInitial = { category_id: "", nama_komoditas: "", bapanas_match: "", satuan: "Kg" };
  const [commodityForm, setCommodityForm] = useState(commodityInitial);

  // ==================== FETCH DATA ====================
  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      setFetchError("");
      const res = await api.get("/admin/categories");
      if (res.data.success) setCategories(res.data.data);
    } catch (error) {
      console.error("Gagal mengambil data kategori:", error);
      setFetchError("Gagal mengambil data kategori dari server.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchBapanas = async () => {
    try {
      const res = await api.get("/bapanas/commodities");
      setBapanasOptions(res.data || []);
    } catch (error) {
      console.error("Gagal mengambil daftar komoditas Bapanas:", error);
      setBapanasOptions([]);
    }
  };

  useEffect(() => {
    Promise.resolve().then(() => {
      fetchCategories();
      fetchBapanas();
    });
  }, []);

  const filteredCategories = categories.filter((c) =>
    c.nama_kategori.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.max(1, Math.ceil(filteredCategories.length / itemsPerPage));
  const pagedCategories = filteredCategories.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  // ==================== HANDLER KATEGORI ====================
  const openAddCategory = () => {
    setCategoryForm(categoryInitial);
    setCategoryPreview(null);
    setIsAddModalOpen(true);
  };

  const openEditCategory = (category) => {
    setSelectedCategory(category);
    setCategoryForm({
      nama_kategori: category.nama_kategori,
      tipe: category.tipe,
      gambar: null,
    });
    setCategoryPreview(storageUrl(category.gambar));
    setIsEditModalOpen(true);
  };

  const openDeleteCategory = (category) => {
    setSelectedCategory(category);
    setIsDeleteModalOpen(true);
  };

  const closeCategoryModals = () => {
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
    setIsDeleteModalOpen(false);
    setSelectedCategory(null);
    setCategoryForm(categoryInitial);
    setCategoryPreview(null);
  };

  const handleCategoryChange = (e) => {
    const { name, value } = e.target;
    setCategoryForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCategoryForm((prev) => ({ ...prev, gambar: file }));
      const reader = new FileReader();
      reader.onloadend = () => setCategoryPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const buildCategoryPayload = () => {
    const payload = new FormData();
    payload.append("nama_kategori", categoryForm.nama_kategori);
    payload.append("tipe", categoryForm.tipe);
    if (categoryForm.gambar instanceof File) payload.append("gambar", categoryForm.gambar);
    return payload;
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.post("/admin/categories", buildCategoryPayload(), {
        headers: { "Content-Type": "multipart/form-data" },
      });
      swalSuccess("Berhasil", "Kategori berhasil ditambahkan.");
      closeCategoryModals();
      fetchCategories();
    } catch (error) {
      swalError("Gagal", error.response?.data?.message || "Terjadi kesalahan saat menambah kategori.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditCategory = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.put(`/admin/categories/${selectedCategory.id}`, buildCategoryPayload(), {
        headers: { "Content-Type": "multipart/form-data" },
      });
      swalSuccess("Berhasil", "Kategori berhasil diperbarui.");
      closeCategoryModals();
      fetchCategories();
    } catch (error) {
      swalError("Gagal", error.response?.data?.message || "Terjadi kesalahan saat memperbarui kategori.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCategory = async () => {
    setIsSubmitting(true);
    try {
      await api.delete(`/admin/categories/${selectedCategory.id}`);
      swalSuccess("Berhasil", "Kategori berhasil dihapus.");
      closeCategoryModals();
      setExpandedCategory(null);
      fetchCategories();
    } catch (error) {
      swalError("Gagal", error.response?.data?.message || "Terjadi kesalahan saat menghapus kategori.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ==================== HANDLER KOMODITAS ====================
  const toggleExpand = (categoryId) => {
    setExpandedCategory((prev) => (prev === categoryId ? null : categoryId));
  };

  const openAddCommodity = (categoryId) => {
    setCommodityForm({ ...commodityInitial, category_id: categoryId });
    setIsCommodityAddOpen(true);
  };

  const openEditCommodity = (commodity) => {
    setSelectedCommodity(commodity);
    setCommodityForm({
      category_id: commodity.category_id,
      nama_komoditas: commodity.nama_komoditas,
      bapanas_match: commodity.bapanas_match || "",
      satuan: commodity.satuan || "Kg",
    });
    setIsCommodityEditOpen(true);
  };

  const openDeleteCommodity = (commodity) => {
    setSelectedCommodity(commodity);
    setIsCommodityDeleteOpen(true);
  };

  const closeCommodityModals = () => {
    setIsCommodityAddOpen(false);
    setIsCommodityEditOpen(false);
    setIsCommodityDeleteOpen(false);
    setSelectedCommodity(null);
    setCommodityForm(commodityInitial);
  };

  const handleCommodityChange = (e) => {
    const { name, value } = e.target;
    setCommodityForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddCommodity = async (e) => {
    e.preventDefault();
    setIsCommoditySubmitting(true);
    try {
      await api.post("/admin/commodities", commodityForm);
      swalSuccess("Berhasil", "Komoditas berhasil ditambahkan.");
      closeCommodityModals();
      fetchCategories();
    } catch (error) {
      swalError("Gagal", error.response?.data?.message || "Terjadi kesalahan saat menambah komoditas.");
    } finally {
      setIsCommoditySubmitting(false);
    }
  };

  const handleEditCommodity = async (e) => {
    e.preventDefault();
    setIsCommoditySubmitting(true);
    try {
      await api.put(`/admin/commodities/${selectedCommodity.id}`, commodityForm);
      swalSuccess("Berhasil", "Komoditas berhasil diperbarui.");
      closeCommodityModals();
      fetchCategories();
    } catch (error) {
      swalError("Gagal", error.response?.data?.message || "Terjadi kesalahan saat memperbarui komoditas.");
    } finally {
      setIsCommoditySubmitting(false);
    }
  };

  const handleDeleteCommodity = async () => {
    setIsCommoditySubmitting(true);
    try {
      await api.delete(`/admin/commodities/${selectedCommodity.id}`);
      swalSuccess("Berhasil", "Komoditas berhasil dihapus.");
      closeCommodityModals();
      fetchCategories();
    } catch (error) {
      swalError("Gagal", error.response?.data?.message || "Terjadi kesalahan saat menghapus komoditas.");
    } finally {
      setIsCommoditySubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white font-['Montserrat'] text-slate-900">
      <div className="flex w-full min-h-screen p-4 pl-[304px]">
        <Sidebar />

        <div className="flex-1 bg-[rgba(222,236,225,0.19)] border border-[rgba(0,154,38,0.19)] rounded-[20px] p-8 relative">
          <PageHeader title="Kategori & Komoditas" subtitle="Kelola kategori dan komoditas untuk produk petani dan nelayan" />

          {/* Control Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#006638]" />
              <input
                type="text"
                placeholder="Cari kategori..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="w-full pl-12 pr-4 py-2.5 rounded-full border border-[#006638] text-sm text-[#006638] placeholder-[#006638] focus:outline-none bg-white"
              />
            </div>
            <button
              onClick={openAddCategory}
              className="flex items-center gap-2 bg-gradient-to-r from-[#006638] to-[#029154] hover:opacity-90 text-white font-semibold px-5 py-2.5 rounded-lg text-sm transition shadow-sm self-end sm:self-auto"
            >
              <span>Tambah Kategori</span>
              <Plus className="w-5 h-5" />
            </button>
          </div>

          {/* Table Container Card */}
          <div className="bg-white/60 border border-[#029154] rounded-2xl p-6 shadow-sm">
            {isLoading ? (
              <div className="flex items-center justify-center gap-2 py-16 text-[#006638]">
                <Loader2 className="w-6 h-6 animate-spin" />
                <span className="font-semibold">Memuat kategori...</span>
              </div>
            ) : fetchError ? (
              <div className="text-center py-16 text-red-500 font-semibold bg-red-50 rounded-xl">
                {fetchError}
              </div>
            ) : filteredCategories.length === 0 ? (
              <div className="text-center py-16 text-slate-500 font-medium">
                Belum ada kategori.
              </div>
            ) : (
              <>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="text-[#273B4A] font-bold text-base border-b-2 border-black/10">
                      <th className="pb-3 px-4 w-16 text-center">No</th>
                      <th className="pb-3 px-4 text-center">Nama</th>
                      <th className="pb-3 px-4 text-center">Tipe</th>
                      <th className="pb-3 px-4 text-center">Gambar</th>
                      <th className="pb-3 px-4 text-center">Jumlah Komoditas</th>
                      <th className="pb-3 px-4 text-center w-40">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pagedCategories.map((item, index) => (
                      <>
                        <tr key={item.id} className="hover:bg-slate-50/50 transition border-b border-black/10 last:border-0">
                          <td className="py-2 px-4 font-semibold text-[#273B4A] text-center">
                            {(page - 1) * itemsPerPage + index + 1}
                          </td>
                          <td className="py-2 px-4 font-semibold text-[#273B4A] text-center">
                            {item.nama_kategori}
                          </td>
                          <td className="py-2 px-4 text-center">{tipeBadge(item.tipe)}</td>
                          <td className="py-2 px-4 text-center">
                            <div className="flex justify-center">
                              <img
                                src={storageUrl(item.gambar)}
                                alt={item.nama_kategori}
                                className="w-12 h-12 object-cover rounded-md border border-slate-100"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = "/images/placeholder-category.png";
                                }}
                              />
                            </div>
                          </td>
                          <td className="py-2 px-4 font-semibold text-[#273B4A] text-center">
                            {item.commodities_count ?? item.commodities?.length ?? 0}
                          </td>
                          <td className="py-2 px-4">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => toggleExpand(item.id)}
                                title="Kelola Komoditas"
                                className="w-9 h-9 rounded-md bg-white border border-[#006638] text-[#006638] flex items-center justify-center shadow-sm hover:bg-emerald-50 transition"
                              >
                                {expandedCategory === item.id ? (
                                  <ChevronDown className="w-4 h-4" />
                                ) : (
                                  <ChevronRight className="w-4 h-4" />
                                )}
                              </button>
                              <button
                                onClick={() => openEditCategory(item)}
                                title="Edit"
                                className="w-9 h-9 rounded-md bg-white border border-[#0220E1] text-[#0004ED] flex items-center justify-center shadow-sm hover:bg-blue-50 transition"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => openDeleteCategory(item)}
                                title="Hapus"
                                className="w-9 h-9 rounded-md bg-white border border-[#E10206] text-[#FF0000] flex items-center justify-center shadow-sm hover:bg-red-50 transition"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                        {expandedCategory === item.id && (
                          <tr key={`${item.id}-com`} className="bg-[rgba(222,236,225,0.25)]">
                            <td colSpan={6} className="p-0">
                              <div className="p-5">
                                <div className="flex items-center justify-between mb-4">
                                  <h4 className="text-[15px] font-bold text-[#005941] flex items-center gap-2">
                                    <Package className="w-4 h-4" />
                                    Komoditas - {item.nama_kategori}
                                    <span className="text-[12px] font-semibold text-slate-400">
                                      ({item.commodities?.length || 0})
                                    </span>
                                  </h4>
                                  <button
                                    onClick={() => openAddCommodity(item.id)}
                                    className="flex items-center gap-1.5 bg-[#006638] hover:bg-[#005941] text-white text-[13px] font-semibold px-4 py-2 rounded-lg transition"
                                  >
                                    <Plus className="w-4 h-4" /> Tambah Komoditas
                                  </button>
                                </div>

                                {item.commodities && item.commodities.length > 0 ? (
                                  <div className="overflow-x-auto bg-white rounded-xl border border-[#029154]/30">
                                    <table className="w-full text-left">
                                      <thead>
                                        <tr className="text-[#273B4A] font-bold text-[13px] border-b-2 border-black/10">
                                          <th className="py-2.5 px-4 text-center">Nama Komoditas</th>
                                          <th className="py-2.5 px-4 text-center">Bapanas Match</th>
                                          <th className="py-2.5 px-4 text-center">Satuan</th>
                                          <th className="py-2.5 px-4 text-center w-24">Aksi</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {item.commodities.map((com) => (
                                          <tr key={com.id} className="border-b border-black/5 last:border-0 hover:bg-slate-50/50 transition">
                                            <td className="py-2 px-4 font-semibold text-[#273B4A] text-center text-[13px]">
                                              {com.nama_komoditas}
                                            </td>
                                            <td className="py-2 px-4 text-center text-[13px]">
                                              {com.bapanas_match ? (
                                                <span className="inline-flex items-center px-2.5 py-1 rounded-[12px] bg-[rgba(105,255,120,0.19)] border border-[#008A1E] text-[12px] font-semibold text-[#006638]">
                                                  {com.bapanas_match}
                                                </span>
                                              ) : (
                                                <span className="text-slate-400 text-[12px]">-</span>
                                              )}
                                            </td>
                                            <td className="py-2 px-4 font-semibold text-[#273B4A] text-center text-[13px]">
                                              {com.satuan}
                                            </td>
                                            <td className="py-2 px-4">
                                              <div className="flex items-center justify-center gap-2">
                                                <button
                                                  onClick={() => openEditCommodity(com)}
                                                  title="Edit"
                                                  className="w-8 h-8 rounded-md bg-white border border-[#0220E1] text-[#0004ED] flex items-center justify-center shadow-sm hover:bg-blue-50 transition"
                                                >
                                                  <Edit3 className="w-3.5 h-3.5" />
                                                </button>
                                                <button
                                                  onClick={() => openDeleteCommodity(com)}
                                                  title="Hapus"
                                                  className="w-8 h-8 rounded-md bg-white border border-[#E10206] text-[#FF0000] flex items-center justify-center shadow-sm hover:bg-red-50 transition"
                                                >
                                                  <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                              </div>
                                            </td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  </div>
                                ) : (
                                  <div className="text-center py-8 text-slate-400 font-medium bg-white rounded-xl border border-[#029154]/30">
                                    Belum ada komoditas pada kategori ini.
                                  </div>
                                )}
                              </div>
                            </td>
                          </tr>
                        )}
                      </>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination Footer */}
              {totalPages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between mt-4 pt-4 border-t border-black/10 gap-3">
                  <div className="text-sm text-black/50 font-semibold">
                    Menampilkan {(page - 1) * itemsPerPage + 1}-
                    {Math.min(page * itemsPerPage, filteredCategories.length)} dari{" "}
                    {filteredCategories.length} kategori
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setPage((p) => Math.max(p - 1, 1))}
                      disabled={page === 1}
                      className="p-1.5 text-black/40 hover:text-black transition disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setPage(i + 1)}
                        className={`w-8 h-8 rounded-[5px] font-semibold text-[15px] flex items-center justify-center transition ${
                          page === i + 1
                            ? "bg-[#006638] text-white"
                            : "bg-white border border-[#006638] text-[#006638] hover:bg-slate-50"
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                    <button
                      onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                      disabled={page === totalPages}
                      className="p-1.5 text-black/40 hover:text-black transition disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* ================= MODAL TAMBAH KATEGORI ================= */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-[20px] w-full max-w-[500px] overflow-hidden shadow-2xl border border-slate-200 flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
              <h3 className="text-[18px] font-bold text-[#005941]">Tambah Kategori Baru</h3>
              <button onClick={closeCategoryModals} className="text-slate-400 hover:text-slate-600 transition">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 text-[14px]">
              <form onSubmit={handleAddCategory} className="space-y-4">
                <div className="flex flex-col items-center">
                  <label className="w-32 h-32 border-2 border-dashed border-slate-300 rounded-[12px] bg-slate-50 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-slate-100 hover:border-[#006638] transition group overflow-hidden relative">
                    {categoryPreview ? (
                      <img src={categoryPreview} alt="Preview" className="w-full h-full object-cover absolute inset-0" />
                    ) : (
                      <>
                        <UploadCloud className="w-8 h-8 text-[#006638] mb-2 group-hover:scale-110 transition" />
                        <span className="text-[12px] text-slate-500">Unggah Gambar</span>
                      </>
                    )}
                    <input type="file" className="hidden" accept="image/png, image/jpeg, image/jpg" onChange={handleCategoryImage} />
                  </label>
                </div>
                <div>
                  <label className="block text-[#273B4A] font-semibold mb-1">Nama Kategori</label>
                  <input type="text" name="nama_kategori" value={categoryForm.nama_kategori} onChange={handleCategoryChange} required className="w-full px-4 py-2 border border-slate-300 rounded-[10px] focus:outline-none focus:border-[#006638]" placeholder="Misal: Sayur" />
                </div>
                <div>
                  <label className="block text-[#273B4A] font-semibold mb-1">Tipe</label>
                  <select name="tipe" value={categoryForm.tipe} onChange={handleCategoryChange} className="w-full px-4 py-2 border border-slate-300 rounded-[10px] focus:outline-none focus:border-[#006638] bg-white">
                    <option value="pertanian">Pertanian</option>
                    <option value="perikanan">Perikanan</option>
                  </select>
                </div>
                <div className="flex gap-3 pt-4">
                  <button type="button" onClick={closeCategoryModals} disabled={isSubmitting} className="flex-1 py-2.5 rounded-[10px] border border-slate-300 font-semibold text-slate-600 hover:bg-slate-100 transition disabled:opacity-50">
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

      {/* ================= MODAL EDIT KATEGORI ================= */}
      {isEditModalOpen && selectedCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-[20px] w-full max-w-[500px] overflow-hidden shadow-2xl border border-slate-200 flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
              <h3 className="text-[18px] font-bold text-[#005941]">Edit Kategori</h3>
              <button onClick={closeCategoryModals} className="text-slate-400 hover:text-slate-600 transition">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 text-[14px]">
              <form onSubmit={handleEditCategory} className="space-y-4">
                <div className="flex flex-col items-center">
                  <label className="w-32 h-32 border border-slate-200 rounded-[12px] bg-slate-50 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-slate-100 transition group overflow-hidden relative shadow-sm">
                    {categoryPreview ? (
                      <img src={categoryPreview} alt="Preview" className="w-full h-full object-cover absolute inset-0" />
                    ) : (
                      <>
                        <UploadCloud className="w-8 h-8 text-[#006638] mb-2 group-hover:scale-110 transition" />
                        <span className="text-[12px] text-slate-500">Unggah Gambar</span>
                      </>
                    )}
                    <input type="file" className="hidden" accept="image/png, image/jpeg, image/jpg" onChange={handleCategoryImage} />
                  </label>
                </div>
                <div>
                  <label className="block text-[#273B4A] font-semibold mb-1">Nama Kategori</label>
                  <input type="text" name="nama_kategori" value={categoryForm.nama_kategori} onChange={handleCategoryChange} required className="w-full px-4 py-2 border border-slate-300 rounded-[10px] focus:outline-none focus:border-[#006638]" />
                </div>
                <div>
                  <label className="block text-[#273B4A] font-semibold mb-1">Tipe</label>
                  <select name="tipe" value={categoryForm.tipe} onChange={handleCategoryChange} className="w-full px-4 py-2 border border-slate-300 rounded-[10px] focus:outline-none focus:border-[#006638] bg-white">
                    <option value="pertanian">Pertanian</option>
                    <option value="perikanan">Perikanan</option>
                  </select>
                </div>
                <div className="flex gap-3 pt-4">
                  <button type="button" onClick={closeCategoryModals} disabled={isSubmitting} className="flex-1 py-2.5 rounded-[10px] border border-slate-300 font-semibold text-slate-600 hover:bg-slate-100 transition disabled:opacity-50">
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

      {/* ================= MODAL HAPUS KATEGORI ================= */}
      {isDeleteModalOpen && selectedCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-[20px] w-full max-w-[400px] overflow-hidden shadow-2xl border border-slate-200 text-center p-8">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-sm">
              <Trash2 className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-[20px] font-bold text-[#273B4A] mb-2">Hapus Kategori?</h3>
            <p className="text-[14px] text-slate-500 mb-8 leading-relaxed">
              Apakah Anda yakin ingin menghapus kategori{" "}
              <strong>{selectedCategory.nama_kategori}</strong>? Semua komoditas dan produk terkait akan terpengaruh.
            </p>
            <div className="flex justify-center gap-3">
              <button onClick={closeCategoryModals} disabled={isSubmitting} className="flex-1 py-2.5 rounded-[10px] border border-slate-300 font-semibold text-slate-600 hover:bg-slate-100 transition disabled:opacity-50">
                Batal
              </button>
              <button onClick={handleDeleteCategory} disabled={isSubmitting} className="flex-1 py-2.5 rounded-[10px] bg-red-500 font-semibold text-white hover:bg-red-600 transition shadow-sm disabled:opacity-50 flex items-center justify-center gap-2">
                {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL TAMBAH KOMODITAS ================= */}
      {isCommodityAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-[20px] w-full max-w-[500px] overflow-hidden shadow-2xl border border-slate-200 flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
              <h3 className="text-[18px] font-bold text-[#005941]">Tambah Komoditas</h3>
              <button onClick={closeCommodityModals} className="text-slate-400 hover:text-slate-600 transition">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 text-[14px]">
              <form onSubmit={handleAddCommodity} className="space-y-4">
                <div>
                  <label className="block text-[#273B4A] font-semibold mb-1">Nama Komoditas</label>
                  <input type="text" name="nama_komoditas" value={commodityForm.nama_komoditas} onChange={handleCommodityChange} required className="w-full px-4 py-2 border border-slate-300 rounded-[10px] focus:outline-none focus:border-[#006638]" placeholder="Misal: Ikan Tuna" />
                </div>
                <div>
                  <label className="block text-[#273B4A] font-semibold mb-1">Bapanas Match (Opsional)</label>
                  <select name="bapanas_match" value={commodityForm.bapanas_match} onChange={handleCommodityChange} className="w-full px-4 py-2 border border-slate-300 rounded-[10px] focus:outline-none focus:border-[#006638] bg-white">
                    <option value="">Tidak ada (harga acuan tidak tersedia)</option>
                    {bapanasOptions.map((k, i) => (
                      <option key={i} value={k}>{k}</option>
                    ))}
                  </select>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Nama komoditas yang cocok dengan data harga Bapanas untuk menghitung harga acuan.
                  </p>
                </div>
                <div>
                  <label className="block text-[#273B4A] font-semibold mb-1">Satuan</label>
                  <input type="text" name="satuan" value={commodityForm.satuan} onChange={handleCommodityChange} className="w-full px-4 py-2 border border-slate-300 rounded-[10px] focus:outline-none focus:border-[#006638]" placeholder="Kg" />
                </div>
                <div className="flex gap-3 pt-4">
                  <button type="button" onClick={closeCommodityModals} disabled={isCommoditySubmitting} className="flex-1 py-2.5 rounded-[10px] border border-slate-300 font-semibold text-slate-600 hover:bg-slate-100 transition disabled:opacity-50">
                    Batal
                  </button>
                  <button type="submit" disabled={isCommoditySubmitting} className="flex-1 py-2.5 rounded-[10px] bg-[#006638] font-semibold text-white hover:bg-[#00522d] transition shadow-sm disabled:opacity-50 flex items-center justify-center gap-2">
                    {isCommoditySubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                    Simpan
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL EDIT KOMODITAS ================= */}
      {isCommodityEditOpen && selectedCommodity && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-[20px] w-full max-w-[500px] overflow-hidden shadow-2xl border border-slate-200 flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
              <h3 className="text-[18px] font-bold text-[#005941]">Edit Komoditas</h3>
              <button onClick={closeCommodityModals} className="text-slate-400 hover:text-slate-600 transition">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 text-[14px]">
              <form onSubmit={handleEditCommodity} className="space-y-4">
                <div>
                  <label className="block text-[#273B4A] font-semibold mb-1">Nama Komoditas</label>
                  <input type="text" name="nama_komoditas" value={commodityForm.nama_komoditas} onChange={handleCommodityChange} required className="w-full px-4 py-2 border border-slate-300 rounded-[10px] focus:outline-none focus:border-[#006638]" />
                </div>
                <div>
                  <label className="block text-[#273B4A] font-semibold mb-1">Bapanas Match (Opsional)</label>
                  <select name="bapanas_match" value={commodityForm.bapanas_match} onChange={handleCommodityChange} className="w-full px-4 py-2 border border-slate-300 rounded-[10px] focus:outline-none focus:border-[#006638] bg-white">
                    <option value="">Tidak ada (harga acuan tidak tersedia)</option>
                    {bapanasOptions.map((k, i) => (
                      <option key={i} value={k}>{k}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[#273B4A] font-semibold mb-1">Satuan</label>
                  <input type="text" name="satuan" value={commodityForm.satuan} onChange={handleCommodityChange} className="w-full px-4 py-2 border border-slate-300 rounded-[10px] focus:outline-none focus:border-[#006638]" placeholder="Kg" />
                </div>
                <div className="flex gap-3 pt-4">
                  <button type="button" onClick={closeCommodityModals} disabled={isCommoditySubmitting} className="flex-1 py-2.5 rounded-[10px] border border-slate-300 font-semibold text-slate-600 hover:bg-slate-100 transition disabled:opacity-50">
                    Batal
                  </button>
                  <button type="submit" disabled={isCommoditySubmitting} className="flex-1 py-2.5 rounded-[10px] bg-[#006638] font-semibold text-white hover:bg-[#00522d] transition shadow-sm disabled:opacity-50 flex items-center justify-center gap-2">
                    {isCommoditySubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                    Simpan Perubahan
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL HAPUS KOMODITAS ================= */}
      {isCommodityDeleteOpen && selectedCommodity && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-[20px] w-full max-w-[400px] overflow-hidden shadow-2xl border border-slate-200 text-center p-8">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-sm">
              <Trash2 className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-[20px] font-bold text-[#273B4A] mb-2">Hapus Komoditas?</h3>
            <p className="text-[14px] text-slate-500 mb-8 leading-relaxed">
              Apakah Anda yakin ingin menghapus komoditas{" "}
              <strong>{selectedCommodity.nama_komoditas}</strong>? Produk terkait tidak akan memiliki harga acuan dari komoditas ini.
            </p>
            <div className="flex justify-center gap-3">
              <button onClick={closeCommodityModals} disabled={isCommoditySubmitting} className="flex-1 py-2.5 rounded-[10px] border border-slate-300 font-semibold text-slate-600 hover:bg-slate-100 transition disabled:opacity-50">
                Batal
              </button>
              <button onClick={handleDeleteCommodity} disabled={isCommoditySubmitting} className="flex-1 py-2.5 rounded-[10px] bg-red-500 font-semibold text-white hover:bg-red-600 transition shadow-sm disabled:opacity-50 flex items-center justify-center gap-2">
                {isCommoditySubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
