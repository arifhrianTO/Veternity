import { useState, useEffect } from "react";
import Sidebar from "../../components/layout/Sidebar";
import {
  Search,
  Plus,
  Edit3,
  Trash2,
  X,
  Loader2,
  MapPin,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import api from "../../config/axios";
import { swalSuccess, swalError, swalWarning } from "../../utils/swal";

export default function LogistikPage() {
  const [logistics, setLogistics] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [fetchError, setFetchError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [perPage, setPerPage] = useState(5);

  // States for Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // State for Selected Logistic & Form Data
  const [selectedLogistic, setSelectedLogistic] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const initialFormState = {
    kode: "",
    nama: "",
    deskripsi: "",
    status: "Aktif",
  };
  const [formData, setFormData] = useState(initialFormState);

  // ---- State Panel "Cek Area via API" ----
  const [provinces, setProvinces] = useState([]);
  const [originCities, setOriginCities] = useState([]);
  const [destCities, setDestCities] = useState([]);
  const [checkOriginProv, setCheckOriginProv] = useState("");
  const [checkOriginCity, setCheckOriginCity] = useState("");
  const [checkDestProv, setCheckDestProv] = useState("");
  const [checkDestCity, setCheckDestCity] = useState("");
  const [checkWeight, setCheckWeight] = useState(1000);
  const [checkingArea, setCheckingArea] = useState(false);
  const [areaResult, setAreaResult] = useState(null);
  const [loadingProvinces, setLoadingProvinces] = useState(false);
  const [loadingOriginCities, setLoadingOriginCities] = useState(false);
  const [loadingDestCities, setLoadingDestCities] = useState(false);

  // ---- Data API ----
  const fetchLogistics = async (keyword = "", page = 1) => {
    try {
      setIsLoading(true);
      setFetchError("");
      const params = { page };
      if (keyword) params.search = keyword;
      const res = await api.get("/logistik", { params });
      if (res.data.success) {
        setLogistics(res.data.data);
        setCurrentPage(res.data.current_page);
        setLastPage(res.data.last_page);
        setTotalItems(res.data.total);
        setPerPage(res.data.per_page);
      }
    } catch (error) {
      console.error("Gagal mengambil data logistik:", error);
      setFetchError(
        error.response?.data?.message || "Gagal mengambil data logistik dari server."
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    Promise.resolve().then(() => fetchLogistics("", 1));
  }, []);

  // Pencarian (dengan debounce sederhana) - reset ke halaman 1
  useEffect(() => {
    const t = setTimeout(() => fetchLogistics(search, 1), 300);
    return () => clearTimeout(t);
  }, [search]);

  const goToPage = (page) => {
    if (page < 1 || page > lastPage || page === currentPage) return;
    fetchLogistics(search, page);
  };

  // Daftar nomor halaman (maks 5 tombol)
  const pageNumbers = () => {
    const pages = [];
    let start = Math.max(1, currentPage - 2);
    let end = Math.min(lastPage, start + 4);
    start = Math.max(1, end - 4);
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  };

  // Ambil provinsi untuk panel cek area
  const fetchProvinces = async () => {
    setLoadingProvinces(true);
    try {
      const res = await api.get("/shipping/provinces");
      if (res.data.success) setProvinces(res.data.data);
    } catch (error) {
      console.error("Gagal mengambil provinsi:", error);
    } finally {
      setLoadingProvinces(false);
    }
  };

  useEffect(() => {
    Promise.resolve().then(() => fetchProvinces());
  }, []);

  const loadCities = async (provId, setter, loadingSetter) => {
    if (!provId) return;
    loadingSetter(true);
    try {
      const res = await api.get(`/shipping/cities/${provId}`);
      if (res.data.success) setter(res.data.data);
    } catch (error) {
      console.error("Gagal mengambil kota:", error);
    } finally {
      loadingSetter(false);
    }
  };

  const handleOriginProvChange = (e) => {
    const val = e.target.value;
    setCheckOriginProv(val);
    setCheckOriginCity("");
    loadCities(val, setOriginCities, setLoadingOriginCities);
  };

  const handleDestProvChange = (e) => {
    const val = e.target.value;
    setCheckDestProv(val);
    setCheckDestCity("");
    setAreaResult(null);
    loadCities(val, setDestCities, setLoadingDestCities);
  };

  const handleCheckArea = async () => {
    if (!checkOriginCity || !checkDestCity || !checkWeight) {
      swalWarning(
        "Data belum lengkap",
        "Pilih kota asal, kota tujuan, dan isi berat terlebih dahulu."
      );
      return;
    }

    setCheckingArea(true);
    setAreaResult(null);
    try {
      const res = await api.post("/logistik/check-area", {
        origin_city_id: checkOriginCity,
        destination_city_id: checkDestCity,
        weight: Number(checkWeight),
      });
      if (res.data.success) {
        setAreaResult(res.data.data);
      } else {
        swalError("Gagal cek area", res.data.message || "Terjadi kesalahan saat cek area.");
      }
    } catch (error) {
      console.error("Gagal cek area:", error);
      swalError(
        "Gagal cek area",
        error.response?.data?.message || "Terjadi kesalahan saat memeriksa area layanan."
      );
    } finally {
      setCheckingArea(false);
    }
  };

  // ---- Helper functions untuk modal ----
  const openAddModal = () => {
    setFormData(initialFormState);
    setIsAddModalOpen(true);
  };

  const openEditModal = (logistic) => {
    setSelectedLogistic(logistic);
    setFormData({
      kode: logistic.kode,
      nama: logistic.nama,
      deskripsi: logistic.deskripsi || "",
      status: logistic.status,
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
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!formData.kode || !formData.nama) return;
    setIsSubmitting(true);
    try {
      const res = await api.post("/logistik", {
        kode: formData.kode,
        nama: formData.nama,
        deskripsi: formData.deskripsi,
        status: formData.status,
      });
      if (res.data.success) {
        swalSuccess("Kurir ditambahkan", res.data.message);
        closeAllModals();
        fetchLogistics(search, currentPage);
      }
    } catch (error) {
      swalError(
        "Gagal menambah kurir",
        error.response?.data?.message || "Periksa kembali kode/nama kurir."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await api.put(`/logistik/${selectedLogistic.id}`, {
        nama: formData.nama,
        deskripsi: formData.deskripsi,
        status: formData.status,
      });
      if (res.data.success) {
        swalSuccess("Kurir diperbarui", res.data.message);
        closeAllModals();
        fetchLogistics(search, currentPage);
      }
    } catch (error) {
      swalError(
        "Gagal memperbarui kurir",
        error.response?.data?.message || "Terjadi kesalahan saat menyimpan."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteSubmit = async () => {
    setIsSubmitting(true);
    try {
      const res = await api.delete(`/logistik/${selectedLogistic.id}`);
      if (res.data.success) {
        swalSuccess("Kurir dihapus", res.data.message);
        closeAllModals();
        // Kalau item terakhir di halaman ini yang dihapus, pindah ke halaman sebelumnya
        if (logistics.length === 1 && currentPage > 1) {
          fetchLogistics(search, currentPage - 1);
        } else {
          fetchLogistics(search, currentPage);
        }
      }
    } catch (error) {
      console.error("Gagal menghapus kurir:", error);
      swalError("Gagal menghapus kurir", "Terjadi kesalahan saat menghapus.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const no = (i) => i + 1;

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

          {/* Panel Cek Area via API */}
          <div className="bg-white/60 border border-[#029154] rounded-2xl p-6 shadow-sm mb-6">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-5 h-5 text-[#006638]" />
              <h2 className="text-[16px] font-bold text-[#005941]">
                Cek Area Layanan via RajaOngkir
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
              <div>
                <label className="block text-[12px] font-semibold text-[#273B4A] mb-1">Asal (Provinsi)</label>
                <select
                  className="w-full px-3 py-2 border border-slate-300 rounded-[10px] focus:outline-none focus:border-[#006638] bg-white text-sm"
                  value={checkOriginProv}
                  onChange={handleOriginProvChange}
                  disabled={loadingProvinces}
                >
                  <option value="">-- Pilih --</option>
                  {provinces.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-[#273B4A] mb-1">Asal (Kota)</label>
                <select
                  className="w-full px-3 py-2 border border-slate-300 rounded-[10px] focus:outline-none focus:border-[#006638] bg-white text-sm"
                  value={checkOriginCity}
                  onChange={(e) => setCheckOriginCity(e.target.value)}
                  disabled={!checkOriginProv || loadingOriginCities}
                >
                  <option value="">-- Pilih --</option>
                  {originCities.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-[#273B4A] mb-1">Tujuan (Provinsi)</label>
                <select
                  className="w-full px-3 py-2 border border-slate-300 rounded-[10px] focus:outline-none focus:border-[#006638] bg-white text-sm"
                  value={checkDestProv}
                  onChange={handleDestProvChange}
                  disabled={loadingProvinces}
                >
                  <option value="">-- Pilih --</option>
                  {provinces.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-[#273B4A] mb-1">Tujuan (Kota)</label>
                <select
                  className="w-full px-3 py-2 border border-slate-300 rounded-[10px] focus:outline-none focus:border-[#006638] bg-white text-sm"
                  value={checkDestCity}
                  onChange={(e) => { setCheckDestCity(e.target.value); setAreaResult(null); }}
                  disabled={!checkDestProv || loadingDestCities}
                >
                  <option value="">-- Pilih --</option>
                  {destCities.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-[#273B4A] mb-1">Berat (gram)</label>
                <input
                  type="number"
                  min="1"
                  className="w-full px-3 py-2 border border-slate-300 rounded-[10px] focus:outline-none focus:border-[#006638] bg-white text-sm"
                  value={checkWeight}
                  onChange={(e) => setCheckWeight(e.target.value)}
                />
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <button
                onClick={handleCheckArea}
                disabled={checkingArea}
                className="flex items-center gap-2 bg-[#006638] hover:bg-[#00522c] text-white font-semibold px-5 py-2.5 rounded-lg text-sm transition shadow-sm disabled:opacity-50"
              >
                {checkingArea && <Loader2 className="w-4 h-4 animate-spin" />}
                Cek Area
              </button>
            </div>

            {/* Hasil Cek Area (preview, tidak disimpan) */}
            {areaResult && (
              <div className="mt-5 border-t border-black/10 pt-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-[14px] font-bold text-[#273B4A]">
                    Kurir yang melayani area tujuan (
                    {destCities.find((c) => String(c.id) === String(checkDestCity))?.name || "Tujuan"})
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {areaResult.map((courier) => (
                    <div key={courier.code} className="border border-[#029154]/40 rounded-[12px] p-3 bg-white">
                      <p className="text-[13px] font-bold text-[#005941] uppercase">
                        {courier.name} <span className="text-black/40 normal-case">({courier.code})</span>
                      </p>
                      <div className="mt-1 space-y-1">
                        {courier.services.map((s, idx) => (
                          <div key={idx} className="flex items-center justify-between text-[12px]">
                            <span className="font-semibold text-[#273B4A]">
                              {s.service}{s.description ? ` • ${s.description}` : ""}
                            </span>
                            <span className="font-bold text-black/70">
                              Rp {Number(s.cost).toLocaleString("id-ID")}{s.etd ? ` (${s.etd} hari)` : ""}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                  {areaResult.length === 0 && (
                    <p className="text-[13px] text-black/50 col-span-2">
                      Tidak ada kurir yang melayani area tersebut.
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Table Container Card */}
          <div className="bg-white/60 border border-[#029154] rounded-2xl p-6 shadow-sm">
            {fetchError ? (
              <div className="p-4 border border-red-300 bg-red-50 rounded-xl text-red-600 text-sm">
                {fetchError}
              </div>
            ) : isLoading ? (
              <div className="flex items-center justify-center py-10 text-[#006638]">
                <Loader2 className="w-5 h-5 animate-spin mr-2" /> Memuat data logistik...
              </div>
            ) : (
              <>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="text-[#273B4A] font-bold text-base border-b-2 border-black/10">
                      <th className="pb-3 px-4 w-16 text-center">No</th>
                      <th className="pb-3 px-4 text-center">Nama Logistik</th>
                      <th className="pb-3 px-4 text-center">Kode</th>
                      <th className="pb-3 px-4 text-center">Deskripsi / Catatan</th>
                      <th className="pb-3 px-4 text-center">Sumber</th>
                      <th className="pb-3 px-4 text-center">Status</th>
                      <th className="pb-3 px-4 text-center w-32">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {logistics.map((item, i) => (
                      <tr key={item.id} className="hover:bg-slate-50/50 transition border-b border-black/10 last:border-0">
                        <td className="py-2 px-4 font-semibold text-[#273B4A] text-center">
                          {no(i)}
                        </td>
                        <td className="py-2 px-4 font-semibold text-[#273B4A] text-center">
                          {item.nama}
                        </td>
                        <td className="py-2 px-4 font-semibold text-[#273B4A] text-center">
                          {item.kode}
                        </td>
                        <td className="py-2 px-4 font-medium text-[#273B4A] text-center">
                          {item.deskripsi || "-"}
                        </td>
                        <td className="py-2 px-4 text-center">
                          <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-[3px] border ${
                            item.sumber === "manual"
                              ? "bg-[#FFF4E5] text-[#B4690E] border-[#B4690E]"
                              : "bg-[rgba(0,174,43,0.19)] text-[#006638] border-[#006638]"
                          }`}>
                            {item.sumber === "manual" ? "Manual" : "RajaOngkir"}
                          </span>
                        </td>
                        <td className="py-2 px-4 text-center">
                          <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-[3px] border ${
                            item.status === "Aktif"
                              ? "bg-[rgba(0,174,43,0.19)] text-[#006638] border-[#006638]"
                              : "bg-red-50 text-red-600 border-red-300"
                          }`}>
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
                    {logistics.length === 0 && (
                      <tr>
                        <td colSpan={7} className="py-10 text-center text-slate-500 font-medium">
                          Belum ada data logistik.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalItems > 0 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 text-sm text-black/50 font-semibold">
                  <div>
                    Menampilkan {totalItems === 0 ? 0 : (currentPage - 1) * perPage + 1}-
                    {Math.min(currentPage * perPage, totalItems)} dari {totalItems} data
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => goToPage(currentPage - 1)}
                      disabled={currentPage <= 1}
                      className="p-2 text-black/40 hover:text-black transition disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    {pageNumbers().map((p) => (
                      <button
                        key={p}
                        onClick={() => goToPage(p)}
                        className={`w-9 h-9 rounded-md font-semibold flex items-center justify-center transition ${
                          p === currentPage
                            ? "bg-[#006638] text-white"
                            : "bg-white border border-[#006638] text-[#006638] hover:bg-slate-50"
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                    <button
                      onClick={() => goToPage(currentPage + 1)}
                      disabled={currentPage >= lastPage}
                      className="p-2 text-black/40 hover:text-black transition disabled:opacity-30 disabled:cursor-not-allowed"
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

      {/* ======================= MODAL TAMBAH LOGISTIK ======================= */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-[20px] w-full max-w-[500px] overflow-hidden shadow-2xl border border-slate-200 flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
              <h3 className="text-[18px] font-bold text-[#005941]">Tambah Kurir Baru</h3>
              <button onClick={closeAllModals} className="text-slate-400 hover:text-slate-600 transition">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 text-[14px]">
              <form onSubmit={handleAddSubmit} className="space-y-4">
                <div>
                  <label className="block text-[#273B4A] font-semibold mb-1">Kode Kurir</label>
                  <input type="text" name="kode" value={formData.kode} onChange={handleInputChange} required className="w-full px-4 py-2 border border-slate-300 rounded-[10px] focus:outline-none focus:border-[#006638]" placeholder="Contoh: jne, jnt, sicepat" />
                  <p className="text-[11px] text-black/40 mt-1">
                    Gunakan kode ekspedisi RajaOngkir agar dapat divalidasi saat cek ongkir.
                  </p>
                </div>
                <div>
                  <label className="block text-[#273B4A] font-semibold mb-1">Nama Logistik</label>
                  <input type="text" name="nama" value={formData.nama} onChange={handleInputChange} required className="w-full px-4 py-2 border border-slate-300 rounded-[10px] focus:outline-none focus:border-[#006638]" placeholder="Misal: JNT Express" />
                </div>
                <div>
                  <label className="block text-[#273B4A] font-semibold mb-1">Deskripsi / Catatan</label>
                  <input type="text" name="deskripsi" value={formData.deskripsi} onChange={handleInputChange} className="w-full px-4 py-2 border border-slate-300 rounded-[10px] focus:outline-none focus:border-[#006638]" placeholder="Opsional, misal: keunggulan kurir" />
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
              <h3 className="text-[18px] font-bold text-[#005941]">Edit Kurir</h3>
              <button onClick={closeAllModals} className="text-slate-400 hover:text-slate-600 transition">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 text-[14px]">
              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div>
                  <label className="block text-[#273B4A] font-semibold mb-1">Kode Kurir</label>
                  <input type="text" value={formData.kode} disabled className="w-full px-4 py-2 border border-slate-200 bg-slate-50 rounded-[10px] text-slate-500" />
                </div>
                <div>
                  <label className="block text-[#273B4A] font-semibold mb-1">Nama Logistik</label>
                  <input type="text" name="nama" value={formData.nama} onChange={handleInputChange} required className="w-full px-4 py-2 border border-slate-300 rounded-[10px] focus:outline-none focus:border-[#006638]" />
                </div>
                <div>
                  <label className="block text-[#273B4A] font-semibold mb-1">Deskripsi / Catatan</label>
                  <input type="text" name="deskripsi" value={formData.deskripsi} onChange={handleInputChange} className="w-full px-4 py-2 border border-slate-300 rounded-[10px] focus:outline-none focus:border-[#006638]" />
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
            <h3 className="text-[20px] font-bold text-[#273B4A] mb-2">Hapus Kurir?</h3>
            <p className="text-[14px] text-slate-500 mb-8 leading-relaxed">
              Apakah Anda yakin ingin menghapus <strong>{selectedLogistic.nama}</strong>? Kurir yang dihapus tidak akan muncul lagi sebagai opsi pengiriman.
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
