import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/layout/Sidebar";
import api from "../../config/axios";
import { Search, Plus, Eye, ChevronLeft, ChevronRight, X, Upload, Loader2 } from "lucide-react";
import { swalError } from "../../utils/swal";

const ROLE = "petani_binaan";
const LABEL = "Petani";

export default function PetaniBinaan() {
  const navigate = useNavigate();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const fileInputRef = useRef(null);

  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const itemsPerPage = 5;

  // Form State untuk Tambah Petani
  const [formData, setFormData] = useState({
    nama_lengkap: "",
    nik: "",
    no_hp: "",
    alamat: "",
    tanggal_lahir: "",
    rekening: "",
    kelamin: "Laki-laki",
    foto: null,
  });

  const fetchData = async () => {
    try {
      setFetchError(null);
      const res = await api.get(`/koperasi/binaan?role=${ROLE}&search=${encodeURIComponent(search)}`);
      setList(res.data || []);
    } catch (error) {
      console.error("Error fetching binaan:", error);
      setFetchError("Gagal mengambil data dari server.");
      setList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    Promise.resolve().then(() => fetchData());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, foto: file }));
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const payload = new FormData();
    payload.append("role", ROLE);
    payload.append("nama_lengkap", formData.nama_lengkap);
    payload.append("nik", formData.nik);
    payload.append("no_hp", formData.no_hp);
    payload.append("tanggal_lahir", formData.tanggal_lahir);
    payload.append("kelamin", formData.kelamin);
    payload.append("alamat", formData.alamat);
    payload.append("rekening", formData.rekening);
    if (formData.foto) payload.append("foto_profil", formData.foto);

    try {
      await api.post("/koperasi/binaan", payload, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      await fetchData();
      setIsAddModalOpen(false);
      setFormData({ nama_lengkap: "", nik: "", no_hp: "", alamat: "", tanggal_lahir: "", rekening: "", kelamin: "Laki-laki", foto: null });
      setPreviewImage(null);
    } catch (error) {
      console.error("Gagal menambah", LABEL, error);
      swalError("Gagal menambah binaan", error.response?.data?.message || `Gagal menambah ${LABEL} binaan.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalPages = Math.max(1, Math.ceil(list.length / itemsPerPage));
  const currentData = list.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="min-h-screen bg-white font-['Montserrat'] text-slate-900">
      <div className="flex w-full min-h-screen p-4 pl-[304px]">
        {/* Sidebar Koperasi */}
        <Sidebar />

        {/* Outer Main Container */}
        <div className="flex-1 bg-[rgba(222,236,225,0.19)] border border-[rgba(0,154,38,0.19)] rounded-[20px] p-8 relative">
          
          {/* Header Panel */}
          <div className="flex items-end justify-between border-b border-[#029154] pb-2 mb-4">
            <h1 className="text-[24px] font-semibold text-[#005941]">{LABEL} Binaan</h1>
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center overflow-hidden border border-red-200 translate-y-[4px]">
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
            {/* Input Search */}
            <div className="relative w-[300px] h-[42px]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#005941]" />
              <input
                type="text"
                placeholder={`Cari ${LABEL}...`}
                value={search}
                onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                className="w-full h-full bg-white border border-[#006638] rounded-full pl-12 pr-4 text-[15px] font-medium text-[#006638] placeholder-[#006638] focus:outline-none"
              />
            </div>

            {/* Tombol Tambah */}
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="w-[180px] h-[42px] bg-gradient-to-r from-[#006638] to-[#029154] rounded-[5px] text-white flex items-center justify-center gap-2 font-semibold text-[16px] hover:opacity-95 transition shadow-sm"
            >
              <span>Tambah {LABEL}</span>
              <Plus className="w-5 h-5 stroke-[2.5]" />
            </button>
          </div>

          {/* Table Container */}
          <div className="bg-white rounded-[20px] border border-[#029154] shadow-[0_0_4px_rgba(0,0,0,0.25)] p-6">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="text-[#273B4A] font-bold text-[14px] border-b-2 border-slate-200">
                      <th className="pb-3 px-3 w-[60px]">No</th>
                      <th className="pb-3 px-3">Nama</th>
                      <th className="pb-3 px-3">NIK</th>
                      <th className="pb-3 px-3">No HP</th>
                      <th className="pb-3 px-3">Status</th>
                      <th className="pb-3 px-3 text-center">Jumlah Produk</th>
                      <th className="pb-3 px-3 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="text-[14px]">
                    {loading ? (
                      <tr>
                        <td colSpan={7} className="text-center py-10">
                          <div className="flex items-center justify-center gap-2 text-[#006638]">
                            <Loader2 className="w-6 h-6 animate-spin" />
                            <span className="font-semibold">Memuat data...</span>
                          </div>
                        </td>
                      </tr>
                    ) : fetchError ? (
                      <tr>
                        <td colSpan={7} className="text-center py-10 text-red-500 font-semibold bg-red-50">{fetchError}</td>
                      </tr>
                    ) : currentData.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="text-center py-10 text-slate-500 font-medium">
                          Belum ada {LABEL.toLowerCase()} binaan.
                        </td>
                      </tr>
                    ) : (
                      currentData.map((item, idx) => (
                        <tr key={item.id} className="hover:bg-slate-50 transition border-b border-black/10 last:border-0">
                          <td className="py-2 px-3 font-semibold text-[#273B4A]">{(currentPage - 1) * itemsPerPage + idx + 1}</td>
                          <td className="py-2 px-3 font-semibold text-[#273B4A]">{item.nama_lengkap}</td>
                          <td className="py-2 px-3 font-medium text-black">{item.nik || "-"}</td>
                          <td className="py-2 px-3 font-semibold text-[#273B4A]">{item.no_hp || "-"}</td>
                          <td className="py-2 px-3">
                            <span className="bg-[rgba(0,174,43,0.19)] border border-[#006638] text-[#006638] px-3 py-0.5 rounded-[3px] text-[13px] font-medium inline-block">
                              Aktif
                            </span>
                          </td>
                          <td className="py-2 px-3 text-center font-semibold text-[#273B4A]">
                            {item.products_count}
                          </td>
                          <td className="py-2 px-3 text-center">
                            <button
                              onClick={() => navigate(`/koperasi/petani-binaan/${item.id}`)}
                              className="w-8 h-8 rounded-full border-2 border-[#006638] flex items-center justify-center text-[#006638] hover:bg-emerald-50 transition mx-auto shadow-sm"
                              title="View Detail"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
              </table>
            </div>

            {/* Pagination & Info */}
            {list.length > itemsPerPage && (
              <div className="flex flex-wrap items-center justify-between border-t border-slate-100 pt-4 mt-6 gap-4">
                <span className="text-[15px] sm:text-[16px] font-semibold text-black/50">
                  Menampilkan {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, list.length)} dari {list.length} {LABEL.toLowerCase()}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    disabled={currentPage === 1}
                    className="p-1 text-black/40 hover:text-black transition disabled:opacity-30"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>

                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`w-9 h-9 rounded-[5px] font-semibold text-[16px] flex items-center justify-center transition ${
                        currentPage === i + 1
                          ? "bg-[#006638] text-white"
                          : "bg-white border border-[#006638] text-[#006638] hover:bg-emerald-50"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}

                  <button
                    onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="p-1 text-black/40 hover:text-black transition disabled:opacity-30"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* MODAL TAMBAH PETANI */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-[700px] rounded-[20px] p-8 shadow-2xl relative my-auto">
            {/* Header Modal */}
            <div className="flex items-center justify-between mb-6 border-b border-[#029154] pb-4">
              <h2 className="text-[22px] font-semibold text-[#005941]">
                Tambah {LABEL} Baru
              </h2>
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  setPreviewImage(null);
                }}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 transition"
              >
                <X className="w-6 h-6 text-slate-500" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSave} className="space-y-6">
              
              {/* Upload Foto Profil */}
              <div className="flex flex-col items-center gap-3">
                <div 
                  className="w-[120px] h-[120px] rounded-full border-2 border-dashed border-[#006638] bg-emerald-50 flex flex-col items-center justify-center overflow-hidden cursor-pointer hover:bg-emerald-100 transition relative"
                  onClick={() => fileInputRef.current.click()}
                >
                  {previewImage ? (
                    <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <>
                      <Upload className="w-6 h-6 text-[#006638] mb-1" />
                      <span className="text-[11px] font-semibold text-[#006638] text-center px-2">Upload<br/>Foto Profil</span>
                    </>
                  )}
                </div>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleImageChange} 
                  accept="image/*" 
                  className="hidden" 
                />
              </div>

              {/* Grid Input Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[14px] font-bold text-[#273B4A] mb-1.5">Nama Lengkap</label>
                  <input
                    type="text"
                    name="nama_lengkap"
                    value={formData.nama_lengkap}
                    onChange={handleInputChange}
                    placeholder="Masukkan nama"
                    className="w-full border border-gray-300 rounded-[8px] p-2.5 text-[14px] font-medium outline-none focus:border-[#006638]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[14px] font-bold text-[#273B4A] mb-1.5">NIK</label>
                  <input
                    type="text"
                    name="nik"
                    value={formData.nik}
                    onChange={handleInputChange}
                    placeholder="16 digit NIK"
                    className="w-full border border-gray-300 rounded-[8px] p-2.5 text-[14px] font-medium outline-none focus:border-[#006638]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[14px] font-bold text-[#273B4A] mb-1.5">Nomor HP</label>
                  <input
                    type="text"
                    name="no_hp"
                    value={formData.no_hp}
                    onChange={handleInputChange}
                    placeholder="Contoh: 081234..."
                    className="w-full border border-gray-300 rounded-[8px] p-2.5 text-[14px] font-medium outline-none focus:border-[#006638]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[14px] font-bold text-[#273B4A] mb-1.5">Tanggal Lahir</label>
                  <input
                    type="date"
                    name="tanggal_lahir"
                    value={formData.tanggal_lahir}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-[8px] p-2.5 text-[14px] font-medium outline-none focus:border-[#006638] text-gray-700"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[14px] font-bold text-[#273B4A] mb-1.5">Jenis Kelamin</label>
                  <select
                    name="kelamin"
                    value={formData.kelamin}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-[8px] p-2.5 text-[14px] font-medium outline-none focus:border-[#006638] bg-white"
                  >
                    <option value="Laki-laki">Laki-laki</option>
                    <option value="Perempuan">Perempuan</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[14px] font-bold text-[#273B4A] mb-1.5">Nomor Rekening</label>
                  <input
                    type="text"
                    name="rekening"
                    value={formData.rekening}
                    onChange={handleInputChange}
                    placeholder="Contoh: 8392xxxx (BCA)"
                    className="w-full border border-gray-300 rounded-[8px] p-2.5 text-[14px] font-medium outline-none focus:border-[#006638]"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[14px] font-bold text-[#273B4A] mb-1.5">Alamat Lengkap</label>
                  <textarea
                    name="alamat"
                    value={formData.alamat}
                    onChange={handleInputChange}
                    placeholder="Masukkan alamat lengkap"
                    rows="3"
                    className="w-full border border-gray-300 rounded-[8px] p-2.5 text-[14px] font-medium outline-none focus:border-[#006638] resize-none"
                    required
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setPreviewImage(null);
                  }}
                  disabled={isSubmitting}
                  className="px-6 py-2 border border-slate-300 text-slate-600 rounded-[8px] font-semibold hover:bg-slate-50 transition disabled:opacity-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-[#006638] text-white rounded-[8px] font-semibold hover:bg-emerald-800 transition shadow-sm disabled:opacity-50 flex items-center gap-2"
                >
                  {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  Simpan {LABEL}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
