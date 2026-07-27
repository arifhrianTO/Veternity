import React, { useState, useEffect } from "react";
import PetaniSidebar from "../../components/petani/PetaniSidebar";
import OrderDetailModal from "../../components/pembeli/OrderDetailModal";
import { ChevronRight, ChevronLeft } from "lucide-react";

const mockOrders = [
  {
    id: "BTC-982-IU7",
    products: [
      { name: "Beras Premium", image: "/images/beras1.png", quantity: 3, price: "Rp 14.000", unit: "/kg" },
    ],
    productCount: 3,
    total: "Rp 1.400.000",
    date: "01-01-25",
    status: "Dikirim",
    image: "/images/beras1.png",
    tracking: {
      created: "21 mei 11.00",
      processed: "21 mei 11.01",
      shipped: "22 mei 07.00",
      completed: null,
      currentStep: 3,
    },
  },
  {
    id: "BTC-982-IU8",
    products: [
      { name: "Beras Premium", image: "/images/beras1.png", quantity: 2, price: "Rp 14.000", unit: "/kg" },
    ],
    productCount: 3,
    total: "Rp 1.400.000",
    date: "01-01-25",
    status: "Menunggu Pembayaran",
    image: "/images/beras1.png",
    tracking: {
      created: "20 mei 09.00",
      processed: null,
      shipped: null,
      completed: null,
      currentStep: 1,
    },
  },
  {
    id: "BTC-982-IU9",
    products: [
      { name: "Ikan Tongkol Segar", image: "/images/ikan1.png", quantity: 5, price: "Rp 34.000", unit: "/kg" },
    ],
    productCount: 3,
    total: "Rp 1.400.000",
    date: "01-01-25",
    status: "Diproses",
    image: "/images/ikan1.png",
    tracking: {
      created: "19 mei 14.00",
      processed: "19 mei 14.30",
      shipped: null,
      completed: null,
      currentStep: 2,
    },
  },
  {
    id: "BTC-982-IU10",
    products: [
      { name: "Telur", image: "/images/telur.png", quantity: 10, price: "Rp 25.000", unit: "/kg" },
    ],
    productCount: 3,
    total: "Rp 1.400.000",
    date: "01-01-25",
    status: "Selesai",
    image: "/images/telur.png",
    tracking: {
      created: "15 mei 10.00",
      processed: "15 mei 10.15",
      shipped: "16 mei 08.00",
      completed: "17 mei 12.00",
      currentStep: 4,
    },
  },
  {
    id: "BTC-982-IU11",
    products: [
      { name: "Beras Premium", image: "/images/beras1.png", quantity: 3, price: "Rp 14.000", unit: "/kg" },
    ],
    productCount: 3,
    total: "Rp 1.400.000",
    date: "02-01-25",
    status: "Dikirim",
    image: "/images/beras1.png",
    tracking: {
      created: "21 mei 11.00",
      processed: "21 mei 11.01",
      shipped: "22 mei 07.00",
      completed: null,
      currentStep: 3,
    },
  },
  {
    id: "BTC-982-IU12",
    products: [
      { name: "Udang Segar", image: "/images/udang.png", quantity: 2, price: "Rp 50.000", unit: "/kg" },
    ],
    productCount: 3,
    total: "Rp 1.400.000",
    date: "03-01-25",
    status: "Diproses",
    image: "/images/udang.png",
    tracking: {
      created: "23 mei 08.00",
      processed: "23 mei 08.30",
      shipped: null,
      completed: null,
      currentStep: 2,
    },
  },
  {
    id: "BTC-982-IU13",
    products: [
      { name: "Beras Premium", image: "/images/beras1.png", quantity: 5, price: "Rp 14.000", unit: "/kg" },
    ],
    productCount: 3,
    total: "Rp 1.400.000",
    date: "04-01-25",
    status: "Menunggu Pembayaran",
    image: "/images/beras1.png",
    tracking: {
      created: "24 mei 15.00",
      processed: null,
      shipped: null,
      completed: null,
      currentStep: 1,
    },
  },
  {
    id: "BTC-982-IU14",
    products: [
      { name: "Ikan Tongkol Segar", image: "/images/ikan1.png", quantity: 4, price: "Rp 34.000", unit: "/kg" },
    ],
    productCount: 3,
    total: "Rp 1.400.000",
    date: "05-01-25",
    status: "Selesai",
    image: "/images/ikan1.png",
    tracking: {
      created: "10 mei 09.00",
      processed: "10 mei 09.15",
      shipped: "11 mei 07.00",
      completed: "12 mei 14.00",
      currentStep: 4,
    },
  },
];

