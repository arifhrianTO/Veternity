import React, { useState } from "react";
import PetaniSidebar from "../../components/petani/PetaniSidebar";
import { ChevronRight, ChevronLeft, X, Phone, MessageSquare, Mail } from "lucide-react";

const penawaranData = [
  {
    id: "PNW-001",
    product: "Beras Premium",
    img: "beras.png",
    quantity: "50 Kg",
    basePrice: "Rp 14.000 / kg",
    offerPrice: "Rp 12.000 / kg",
    date: "01-01-26",
    status: "Menunggu",
    buyer: "PT Sejahtera",
    location: "Bogor, Jawa Barat",
    message:
      "Halo pak, saya tertarik membeli beras panen terbaru. Mohon konfirmasi harga dan pengiriman.",
    history: [
      { time: "10:30", label: "Pembeli mengajukan penawaran", value: "Rp 12.000 / kg" },
      { time: "10:35", label: "Menunggu respon", value: "-" },
    ],
  },
  {
    id: "PNW-002",
    product: "Beras Premium",
    img: "beras.png",
    quantity: "50 Kg",
    basePrice: "Rp 14.000 / kg",
    offerPrice: "Rp 12.000 / kg",
    date: "01-01-26",
    status: "Diterima",
    buyer: "PT Sejahtera",
    location: "Bogor, Jawa Barat",
    message: "Terima kasih, penawaran diterima. Mohon siapkan pesanan.",
    history: [
      { time: "10:30", label: "Pembeli mengajukan penawaran", value: "Rp 12.000 / kg" },
      { time: "10:35", label: "Penawaran diterima", value: "Rp 12.000 / kg" },
    ],
  },
  {
    id: "PNW-003",
    product: "Beras Premium",
    img: "beras.png",
    quantity: "50 Kg",
    basePrice: "Rp 14.000 / kg",
    offerPrice: "Rp 12.000 / kg",
    date: "01-01-26",
    status: "Ditolak",
    buyer: "PT Sejahtera",
    location: "Bogor, Jawa Barat",
    message: "Mohon maaf, penawaran tidak sesuai dengan harga kami.",
    history: [
      { time: "10:30", label: "Pembeli mengajukan penawaran", value: "Rp 12.000 / kg" },
      { time: "10:35", label: "Penawaran ditolak", value: "-" },
    ],
  },
];

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
  const [activeTab, setActiveTab] = useState("semua");
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [counterPrice, setCounterPrice] = useState("");
  const [page, setPage] = useState(1);
  const itemsPerPage = 4;

  const filteredOffers = penawaranData.filter((item) => {
    if (activeTab === "semua") return true;
    if (activeTab === "menunggu") return item.status === "Menunggu";
    if (activeTab === "diterima") return item.status === "Diterima";
    if (activeTab === "ditolak") return item.status === "Ditolak";
    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filteredOffers.length / itemsPerPage));
  const startIndex = (page - 1) * itemsPerPage;
  const currentOffers = filteredOffers.slice(startIndex, startIndex + itemsPerPage);

  const handleTabChange = (tabKey) => {
    setActiveTab(tabKey);
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-white font-[Montserrat] text-slate-900">
      <div className="flex max-w-[1440px] mx-auto py-8 gap-6 px-4">
        <PetaniSidebar />

        {/* Outer Container Wrapper */}
        <div className="flex-1 bg-[rgba(222,236,225,0.19)] border border-[rgba(0,154,38,0.19)] rounded-[20px] p-8 min-h-[971px] relative flex flex-col justify-between">
          <div>
            {/* Top Header Bar */}
            <div className="flex items-center justify-between border-b border-[#029154] pb-6 mb-6">
              <div>
                <h2 className="text-[24px] font-semibold text-[#005941]">Penawaran</h2>
                <p className="text-[14px] text-slate-500">Kelola penawaran yang masuk dari pembeli</p>
              </div>
              <div className="flex items-center gap-4">
                <img
                  src="/images/ikan1.png"
                  alt="avatar"
                  className="w-14 h-14 rounded-full border border-slate-100 object-cover"
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
                    <tr className="text-[16px] font-bold text-[#273B4A] border-b-2 border-black/[0.13]">
                      <th className="pb-4 px-2">Produk</th>
                      <th className="pb-4 px-2">Harga Acuan</th>
                      <th className="pb-4 px-2">Harga Tawaran</th>
                      <th className="pb-4 px-2">Status</th>
                      <th className="pb-4 px-2 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentOffers.map((offer) => (
                      <tr key={offer.id} className="border-b border-black/[0.13] last:border-b-0">
                        <td className="py-4 px-2">
                          <div className="flex items-center gap-3">
                            <img
                              src={`/images/${offer.img}`}
                              alt={offer.product}
                              className="w-[83px] h-[55px] object-cover rounded-[5px]"
                            />
                            <div>
                              <div className="text-[16px] font-semibold text-[#273B4A]">{offer.product}</div>
                              <div className="text-[14px] text-slate-500">{offer.quantity}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-2 text-[16px] font-semibold text-[#273B4A]">{offer.basePrice}</td>
                        <td className="py-4 px-2 text-[16px] font-semibold text-[#273B4A]">{offer.offerPrice}</td>
                        <td className="py-4 px-2">
                          <div className="flex flex-col items-start gap-1">
                            {getStatusBadge(offer.status)}
                            <span className="text-[12px] text-slate-400 font-medium ml-1">{offer.date}</span>
                          </div>
                        </td>
                        <td className="py-4 px-2 text-center">
                          <button
                            onClick={() => setSelectedOffer(offer)}
                            className="rounded-full bg-[#006638] px-6 py-2 text-[14px] font-semibold text-white shadow-sm hover:bg-[#00522d] transition"
                          >
                            Detail
                          </button>
                        </td>
                      </tr>
                    ))}
                    {currentOffers.length === 0 && (
                      <tr>
                        <td colSpan="5" className="text-center py-8 text-slate-500 font-medium">
                          Tidak ada penawaran ditemukan.
                        </td>
                      </tr>
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
                  className={`w-[40px] h-[40px] rounded-[5px] text-[20px] font-semibold flex items-center justify-center transition ${
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
          <div className="w-full max-w-[560px] overflow-hidden rounded-[20px] bg-white shadow-2xl border border-slate-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
              <h3 className="text-[18px] font-bold text-[#005941]">Detail Penawaran</h3>
              <button
                onClick={() => setSelectedOffer(null)}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="space-y-4 p-6 text-[14px]">
              <div className="grid gap-3 sm:grid-cols-[1.2fr_0.8fr]">
                <div className="rounded-[12px] border border-slate-200 bg-slate-50 p-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={`/images/${selectedOffer.img}`}
                      alt={selectedOffer.product}
                      className="w-16 h-16 object-cover rounded-[8px]"
                    />
                    <div>
                      <div className="font-semibold text-[#273B4A]">{selectedOffer.product}</div>
                      <div className="text-slate-500">{selectedOffer.quantity}</div>
                    </div>
                  </div>
                </div>

                <div className="grid gap-2">
                  <div className="rounded-[12px] border border-slate-200 bg-slate-50 p-2.5">
                    <div className="text-[12px] text-slate-500">Harga Acuan</div>
                    <div className="font-semibold text-[#273B4A]">{selectedOffer.basePrice}</div>
                  </div>
                  <div className="rounded-[12px] border border-slate-200 bg-slate-50 p-2.5">
                    <div className="text-[12px] text-slate-500">Harga Tawaran</div>
                    <div className="font-semibold text-[#006638]">{selectedOffer.offerPrice}</div>
                  </div>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-[12px] border border-slate-200 bg-slate-50 p-3 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#006638]/10 text-[#006638] font-bold">
                        👤
                      </div>
                      <div>
                        <div className="font-semibold text-[#273B4A]">{selectedOffer.buyer}</div>
                        <div className="text-[12px] text-slate-500">{selectedOffer.location}</div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <button className="flex-1 py-1.5 flex items-center justify-center rounded-[8px] border border-slate-200 bg-white text-slate-600 hover:bg-slate-100">
                      <Phone className="w-4 h-4" />
                    </button>
                    <button className="flex-1 py-1.5 flex items-center justify-center rounded-[8px] border border-slate-200 bg-white text-slate-600 hover:bg-slate-100">
                      <MessageSquare className="w-4 h-4" />
                    </button>
                    <button className="flex-1 py-1.5 flex items-center justify-center rounded-[8px] border border-slate-200 bg-white text-slate-600 hover:bg-slate-100">
                      <Mail className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="rounded-[12px] border border-slate-200 bg-slate-50 p-3">
                  <div className="font-semibold text-[#273B4A]">Pesan Pembeli</div>
                  <p className="mt-1 text-[13px] leading-snug text-slate-600">{selectedOffer.message}</p>
                </div>
              </div>

              <div className="rounded-[12px] border border-slate-200 bg-slate-50 p-3">
                <div className="font-semibold text-[#273B4A]">Riwayat Penawaran</div>
                <div className="mt-2 space-y-2">
                  {selectedOffer.history.map((item, index) => (
                    <div key={index} className="flex items-center justify-between rounded-[8px] bg-white px-3 py-2 border border-slate-200 text-[13px]">
                      <div>
                        <div className="font-semibold text-[#273B4A]">{item.label}</div>
                        <div className="text-[11px] text-slate-400">{item.time}</div>
                      </div>
                      <div className="font-semibold text-[#006638]">{item.value}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid gap-3 pt-2">
                <div className="grid grid-cols-3 gap-2">
                  <button className="rounded-[10px] bg-[#006638] py-2 font-semibold text-white hover:bg-[#00522d] transition">
                    Terima
                  </button>
                  <button className="rounded-[10px] border border-red-600 py-2 font-semibold text-red-600 hover:bg-red-50 transition">
                    Tolak
                  </button>
                  <button className="rounded-[10px] border border-[#006638] py-2 font-semibold text-[#006638] hover:bg-[#006638]/5 transition">
                    Counter Offer
                  </button>
                </div>

                <div className="flex gap-2 items-center pt-2 border-t border-slate-100">
                  <input
                    type="text"
                    value={counterPrice}
                    onChange={(e) => setCounterPrice(e.target.value)}
                    placeholder="Masukkan Harga Counter"
                    className="flex-1 rounded-[10px] border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none focus:border-[#006638]"
                  />
                  <span className="text-slate-500 font-medium">/kg</span>
                  <button className="rounded-[10px] bg-[#273B4A] px-5 py-2 font-semibold text-white hover:bg-[#1f2f3b] transition">
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