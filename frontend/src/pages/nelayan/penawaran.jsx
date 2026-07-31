import { useState, useEffect } from "react";
import Sidebar from "../../components/layout/Sidebar";
import { ChevronRight, ChevronLeft, X, Phone, MessageSquare, Mail, Loader2 } from "lucide-react";
import api from "../../config/axios";

const tabItems = [
  { key: "semua", label: "Semua" },
  { key: "menunggu", label: "Menunggu" },
  { key: "diterima", label: "Diterima" },
  { key: "ditolak", label: "Ditolak" },
];

function getStatusBadge(status) {
  switch (status) {
    case "Menunggu":
      return (
        <span className="inline-flex items-center justify-center px-3 py-1 rounded-[12px] bg-amber-100 border border-amber-300 text-[14px] font-semibold text-amber-700">
          Menunggu
        </span>
      );
    case "Diterima":
      return (
        <span className="inline-flex items-center justify-center px-3 py-1 rounded-[12px] bg-[rgba(105,255,120,0.19)] border border-[#008A1E] text-[14px] font-semibold text-[#006638]">
          Diterima
        </span>
      );
    case "Ditolak":
      return (
        <span className="inline-flex items-center justify-center px-3 py-1 rounded-[12px] bg-red-100 border border-red-300 text-[14px] font-semibold text-red-700">
          Ditolak
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center justify-center px-3 py-1 rounded-[12px] bg-slate-100 border border-slate-300 text-[14px] font-semibold text-slate-700">
          {status}
        </span>
      );
  }
}

