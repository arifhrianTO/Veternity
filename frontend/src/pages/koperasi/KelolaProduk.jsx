import { useState, useEffect, useRef } from "react";
import Sidebar from "../../components/layout/Sidebar";
import PageHeader from "../../components/layout/PageHeader";
import api from "../../config/axios";
import { Search, Plus, Edit3, Trash2, ChevronLeft, ChevronRight, Eye, X, Upload, Loader2 } from "lucide-react";
import { swalError } from "../../utils/swal";

const storageUrl = (path) => (path ? `http://localhost:8000/storage/${path}` : "/images/beras.png");

export default function KoperasiKelolaProduk() {
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State untuk Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedDetailItem, setSelectedDetailItem] = useState(null);
  const [productToEdit, setProductToEdit] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);

  // State Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Form Upload Image Reference
  const fileInputRef = useRef(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [hargaAcuanPreview, setHargaAcuanPreview] = useState(null);

  // Data dari server
  const [produkList, setProdukList] = useState([]);
  const [binaanList, setBinaanList] = useState([]);
  const [categories, setCategories] = useState([]);

  // Form State untuk Tambah
  const [addFormData, setAddFormData] = useState({
    nama: "", pemilik_id: "", category_id: "", commodity_id: "", komoditas_acuan: "", stok: "", harga_harapan: "", tanggal_panen: "", masa_layak: "", status: "Aktif"
  });

  const fetchCategories = async () => {
    try {
      const res = await api.get("/categories", { params: { with_commodities: 1 } });
      setCategories(res.data.data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setCategories([]);
    }
  };

  // Kategori & komoditas terpilih (untuk dropdown cascade di form tambah/edit)
  const selectedCategoryObj = categories.find(
    (c) => c.id === Number(addFormData.category_id)
  );
  const addCommodityOptions = selectedCategoryObj?.commodities || [];

  const editCategoryObj = categories.find(
    (c) => c.id === Number(productToEdit?.category_id)
  );
  const editCommodityOptions = editCategoryObj?.commodities || [];

  const fetchProduk = async () => {
    try {
      setLoading(true);
      setFetchError(null);
      const res = await api.get("/koperasi/produk");
      setProdukList(res.data || []);
    } catch (error) {
      console.error("Error fetching produk:", error);
      setFetchError("Gagal mengambil data produk dari server.");
      setProdukList([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchBinaan = async () => {
    try {
      const res = await api.get("/koperasi/binaan");
      setBinaanList(res.data || []);
    } catch (error) {
      console.error("Error fetching binaan:", error);
      setBinaanList([]);
    }
  };

  useEffect(() => {
    Promise.resolve().then(() => {
      fetchProduk();
      fetchBinaan();
      fetchCategories();
    });
  }, []);

  const productName = (p) => p?.category?.nama_kategori || p?.kategori || "Produk";
  const ownerName = (p) => p?.user?.nama_lengkap || "Koperasi";

  // ==================== HANDLER TAMBAH PRODUK ====================
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAddFormData((prev) => ({ ...prev, gambar: file }));
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleAddInputChange = (e) => {
    const { name, value } = e.target;
    setAddFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddCategoryChange = (e) => {
    setAddFormData((prev) => ({
      ...prev,
      category_id: e.target.value,
      commodity_id: "",
      komoditas_acuan: "",
    }));
    setHargaAcuanPreview(null);
  };

  const handleAddCommodityChange = async (e) => {
    const commodityId = e.target.value;
    const commodity = addCommodityOptions.find((c) => c.id === Number(commodityId));
    const bapanasMatch = commodity?.bapanas_match || "";
    setAddFormData((prev) => ({
      ...prev,
      commodity_id: commodityId,
      komoditas_acuan: bapanasMatch,
    }));

    if (!bapanasMatch) {
      setHargaAcuanPreview(null);
      return;
    }
    try {
      const res = await api.get('/bapanas/latest-price', { params: { commodity: bapanasMatch } });
      setHargaAcuanPreview(res.data.price);
    } catch (error) {
      console.error("Harga acuan tidak ditemukan", error);
      setHargaAcuanPreview(null);
    }
  };

  const handleSaveAddProduct = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const payload = new FormData();
    payload.append("nama_produk", addFormData.nama);
    if (addFormData.category_id) payload.append("category_id", addFormData.category_id);
    if (addFormData.commodity_id) payload.append("commodity_id", addFormData.commodity_id);
    if (addFormData.komoditas_acuan) payload.append("komoditas_acuan", addFormData.komoditas_acuan);
    if (addFormData.pemilik_id) payload.append("pemilik_id", addFormData.pemilik_id);
    payload.append("stok", addFormData.stok);
    payload.append("harga_harapan", addFormData.harga_harapan);
    payload.append("tanggal_panen", addFormData.tanggal_panen);
    payload.append("masa_layak", addFormData.masa_layak);
    payload.append("status", addFormData.status);
    if (addFormData.gambar) payload.append("gambar", addFormData.gambar);

    try {
      await api.post("/products", payload, { headers: { "Content-Type": "multipart/form-data" } });
      await fetchProduk();
      setIsAddModalOpen(false);
      setAddFormData({ nama: "", pemilik_id: "", category_id: "", commodity_id: "", komoditas_acuan: "", stok: "", harga_harapan: "", tanggal_panen: "", masa_layak: "", status: "Aktif" });
      setPreviewImage(null);
    } catch (error) {
      console.error("Gagal menambah produk:", error);
      swalError("Gagal menambah produk", error.response?.data?.message || "Terjadi kesalahan saat menambah produk.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ==================== HANDLER EDIT PRODUK ====================
  const openEditModal = (item) => {
    setProductToEdit({
      id: item.id,
      nama: productName(item),
      pemilik_id: item.user_id,
      category_id: item.category_id || "",
      commodity_id: item.commodity_id || "",
      komoditas_acuan: item.komoditas_acuan || "",
      stok: item.stok,
      harga_harapan: item.harga_harapan,
      tanggal_panen: item.tanggal_panen,
      masa_layak: item.masa_layak,
      status: item.status,
    });
    setPreviewImage(item.gambar ? storageUrl(item.gambar) : null);
    setHargaAcuanPreview(item.harga_acuan || null);
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setProductToEdit((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditCategoryChange = (e) => {
    setProductToEdit((prev) => ({
      ...prev,
      category_id: e.target.value,
      commodity_id: "",
      komoditas_acuan: "",
    }));
    setHargaAcuanPreview(null);
  };

  const handleEditCommodityChange = async (e) => {
    const commodityId = e.target.value;
    const commodity = editCommodityOptions.find((c) => c.id === Number(commodityId));
    const bapanasMatch = commodity?.bapanas_match || "";
    setProductToEdit((prev) => ({
      ...prev,
      commodity_id: commodityId,
      komoditas_acuan: bapanasMatch,
    }));

    if (!bapanasMatch) {
      setHargaAcuanPreview(null);
      return;
    }
    try {
      const res = await api.get('/bapanas/latest-price', { params: { commodity: bapanasMatch } });
      setHargaAcuanPreview(res.data.price);
    } catch (error) {
      console.error("Harga acuan tidak ditemukan", error);
      setHargaAcuanPreview(null);
    }
  };

  const handleSaveEditProduct = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const payload = new FormData();
    payload.append("nama_produk", productToEdit.nama);
    if (productToEdit.category_id) payload.append("category_id", productToEdit.category_id);
    if (productToEdit.commodity_id) payload.append("commodity_id", productToEdit.commodity_id);
    if (productToEdit.komoditas_acuan) payload.append("komoditas_acuan", productToEdit.komoditas_acuan);
    payload.append("stok", productToEdit.stok);
    payload.append("harga_harapan", productToEdit.harga_harapan);
    payload.append("tanggal_panen", productToEdit.tanggal_panen);
    payload.append("masa_layak", productToEdit.masa_layak);
    payload.append("status", productToEdit.status);
    if (productToEdit.gambar instanceof File) {
      payload.append("gambar", productToEdit.gambar);
    }
    payload.append("_method", "PUT");

    try {
      await api.post(`/products/${productToEdit.id}`, payload, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      await fetchProduk();
      setProductToEdit(null); setPreviewImage(null); setHargaAcuanPreview(null);
    } catch (error) {
      console.error("Gagal mengupdate produk:", error);
      swalError("Gagal memperbarui produk", error.response?.data?.message || "Terjadi kesalahan saat menyimpan produk.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ==================== HANDLER HAPUS PRODUK ====================
  const openDeleteModal = (item) => setProductToDelete(item);

  const handleDeleteProduct = async () => {
    if (!productToDelete) return;
    setIsSubmitting(true);
    try {
      await api.delete(`/products/${productToDelete.id}`);
      await fetchProduk();
      setProductToDelete(null);
    } catch (error) {
      console.error("Gagal menghapus produk:", error);
      swalError("Gagal menghapus produk", error.response?.data?.message || "Terjadi kesalahan saat menghapus produk.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ==================== HANDLER DETAIL PRODUK ====================
  const openDetailModal = (item) => setSelectedDetailItem(item);

  // Filter + Pagination Logic
  const filtered = produkList.filter((p) =>
    productName(p).toLowerCase().includes(search.toLowerCase()) ||
    ownerName(p).toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
  const currentData = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const formatRupiah = (val) => "Rp " + Number(val).toLocaleString("id-ID");

  return (
    <div className="min-h-screen bg-white font-['Montserrat'] text-slate-900">
      <div className="flex w-full min-h-screen p-4 pl-[304px]">
        
        {/* Sidebar Koperasi */}
        <Sidebar />

        {/* Outer Main Container */}
        <div className="flex-1 bg-[rgba(222,236,225,0.19)] border border-[rgba(0,154,38,0.19)] rounded-[20px] p-6 flex flex-col h-[calc(100vh-32px)] overflow-hidden">
          <PageHeader title="Kelola Produk" />

            {/* Action Bar (Search & Tambah) */}
          <div className="flex items-center justify-between mb-4 shrink-0">
              {/* Search Bar */}
              <div className="relative w-[300px] h-[42px]">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#005941]" />
                <input
                  type="text"
                  placeholder="Cari Produk..."
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                  className="w-full h-full pl-12 pr-4 bg-white border border-[#006638] rounded-full text-[15px] font-medium text-[#006638] placeholder-[#006638] focus:outline-none"
                />
              </div>

              {/* Tombol Tambah */}
              <button 
                onClick={() => setIsAddModalOpen(true)}
                className="flex items-center justify-center gap-2 w-[180px] h-[42px] bg-gradient-to-r from-[#006638] to-[#029154] text-white font-semibold text-[16px] rounded-[5px] hover:opacity-95 transition shadow-sm"
              >
                <span>Tambah</span>
                <Plus className="w-5 h-5 stroke-[2.5]" />
              </button>
            </div>

          {/* Table Box Container */}
          <div className="bg-white/80 border border-[#029154] rounded-[15px] p-4 shadow-[0_0_4px_rgba(0,0,0,0.25)] flex flex-col flex-1 min-h-0">
              <div className="overflow-x-auto flex-1 flex flex-col min-h-[300px]">
                <table className="w-full text-left border-collapse flex flex-col h-full">
                  <thead className="table w-full table-fixed">
                    <tr className="text-[#273B4A] font-bold text-[13px] border-b-2 border-black/10">
                      <th className="pb-2 px-4">Produk</th>
                      <th className="pb-2 px-4 text-center">Pemilik</th>
                      <th className="pb-2 px-4 text-center">Stok</th>
                      <th className="pb-2 px-4 text-center leading-tight">Harga<br />Harapan</th>
                      <th className="pb-2 px-4 text-center">Status</th>
                      <th className="pb-2 px-4 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="w-full">
                    {loading ? (
                      <tr className="table w-full table-fixed">
                        <td colSpan={6} className="text-center py-10">
                          <div className="flex items-center justify-center gap-2 text-[#006638]">
                            <Loader2 className="w-6 h-6 animate-spin" />
                            <span className="font-semibold">Memuat produk...</span>
                          </div>
                        </td>
                      </tr>
                    ) : fetchError ? (
                      <tr className="table w-full table-fixed">
                        <td colSpan={6} className="text-center py-10 text-red-500 font-semibold bg-red-50">{fetchError}</td>
                      </tr>
                    ) : currentData.length === 0 ? (
                      <tr className="table w-full table-fixed">
                        <td colSpan={6} className="text-center py-10 text-slate-500 font-medium">Belum ada produk yang ditambahkan.</td>
                      </tr>
                    ) : (
                      currentData.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50/50 transition border-b border-black/10 last:border-0 table w-full table-fixed">
                          <td className="py-2 px-4 font-semibold text-[#273B4A] text-[13px]">
                            <div className="flex items-center gap-2">
                              <img src={storageUrl(item.gambar)} alt={productName(item)} className="w-10 h-8 object-cover rounded-[5px] border border-slate-100" onError={(e) => { e.target.onerror = null; e.target.src = "/images/beras.png"; }} />
                              {productName(item)}
                            </div>
                          </td>
                          <td className="py-2 px-4 font-semibold text-[#273B4A] text-center text-[13px]">{ownerName(item)}</td>
                          <td className="py-2 px-4 font-semibold text-[#273B4A] text-center text-[13px]">{item.stok} {item.satuan || "Kg"}</td>
                          <td className="py-2 px-4 font-medium text-black/60 text-center text-[13px]">{formatRupiah(item.harga_harapan)}</td>
                          <td className="py-2 px-4 text-center">
                            {item.status === "Aktif" ? (
                              <span className="bg-[rgba(0,174,43,0.19)] border border-[#006638] text-[#006638] px-2 py-0.5 rounded-[3px] text-[12px] font-semibold inline-block">Aktif</span>
                            ) : (
                              <span className="bg-red-100 border border-red-500 text-red-600 px-2 py-0.5 rounded-[3px] text-[12px] font-semibold inline-block">Tidak Aktif</span>
                            )}
                          </td>
                          <td className="py-2 px-4">
                            <div className="flex items-center justify-center gap-1.5">
                              <button onClick={() => openDetailModal(item)} className="w-7 h-7 rounded-[5px] bg-emerald-50 border border-emerald-200 text-[#006638] flex items-center justify-center hover:bg-emerald-100 transition shadow-sm">
                                <Eye className="w-3.5 h-3.5" />
                              </button>
                              <button onClick={() => openEditModal(item)} className="w-7 h-7 rounded-[5px] bg-white border border-[#0220E1] text-[#0004ED] flex items-center justify-center hover:bg-blue-50 transition shadow-sm">
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button onClick={() => openDeleteModal(item)} className="w-7 h-7 rounded-[5px] bg-white border border-[#E10206] text-[#FF0000] flex items-center justify-center hover:bg-red-50 transition shadow-sm">
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination Footer */}
              {filtered.length > itemsPerPage && (
                <div className="flex items-center justify-between mt-2 pt-3 border-t border-black/10 text-sm text-black/50 font-semibold shrink-0">
                  <div>
                    Menampilkan {(currentPage - 1) * itemsPerPage + 1}-
                    {Math.min(currentPage * itemsPerPage, filtered.length)} dari {filtered.length} produk
                  </div>
                  <div className="flex items-center gap-1">
                    <button 
                      onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                      disabled={currentPage === 1}
                      className="p-1 text-black/40 hover:text-black transition disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    
                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`w-8 h-8 rounded-[5px] font-semibold text-[15px] flex items-center justify-center transition ${
                          currentPage === i + 1
                            ? "bg-[#006638] text-white"
                            : "bg-white border border-[#006638] text-[#006638] hover:bg-slate-50"
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}

                    <button 
                      onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="p-1 text-black/40 hover:text-black transition disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}

        </div>
      </div>
      </div>
      {/* ========================================= */}
      {/* MODAL TAMBAH PRODUK */}
      {/* ========================================= */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-[700px] rounded-[20px] p-8 shadow-2xl relative my-auto">
            <div className="flex items-center justify-between mb-6 border-b border-[#029154] pb-4">
              <h2 className="text-[22px] font-semibold text-[#005941]">Tambah Produk Baru</h2>
              <button onClick={() => { setIsAddModalOpen(false); setPreviewImage(null); setHargaAcuanPreview(null); }} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 transition">
                <X className="w-6 h-6 text-slate-500" />
              </button>
            </div>

            <form onSubmit={handleSaveAddProduct} className="space-y-6">
              <div className="flex flex-col items-center gap-3">
                <div 
                  className="w-[120px] h-[120px] rounded-lg border-2 border-dashed border-[#006638] bg-emerald-50 flex flex-col items-center justify-center overflow-hidden cursor-pointer hover:bg-emerald-100 transition relative"
                  onClick={() => fileInputRef.current.click()}
                >
                  {previewImage ? (
                    <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <><Upload className="w-6 h-6 text-[#006638] mb-1" /><span className="text-[11px] font-semibold text-[#006638] text-center px-2">Upload<br/>Gambar</span></>
                  )}
                </div>
                <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[14px] font-bold text-[#273B4A] mb-1.5">Nama Produk</label>
                  <input type="text" name="nama" value={addFormData.nama} onChange={handleAddInputChange} className="w-full border border-gray-300 rounded-[8px] p-2.5 text-[14px] font-medium outline-none focus:border-[#006638]" required />
                </div>
                <div>
                  <label className="block text-[14px] font-bold text-[#273B4A] mb-1.5">Kategori</label>
                  <select name="category_id" value={addFormData.category_id} onChange={handleAddCategoryChange} className="w-full border border-gray-300 rounded-[8px] p-2.5 text-[14px] font-medium outline-none focus:border-[#006638] bg-white">
                    <option value="">Pilih Kategori...</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.nama_kategori}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[14px] font-bold text-[#273B4A] mb-1.5">Komoditas</label>
                  <select name="commodity_id" value={addFormData.commodity_id} onChange={handleAddCommodityChange} disabled={!addFormData.category_id} className="w-full border border-gray-300 rounded-[8px] p-2.5 text-[14px] font-medium outline-none focus:border-[#006638] bg-white disabled:bg-slate-50 disabled:text-slate-400">
                    <option value="">Pilih Komoditas...</option>
                    {addCommodityOptions.map((c) => (
                      <option key={c.id} value={c.id}>{c.nama_komoditas}</option>
                    ))}
                  </select>
                  {hargaAcuanPreview && (
                    <p className="text-[12px] text-[#006638] font-medium mt-1">
                      Harga acuan Bapanas: Rp {Number(hargaAcuanPreview).toLocaleString("id-ID")} / kg
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-[14px] font-bold text-[#273B4A] mb-1.5">Pemilik</label>
                  <select name="pemilik_id" value={addFormData.pemilik_id} onChange={handleAddInputChange} className="w-full border border-gray-300 rounded-[8px] p-2.5 text-[14px] font-medium outline-none focus:border-[#006638] bg-white">
                    <option value="">Koperasi sendiri</option>
                    {binaanList.map((b) => (
                      <option key={b.id} value={b.id}>{b.nama_lengkap} ({b.role})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[14px] font-bold text-[#273B4A] mb-1.5">Stok</label>
                  <input type="number" name="stok" value={addFormData.stok} onChange={handleAddInputChange} placeholder="Contoh: 50" className="w-full border border-gray-300 rounded-[8px] p-2.5 text-[14px] font-medium outline-none focus:border-[#006638]" required />
                </div>
                <div>
                  <label className="block text-[14px] font-bold text-[#273B4A] mb-1.5">Harga Harapan</label>
                  <input type="number" name="harga_harapan" value={addFormData.harga_harapan} onChange={handleAddInputChange} placeholder="Contoh: 14000" className="w-full border border-gray-300 rounded-[8px] p-2.5 text-[14px] font-medium outline-none focus:border-[#006638]" required />
                </div>
                <div>
                  <label className="block text-[14px] font-bold text-[#273B4A] mb-1.5">Tanggal Panen</label>
                  <input type="date" name="tanggal_panen" value={addFormData.tanggal_panen} onChange={handleAddInputChange} className="w-full border border-gray-300 rounded-[8px] p-2.5 text-[14px] font-medium outline-none focus:border-[#006638]" required />
                </div>
                <div>
                  <label className="block text-[14px] font-bold text-[#273B4A] mb-1.5">Masa Layak (Hari)</label>
                  <input type="number" name="masa_layak" value={addFormData.masa_layak} onChange={handleAddInputChange} placeholder="Contoh: 7" className="w-full border border-gray-300 rounded-[8px] p-2.5 text-[14px] font-medium outline-none focus:border-[#006638]" required />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[14px] font-bold text-[#273B4A] mb-1.5">Status</label>
                  <select name="status" value={addFormData.status} onChange={handleAddInputChange} className="w-full border border-gray-300 rounded-[8px] p-2.5 text-[14px] font-medium outline-none focus:border-[#006638] bg-white">
                    <option value="Aktif">Aktif</option>
                    <option value="Tidak Aktif">Tidak Aktif</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 mt-6">
                <button type="button" onClick={() => { setIsAddModalOpen(false); setPreviewImage(null); setHargaAcuanPreview(null); }} disabled={isSubmitting} className="px-6 py-2 border border-slate-300 text-slate-600 rounded-[8px] font-semibold hover:bg-slate-50 transition disabled:opacity-50">Batal</button>
                <button type="submit" disabled={isSubmitting} className="px-6 py-2 bg-[#006638] text-white rounded-[8px] font-semibold hover:bg-emerald-800 transition shadow-sm disabled:opacity-50 flex items-center gap-2">
                  {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  Simpan Produk
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================= */}
      {/* MODAL EDIT PRODUK */}
      {/* ========================================= */}
      {productToEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-[700px] rounded-[20px] p-8 shadow-2xl relative my-auto">
            <div className="flex items-center justify-between mb-6 border-b border-[#029154] pb-4">
              <h2 className="text-[22px] font-semibold text-[#005941]">Edit Produk</h2>
              <button onClick={() => { setProductToEdit(null); setPreviewImage(null); setHargaAcuanPreview(null); }} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 transition">
                <X className="w-6 h-6 text-slate-500" />
              </button>
            </div>

            <form onSubmit={handleSaveEditProduct} className="space-y-6">
              <div className="flex flex-col items-center gap-3">
                <div 
                  className="w-[120px] h-[120px] rounded-lg border-2 border-dashed border-[#006638] bg-emerald-50 flex flex-col items-center justify-center overflow-hidden cursor-pointer hover:bg-emerald-100 transition relative"
                  onClick={() => fileInputRef.current.click()}
                >
                  {previewImage ? (
                    <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <><Upload className="w-6 h-6 text-[#006638] mb-1" /><span className="text-[11px] font-semibold text-[#006638] text-center px-2">Upload<br/>Gambar</span></>
                  )}
                </div>
                <input type="file" ref={fileInputRef} onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    setProductToEdit((prev) => ({ ...prev, gambar: file }));
                    setPreviewImage(URL.createObjectURL(file));
                  }
                }} accept="image/*" className="hidden" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[14px] font-bold text-[#273B4A] mb-1.5">Nama Produk</label>
                  <input type="text" name="nama" value={productToEdit.nama} onChange={handleEditInputChange} className="w-full border border-gray-300 rounded-[8px] p-2.5 text-[14px] font-medium outline-none focus:border-[#006638]" required />
                </div>
                <div>
                  <label className="block text-[14px] font-bold text-[#273B4A] mb-1.5">Kategori</label>
                  <select name="category_id" value={productToEdit.category_id} onChange={handleEditCategoryChange} className="w-full border border-gray-300 rounded-[8px] p-2.5 text-[14px] font-medium outline-none focus:border-[#006638] bg-white">
                    <option value="">Pilih Kategori...</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.nama_kategori}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[14px] font-bold text-[#273B4A] mb-1.5">Komoditas</label>
                  <select name="commodity_id" value={productToEdit.commodity_id} onChange={handleEditCommodityChange} disabled={!productToEdit.category_id} className="w-full border border-gray-300 rounded-[8px] p-2.5 text-[14px] font-medium outline-none focus:border-[#006638] bg-white disabled:bg-slate-50 disabled:text-slate-400">
                    <option value="">Pilih Komoditas...</option>
                    {editCommodityOptions.map((c) => (
                      <option key={c.id} value={c.id}>{c.nama_komoditas}</option>
                    ))}
                  </select>
                  {hargaAcuanPreview && (
                    <p className="text-[12px] text-[#006638] font-medium mt-1">
                      Harga acuan Bapanas: Rp {Number(hargaAcuanPreview).toLocaleString("id-ID")} / kg
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-[14px] font-bold text-[#273B4A] mb-1.5">Stok</label>
                  <input type="number" name="stok" value={productToEdit.stok} onChange={handleEditInputChange} className="w-full border border-gray-300 rounded-[8px] p-2.5 text-[14px] font-medium outline-none focus:border-[#006638]" required />
                </div>
                <div>
                  <label className="block text-[14px] font-bold text-[#273B4A] mb-1.5">Harga Harapan</label>
                  <input type="number" name="harga_harapan" value={productToEdit.harga_harapan} onChange={handleEditInputChange} className="w-full border border-gray-300 rounded-[8px] p-2.5 text-[14px] font-medium outline-none focus:border-[#006638]" required />
                </div>
                <div>
                  <label className="block text-[14px] font-bold text-[#273B4A] mb-1.5">Tanggal Panen</label>
                  <input type="date" name="tanggal_panen" value={productToEdit.tanggal_panen} onChange={handleEditInputChange} className="w-full border border-gray-300 rounded-[8px] p-2.5 text-[14px] font-medium outline-none focus:border-[#006638]" required />
                </div>
                <div>
                  <label className="block text-[14px] font-bold text-[#273B4A] mb-1.5">Masa Layak (Hari)</label>
                  <input type="number" name="masa_layak" value={productToEdit.masa_layak} onChange={handleEditInputChange} className="w-full border border-gray-300 rounded-[8px] p-2.5 text-[14px] font-medium outline-none focus:border-[#006638]" required />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[14px] font-bold text-[#273B4A] mb-1.5">Status</label>
                  <select name="status" value={productToEdit.status} onChange={handleEditInputChange} className="w-full border border-gray-300 rounded-[8px] p-2.5 text-[14px] font-medium outline-none focus:border-[#006638] bg-white">
                    <option value="Aktif">Aktif</option>
                    <option value="Tidak Aktif">Tidak Aktif</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 mt-6">
                <button type="button" onClick={() => { setProductToEdit(null); setPreviewImage(null); setHargaAcuanPreview(null); }} disabled={isSubmitting} className="px-6 py-2 border border-slate-300 text-slate-600 rounded-[8px] font-semibold hover:bg-slate-50 transition disabled:opacity-50">Batal</button>
                <button type="submit" disabled={isSubmitting} className="px-6 py-2 bg-[#0004ED] text-white rounded-[8px] font-semibold hover:bg-blue-800 transition shadow-sm disabled:opacity-50 flex items-center gap-2">
                  {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================= */}
      {/* MODAL KONFIRMASI HAPUS PRODUK */}
      {/* ========================================= */}
      {productToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-[400px] rounded-[20px] p-6 shadow-2xl text-center">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-[20px] font-bold text-[#273B4A] mb-2">Hapus Produk?</h3>
            <p className="text-[14px] text-slate-500 mb-6">
              Apakah Anda yakin ingin menghapus produk <b>{productName(productToDelete)}</b> milik <b>{ownerName(productToDelete)}</b>? Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="flex justify-center gap-3">
              <button onClick={() => setProductToDelete(null)} disabled={isSubmitting} className="px-6 py-2 border border-slate-300 text-slate-600 rounded-[8px] font-semibold hover:bg-slate-50 transition disabled:opacity-50">Batal</button>
              <button onClick={handleDeleteProduct} disabled={isSubmitting} className="px-6 py-2 bg-red-600 text-white rounded-[8px] font-semibold hover:bg-red-700 transition shadow-sm disabled:opacity-50 flex items-center gap-2">
                {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================= */}
      {/* MODAL DETAIL PRODUK */}
      {/* ========================================= */}
      {selectedDetailItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-[500px] rounded-[20px] p-6 shadow-2xl relative">
            <button onClick={() => setSelectedDetailItem(null)} className="absolute top-4 right-5 hover:bg-slate-100 transition p-1 rounded-full text-slate-600">
              <X className="w-6 h-6" />
            </button>
            
            <h2 className="text-[22px] font-semibold text-[#005941] mb-6 border-b border-[#029154] pb-4">
              Detail Produk
            </h2>

            <div className="flex flex-col items-center mb-6">
              <img 
                src={storageUrl(selectedDetailItem.gambar)} 
                alt={productName(selectedDetailItem)} 
                className="w-[180px] h-[120px] object-cover rounded-lg border border-slate-200 mb-4"
                onError={(e) => { e.target.onerror = null; e.target.src = "/images/beras.png"; }}
              />
              <h3 className="text-[24px] font-bold text-[#273B4A]">{selectedDetailItem.nama_produk || productName(selectedDetailItem)}</h3>
              <p className="text-[16px] font-medium text-slate-500">{ownerName(selectedDetailItem)}</p>
            </div>

            <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-[15px] font-medium text-slate-800 bg-slate-50 p-4 rounded-[12px] border border-slate-200">
              <div>
                <span className="block text-[12px] font-bold text-slate-400 mb-1">Stok</span>
                {selectedDetailItem.stok} {selectedDetailItem.satuan || "Kg"}
              </div>
              <div>
                <span className="block text-[12px] font-bold text-slate-400 mb-1">Harga Harapan</span>
                <span className="text-[#006638] font-bold">{formatRupiah(selectedDetailItem.harga_harapan)}</span>
              </div>
              <div>
                <span className="block text-[12px] font-bold text-slate-400 mb-1">Komoditas</span>
                {selectedDetailItem.commodity?.nama_komoditas || selectedDetailItem.komoditas_acuan || "-"}
              </div>
              <div>
                <span className="block text-[12px] font-bold text-slate-400 mb-1">Harga Acuan</span>
                <span className="text-slate-700 font-bold">
                  {selectedDetailItem.harga_acuan ? formatRupiah(selectedDetailItem.harga_acuan) + " / kg" : "-"}
                </span>
              </div>
              <div>
                <span className="block text-[12px] font-bold text-slate-400 mb-1">Tanggal Panen</span>
                {selectedDetailItem.tanggal_panen}
              </div>
              <div>
                <span className="block text-[12px] font-bold text-slate-400 mb-1">Masa Layak</span>
                {selectedDetailItem.masa_layak} Hari
              </div>
              <div className="col-span-2 pt-2 mt-2 border-t border-slate-200 flex justify-between items-center">
                <span className="text-[14px] font-bold text-slate-600">Status Produk:</span>
                {selectedDetailItem.status === "Aktif" ? (
                  <span className="bg-[rgba(0,174,43,0.19)] border border-[#006638] text-[#006638] px-3 py-1 rounded-[3px] text-[13px] font-semibold">Aktif</span>
                ) : (
                  <span className="bg-red-100 border border-red-500 text-red-600 px-3 py-1 rounded-[3px] text-[13px] font-semibold">Tidak Aktif</span>
                )}
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button onClick={() => setSelectedDetailItem(null)} className="px-6 py-2 bg-[#006638] text-white rounded-[8px] font-semibold hover:bg-emerald-800 transition shadow-sm">
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
