import { useState, useEffect } from "react";
import Sidebar from "../../components/layout/Sidebar";
import PageHeader from "../../components/layout/PageHeader";
import {
  ChevronRight,
  ChevronLeft,
  X,
  Loader2,
  TrendingUp,
  CheckCircle2,
  XCircle,
  Clock,
  RefreshCw,
} from "lucide-react";
import api from "../../config/axios";
import { swalSuccess, swalError } from "../../utils/swal";

const tabItems = [
  { key: "semua", label: "Semua" },
  { key: "menunggu", label: "Menunggu" },
  { key: "counter", label: "Counter" },
  { key: "diterima", label: "Diterima" },
  { key: "ditolak", label: "Ditolak" },
];

function getStatusBadge(status) {
  switch (status) {
    case "Menunggu":
      return (
        <span className="inline-flex items-center gap-1.5 justify-center px-3 py-1 rounded-[12px] bg-amber-100 border border-amber-300 text-[13px] font-semibold text-amber-700">
          <Clock className="w-3 h-3" /> Menunggu
        </span>
      );
    case "Diterima":
      return (
        <span className="inline-flex items-center gap-1.5 justify-center px-3 py-1 rounded-[12px] bg-[rgba(105,255,120,0.19)] border border-[#008A1E] text-[13px] font-semibold text-[#006638]">
          <CheckCircle2 className="w-3 h-3" /> Diterima
        </span>
      );
    case "Ditolak":
      return (
        <span className="inline-flex items-center gap-1.5 justify-center px-3 py-1 rounded-[12px] bg-red-100 border border-red-300 text-[13px] font-semibold text-red-700">
          <XCircle className="w-3 h-3" /> Ditolak
        </span>
      );
    case "Counter":
      return (
        <span className="inline-flex items-center gap-1.5 justify-center px-3 py-1 rounded-[12px] bg-sky-100 border border-sky-300 text-[13px] font-semibold text-sky-700">
          <RefreshCw className="w-3 h-3" /> Counter
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center justify-center px-3 py-1 rounded-[12px] bg-slate-100 border border-slate-300 text-[13px] font-semibold text-slate-700">
          {status}
        </span>
      );
  }
}

function formatRp(value) {
  if (!value) return "-";
  return `Rp ${Number(value).toLocaleString("id-ID")}`;
}