export default function PenawaranPage() {
  const [offers, setOffers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        setIsLoading(true);
        const testToken = localStorage.getItem("token") || "11|bRDttRF4eF1WuflHocapjNqoF26hfU4a2AusID1E7a2abeb3";
        localStorage.setItem("token", testToken);

        const response = await api.get('/offers');
        const formattedOffers = response.data.map(offer => ({
          id: offer.kode_penawaran,
          product: offer.product ? offer.product.kategori : 'Unknown',
          img: offer.product && offer.product.gambar ? `http://localhost:8000/storage/${offer.product.gambar}` : '/images/placeholder.png',
          quantity: `${offer.jumlah_diminta} ${offer.product ? offer.product.satuan : 'Kg'}`,
          basePrice: offer.product ? `Rp ${Number(offer.product.harga_harapan).toLocaleString('id-ID')} / ${offer.product.satuan}` : '-',
          offerPrice: `Rp ${Number(offer.harga_tawaran).toLocaleString('id-ID')} / ${offer.product ? offer.product.satuan : 'Kg'}`,
          date: new Date(offer.created_at).toLocaleDateString('id-ID', {day: '2-digit', month: '2-digit', year: '2-digit'}),
          status: offer.status,
          buyer: offer.pembeli ? offer.pembeli.nama_lengkap : 'Unknown',
          location: offer.pembeli ? offer.pembeli.alamat : 'Unknown',
          message: offer.pesan_pembeli || 'Tidak ada pesan.',
          history: offer.histories ? offer.histories.map(h => ({
            time: new Date(h.created_at).toLocaleTimeString('id-ID', {hour: '2-digit', minute:'2-digit'}),
            label: h.aksi,
            value: h.harga_terkait ? `Rp ${Number(h.harga_terkait).toLocaleString('id-ID')}` : '-'
          })) : []
        }));
        setOffers(formattedOffers);
      } catch (err) {
        console.error("Gagal mengambil data penawaran:", err);
        setError("Gagal memuat data penawaran.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchOffers();
  }, []);

  const [activeTab, setActiveTab] = useState("semua");
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [counterPrice, setCounterPrice] = useState("");
  const [page, setPage] = useState(1);
  const itemsPerPage = 4;

  const filteredOffers = Array.isArray(offers) ? offers.filter((item) => {
    if (activeTab === "semua") return true;
    if (activeTab === "menunggu") return item.status === "Menunggu";
    if (activeTab === "diterima") return item.status === "Diterima";
    if (activeTab === "ditolak") return item.status === "Ditolak";
    return true;
  }) : [];

  const totalPages = Math.max(1, Math.ceil(filteredOffers.length / itemsPerPage));
  const startIndex = (page - 1) * itemsPerPage;
  const currentOffers = filteredOffers.slice(startIndex, startIndex + itemsPerPage);

  const handleTabChange = (tabKey) => {
    setActiveTab(tabKey);
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-white font-[Montserrat] text-slate-900">
      <div className="flex w-full min-h-screen p-4 pl-[304px]">
        <Sidebar />

        {/* Outer Container Wrapper */}
        <div className="flex-1 bg-[rgba(222,236,225,0.19)] border border-[rgba(0,154,38,0.19)] rounded-[20px] p-8 relative flex flex-col justify-between">
          <div>
            {/* Top Header Bar */}
            <div className="flex items-end justify-between border-b border-[#029154] pb-2 mb-4">
              <div>
                <h2 className="text-[24px] font-semibold text-[#005941]">Penawaran</h2>
                <p className="text-[14px] text-slate-500">Kelola penawaran yang masuk dari pembeli</p>
              </div>
              <div className="flex items-center gap-4">
                <img
                  src="/images/ikan1.png"
                  alt="avatar"
                  className="w-10 h-10 rounded-full border border-slate-100 object-cover translate-y-[4px]"
                />
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="mb-6 flex flex-wrap gap-2">
              {tabItems.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => handleTabChange(tab.key)}
                  className={`rounded-[10px] px-5 py-2 text-[15px] font-semibold transition ${
                    activeTab === tab.key
                      ? "bg-[#006638] text-white"
                      : "bg-white border border-[#006638] text-[#006638] hover:bg-[#006638]/10"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Inner Table Card Container */}
            <div className="bg-white/50 border border-[#029154] shadow-[0_0_4px_rgba(0,0,0,0.25)] rounded-[20px] p-6">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-[15px] font-bold text-[#273B4A] border-b-2 border-black/[0.13]">
                      <th className="pb-4 px-2">Produk</th>
                      <th className="pb-4 px-2">Harga Acuan</th>
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
                        <td colSpan="5" className="text-center py-8 text-slate-500 font-medium">
                          Tidak ada penawaran ditemukan.
                        </td>
                      </tr>
                    ) : (
                      currentOffers.map((offer) => (
                        <tr key={offer.id} className="border-b border-black/[0.13] last:border-b-0 hover:bg-slate-50/50 transition">
                          <td className="py-4 px-2">
                            <div className="flex items-center gap-3">
                              <img src={offer.img} alt={offer.product} className="w-[50px] h-[50px] object-cover rounded-[5px] border border-slate-200" />
                              <div>
                                <div className="text-[14px] font-semibold text-[#273B4A]">{offer.product}</div>
                                <div className="text-[13px] text-slate-500">{offer.quantity}</div>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-2 text-[14px] font-semibold text-[#273B4A]">{offer.basePrice}</td>
                          <td className="py-4 px-2 text-[14px] font-semibold text-[#273B4A]">{offer.offerPrice}</td>
                          <td className="py-4 px-2">
                            <div className="flex flex-col items-start gap-1">
                              {getStatusBadge(offer.status)}
                              <span className="text-[12px] text-slate-400 font-medium ml-1">{offer.date}</span>
                            </div>
                          </td>
                          <td className="py-4 px-2 text-center">
                            <button
                              onClick={() => setSelectedOffer(offer)}
                              className="rounded-full bg-[#006638] px-6 py-2 text-[13px] font-semibold text-white shadow-sm hover:bg-[#00522d] transition"
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

          {/* Bottom Pagination Info & Controls */}
          <div className="flex items-center justify-between mt-6 px-2">
            <span className="text-[16px] font-semibold text-black/[0.51]">
              Menampilkan {filteredOffers.length > 0 ? startIndex + 1 : 0}-
              {Math.min(startIndex + currentOffers.length, filteredOffers.length)} dari {filteredOffers.length} penawaran
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

      {/* Modal Detail Penawaran */}
      {selectedOffer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-[640px] overflow-hidden rounded-[20px] bg-white shadow-2xl border border-slate-200 flex flex-col max-h-[95vh]">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-3 shrink-0">
              <h3 className="text-[18px] font-bold text-[#005941]">Detail Penawaran</h3>
              <button
                onClick={() => setSelectedOffer(null)}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content - Scrollable */}
            <div className="p-5 text-[14px] overflow-y-auto flex-1 custom-scrollbar space-y-3">
              
              {/* Info Produk & Harga - 1 Baris Grid */}
              <div className="grid gap-3 sm:grid-cols-[1fr_1fr]">
                <div className="rounded-[12px] border border-slate-200 bg-slate-50 p-2.5 flex items-center gap-3">
                  <img
                    src={`/images/${selectedOffer.img}`}
                    alt={selectedOffer.product}
                    className="w-12 h-12 object-cover rounded-[8px]"
                  />
                  <div>
                    <div className="font-semibold text-[#273B4A] text-[15px]">{selectedOffer.product}</div>
                    <div className="text-slate-500 text-[13px]">{selectedOffer.quantity}</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="rounded-[12px] border border-slate-200 bg-slate-50 p-2 text-center flex flex-col justify-center">
                    <div className="text-[11px] text-slate-500 mb-0.5">Harga Acuan</div>
                    <div className="font-semibold text-[#273B4A] text-[13px]">{selectedOffer.basePrice}</div>
                  </div>
                  <div className="rounded-[12px] border border-slate-200 bg-[#006638]/5 p-2 text-center flex flex-col justify-center border-[#006638]/20">
                    <div className="text-[11px] text-[#006638] mb-0.5 font-medium">Harga Tawaran</div>
                    <div className="font-bold text-[#006638] text-[13px]">{selectedOffer.offerPrice}</div>
                  </div>
                </div>
              </div>

              {/* Info Pembeli & Pesan - 1 Baris Grid */}
              <div className="grid gap-3 sm:grid-cols-[1fr_1.2fr]">
                <div className="rounded-[12px] border border-slate-200 bg-slate-50 p-3 flex flex-col justify-between">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#006638]/10 text-[#006638] font-bold text-lg">
                      {selectedOffer.buyer.charAt(0)}
                    </div>
                    <div>
                      <div className="font-semibold text-[#273B4A] leading-tight">{selectedOffer.buyer}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">{selectedOffer.location}</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button title="Telepon" className="flex-1 py-1.5 flex items-center justify-center rounded-[8px] border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 transition">
                      <Phone className="w-3.5 h-3.5" />
                    </button>
                    <button title="Kirim Pesan" className="flex-1 py-1.5 flex items-center justify-center rounded-[8px] border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 transition">
                      <MessageSquare className="w-3.5 h-3.5" />
                    </button>
                    <button title="Kirim Email" className="flex-1 py-1.5 flex items-center justify-center rounded-[8px] border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 transition">
                      <Mail className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="rounded-[12px] border border-slate-200 bg-slate-50 p-3">
                  <div className="font-semibold text-[#273B4A] text-[13px] mb-1">Pesan Pembeli :</div>
                  <p className="text-[13px] leading-relaxed text-slate-600 italic">"{selectedOffer.message}"</p>
                </div>
              </div>

              {/* Riwayat */}
              <div className="rounded-[12px] border border-slate-200 bg-slate-50 p-3">
                <div className="font-semibold text-[#273B4A] text-[13px] mb-2">Riwayat Penawaran</div>
                <div className="space-y-1.5">
                  {selectedOffer.history.map((item, index) => (
                    <div key={index} className="flex items-center justify-between rounded-[8px] bg-white px-3 py-1.5 border border-slate-200 text-[12px]">
                      <div className="flex items-center gap-3">
                        <div className="text-[11px] text-slate-400 font-medium w-[35px]">{item.time}</div>
                        <div className="font-medium text-[#273B4A]">{item.label}</div>
                      </div>
                      <div className="font-bold text-[#006638]">{item.value}</div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Action Buttons - Fixed at Bottom */}
            <div className="border-t border-slate-200 p-4 shrink-0 bg-slate-50">
               <div className="flex flex-col sm:flex-row gap-3">
                  {/* Left: Terima / Tolak */}
                  <div className="flex gap-2 sm:w-[40%]">
                    <button className="flex-1 rounded-[10px] bg-[#006638] py-2.5 font-semibold text-white hover:bg-[#00522d] transition text-[13px]">
                      Terima
                    </button>
                    <button className="flex-1 rounded-[10px] border-2 border-red-500 bg-white py-2 font-semibold text-red-500 hover:bg-red-50 transition text-[13px]">
                      Tolak
                    </button>
                  </div>
                  
                  {/* Right: Counter Offer */}
                  <div className="flex gap-2 flex-1 items-center bg-white border border-slate-300 rounded-[10px] overflow-hidden pl-3 focus-within:border-[#006638]">
                    <span className="text-[13px] font-semibold text-slate-400">Rp</span>
                    <input
                      type="text"
                      value={counterPrice}
                      onChange={(e) => setCounterPrice(e.target.value)}
                      placeholder="Harga counter..."
                      className="flex-1 bg-transparent py-2.5 text-[13px] text-slate-900 outline-none font-semibold"
                    />
                    <button className="bg-[#273B4A] h-full px-4 font-semibold text-white hover:bg-[#1f2f3b] transition text-[13px]">
                      Kirim
                    </button>
                  </div>
               </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
