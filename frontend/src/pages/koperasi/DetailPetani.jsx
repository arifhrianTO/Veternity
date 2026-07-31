import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../config/axios";
import { ArrowLeft, Edit3, Trash2, X, Upload, Loader2 } from "lucide-react";

const storageUrl = (path) => (path ? `http://localhost:8000/storage/${path}` : "/images/user.png");

export default function DetailPetani() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("produk");
  const [isEditProfilOpen, setIsEditProfilOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [productToEdit, setProductToEdit] = useState(null);
  const fileInputRef = useRef(null);

  const [binaan, setBinaan] = useState(null);
  const [produkList, setProdukList] = useState([]);
  const [riwayatList, setRiwayatList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [editFormData, setEditFormData] = useState({});
  const [previewImage, setPreviewImage] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setFetchError(null);
      const res = await api.get(`/koperasi/binaan/${id}`);
      const data = res.data;
      setBinaan(data.binaan);
      setProdukList(data.products || []);
      setRiwayatList(data.orders || []);
    } catch (error) {
      console.error("Error fetching detail binaan:", error);
      setFetchError("Gagal mengambil data binaan dari server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    Promise.resolve().then(() => fetchData());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const productName = (p) => p?.category?.nama_kategori || p?.kategori || "Produk";
  const formatRupiah = (val) => "Rp " + Number(val || 0).toLocaleString("id-ID");

  // ====== HANDLER PROFIL ======
  const handleOpenEditProfil = () => {
    setEditFormData({
      nama_lengkap: binaan.nama_lengkap,
      nik: binaan.nik,
      no_hp: binaan.no_hp,
      tanggal_lahir: binaan.tanggal_lahir,
      kelamin: binaan.kelamin,
      alamat: binaan.alamat,
      rekening: binaan.rekening,
    });
    setPreviewImage(binaan.foto_profil ? `http://localhost:8000/storage/${binaan.foto_profil}` : null);
    setIsEditProfilOpen(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditFormData((prev) => ({ ...prev, foto: file }));
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleProfilInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveProfil = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const payload = new FormData();
    Object.keys(editFormData).forEach((key) => {
      if (editFormData[key] !== null && editFormData[key] !== "" && key !== "foto") {
        payload.append(key, editFormData[key]);
      }
    });
    if (editFormData.foto) payload.append("foto_profil", editFormData.foto);
    payload.append("_method", "PUT");

    try {
      await api.post(`/koperasi/binaan/${id}`, payload, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      await fetchData();
      setIsEditProfilOpen(false);
    } catch (error) {
      console.error("Gagal update profil:", error);
      alert(error.response?.data?.message || "Gagal memperbarui profil.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ====== HANDLER PRODUK ======
  const handleDeleteProduct = async () => {
    if (!productToDelete) return;
    setIsSubmitting(true);
    try {
      await api.delete(`/products/${productToDelete.id}`);
      await fetchData();
      setProductToDelete(null);
    } catch (error) {
      console.error("Gagal menghapus produk:", error);
      alert(error.response?.data?.message || "Gagal menghapus produk.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveEditProduct = async (e) => {
    e.preventDefault();
    if (!productToEdit) return;
    setIsSubmitting(true);
    const payload = new FormData();
    payload.append("kategori", productToEdit.nama);
    payload.append("stok", productToEdit.stok);
    payload.append("harga_harapan", productToEdit.harga_harapan);
    payload.append("tanggal_panen", productToEdit.tanggal_panen);
    payload.append("masa_layak", productToEdit.masa_layak);
    payload.append("status", productToEdit.status);
    payload.append("_method", "PUT");

    try {
      await api.post(`/products/${productToEdit.id}`, payload, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      await fetchData();
      setProductToEdit(null);
    } catch (error) {
      console.error("Gagal mengupdate produk:", error);
      alert(error.response?.data?.message || "Gagal memperbarui produk.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEditProduct = (prod) => {
    setProductToEdit({
      id: prod.id,
      nama: productName(prod),
      stok: prod.stok,
      harga_harapan: prod.harga_harapan,
      tanggal_panen: prod.tanggal_panen,
      masa_layak: prod.masa_layak,
      status: prod.status,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white font-['Montserrat'] text-slate-900 flex items-center justify-center">
        <div className="flex items-center gap-2 text-[#006638]">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span className="font-semibold">Memuat detail binaan...</span>
        </div>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="min-h-screen bg-white font-['Montserrat'] text-slate-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 font-semibold mb-4">{fetchError}</p>
          <button onClick={() => navigate(-1)} className="px-6 py-2 border-2 border-[#006638] text-[#006638] rounded-lg font-semibold">Kembali</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-['Montserrat'] text-slate-900 py-8 px-4 sm:px-6">
      <div className="w-full max-w-7xl mx-auto">
        {/* Header (Di Luar Border/Card) */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 flex items-center justify-center border-2 border-[#006638] rounded-full text-[#006638] hover:bg-emerald-50 transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-[24px] font-semibold text-[#005941]">
            Detail Petani Binaan
          </h2>
        </div>

        {/* Profil Card */}
        <div className="border border-[#006638] rounded-[20px] p-8 mb-8 bg-white flex flex-col md:flex-row items-center md:items-start gap-8 shadow-sm">
          <img
            src={storageUrl(binaan.foto_profil)}
            alt={binaan.nama_lengkap}
            className="w-[180px] h-[180px] rounded-full object-cover flex-shrink-0 border border-slate-200"
            onError={(e) => { e.target.onerror = null; e.target.src = "/images/user.png"; }}
          />

            <div className="flex-1 w-full">
              <div className="flex justify-between items-start mb-6">
                <h1 className="text-[28px] font-semibold text-[#006638] leading-tight">
                  {binaan.nama_lengkap}
                </h1>
                <button 
                  onClick={handleOpenEditProfil}
                  className="p-2 border-2 border-[#006638] rounded-lg text-[#006638] hover:bg-emerald-50 transition flex items-center gap-2 font-medium"
                >
                  <Edit3 className="w-5 h-5" />
                  Edit Profil
                </button>
              </div>

              <div className="grid grid-cols-[160px_1fr] gap-y-4 text-[16px] font-medium text-slate-800">
                <div className="font-semibold">Nik</div>
                <div>: {binaan.nik || "-"}</div>

                <div className="font-semibold">No Hp</div>
                <div>: {binaan.no_hp || "-"}</div>

                <div className="font-semibold">Alamat</div>
                <div>: {binaan.alamat || "-"}</div>

                <div className="font-semibold">Tanggal Lahir</div>
                <div>: {binaan.tanggal_lahir || "-"}</div>

                <div className="font-semibold">Rekening</div>
                <div>: {binaan.rekening || "-"}</div>
              </div>
            </div>
          </div>

          {/* Tab Switcher */}
          <div className="w-[300px] h-[50px] bg-white shadow-sm border border-slate-200 rounded-[10px] flex items-center mb-6 p-1 relative">
            <button
              onClick={() => setActiveTab("produk")}
              className={`flex-1 text-center text-[16px] font-semibold transition z-10 ${
                activeTab === "produk" ? "text-[#006638]" : "text-slate-500"
              }`}
            >
              Produk
            </button>
            <button
              onClick={() => setActiveTab("riwayat")}
              className={`flex-1 text-center text-[16px] font-semibold transition z-10 ${
                activeTab === "riwayat" ? "text-[#006638]" : "text-slate-500"
              }`}
            >
              Riwayat
            </button>
            
            <div
              className={`absolute bottom-[2px] h-[3px] bg-[#006638] transition-all duration-300 w-[140px] rounded-full ${
                activeTab === "produk" ? "left-1" : "left-[148px]"
              }`}
            />
          </div>

          {/* Content Tab */}
          <div className="border border-[#006638] rounded-[20px] p-6 bg-white shadow-sm">
            {activeTab === "produk" && (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="text-[#273B4A] font-bold text-[14px] border-b-2 border-slate-200">
                        <th className="pb-4 px-4">Produk</th>
                        <th className="pb-4 px-4">Stok</th>
                        <th className="pb-4 px-4">Harga Harapan</th>
                        <th className="pb-4 px-4">Tanggal Panen</th>
                        <th className="pb-4 px-4">Masa Layak</th>
                        <th className="pb-4 px-4">Status</th>
                        <th className="pb-4 px-4 text-center">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="text-[14px] font-medium text-[#273B4A]">
                      {produkList.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="text-center py-10 text-slate-500">Belum ada produk.</td>
                        </tr>
                      ) : (
                        produkList.map((prod) => (
                          <tr key={prod.id} className="border-b border-black/10 last:border-0 hover:bg-slate-50 transition">
                            <td className="py-3 px-4 font-semibold">{productName(prod)}</td>
                            <td className="py-3 px-4">{prod.stok} {prod.satuan || "Kg"}</td>
                            <td className="py-3 px-4">{formatRupiah(prod.harga_harapan)}</td>
                            <td className="py-3 px-4">{prod.tanggal_panen}</td>
                            <td className="py-3 px-4">{prod.masa_layak} Hari</td>
                            <td className="py-3 px-4">
                              <span className="bg-[rgba(0,174,43,0.19)] border border-[#006638] text-[#006638] px-3 py-1 rounded-[3px] text-[13px] font-semibold inline-block">
                                {prod.status}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center justify-center gap-2">
                                <button 
                                  onClick={() => openEditProduct(prod)}
                                  className="w-8 h-8 rounded-[5px] border border-[#0220E1] flex items-center justify-center text-[#0004ED] hover:bg-blue-50 transition shadow-sm"
                                >
                                  <Edit3 className="w-4 h-4" />
                                </button>
                                <button 
                                  onClick={() => setProductToDelete(prod)}
                                  className="w-8 h-8 rounded-[5px] border border-[#E10206] flex items-center justify-center text-[#FF0000] hover:bg-red-50 transition shadow-sm"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                </table>
              </div>
            )}

            {activeTab === "riwayat" && (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="text-[#273B4A] font-bold text-[14px] border-b-2 border-slate-200">
                        <th className="pb-4 px-4">No Pesanan</th>
                        <th className="pb-4 px-4">Pembeli</th>
                        <th className="pb-4 px-4">Produk</th>
                        <th className="pb-4 px-4">Total</th>
                        <th className="pb-4 px-4">Tanggal</th>
                        <th className="pb-4 px-4 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="text-[14px] font-medium text-[#273B4A]">
                      {riwayatList.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="text-center py-10 text-slate-500">Belum ada riwayat pesanan.</td>
                        </tr>
                      ) : (
                        riwayatList.map((rw) => (
                          <tr key={rw.id} className="border-b border-black/10 last:border-0 hover:bg-slate-50 transition">
                            <td className="py-3 px-4 font-semibold">{rw.kode_pesanan}</td>
                            <td className="py-3 px-4">{rw.pembeli?.nama_lengkap || "-"}</td>
                            <td className="py-3 px-4">{rw.items?.map((it) => it.nama_produk).join(", ") || "-"}</td>
                            <td className="py-3 px-4">{formatRupiah(rw.total_harga)}</td>
                            <td className="py-3 px-4">{rw.tanggal_pesanan}</td>
                            <td className="py-3 px-4 text-center">
                              <span className="bg-[rgba(0,174,43,0.19)] border border-[#006638] text-[#006638] px-3 py-1 rounded-[3px] text-[12px] font-semibold inline-block">
                                {rw.status}
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                </table>
              </div>
            )}
          </div>
      </div>

      {/* ========================================= */}
      {/* MODAL EDIT PROFIL */}
      {/* ========================================= */}
      {isEditProfilOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-[700px] rounded-[20px] p-8 shadow-2xl relative my-auto">
            <div className="flex items-center justify-between mb-6 border-b border-[#029154] pb-4">
              <h2 className="text-[22px] font-semibold text-[#005941]">Edit Profil Petani</h2>
              <button onClick={() => setIsEditProfilOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 transition">
                <X className="w-6 h-6 text-slate-500" />
              </button>
            </div>

            <form onSubmit={handleSaveProfil} className="space-y-6">
              <div className="flex flex-col items-center gap-3">
                <div 
                  className="w-[120px] h-[120px] rounded-full border-2 border-dashed border-[#006638] bg-emerald-50 flex flex-col items-center justify-center overflow-hidden cursor-pointer hover:bg-emerald-100 transition relative"
                  onClick={() => fileInputRef.current.click()}
                >
                  {previewImage ? (
                    <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <><Upload className="w-6 h-6 text-[#006638] mb-1" /><span className="text-[11px] font-semibold text-[#006638] text-center px-2">Upload<br/>Foto Profil</span></>
                  )}
                </div>
                <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[14px] font-bold text-[#273B4A] mb-1.5">Nama Lengkap</label>
                  <input type="text" name="nama_lengkap" value={editFormData.nama_lengkap} onChange={handleProfilInputChange} className="w-full border border-gray-300 rounded-[8px] p-2.5 text-[14px] font-medium outline-none focus:border-[#006638]" required />
                </div>
                <div>
                  <label className="block text-[14px] font-bold text-[#273B4A] mb-1.5">NIK</label>
                  <input type="text" name="nik" value={editFormData.nik} onChange={handleProfilInputChange} className="w-full border border-gray-300 rounded-[8px] p-2.5 text-[14px] font-medium outline-none focus:border-[#006638]" required />
                </div>
                <div>
                  <label className="block text-[14px] font-bold text-[#273B4A] mb-1.5">Nomor HP</label>
                  <input type="text" name="no_hp" value={editFormData.no_hp} onChange={handleProfilInputChange} className="w-full border border-gray-300 rounded-[8px] p-2.5 text-[14px] font-medium outline-none focus:border-[#006638]" required />
                </div>
                <div>
                  <label className="block text-[14px] font-bold text-[#273B4A] mb-1.5">Tanggal Lahir</label>
                  <input type="date" name="tanggal_lahir" value={editFormData.tanggal_lahir} onChange={handleProfilInputChange} className="w-full border border-gray-300 rounded-[8px] p-2.5 text-[14px] font-medium outline-none focus:border-[#006638]" required />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[14px] font-bold text-[#273B4A] mb-1.5">Nomor Rekening</label>
                  <input type="text" name="rekening" value={editFormData.rekening} onChange={handleProfilInputChange} className="w-full border border-gray-300 rounded-[8px] p-2.5 text-[14px] font-medium outline-none focus:border-[#006638]" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[14px] font-bold text-[#273B4A] mb-1.5">Alamat Lengkap</label>
                  <textarea name="alamat" value={editFormData.alamat} onChange={handleProfilInputChange} rows="3" className="w-full border border-gray-300 rounded-[8px] p-2.5 text-[14px] font-medium outline-none focus:border-[#006638] resize-none" required />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 mt-6">
                <button type="button" onClick={() => setIsEditProfilOpen(false)} disabled={isSubmitting} className="px-6 py-2 border border-slate-300 text-slate-600 rounded-[8px] font-semibold hover:bg-slate-50 transition disabled:opacity-50">Batal</button>
                <button type="submit" disabled={isSubmitting} className="px-6 py-2 bg-[#006638] text-white rounded-[8px] font-semibold hover:bg-emerald-800 transition shadow-sm disabled:opacity-50 flex items-center gap-2">
                  {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  Simpan Perubahan
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
          <div className="bg-white w-full max-w-[500px] rounded-[20px] p-8 shadow-2xl relative my-auto">
            <div className="flex items-center justify-between mb-6 border-b border-[#029154] pb-4">
              <h2 className="text-[20px] font-semibold text-[#005941]">Edit Produk</h2>
              <button onClick={() => setProductToEdit(null)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 transition">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            <form onSubmit={handleSaveEditProduct} className="space-y-4">
              <div>
                <label className="block text-[14px] font-bold text-[#273B4A] mb-1.5">Nama Produk</label>
                <input type="text" value={productToEdit.nama} onChange={(e) => setProductToEdit({...productToEdit, nama: e.target.value})} className="w-full border border-gray-300 rounded-[8px] p-2.5 text-[14px] font-medium outline-none focus:border-[#006638]" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[14px] font-bold text-[#273B4A] mb-1.5">Stok</label>
                  <input type="number" value={productToEdit.stok} onChange={(e) => setProductToEdit({...productToEdit, stok: e.target.value})} className="w-full border border-gray-300 rounded-[8px] p-2.5 text-[14px] font-medium outline-none focus:border-[#006638]" required />
                </div>
                <div>
                  <label className="block text-[14px] font-bold text-[#273B4A] mb-1.5">Harga</label>
                  <input type="number" value={productToEdit.harga_harapan} onChange={(e) => setProductToEdit({...productToEdit, harga_harapan: e.target.value})} className="w-full border border-gray-300 rounded-[8px] p-2.5 text-[14px] font-medium outline-none focus:border-[#006638]" required />
                </div>
                <div>
                  <label className="block text-[14px] font-bold text-[#273B4A] mb-1.5">Tgl Panen</label>
                  <input type="date" value={productToEdit.tanggal_panen} onChange={(e) => setProductToEdit({...productToEdit, tanggal_panen: e.target.value})} className="w-full border border-gray-300 rounded-[8px] p-2.5 text-[14px] font-medium outline-none focus:border-[#006638]" required />
                </div>
                <div>
                  <label className="block text-[14px] font-bold text-[#273B4A] mb-1.5">Masa Layak</label>
                  <input type="number" value={productToEdit.masa_layak} onChange={(e) => setProductToEdit({...productToEdit, masa_layak: e.target.value})} className="w-full border border-gray-300 rounded-[8px] p-2.5 text-[14px] font-medium outline-none focus:border-[#006638]" required />
                </div>
              </div>
              <div>
                <label className="block text-[14px] font-bold text-[#273B4A] mb-1.5">Status</label>
                <select value={productToEdit.status} onChange={(e) => setProductToEdit({...productToEdit, status: e.target.value})} className="w-full border border-gray-300 rounded-[8px] p-2.5 text-[14px] font-medium outline-none focus:border-[#006638] bg-white">
                  <option value="Aktif">Aktif</option>
                  <option value="Tidak Aktif">Tidak Aktif</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 mt-6">
                <button type="button" onClick={() => setProductToEdit(null)} disabled={isSubmitting} className="px-4 py-2 border border-slate-300 text-slate-600 rounded-[8px] font-semibold hover:bg-slate-50 transition disabled:opacity-50">Batal</button>
                <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-[#0004ED] text-white rounded-[8px] font-semibold hover:bg-blue-800 transition shadow-sm disabled:opacity-50 flex items-center gap-2">
                  {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  Simpan
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
              Apakah Anda yakin ingin menghapus produk <b>{productName(productToDelete)}</b>? Tindakan ini tidak dapat dibatalkan.
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

    </div>
  );
}
