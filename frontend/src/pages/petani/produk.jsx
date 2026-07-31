import { useState, useEffect } from "react";
import Sidebar from "../../components/layout/Sidebar";
import { ChevronRight, ChevronLeft, Edit3, Trash2, Eye, X, UploadCloud, Loader2 } from "lucide-react";
import api from "../../config/axios"; // Import Axios Instance

export default function ProdukPage() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [page, setPage] = useState(1);
  
  const itemsPerPage = 4;
  const safeProducts = Array.isArray(products) ? products : [];
  const totalPages = Math.max(1, Math.ceil(safeProducts.length / itemsPerPage));
  const startIndex = (page - 1) * itemsPerPage;
  const currentProducts = safeProducts.slice(startIndex, startIndex + itemsPerPage);

  // States for Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  
  // State for Selected Product & Form Data
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  const initialFormState = {
    kategori: "",
    stok: "",
    harga_harapan: "",
    tanggal_panen: "",
    masa_layak: "",
    gambar: null
  };
  const [formData, setFormData] = useState(initialFormState);
  const [imagePreview, setImagePreview] = useState(null);

  // Fetch Products
  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      setFetchError(null);
      // HARDCODE TOKEN SEMENTARA UNTUK TESTING JIKA LOGIN BELUM JALAN
      const testToken = localStorage.getItem("token") || "11|bRDttRF4eF1WuflHocapjNqoF26hfU4a2AusID1E7a2abeb3";
      localStorage.setItem("token", testToken);

      const response = await api.get('/my-products');
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
      setFetchError("Gagal mengambil data produk dari server. Pastikan API menyala.");
      setProducts([]); // Fallback to empty array
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    Promise.resolve().then(() => fetchProducts());
  }, []);

  // Helper functions to open modals
  const openDetailModal = (product) => {
    setSelectedProduct(product);
    setIsDetailModalOpen(true);
  };

  const openAddModal = () => {
    setFormData(initialFormState);
    setImagePreview(null);
    setIsAddModalOpen(true);
  };

  const openEditModal = (product) => {
    setSelectedProduct(product);
    setFormData({
      kategori: product.kategori,
      stok: product.stok,
      harga_harapan: product.harga_harapan,
      tanggal_panen: product.tanggal_panen,
      masa_layak: product.masa_layak,
      gambar: null // File direset, preview pakai path dari server
    });
    setImagePreview(product.gambar ? `http://localhost:8000/storage/${product.gambar}` : null);
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

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const payload = new FormData();
    Object.keys(formData).forEach(key => {
      if (formData[key] !== null) {
        payload.append(key, formData[key]);
      }
    });

    try {
      await api.post('/products', payload, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      fetchProducts();
      closeAllModals();
    } catch (error) {
      console.error("Gagal menambah produk", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const payload = new FormData();
    Object.keys(formData).forEach(key => {
      // Hanya append jika ada value. Untuk gambar, hanya append jika user benar2 milih file baru
      if (formData[key] !== null && formData[key] !== "") {
        payload.append(key, formData[key]);
      }
    });
    payload.append('_method', 'PUT'); // Laravel requirement for multipart/form-data update

    try {
      await api.post(`/products/${selectedProduct.id}`, payload, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      fetchProducts();
      closeAllModals();
    } catch (error) {
      console.error("Gagal mengupdate produk", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteSubmit = async () => {
    setIsSubmitting(true);
    try {
      await api.delete(`/products/${selectedProduct.id}`);
      fetchProducts();
      closeAllModals();
    } catch (error) {
      console.error("Gagal menghapus produk", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white font-[Montserrat] text-slate-900">
      <div className="flex w-full min-h-screen p-4 pl-[304px]">
        <Sidebar />

        {/* Outer Container Wrapper */}
        <div className="flex-1 bg-[rgba(222,236,225,0.19)] border border-[rgba(0,154,38,0.19)] rounded-[20px] p-8 relative">
          
          {/* Top Header */}
          <div className="flex items-end justify-between border-b border-[#029154] pb-2 mb-6">
            <h2 className="text-[24px] font-semibold text-[#005941]">Produk saya</h2>
            <img src="/images/ikan1.png" alt="avatar" className="w-10 h-10 rounded-full border border-slate-100 object-cover translate-y-[4px]" />
          </div>

          {/* Sub Header (Deskripsi & Tombol Tambah) */}
          <div className="flex items-center justify-between mb-4">
            <p className="text-[14px] text-slate-500">Kelola produk hasil panen anda</p>
            <button 
              onClick={openAddModal}
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
                  {isLoading ? (
                    <tr>
                      <td colSpan="7" className="text-center py-10">
                        <div className="flex items-center justify-center gap-2 text-[#006638]">
                           <Loader2 className="w-6 h-6 animate-spin" />
                           <span className="font-semibold">Memuat produk...</span>
                        </div>
                      </td>
                    </tr>
                  ) : fetchError ? (
                    <tr>
                      <td colSpan="7" className="text-center py-10 text-red-500 font-semibold bg-red-50">
                        {fetchError}
                      </td>
                    </tr>
                  ) : currentProducts.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="text-center py-10 text-slate-500 font-medium">
                        Belum ada produk yang ditambahkan.
                      </td>
                    </tr>
                  ) : (
                    currentProducts.map((p) => (
                      <tr key={p.id} className="border-b border-black/[0.13] last:border-b-0 hover:bg-slate-50/50 transition">
                        <td className="py-4 px-2 text-[14px] font-semibold text-[#273B4A]">
                          <div className="flex items-center gap-3">
                            <img src={p.gambar ? `http://localhost:8000/storage/${p.gambar}` : "/images/placeholder.png"} alt={p.kategori} className="w-[50px] h-[50px] object-cover rounded-[5px] border border-slate-200" />
                            {p.kategori}
                          </div>
                        </td>
                        <td className="py-4 px-2 text-[14px] font-semibold text-[#273B4A]">{p.stok} {p.satuan}</td>
                        <td className="py-4 px-2 text-[14px] font-semibold text-[#273B4A]">Rp {Number(p.harga_harapan).toLocaleString('id-ID')}</td>
                        <td className="py-4 px-2 text-[14px] font-semibold text-[#273B4A]">{p.tanggal_panen}</td>
                        <td className="py-4 px-2 text-[14px] font-semibold text-[#273B4A]">{p.masa_layak} Hari</td>
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
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Bottom Pagination Info & Controls */}
          <div className="flex items-center justify-between mt-6 px-2">
            <span className="text-[16px] font-semibold text-black/[0.51]">
              Menampilkan {products.length === 0 ? 0 : startIndex + 1}-{Math.min(startIndex + itemsPerPage, products.length)} dari {products.length} produk
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
              <label className="shrink-0 w-full sm:w-[250px] h-[200px] border-2 border-dashed border-slate-300 rounded-[12px] bg-slate-50 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-slate-100 hover:border-[#006638] transition group p-4 overflow-hidden relative">
                {imagePreview ? (
                   <img src={imagePreview} alt="Preview" className="w-full h-full object-cover absolute inset-0" />
                ) : (
                   <>
                    <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center mb-3 group-hover:scale-110 transition">
                      <UploadCloud className="w-6 h-6 text-[#006638]" />
                    </div>
                    <span className="font-semibold text-[#273B4A]">Klik untuk unggah foto produk</span>
                    <span className="text-[12px] text-slate-500 mt-1">PNG, JPG, maksimal 5MB</span>
                   </>
                )}
                <input type="file" className="hidden" accept="image/png, image/jpeg, image/jpg" onChange={handleImageChange} />
              </label>

              {/* Form Input Section (Right) */}
              <div className="flex-1 space-y-4">
                <div className="space-y-1">
                  <label className="font-semibold text-[#273B4A] text-[13px]">Kategori Produk</label>
                  <select name="kategori" value={formData.kategori} onChange={handleInputChange} className="w-full border border-slate-300 rounded-[10px] px-3 py-2 text-slate-700 focus:outline-none focus:border-[#006638] bg-white">
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
                      <input type="number" name="stok" value={formData.stok} onChange={handleInputChange} className="w-full px-3 py-2 outline-none text-slate-700" placeholder="0" />
                      <span className="bg-slate-100 px-3 py-2 font-medium text-slate-500 border-l border-slate-300">Kg</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-[#273B4A] text-[13px]">Harga Harapan</label>
                    <div className="flex items-center border border-slate-300 rounded-[10px] overflow-hidden focus-within:border-[#006638]">
                      <span className="bg-slate-100 px-3 py-2 font-medium text-slate-500 border-r border-slate-300">Rp</span>
                      <input type="number" name="harga_harapan" value={formData.harga_harapan} onChange={handleInputChange} className="w-full px-3 py-2 outline-none text-slate-700" placeholder="0" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-semibold text-[#273B4A] text-[13px]">Tanggal Panen</label>
                    <input type="date" name="tanggal_panen" value={formData.tanggal_panen} onChange={handleInputChange} className="w-full border border-slate-300 rounded-[10px] px-3 py-2 text-slate-700 focus:outline-none focus:border-[#006638]" />
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-[#273B4A] text-[13px]">Masa Layak</label>
                    <div className="flex items-center border border-slate-300 rounded-[10px] overflow-hidden focus-within:border-[#006638]">
                      <input type="number" name="masa_layak" value={formData.masa_layak} onChange={handleInputChange} className="w-full px-3 py-2 outline-none text-slate-700" placeholder="0" />
                      <span className="bg-slate-100 px-3 py-2 font-medium text-slate-500 border-l border-slate-300">Hari</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-200 p-4 shrink-0 bg-slate-50 flex justify-end gap-3">
              <button onClick={closeAllModals} disabled={isSubmitting} className="px-5 py-2.5 rounded-[10px] border border-slate-300 font-semibold text-slate-600 hover:bg-slate-100 transition disabled:opacity-50">
                Batal
              </button>
              <button onClick={handleAddSubmit} disabled={isSubmitting} className="px-5 py-2.5 rounded-[10px] bg-[#006638] font-semibold text-white hover:bg-[#00522d] transition shadow-sm disabled:opacity-50 flex items-center gap-2">
                {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
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
              <label className="shrink-0 w-full sm:w-[250px] space-y-2 cursor-pointer">
                <div className="relative rounded-[12px] border border-slate-200 overflow-hidden group">
                  <img src={imagePreview} alt="Product" className="w-full h-[200px] object-cover" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition cursor-pointer">
                    <div className="bg-white px-4 py-2 rounded-full font-semibold text-[#006638] text-[13px] shadow-md flex items-center gap-2">
                      <UploadCloud className="w-4 h-4" /> Ubah Foto
                    </div>
                  </div>
                </div>
                <p className="text-[12px] text-slate-500 text-center">Klik gambar untuk mengubah</p>
                <input type="file" className="hidden" accept="image/png, image/jpeg, image/jpg" onChange={handleImageChange} />
              </label>

              {/* Form Input Section (Right) */}
              <div className="flex-1 space-y-4">
                <div className="space-y-1">
                  <label className="font-semibold text-[#273B4A] text-[13px]">Kategori Produk</label>
                  <select name="kategori" value={formData.kategori} onChange={handleInputChange} className="w-full border border-slate-300 rounded-[10px] px-3 py-2 text-slate-700 focus:outline-none focus:border-[#006638] bg-white">
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
                      <input type="number" name="stok" value={formData.stok} onChange={handleInputChange} className="w-full px-3 py-2 outline-none text-slate-700" />
                      <span className="bg-slate-100 px-3 py-2 font-medium text-slate-500 border-l border-slate-300">Kg</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-[#273B4A] text-[13px]">Harga Harapan</label>
                    <div className="flex items-center border border-slate-300 rounded-[10px] overflow-hidden focus-within:border-[#006638]">
                      <span className="bg-slate-100 px-3 py-2 font-medium text-slate-500 border-r border-slate-300">Rp</span>
                      <input type="number" name="harga_harapan" value={formData.harga_harapan} onChange={handleInputChange} className="w-full px-3 py-2 outline-none text-slate-700" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-semibold text-[#273B4A] text-[13px]">Tanggal Panen</label>
                    <input type="date" name="tanggal_panen" value={formData.tanggal_panen} onChange={handleInputChange} className="w-full border border-slate-300 rounded-[10px] px-3 py-2 text-slate-700 focus:outline-none focus:border-[#006638]" />
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-[#273B4A] text-[13px]">Masa Layak</label>
                    <div className="flex items-center border border-slate-300 rounded-[10px] overflow-hidden focus-within:border-[#006638]">
                      <input type="number" name="masa_layak" value={formData.masa_layak} onChange={handleInputChange} className="w-full px-3 py-2 outline-none text-slate-700" />
                      <span className="bg-slate-100 px-3 py-2 font-medium text-slate-500 border-l border-slate-300">Hari</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-200 p-4 shrink-0 bg-slate-50 flex justify-end gap-3">
              <button onClick={closeAllModals} disabled={isSubmitting} className="px-5 py-2.5 rounded-[10px] border border-slate-300 font-semibold text-slate-600 hover:bg-slate-100 transition disabled:opacity-50">
                Batal
              </button>
              <button onClick={handleEditSubmit} disabled={isSubmitting} className="px-5 py-2.5 rounded-[10px] bg-[#006638] font-semibold text-white hover:bg-[#00522d] transition shadow-sm disabled:opacity-50 flex items-center gap-2">
                {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
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
              Apakah Anda yakin ingin menghapus produk <strong>{selectedProduct.kategori}</strong>? Tindakan ini tidak dapat dibatalkan.
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
              <div className="rounded-[12px] border border-slate-200 p-2 bg-slate-50 shrink-0 w-full sm:w-[250px] h-fit flex items-center justify-center">
                 <img src={selectedProduct.gambar ? `http://localhost:8000/storage/${selectedProduct.gambar}` : "/images/placeholder.png"} alt={selectedProduct.kategori} className="w-full h-[200px] object-cover rounded-[8px]" />
              </div>
              
              {/* Details Section (Right) */}
              <div className="flex-1 space-y-3">
                <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                  <span className="text-slate-500 text-[14px]">Kategori</span>
                  <span className="font-bold text-[#273B4A]">{selectedProduct.kategori}</span>
                </div>
                <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                  <span className="text-slate-500 text-[14px]">Stok Tersedia</span>
                  <span className="font-semibold text-[#273B4A]">{selectedProduct.stok} {selectedProduct.satuan}</span>
                </div>
                <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                  <span className="text-slate-500 text-[14px]">Harga Harapan</span>
                  <span className="font-bold text-[#006638]">Rp {Number(selectedProduct.harga_harapan).toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                  <span className="text-slate-500 text-[14px]">Tanggal Panen</span>
                  <span className="font-semibold text-[#273B4A]">{selectedProduct.tanggal_panen}</span>
                </div>
                <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                  <span className="text-slate-500 text-[14px]">Masa Layak</span>
                  <span className="font-semibold text-[#273B4A]">{selectedProduct.masa_layak} Hari</span>
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
