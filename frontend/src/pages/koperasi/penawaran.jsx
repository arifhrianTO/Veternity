import { useState, useEffect } from "react";
import Sidebar from "../../components/layout/Sidebar";
import api from "../../config/axios";
import { X, MapPin, Phone, MessageCircle, Mail, Check, XCircle, Send, Loader2 } from "lucide-react";
import { swalError } from "../../utils/swal";

const storageUrl = (path) => (path ? `http://localhost:8000/storage/${path}` : "/images/beras.png");

export default function PenawaranPage() {
  const [activeTab, setActiveTab] = useState("Semua");
  const [selectedItem, setSelectedItem] = useState(null);
  const [showCounter, setShowCounter] = useState(false);
  const [counterPrice, setCounterPrice] = useState("");

  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchOffers = async () => {
    try {
      setLoading(true);
      setFetchError(null);
      const res = await api.get("/offers");
      setOffers(res.data || []);
    } catch (error) {
      console.error("Error fetching offers:", error);
      setFetchError("Gagal mengambil data penawaran dari server.");
      setOffers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    Promise.resolve().then(() => fetchOffers());
  }, []);

  const formatRupiah = (val) => "Rp " + Number(val || 0).toLocaleString("id-ID");

  const mappedOffers = offers.map((o) => ({
    id: o.id,
    kode: o.kode_penawaran,
    nama: o.product?.category?.nama_kategori || o.product?.kategori || "Produk",
    berat: o.jumlah_diminta ? `${o.jumlah_diminta} Kg` : "-",
    gambar: storageUrl(o.product?.gambar),
    pemilik: o.petani?.nama_lengkap || "Koperasi",
    hargaAcuan: o.product ? formatRupiah(o.product.harga_harapan) : "-",
    hargaTawaran: formatRupiah(o.harga_tawaran),
    status: o.status || "Menunggu",
    tanggal: o.created_at?.split("T")[0] || "-",
    pembeli: {
      nama: o.pembeli?.nama_lengkap || "Pembeli",
      lokasi: o.pembeli?.alamat || "-",
      pesan: o.pesan_pembeli || "-",
    },
    riwayat: (o.histories || []).map((h) => ({
      tanggal: h.created_at?.split("T")[0] || "-",
      keterangan: h.aksi || "-",
      harga: h.harga_terkait ? formatRupiah(h.harga_terkait) : null,
    })),
  }));

  // Helper untuk styling badge status
  const getStatusBadge = (status) => {
    const styleMap = {
      Menunggu: {
        badge: "bg-[#FFD469]/20 border border-[#956100] text-[#DC8800]",
        label: "Menunggu",
      },
      Diterima: {
        badge: "bg-[#69AAFF]/20 border border-[#002595] text-[#004DDC]",
        label: "Diterima",
      },
      Ditolak: {
        badge: "bg-[#FF696B]/20 border border-[#950002] text-[#DC0004]",
        label: "Ditolak",
      },
      Counter: {
        badge: "bg-[#69AAFF]/20 border border-[#002595] text-[#004DDC]",
        label: "Counter",
      },
      Selesai: {
        badge: "bg-[#6EFF69]/20 border border-[#00950F] text-[#00DC0B]",
        label: "Selesai",
      },
    };
    const s = styleMap[status] || { badge: "bg-gray-100 border border-gray-400 text-gray-600", label: status };
    return (
      <span className={`${s.badge} px-2 py-0.5 text-[12px] font-semibold text-center rounded-[3px] inline-block`}>
        {s.label}
      </span>
    );
  };

  // Filter data berdasarkan tab
  const filteredData =
    activeTab === "Semua"
      ? mappedOffers
      : mappedOffers.filter((item) => item.status === activeTab);

  const handleOpenModal = (item) => {
    setSelectedItem(item);
    setShowCounter(false);
  };

  const handleCloseModal = () => {
    setSelectedItem(null);
    setShowCounter(false);
  };

  const sendAction = async (status, harga) => {
    if (!selectedItem) return;
    setIsSubmitting(true);
    const labels = {
      Diterima: "Penawaran diterima",
      Ditolak: "Penawaran ditolak",
      Counter: "Counter offer dikirim",
    };
    try {
      await api.put(`/offers/${selectedItem.id}`, {
        status,
        harga_tawaran: harga || undefined,
        aksi_label: labels[status] || status,
      });
      await fetchOffers();
      setSelectedItem((prev) => ({ ...prev, status }));
      setShowCounter(false);
      setCounterPrice("");
    } catch (error) {
      console.error("Gagal update penawaran:", error);
      swalError("Gagal memperbarui penawaran", error.response?.data?.message || "Terjadi kesalahan saat menyimpan penawaran.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const statusActionMap = {
    Menunggu: { dapatTindakan: true },
    Counter: { dapatTindakan: true },
    Diterima: { dapatTindakan: false },
    Ditolak: { dapatTindakan: false },
    Selesai: { dapatTindakan: false },
  };

  return (
    <div className="min-h-screen bg-white font-['Montserrat'] text-slate-900 relative">
      <div className="flex w-full min-h-screen p-4 pl-[304px]">
        
        {/* Sidebar Koperasi */}
        <Sidebar />

        {/* Main Content Container */}
        <div className="flex-1 bg-[rgba(222,236,225,0.19)] border border-[rgba(0,154,38,0.19)] rounded-[20px] p-8 flex flex-col justify-between">
          <div>
            {/* Header Panel */}
            <div className="flex items-end justify-between border-b border-[#029154] pb-2 mb-4">
              <h1 className="text-[24px] font-semibold text-[#005941]">
                Penawaran
              </h1>
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

            {/* Filter Status Tabs */}
            <div className="bg-white rounded-[10px] shadow-[0_0_5px_rgba(0,0,0,0.25)] mb-6 max-w-[600px]">
              <div className="flex items-center justify-between px-6 py-2">
                {["Semua", "Menunggu", "Diterima", "Ditolak"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`relative text-[16px] font-semibold pb-1 transition ${
                      activeTab === tab
                        ? "text-[#005941]"
                        : "text-black/40 hover:text-slate-800"
                    }`}
                  >
                    {tab}
                    {activeTab === tab && (
                      <div className="absolute left-1/2 -translate-x-1/2 bottom-0 w-[100%] h-[3px] bg-[#006638] rounded-full" />
                    )}
                  </button>
                ))}
              </div>
            </div>

              {/* Table Header Labels */}
              <div className="grid grid-cols-12 px-4 py-2 text-[#273B4A] font-bold text-[14px] mb-2 items-center text-center border-b-2 border-black/10">
                <div className="col-span-3 text-left">Produk</div>
                <div className="col-span-2">Pemilik</div>
                <div className="col-span-2">Harga Acuan</div>
                <div className="col-span-2">Harga Tawaran</div>
                <div className="col-span-2">Status</div>
                <div className="col-span-1">Aksi</div>
              </div>

              {/* Cards List / List Row */}
              <div className="bg-white rounded-[20px] border border-[#029154] shadow-[0_0_4px_rgba(0,0,0,0.25)] flex flex-col p-2">
                {loading ? (
                  <div className="flex items-center justify-center gap-2 text-[#006638] py-10">
                    <Loader2 className="w-6 h-6 animate-spin" />
                    <span className="font-semibold">Memuat penawaran...</span>
                  </div>
                ) : fetchError ? (
                  <div className="text-center py-10 text-red-500 font-semibold bg-red-50">{fetchError}</div>
                ) : filteredData.length === 0 ? (
                  <div className="text-center py-10 text-slate-500 font-medium">Belum ada penawaran.</div>
                ) : (
                  filteredData.map((item, index) => (
                    <div
                      key={item.id}
                      className={`grid grid-cols-12 items-center text-center p-2 hover:bg-slate-50 transition ${
                        index !== filteredData.length - 1 ? "border-b border-black/10" : ""
                      }`}
                    >
                      {/* Produk */}
                      <div className="col-span-3 flex items-center gap-4 text-left">
                        <img
                          src={item.gambar}
                          alt={item.nama}
                          className="w-[70px] h-[50px] object-cover rounded-md border border-slate-100"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "/images/beras.png";
                          }}
                        />
                        <div className="flex flex-col">
                          <span className="font-semibold text-[#273B4A] text-[14px]">
                            {item.nama}
                          </span>
                          <span className="font-semibold text-black/40 text-[14px]">
                            {item.berat}
                          </span>
                        </div>
                      </div>

                      {/* Pemilik */}
                      <div className="col-span-2 font-medium text-black text-[14px]">
                        {item.pemilik}
                      </div>

                      {/* Harga Acuan */}
                      <div className="col-span-2 font-medium text-black text-[14px]">
                        {item.hargaAcuan}
                      </div>

                      {/* Harga Tawaran */}
                      <div className="col-span-2 font-medium text-black text-[14px]">
                        {item.hargaTawaran}
                      </div>

                      {/* Status & Tanggal */}
                      <div className="col-span-2 flex justify-center">
                        {getStatusBadge(item.status)}
                      </div>

                      {/* Tombol Detail */}
                      <div className="col-span-1 flex justify-center">
                        <button 
                          onClick={() => handleOpenModal(item)}
                          className="w-8 h-8 rounded-full border-2 border-[#006638] flex items-center justify-center text-[#006638] hover:bg-emerald-50 transition mx-auto shadow-sm"
                          title="View Detail"
                        >
                           <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-eye"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/></svg>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
          </div>
        </div>
      </div>

      {/* MODAL / POP-UP OVERLAY */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-[650px] rounded-[20px] p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            
            {/* Close Button Icon */}
            <div className="absolute top-4 right-5 bg-white rounded-full">
              <button 
                onClick={handleCloseModal}
                className="hover:bg-slate-100 transition p-1 rounded-full"
              >
                <X className="w-6 h-6 text-slate-600" />
              </button>
            </div>

            {/* Modal Header (Detail Produk & Harga) */}
            <div className="flex items-start justify-between border-b pb-4 mb-4 mt-2 gap-4">
              <div className="flex gap-4 items-center pr-8">
                <img
                  src={selectedItem.gambar}
                  alt={selectedItem.nama}
                  className="w-[120px] h-[85px] object-cover rounded-[8px]"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/images/beras.png";
                  }}
                />
                <div>
                  <h3 className="text-[18px] font-bold text-[#273B4A]">
                    {selectedItem.nama}
                  </h3>
                  <p className="text-[14px] font-semibold text-black/40">
                    {selectedItem.berat}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="w-6 h-6 rounded-full bg-slate-300 overflow-hidden flex-shrink-0">
                      <img 
                        src="/images/user.png" 
                        alt="user" 
                        className="w-full h-full object-cover" 
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "/images/user.png";
                        }}
                      />
                    </div>
                    <span className="text-[14px] font-semibold text-black/60">
                      {selectedItem.pemilik}
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="mb-2">
                  <span className="block text-[12px] font-bold text-[#273B4A]">Harga Acuan</span>
                  <span className="text-[14px] font-medium text-black">{selectedItem.hargaAcuan}</span>
                </div>
                <div>
                  <span className="block text-[12px] font-bold text-[#273B4A]">Harga Tawaran</span>
                  <span className="text-[14px] font-bold text-[#029154]">{selectedItem.hargaTawaran}</span>
                </div>
              </div>
            </div>

            {/* Modal Body (Detail Pembeli) */}
            <div className="border border-black/20 rounded-[15px] p-4 mb-4">
              <h4 className="text-[14px] font-bold text-[#273B4A] mb-2">Pembeli</h4>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-teal-800 flex items-center justify-center overflow-hidden flex-shrink-0">
                    <img 
                      src="/images/buyer-avatar.png" 
                      alt="Buyer" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/images/user.png";
                      }}
                    />
                  </div>
                  <div>
                    <p className="font-bold text-[14px] text-slate-800">{selectedItem.pembeli?.nama}</p>
                    <div className="flex items-center gap-1 text-[12px] text-slate-500">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{selectedItem.pembeli?.lokasi}</span>
                    </div>
                  </div>
                </div>

                {/* Contact Action Icons */}
                <div className="flex gap-2">
                  <button className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center hover:bg-green-200 transition text-green-700">
                    <Phone className="w-4 h-4" />
                  </button>
                  <button className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center hover:bg-green-200 transition text-green-700">
                    <MessageCircle className="w-4 h-4" />
                  </button>
                  <button className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center hover:bg-green-200 transition text-green-700">
                    <Mail className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="mt-3 bg-slate-50 p-3 rounded-[8px] border border-slate-200">
                <p className="text-[11px] font-semibold text-slate-400 mb-1">Pesan pembeli</p>
                <p className="text-[13px] text-slate-700">{selectedItem.pembeli?.pesan}</p>
              </div>
            </div>

            {/* Riwayat Penawaran */}
            <div className="mb-5">
              <h4 className="text-[14px] font-bold text-[#273B4A] mb-3">Riwayat Penawaran</h4>
              <div className="space-y-3 pl-2">
                {selectedItem.riwayat && selectedItem.riwayat.length > 0 ? (
                  selectedItem.riwayat.map((rw, index) => (
                    <div key={index} className="flex items-start gap-3 relative">
                      <div className="flex flex-col items-center">
                        <div className="w-3 h-3 rounded-full bg-[#029154] mt-1" />
                        {index !== selectedItem.riwayat.length - 1 && (
                          <div className="w-[2px] h-8 bg-gray-300" />
                        )}
                      </div>
                      <div className="flex-1 flex justify-between text-[12px]">
                        <div>
                          <p className="text-gray-400 font-medium">{rw.tanggal}</p>
                          <p className="text-slate-800 font-semibold">{rw.keterangan}</p>
                        </div>
                        {rw.harga && (
                          <span className="font-bold text-[#029154]">{rw.harga}</span>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-[12px] text-gray-400">Belum ada riwayat penawaran.</p>
                )}
              </div>
            </div>

            {/* Aksi Buttons */}
            {(statusActionMap[selectedItem.status]?.dapatTindakan ?? false) ? (
              <div className="border-t pt-4">
                <h4 className="text-[14px] font-bold text-[#273B4A] mb-3">Aksi</h4>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() => sendAction("Diterima")}
                    disabled={isSubmitting}
                    className="py-2 px-4 bg-[#006638] text-white font-bold text-[14px] rounded-[8px] hover:bg-emerald-800 transition flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                    Terima
                  </button>
                  <button
                    onClick={() => sendAction("Ditolak")}
                    disabled={isSubmitting}
                    className="py-2 px-4 border border-red-500 text-red-500 font-bold text-[14px] rounded-[8px] hover:bg-red-50 transition flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
                    Tolak
                  </button>
                  <button 
                    onClick={() => setShowCounter(!showCounter)}
                    disabled={isSubmitting}
                    className="py-2 px-4 border border-blue-600 text-blue-600 font-bold text-[14px] rounded-[8px] hover:bg-blue-50 transition flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Counter Offer
                  </button>
                </div>

                {/* Form Input Counter Offer */}
                {showCounter && (
                  <div className="mt-4 p-3 bg-slate-50 border rounded-[10px] transition-all">
                    <h5 className="text-[13px] font-bold text-[#273B4A] mb-2">Buat Counter Offer</h5>
                    <p className="text-[11px] text-gray-500 mb-1">Harga tawaran anda</p>
                    <div className="flex gap-2">
                      <div className="flex flex-1 border rounded-[6px] overflow-hidden bg-white">
                        <input
                          type="number"
                          placeholder="Masukkan Harga"
                          value={counterPrice}
                          onChange={(e) => setCounterPrice(e.target.value)}
                          className="w-full px-3 py-1.5 text-[13px] outline-none"
                        />
                        <span className="bg-gray-100 px-3 py-1.5 text-[13px] text-gray-500 font-medium flex items-center border-l">
                          /Kg
                        </span>
                      </div>
                      <button
                        onClick={() => counterPrice && sendAction("Counter", counterPrice)}
                        disabled={isSubmitting || !counterPrice}
                        className="px-5 py-1.5 bg-[#003B7A] text-white text-[13px] font-bold rounded-[6px] hover:bg-blue-900 transition flex items-center gap-1.5 disabled:opacity-50"
                      >
                        <Send className="w-3.5 h-3.5" />
                        Kirim
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="border-t pt-4 flex justify-end">
                <span className="text-[13px] font-semibold text-slate-500">Status: {selectedItem.status}</span>
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
}
