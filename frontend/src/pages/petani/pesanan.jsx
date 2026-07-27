import React, { useState } from "react";
import PetaniSidebar from "../../components/petani/PetaniSidebar";

const mockOrders = [
  {
    id: "BTC-982-IU7",
    buyer: "Koperasi Mitra",
    product: "Beras Premium",
    quantity: "55 Kg",
    total: "Rp 1.400.000",
    date: "01-01-25",
    status: "Diproses",
    statusVariant: "purple",
  },
  {
    id: "BTC-982-IU8",
    buyer: "Koperasi Hijau",
    product: "Beras Organik",
    quantity: "30 Kg",
    total: "Rp 840.000",
    date: "02-01-25",
    status: "Menunggu Pembayaran",
    statusVariant: "amber",
  },
  {
    id: "BTC-982-IU9",
    buyer: "Koperasi Mitra",
    product: "Beras Premium",
    quantity: "45 Kg",
    total: "Rp 1.260.000",
    date: "03-01-25",
    status: "Dikirim",
    statusVariant: "blue",
  },
  {
    id: "BTC-982-IU10",
    buyer: "Koperasi Sejahtera",
    product: "Beras Premium",
    quantity: "24 Kg",
    total: "Rp 672.000",
    date: "04-01-25",
    status: "Diproses",
    statusVariant: "purple",
  },
  {
    id: "BTC-982-IU11",
    buyer: "Koperasi Makmur",
    product: "Beras Premium",
    quantity: "10 Kg",
    total: "Rp 280.000",
    date: "05-01-25",
    status: "Selesai",
    statusVariant: "emerald",
  },
  {
    id: "BTC-982-IU12",
    buyer: "Koperasi Hijau",
    product: "Beras Organik",
    quantity: "18 Kg",
    total: "Rp 504.000",
    date: "06-01-25",
    status: "Dikirim",
    statusVariant: "blue",
  },
  {
    id: "BTC-982-IU13",
    buyer: "Koperasi Sejahtera",
    product: "Beras Premium",
    quantity: "28 Kg",
    total: "Rp 784.000",
    date: "07-01-25",
    status: "Menunggu Pembayaran",
    statusVariant: "amber",
  },
  {
    id: "BTC-982-IU14",
    buyer: "Koperasi Mitra",
    product: "Beras Organik",
    quantity: "35 Kg",
    total: "Rp 980.000",
    date: "08-01-25",
    status: "Selesai",
    statusVariant: "emerald",
  },
];

const tabItems = [
  { key: "semua", label: "Semua" },
  { key: "dalam-proses", label: "Dalam Proses" },
  { key: "dikirim", label: "Dikirim" },
  { key: "selesai", label: "Selesai" },
];

function statusClass(statusVariant) {
  switch (statusVariant) {
    case "purple":
      return "bg-violet-100 text-violet-700";
    case "amber":
      return "bg-amber-100 text-amber-700";
    case "blue":
      return "bg-sky-100 text-sky-700";
    case "emerald":
      return "bg-emerald-100 text-emerald-700";
    default:
      return "bg-slate-100 text-slate-700";
  }
}

export default function PesananPage() {
  const [activeTab, setActiveTab] = useState("semua");
  const [page, setPage] = useState(1);
  const itemsPerPage = 4;

  const filteredOrders = mockOrders.filter((order) => {
    if (activeTab === "semua") return true;
    if (activeTab === "dalam-proses") return order.status === "Diproses";
    if (activeTab === "dikirim") return order.status === "Dikirim";
    if (activeTab === "selesai") return order.status === "Selesai";
    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / itemsPerPage));
  const startIndex = (page - 1) * itemsPerPage;
  const currentOrders = filteredOrders.slice(startIndex, startIndex + itemsPerPage);

  const handleTabChange = (tabKey) => {
    setActiveTab(tabKey);
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-[#F3F8F6] font-sans text-slate-900">
      <div className="flex max-w-[1360px] mx-auto py-8 gap-6 px-4">
        <PetaniSidebar />

        <div className="flex-1">
          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold">Pesanan</h3>
                <div className="text-sm text-slate-500">Kelola pesanan pelanggan Anda</div>
              </div>
            </div>

        <div className="mb-5 rounded-2xl border border-slate-200 bg-slate-50 p-2 flex flex-wrap gap-2">
          {tabItems.map((tab) => (
            <button
              key={tab.key}
              onClick={() => handleTabChange(tab.key)}
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
                <th className="py-3">No Pesanan</th>
                <th className="py-3">Pembeli</th>
                <th className="py-3">Produk</th>
                <th className="py-3">Jumlah</th>
                <th className="py-3">Total</th>
                <th className="py-3">Tanggal</th>
                <th className="py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {currentOrders.map((order, index) => (
                <tr key={`${order.id}-${index}`} className="align-top">
                  <td className="py-4 font-semibold text-slate-900">{order.id}</td>
                  <td className="py-4 text-slate-600">{order.buyer}</td>
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <img src="/images/beras.png" alt={order.product} className="w-20 h-14 object-cover rounded" />
                      <span>{order.product}</span>
                    </div>
                  </td>
                  <td className="py-4">{order.quantity}</td>
                  <td className="py-4">{order.total}</td>
                  <td className="py-4">{order.date}</td>
                  <td className="py-4">
                    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusClass(order.statusVariant)}`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between text-sm text-slate-500">
          <div>
            Menampilkan {Math.min(startIndex + 1, filteredOrders.length)}-
            {Math.min(startIndex + currentOrders.length, filteredOrders.length)} dari {filteredOrders.length} pesanan
          </div>
          <div className="inline-flex items-center gap-2">
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className="rounded-lg border border-slate-200 px-3 py-1 text-slate-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              &lsaquo;
            </button>
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                onClick={() => setPage(index + 1)}
                className={`h-9 w-9 rounded-lg border px-3 py-1 font-semibold ${
                  page === index + 1 ? "bg-emerald-700 text-white border-emerald-700" : "border-slate-200 text-slate-700 hover:bg-slate-50"
                }`}
              >
                {index + 1}
              </button>
            ))}
            <button
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages}
              className="rounded-lg border border-slate-200 px-3 py-1 text-slate-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              &rsaquo;
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
  );
}