const tabItems = [
  { key: "semua", label: "Semua" },
  { key: "dalam-proses", label: "Dalam Proses" },
  { key: "dikirim", label: "Dikirim" },
  { key: "selesai", label: "Selesai" },
];

function getStatusBadge(status) {
  switch (status) {
    case "Dikirim":
      return {
        bg: "bg-[rgba(105,147,255,0.19)]",
        border: "border-[#00378A]",
        text: "text-[#00378A]",
      };
    case "Menunggu Pembayaran":
      return {
        bg: "bg-[rgba(255,212,105,0.19)]",
        border: "border-[#956100]",
        text: "text-[#DC8800]",
      };
    case "Diproses":
      return {
        bg: "bg-[rgba(172,105,255,0.19)]",
        border: "border-[#520066]",
        text: "text-[#4B0066]",
      };
    case "Selesai":
      return {
        bg: "bg-[rgba(105,255,120,0.19)]",
        border: "border-[#008A1E]",
        text: "text-[#006638]",
      };
    default:
      return {
        bg: "bg-slate-100",
        border: "border-slate-300",
        text: "text-slate-600",
      };
  }
}

export default function PesananPembeliPage() {
  const [activeTab, setActiveTab] = useState("semua");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [allOrders, setAllOrders] = useState(mockOrders);
  const itemsPerPage = 4;

  // Merge localStorage orders with mock orders
  useEffect(() => {
    const saved = localStorage.getItem("orders");
    if (saved) {
      const lsOrders = JSON.parse(saved).map((o) => ({
        id: o.id,
        products: o.products || [],
        productCount: o.products ? o.products.length : 0,
        total: o.total,
        date: o.date,
        status: o.status || "Diproses",
        image: o.products?.[0]?.image || "/images/beras1.png",
        tracking: {
          created: new Date().toLocaleString("id-ID", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }),
          processed: null,
          shipped: null,
          completed: null,
          currentStep: 1,
        },
      }));
      setAllOrders([...lsOrders, ...mockOrders]);
    }
  }, []);

  const filteredOrders = allOrders.filter((order) => {
    if (activeTab === "semua") return true;
    if (activeTab === "dalam-proses")
      return order.status === "Diproses" || order.status === "Menunggu Pembayaran";
    if (activeTab === "dikirim") return order.status === "Dikirim";
    if (activeTab === "selesai") return order.status === "Selesai";
    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentOrders = filteredOrders.slice(startIndex, startIndex + itemsPerPage);

  const handleTabChange = (tabKey) => {
    setActiveTab(tabKey);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-white font-[Montserrat] text-slate-900">
      <div className="flex max-w-[1440px] mx-auto py-8 gap-6 px-4">
        <PetaniSidebar />

        {/* Main content - consistent wrapper */}
        <div className="flex-1 bg-[rgba(222,236,225,0.19)] border border-[rgba(0,154,38,0.19)] rounded-[20px] p-8 min-h-[971px] relative">

          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#029154] pb-6 mb-6">
            <h2 className="text-[24px] font-semibold text-[#005941]">Pesanan Saya</h2>
            <img src="/images/ikan1.png" alt="avatar" className="w-14 h-14 rounded-full border border-slate-100" />
          </div>

          {/* Tab bar - Rectangle 4189 */}
          <div className="bg-white shadow-[0_0_5px_rgba(0,0,0,0.25)] rounded-[10px] p-3 flex gap-2 mb-6 w-fit">
            {tabItems.map((tab) => {
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => handleTabChange(tab.key)}
                  className={`relative px-6 py-2 text-[20px] font-semibold transition ${
                    isActive ? "text-[#005941]" : "text-black/[0.43] hover:text-black/60"
                  }`}
                >
                  {tab.label}
                  {isActive && (
                    <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#006638] rounded-full" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Table container - Rectangle 4186 */}
          <div className="bg-white/50 border border-[#029154] shadow-[0_0_4px_rgba(0,0,0,0.25)] rounded-[20px] p-6">

            {/* Column headers */}
            <div className="flex items-center px-4 mb-4">
              <span className="w-[120px] text-[16px] font-bold text-[#273B4A]">No Pesanan</span>
              <span className="flex-[2] text-[16px] font-bold text-[#273B4A] pl-8">Produk</span>
              <span className="flex-1 text-[16px] font-bold text-[#273B4A] text-center">Total</span>
              <span className="flex-1 text-[16px] font-bold text-[#273B4A] text-center">Tanggal</span>
              <span className="w-[130px] text-[16px] font-bold text-[#273B4A] text-center">Status</span>
              <span className="w-[40px]" />
            </div>

            {/* Divider */}
            <div className="border-b-2 border-black/[0.13] mb-2" />

            {/* Order rows */}
            {currentOrders.length === 0 ? (
              <div className="text-center py-16 text-black/40 text-[16px] font-medium">
                Tidak ada pesanan ditemukan.
              </div>
            ) : (
              <div>
                {currentOrders.map((order, idx) => {
                  const badge = getStatusBadge(order.status);
                  const isLast = idx === currentOrders.length - 1;

                  return (
                    <div key={`${order.id}-${idx}`}>
                      <div className="flex items-center px-4 py-5">
                        {/* No Pesanan */}
                        <span className="w-[120px] text-[16px] font-semibold text-[#273B4A]">
                          {order.id}
                        </span>

                        {/* Produk - image + count */}
                        <div className="flex-[2] flex items-center gap-3 pl-8">
                          <img
                            src={order.image || "/images/beras1.png"}
                            alt="product"
                            className="w-[83px] h-[55px] object-cover rounded-[5px] flex-shrink-0"
                            onError={(e) => { e.target.src = "/images/beras.png"; }}
                          />
                          <span className="text-[16px] font-semibold text-[#273B4A]">
                            {order.productCount || order.products?.length || 1} produk
                          </span>
                        </div>

                        {/* Total */}
                        <span className="flex-1 text-[16px] font-semibold text-[#273B4A] text-center">
                          {order.total}
                        </span>

                        {/* Tanggal */}
                        <span className="flex-1 text-[16px] font-semibold text-[#273B4A] text-center">
                          {order.date}
                        </span>

                        {/* Status badge */}
                        <div className="w-[130px] flex justify-center">
                          <span
                            className={`inline-flex items-center justify-center px-3 py-1 rounded-[3px] border text-[15px] font-semibold text-center leading-[18px] ${badge.bg} ${badge.border} ${badge.text}`}
                          >
                            {order.status}
                          </span>
                        </div>

                        {/* Detail arrow */}
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="w-[40px] flex items-center justify-center hover:bg-slate-50 rounded-lg transition"
                        >
                          <ChevronRight className="w-6 h-6 text-[#029154]" strokeWidth={3} />
                        </button>
                      </div>

                      {/* Row divider */}
                      {!isLast && <div className="border-b-2 border-black/[0.13]" />}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Bottom: pagination info + page buttons */}
          <div className="flex items-center justify-between mt-4 px-2">
            <span className="text-[16px] font-semibold text-black/[0.51]">
              Menampilkan {Math.min(startIndex + 1, filteredOrders.length)}-
              {Math.min(startIndex + currentOrders.length, filteredOrders.length)} dari{" "}
              {filteredOrders.length} produk
            </span>

            <div className="flex items-center gap-2">
              {/* Prev arrow */}
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="w-8 h-8 flex items-center justify-center disabled:opacity-30"
              >
                <ChevronLeft className="w-5 h-5 text-black/[0.43]" />
              </button>

              {/* Page numbers */}
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-[40px] h-[40px] rounded-[5px] text-[24px] font-semibold flex items-center justify-center transition ${
                    currentPage === i + 1
                      ? "bg-[#006638] text-white"
                      : "bg-white border border-[#006638] text-[#006638] hover:bg-[#006638]/5"
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              {/* Next arrow */}
              <button
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="w-8 h-8 flex items-center justify-center disabled:opacity-30"
              >
                <ChevronRight className="w-5 h-5 text-black/[0.43]" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Order Detail Popup */}
      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </div>
  );
}