export default function PenawaranPembeliPage() {
  const [offers, setOffers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("semua");
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [counterPrice, setCounterPrice] = useState("");
  const [offerComment, setOfferComment] = useState("");
  const [isActionSubmitting, setIsActionSubmitting] = useState(false);
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;

  const fetchOffers = async () => {
    try {
      setIsLoading(true);
      const res = await api.get("/my-offers");
      const formatted = res.data.map((offer) => ({
        offerId: offer.id,
        kode: offer.kode_penawaran,
        product: offer.product?.nama_produk ?? "Unknown",
        img: offer.product?.gambar
          ? `http://localhost:8000/storage/${offer.product.gambar}`
          : "/images/placeholder.png",
        satuan: offer.product?.satuan ?? "Kg",
        quantity: `${offer.jumlah_diminta} ${offer.product?.satuan ?? "Kg"}`,
        hargaHarapan: offer.product
          ? `${formatRp(offer.product.harga_harapan)} / ${offer.product.satuan}`
          : "-",
        hargaAcuan: offer.harga_acuan
          ? `${formatRp(offer.harga_acuan)} / ${offer.product?.satuan ?? "Kg"}`
          : null,
        hargaAcuanRaw: offer.harga_acuan ? Number(offer.harga_acuan) : null,
        hargaAcuanTanggal: offer.harga_acuan_tanggal,
        hargaTawaran: `${formatRp(offer.harga_tawaran)} / ${offer.product?.satuan ?? "Kg"}`,
        hargaTawaranRaw: Number(offer.harga_tawaran),
        status: offer.status,
        date: new Date(offer.created_at).toLocaleDateString("id-ID", {
          day: "2-digit",
          month: "2-digit",
          year: "2-digit",
        }),
        petani: offer.petani?.nama_lengkap ?? offer.petani?.name ?? "Penjual",
        petaniAlamat: offer.petani?.alamat ?? "-",
        history: (offer.histories ?? []).map((h) => ({
          time: new Date(h.created_at).toLocaleTimeString("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
          }),
          label: h.aksi,
          value: h.harga_terkait
            ? `Rp ${Number(h.harga_terkait).toLocaleString("id-ID")}`
            : "-",
          komentar: h.komentar || null,
        })),
      }));
      setOffers(formatted);
    } catch (err) {
      console.error("Gagal mengambil penawaran:", err);
      setError("Gagal memuat data penawaran Anda.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    Promise.resolve().then(fetchOffers);
  }, []);

  const filteredOffers = offers.filter((o) => {
    if (activeTab === "semua") return true;
    if (activeTab === "menunggu") return o.status === "Menunggu";
    if (activeTab === "counter") return o.status === "Counter";
    if (activeTab === "diterima") return o.status === "Diterima";
    if (activeTab === "ditolak") return o.status === "Ditolak";
    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filteredOffers.length / itemsPerPage));
  const startIndex = (page - 1) * itemsPerPage;
  const currentOffers = filteredOffers.slice(startIndex, startIndex + itemsPerPage);

  const handleTabChange = (key) => {
    setActiveTab(key);
    setPage(1);
  };

  const handleUpdateOffer = async (status, aksiLabel, hargaTawaranOverride = null, komentar = "") => {
    if (!selectedOffer) return;
    setIsActionSubmitting(true);
    try {
      const payload = { status, aksi_label: aksiLabel };
      if (hargaTawaranOverride !== null) {
        payload.harga_tawaran = hargaTawaranOverride;
      }
      if (komentar) {
        payload.komentar = komentar;
      }
      await api.put(`/offers/${selectedOffer.offerId}`, payload);
      await swalSuccess(
        status === "Diterima" ? "Penawaran Diterima!" : status === "Ditolak" ? "Penawaran Ditolak" : "Counter Terkirim",
        status === "Diterima"
          ? "Anda telah menerima tawaran dari penjual. Produk otomatis masuk ke keranjang Anda."
          : status === "Ditolak"
          ? "Penawaran telah Anda tolak."
          : "Counter harga Anda telah dikirim ke penjual."
      );
      await fetchOffers();
      setSelectedOffer(null);
      setCounterPrice("");
      setOfferComment("");
    } catch (err) {
      console.error("Gagal update penawaran:", err);
      await swalError(
        "Gagal",
        err.response?.data?.message ?? "Terjadi kesalahan saat memperbarui penawaran."
      );
    } finally {
      setIsActionSubmitting(false);
    }
  };

  const handleTerima = () => handleUpdateOffer("Diterima", "Pembeli menerima penawaran counter", null, offerComment);
  const handleTolak = () => handleUpdateOffer("Ditolak", "Pembeli menolak penawaran counter", null, offerComment);
  const handleKirimCounter = () => {
    const val = Number(counterPrice);
    if (!counterPrice || val <= 0) {
      swalError("Harga tidak valid", "Masukkan harga counter yang valid.");
      return;
    }
    handleUpdateOffer("Counter", "Pembeli mengajukan counter balik", val, offerComment);
  };

  return (
    <div className="min-h-screen bg-white font-[Montserrat] text-slate-900">
      <div className="flex w-full min-h-screen p-4 pl-[304px]">
        <Sidebar />

        <div className="flex-1 bg-[rgba(222,236,225,0.19)] border border-[rgba(0,154,38,0.19)] rounded-[20px] p-8 relative flex flex-col justify-between">
          <div>
            <PageHeader title="Penawaran Saya" subtitle="Pantau status penawaran harga yang Anda ajukan ke penjual" />

            {/* Tabs */}
            <div className="mb-6 flex flex-wrap gap-2">
              {tabItems.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => handleTabChange(tab.key)}
                  className={`rounded-[10px] px-5 py-2 text-[14px] font-semibold transition ${
                    activeTab === tab.key
                      ? "bg-[#006638] text-white"
                      : "bg-white border border-[#006638] text-[#006638] hover:bg-[#006638]/10"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Table */}
            <div className="bg-white/50 border border-[#029154] shadow-[0_0_4px_rgba(0,0,0,0.25)] rounded-[20px] p-6">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-[14px] font-bold text-[#273B4A] border-b-2 border-black/[0.13]">
                      <th className="pb-4 px-2">Produk</th>
                      <th className="pb-4 px-2">
                        <span className="flex items-center gap-1">
                          <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                          Harga Acuan (Bapanas)
                        </span>
                      </th>
                      <th className="pb-4 px-2">Harga Tawaran</th>
                      <th className="pb-4 px-2">Status</th>
                      <th className="pb-4 px-2 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoading ? (
                      <tr>
                        <td colSpan="5" className="text-center py-10">
                          <div className="flex items-center justify-center gap-2 text-[#006638]">
                            <Loader2 className="w-6 h-6 animate-spin" />
                            <span className="font-semibold">Memuat penawaran...</span>
                          </div>
                        </td>
                      </tr>
                    ) : error ? (
                      <tr>
                        <td colSpan="5" className="text-center py-10 text-red-500 font-semibold bg-red-50">
                          {error}
                        </td>
                      </tr>
                    ) : currentOffers.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="text-center py-12 text-slate-400 font-medium">
                          Belum ada penawaran yang diajukan.
                        </td>
                      </tr>
                    ) : (
                      currentOffers.map((offer) => (
                        <tr
                          key={offer.offerId}
                          className="border-b border-black/[0.08] last:border-b-0 hover:bg-slate-50/60 transition"
                        >
                          {/* Produk */}
                          <td className="py-4 px-2">
                            <div className="flex items-center gap-3">
                              <img
                                src={offer.img}
                                alt={offer.product}
                                className="w-[48px] h-[48px] object-cover rounded-[6px] border border-slate-200"
                                onError={(e) => (e.target.src = "/images/placeholder.png")}
                              />
                              <div>
                                <div className="text-[14px] font-semibold text-[#273B4A]">
                                  {offer.product}
                                </div>
                                <div className="text-[12px] text-slate-400">{offer.quantity}</div>
                              </div>
                            </div>
                          </td>

                          {/* Harga Acuan */}
                          <td className="py-4 px-2">
                            {offer.hargaAcuan ? (
                              <div>
                                <div className="text-[14px] font-semibold text-emerald-700">
                                  {offer.hargaAcuan}
                                </div>
                                {offer.hargaAcuanTanggal && (
                                  <div className="text-[11px] text-slate-400 mt-0.5">
                                    Update:{" "}
                                    {new Date(offer.hargaAcuanTanggal).toLocaleDateString("id-ID", {
                                      month: "short",
                                      year: "numeric",
                                    })}
                                  </div>
                                )}
                              </div>
                            ) : (
                              <span className="text-[13px] text-slate-400 italic">Belum tersedia</span>
                            )}
                          </td>

                          {/* Harga Tawaran */}
                          <td className="py-4 px-2">
                            <div className="text-[14px] font-semibold text-[#273B4A]">
                              {offer.hargaTawaran}
                            </div>
                            <div className="text-[11px] text-slate-400">
                              Harapan penjual: {offer.hargaHarapan}
                            </div>
                          </td>

                          {/* Status */}
                          <td className="py-4 px-2">
                            <div className="flex flex-col items-start gap-1">
                              {getStatusBadge(offer.status)}
                              <span className="text-[11px] text-slate-400 ml-1">{offer.date}</span>
                            </div>
                          </td>

                          {/* Aksi */}
                          <td className="py-4 px-2 text-center">
                            <button
                              onClick={() => {
                                setSelectedOffer(offer);
                                setCounterPrice("");
                                setOfferComment("");
                              }}
                              className="rounded-full bg-[#006638] px-5 py-2 text-[13px] font-semibold text-white shadow-sm hover:bg-[#00522d] transition"
                            >
                              Detail
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-6 px-2">
            <span className="text-[15px] font-semibold text-black/[0.51]">
              Menampilkan {filteredOffers.length > 0 ? startIndex + 1 : 0}-
              {Math.min(startIndex + currentOffers.length, filteredOffers.length)} dari{" "}
              {filteredOffers.length} penawaran
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                disabled={page === 1}
                className="w-8 h-8 flex items-center justify-center disabled:opacity-30"
              >
                <ChevronLeft className="w-5 h-5 text-black/[0.43]" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`w-[36px] h-[36px] rounded-[5px] text-[15px] font-semibold flex items-center justify-center transition ${
                    page === i + 1
                      ? "bg-[#006638] text-white"
                      : "bg-white border border-[#006638] text-[#006638] hover:bg-[#006638]/5"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                disabled={page === totalPages}
                className="w-8 h-8 flex items-center justify-center disabled:opacity-30"
              >
                <ChevronRight className="w-5 h-5 text-black/[0.43]" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ======= MODAL DETAIL ======= */}
      {selectedOffer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-[620px] overflow-hidden rounded-[20px] bg-white shadow-2xl border border-slate-200 flex flex-col max-h-[92vh]">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-3 shrink-0">
              <div>
                <h3 className="text-[17px] font-bold text-[#005941]">Detail Penawaran</h3>
                <p className="text-[12px] text-slate-400">{selectedOffer.kode}</p>
              </div>
              <button
                onClick={() => {
                  setSelectedOffer(null);
                  setCounterPrice("");
                  setOfferComment("");
                }}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-5 overflow-y-auto flex-1 space-y-3 custom-scrollbar text-[14px]">
              <style>{`.custom-scrollbar::-webkit-scrollbar { display: none; } .custom-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }`}</style>

              {/* Produk & Harga Grid */}
              <div className="grid gap-3 sm:grid-cols-[1fr_1.1fr]">
                <div className="rounded-[12px] border border-slate-200 bg-slate-50 p-3 flex items-center gap-3">
                  <img
                    src={selectedOffer.img}
                    alt={selectedOffer.product}
                    className="w-12 h-12 object-cover rounded-[8px] border border-slate-100"
                    onError={(e) => (e.target.src = "/images/placeholder.png")}
                  />
                  <div>
                    <div className="font-semibold text-[#273B4A] text-[15px]">{selectedOffer.product}</div>
                    <div className="text-slate-400 text-[12px]">{selectedOffer.quantity}</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {/* Harga Acuan Bapanas */}
                  <div className="rounded-[12px] border border-emerald-200 bg-emerald-50 p-2 text-center flex flex-col justify-center">
                    <div className="text-[10px] text-emerald-600 mb-0.5 font-semibold flex items-center justify-center gap-1">
                      <TrendingUp className="w-3 h-3" /> Harga Acuan
                    </div>
                    {selectedOffer.hargaAcuan ? (
                      <>
                        <div className="font-bold text-emerald-700 text-[13px]">
                          {selectedOffer.hargaAcuan}
                        </div>
                        {selectedOffer.hargaAcuanTanggal && (
                          <div className="text-[10px] text-emerald-500 mt-0.5">
                            {new Date(selectedOffer.hargaAcuanTanggal).toLocaleDateString("id-ID", {
                              month: "short",
                              year: "numeric",
                            })}
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="font-semibold text-slate-400 text-[12px] italic">Belum tersedia</div>
                    )}
                  </div>

                  {/* Harga Tawaran */}
                  <div className="rounded-[12px] border border-sky-200 bg-sky-50 p-2 text-center flex flex-col justify-center">
                    <div className="text-[10px] text-sky-600 mb-0.5 font-semibold">Tawaran Anda</div>
                    <div className="font-bold text-sky-700 text-[13px]">{selectedOffer.hargaTawaran}</div>
                  </div>
                </div>
              </div>

              {/* Harga harapan penjual */}
              <div className="text-[12px] text-slate-500 px-1">
                Harga Harapan Penjual:{" "}
                <span className="font-semibold text-[#273B4A]">{selectedOffer.hargaHarapan}</span>
              </div>

              {/* Status badge */}
              <div className="flex items-center gap-2 px-1">
                <span className="text-[12px] text-slate-500">Status saat ini:</span>
                {getStatusBadge(selectedOffer.status)}
                {selectedOffer.status === "Counter" && (
                  <span className="text-[12px] text-sky-600 font-semibold animate-pulse">
                    — Penjual mengajukan harga baru, silakan respons di bawah!
                  </span>
                )}
              </div>

              {/* Info Penjual */}
              <div className="rounded-[12px] border border-slate-200 bg-slate-50 p-3 flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#006638]/10 text-[#006638] font-bold text-lg">
                  {selectedOffer.petani.charAt(0)}
                </div>
                <div>
                  <div className="font-semibold text-[#273B4A]">{selectedOffer.petani}</div>
                  <div className="text-[11px] text-slate-400">{selectedOffer.petaniAlamat}</div>
                </div>
              </div>

              {/* Riwayat Penawaran */}
              <div className="rounded-[12px] border border-slate-200 bg-slate-50 p-3">
                <div className="font-semibold text-[#273B4A] text-[13px] mb-2">Riwayat Penawaran</div>
                <div className="space-y-1.5">
                  {selectedOffer.history.length === 0 ? (
                    <p className="text-[12px] text-slate-400 italic">Belum ada riwayat.</p>
                  ) : (
                    selectedOffer.history.map((item, idx) => (
                      <div
                        key={idx}
                        className="rounded-[8px] bg-white px-3 py-1.5 border border-slate-200 text-[12px]"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="text-[11px] text-slate-400 font-medium w-[32px]">{item.time}</div>
                            <div className="font-medium text-[#273B4A]">{item.label}</div>
                          </div>
                          <div className="font-bold text-[#006638]">{item.value}</div>
                        </div>
                        {item.komentar && (
                          <div className="mt-1.5 ml-[44px] text-slate-600 italic border-l-2 border-emerald-300 pl-2">
                            "{item.komentar}"
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Footer Actions — hanya tampil jika status = Counter */}
            {selectedOffer.status === "Counter" && (
              <div className="border-t border-slate-200 p-4 shrink-0 bg-sky-50">
                <p className="text-[12px] text-sky-700 font-semibold mb-3">
                  Penjual mengajukan counter harga. Apa respons Anda?
                </p>
                <div className="mb-3">
                  <label className="text-[12px] font-semibold text-slate-600 block mb-1">
                    Komentar (opsional)
                  </label>
                  <textarea
                    value={offerComment}
                    onChange={(e) => setOfferComment(e.target.value)}
                    placeholder="Contoh: Setuju, lanjut proses..."
                    rows={2}
                    className="w-full border border-slate-300 rounded-[8px] px-3 py-2 text-[13px] outline-none resize-none"
                  />
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  {/* Terima / Tolak */}
                  <div className="flex gap-2 sm:w-[42%]">
                    <button
                      onClick={handleTerima}
                      disabled={isActionSubmitting}
                      className="flex-1 rounded-[10px] bg-[#006638] py-2.5 font-semibold text-white hover:bg-[#00522d] transition text-[13px] disabled:opacity-50"
                    >
                      Terima
                    </button>
                    <button
                      onClick={handleTolak}
                      disabled={isActionSubmitting}
                      className="flex-1 rounded-[10px] border-2 border-red-500 bg-white py-2 font-semibold text-red-500 hover:bg-red-50 transition text-[13px] disabled:opacity-50"
                    >
                      Tolak
                    </button>
                  </div>

                  {/* Counter Balik */}
                  <div className="flex gap-2 flex-1 items-center bg-white border border-slate-300 rounded-[10px] overflow-hidden pl-3 focus-within:border-sky-500">
                    <span className="text-[13px] font-semibold text-slate-400">Rp</span>
                    <input
                      type="number"
                      min="1"
                      value={counterPrice}
                      onChange={(e) => setCounterPrice(e.target.value)}
                      placeholder="Counter balik harga..."
                      className="flex-1 bg-transparent py-2.5 text-[13px] text-slate-900 outline-none font-semibold"
                    />
                    <button
                      onClick={handleKirimCounter}
                      disabled={isActionSubmitting}
                      className="bg-sky-600 h-full px-4 font-semibold text-white hover:bg-sky-700 transition text-[13px] disabled:opacity-50"
                    >
                      Kirim
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Info jika sudah final */}
            {(selectedOffer.status === "Diterima" || selectedOffer.status === "Ditolak") && (
              <div
                className={`border-t px-5 py-3 shrink-0 text-[13px] font-semibold text-center ${
                  selectedOffer.status === "Diterima"
                    ? "border-emerald-200 bg-emerald-50 text-[#006638]"
                    : "border-red-200 bg-red-50 text-red-600"
                }`}
              >
                {selectedOffer.status === "Diterima"
                  ? "✓ Penawaran telah disepakati. Produk otomatis masuk ke keranjang Anda."
                  : "✗ Penawaran tidak berhasil disepakati."}
              </div>
            )}

            {/* CTA Lanjut ke Keranjang saat disetujui */}
            {selectedOffer.status === "Diterima" && (
              <div className="border-t border-slate-200 p-4 shrink-0 bg-white">
                <button
                  onClick={() => (window.location.href = "/pembeli/keranjang")}
                  className="w-full h-[46px] rounded-[10px] bg-[#006638] hover:bg-[#00522d] text-white font-bold text-[14px] transition shadow-sm"
                >
                  Lanjut ke Keranjang
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
