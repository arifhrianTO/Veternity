import React, { useState } from "react";
import PetaniSidebar from "../../components/petani/PetaniSidebar";
import PetaniStatusBadge from "../../components/petani/PetaniStatusBadge";

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
    statusVariant: "yellow",
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
    statusVariant: "emerald",
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
    statusVariant: "red",
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

export default function PenawaranPage() {
  const [activeTab, setActiveTab] = useState("semua");
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [counterPrice, setCounterPrice] = useState("");

  const filteredOffers = penawaranData.filter((item) => {
    if (activeTab === "semua") return true;
    if (activeTab === "menunggu") return item.status === "Menunggu";
    if (activeTab === "diterima") return item.status === "Diterima";
    if (activeTab === "ditolak") return item.status === "Ditolak";
    return true;
  });

  return (
    <div className="min-h-screen bg-[#F3F8F6] font-sans text-slate-900">
      <div className="flex max-w-[1360px] mx-auto py-8 gap-6 px-4">
        <PetaniSidebar />

        <div className="flex-1">
          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold">Penawaran</h3>
                <div className="text-sm text-slate-500">Kelola penawaran yang masuk dari pembeli</div>
              </div>
            </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-2 flex flex-wrap gap-2 mb-6">
          {tabItems.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`rounded-full px-4 py-2 text-sm font-semibold ${
                activeTab === tab.key
                  ? "bg-white text-emerald-700 shadow-sm"
                  : "text-slate-600 hover:bg-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-slate-500 text-left border-b">
                <th className="py-3">Produk</th>
                <th className="py-3">Harga Acuan</th>
                <th className="py-3">Harga Tawaran</th>
                <th className="py-3">Status</th>
                <th className="py-3">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredOffers.map((offer, index) => (
                <tr key={offer.id} className="align-top">
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <img src={`/images/${offer.img}`} alt={offer.product} className="w-20 h-14 object-cover rounded" />
                      <div>
                        <div className="font-semibold text-slate-900">{offer.product}</div>
                        <div className="text-sm text-slate-500">{offer.quantity}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 font-semibold text-slate-900">{offer.basePrice}</td>
                  <td className="py-4 font-semibold text-slate-900">{offer.offerPrice}</td>
                  <td className="py-4">
                    <div className="inline-flex items-center gap-2">
                      <PetaniStatusBadge variant={offer.statusVariant}>{offer.status}</PetaniStatusBadge>
                    </div>
                    <div className="mt-2 text-xs text-slate-400">{offer.date}</div>
                  </td>
                  <td className="py-4">
                    <button
                      onClick={() => setSelectedOffer(offer)}
                      className="rounded-full bg-emerald-700 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-800"
                    >
                      Detail
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedOffer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
          <div className="w-full max-w-[520px] overflow-hidden rounded-[28px] bg-white shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-200 p-3">
              
              <button
                onClick={() => setSelectedOffer(null)}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200"
                aria-label="Tutup"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 p-3">
              <div className="grid gap-3 lg:grid-cols-[1.2fr_0.8fr]">
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-3">
                  <div className="flex items-center gap-3">
                    <img src={`/images/${selectedOffer.img}`} alt={selectedOffer.product} className="w-18 h-18 object-cover rounded-3xl" />
                    <div>
                      <div className="text-sm font-semibold text-slate-900">{selectedOffer.product}</div>
                      <div className="text-xs text-slate-500">{selectedOffer.quantity}</div>
                    </div>
                  </div>
                </div>

                <div className="grid gap-2">
                  <div className="rounded-3xl border border-slate-200 bg-slate-50 p-3">
                    <div className="text-xs text-slate-500">Harga Acuan</div>
                    <div className="mt-1 text-sm font-semibold text-slate-900">{selectedOffer.basePrice}</div>
                  </div>
                  <div className="rounded-3xl border border-slate-200 bg-slate-50 p-3">
                    <div className="text-xs text-slate-500">Harga Tawaran</div>
                    <div className="mt-1 text-sm font-semibold text-slate-900">{selectedOffer.offerPrice}</div>
                  </div>
                </div>
              </div>

              <div className="grid gap-3 lg:grid-cols-2">
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-3">
                  <div className="flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">👤</div>
                    <div>
                      <div className="text-sm font-semibold text-slate-900">{selectedOffer.buyer}</div>
                      <div className="text-xs text-slate-500">{selectedOffer.location}</div>
                    </div>
                  </div>
                  <div className="mt-2 grid grid-cols-3 gap-2 text-center text-[11px] text-slate-500">
                    <button className="rounded-2xl border border-slate-200 bg-white py-2 hover:bg-slate-100">📞</button>
                    <button className="rounded-2xl border border-slate-200 bg-white py-2 hover:bg-slate-100">💬</button>
                    <button className="rounded-2xl border border-slate-200 bg-white py-2 hover:bg-slate-100">✉️</button>
                  </div>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-3">
                  <div className="text-sm font-semibold text-slate-900">Pesan Pembeli</div>
                  <p className="mt-2 text-sm leading-5 text-slate-600">{selectedOffer.message}</p>
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-3">
                <div className="text-sm font-semibold text-slate-900">Riwayat Penawaran</div>
                <div className="mt-3 space-y-2">
                  {selectedOffer.history.map((item, index) => (
                    <div key={index} className="flex items-center justify-between rounded-3xl bg-white px-3 py-2 shadow-sm">
                      <div>
                        <div className="text-sm font-semibold text-slate-900">{item.label}</div>
                        <div className="text-xs text-slate-500">{item.time}</div>
                      </div>
                      <div className="text-sm font-semibold text-slate-900">{item.value}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid gap-2 lg:grid-cols-[1fr_0.9fr]">
                <div className="grid gap-2 sm:grid-cols-3">
                  <button className="rounded-2xl bg-emerald-700 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-800">Terima</button>
                  <button className="rounded-2xl border border-red-600 px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50">Tolak</button>
                  <button className="rounded-2xl border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">Counter Offer</button>
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-semibold text-slate-900">Buat Counter Offer</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={counterPrice}
                      onChange={(e) => setCounterPrice(e.target.value)}
                      placeholder="Masukkan Harga"
                      className="w-full rounded-2xl border border-slate-200 bg-white px-2 py-2 text-sm text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                    />
                    <span className="inline-flex items-center rounded-2xl border border-slate-200 bg-slate-100 px-2 text-sm text-slate-500">/kg</span>
                  </div>
                  <button className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-950">Kirim</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  </div>
</div>
  );
}
