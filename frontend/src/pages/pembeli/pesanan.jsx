import { useState, useEffect } from "react";
import Sidebar from "../../components/layout/Sidebar";
import OrderDetailModal from "../../components/pembeli/OrderDetailModal";
import { ChevronRight, ChevronLeft, Loader2 } from "lucide-react";
import api from "../../config/axios";
import { swalSuccess, swalError, swalInfo } from "../../utils/swal";

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
  const [allOrders, setAllOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const itemsPerPage = 4;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        const res = await api.get("/orders");

        const formattedOrders = res.data.map((o) => ({
          id: o.id, // Primary key id di database
          kode_pesanan: o.kode_pesanan,
          products: o.items.map((i) => ({
            name: i.nama_produk,
            quantity: i.jumlah_beli,
            price: `Rp ${Number(i.harga_satuan).toLocaleString("id-ID")}`,
          })),
          productCount: o.items.reduce(
            (acc, curr) => acc + curr.jumlah_beli,
            0,
          ),
          total: `Rp ${Number(o.total_harga).toLocaleString("id-ID")}`,
          date: new Date(o.tanggal_pesanan).toLocaleDateString("id-ID"),
          status: o.status || "Diproses",
          image: o.items[0]?.product?.gambar
            ? `http://localhost:8000/storage/${o.items[0].product.gambar}`
            : "/images/beras.png",
          tracking: {
            created: new Date(o.created_at).toLocaleString("id-ID", {
              day: "numeric",
              month: "short",
              hour: "2-digit",
              minute: "2-digit",
            }),
            processed:
              o.status !== "Menunggu Pembayaran"
                ? new Date(o.updated_at).toLocaleString("id-ID", {
                    day: "numeric",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : null,
            shipped: null,
            completed: o.status === "Selesai" ? "Selesai" : null,
            currentStep:
              o.status === "Selesai"
                ? 4
                : o.status === "Dikirim"
                  ? 3
                  : o.status === "Diproses"
                    ? 2
                    : 1,
            resi: o.catatan ? o.catatan.replace("Resi: ", "") : null, // Asumsi resi ditaruh di catatan (sementara)
            courier: "jne", // Default
          },
          snap_token: o.payment_token // Ambil token dari backend
        }));
        setAllOrders(formattedOrders);
      } catch (error) {
        console.error("Gagal mengambil data pesanan", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const filteredOrders = allOrders.filter((order) => {
    if (activeTab === "semua") return true;
    if (activeTab === "dalam-proses")
      return (
        order.status === "Diproses" || order.status === "Menunggu Pembayaran"
      );
    if (activeTab === "dikirim") return order.status === "Dikirim";
    if (activeTab === "selesai") return order.status === "Selesai";
    return true;
  });

  const totalPages = Math.max(
    1,
    Math.ceil(filteredOrders.length / itemsPerPage),
  );
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentOrders = filteredOrders.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  const handleTabChange = (tabKey) => {
    setActiveTab(tabKey);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-white font-[Montserrat] text-slate-900">
      <div className="flex w-full min-h-screen p-4 pl-[304px]">
        <Sidebar />

        {/* Main content - consistent wrapper */}
        <div className="flex-1 bg-[rgba(222,236,225,0.19)] border border-[rgba(0,154,38,0.19)] rounded-[20px] p-8 relative">
          {/* Header */}
          <div className="flex items-end justify-between border-b border-[#029154] pb-2 mb-4">
            <h2 className="text-[24px] font-semibold text-[#005941]">
              Pesanan Saya
            </h2>
            <img
              src="/images/ikan1.png"
              alt="avatar"
              className="w-10 h-10 rounded-full border border-slate-100"
            />
          </div>

          {/* Tab bar - Rectangle 4189 */}
          <div className="bg-white shadow-[0_0_5px_rgba(0,0,0,0.25)] rounded-[10px] p-2 flex gap-1 mb-6 w-fit">
            {tabItems.map((tab) => {
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => handleTabChange(tab.key)}
                  className={`relative px-5 py-2 text-[15px] font-bold transition ${
                    isActive
                      ? "text-[#005941]"
                      : "text-black/[0.43] hover:text-black/60"
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
              <span className="w-[120px] text-[13px] font-bold text-slate-500 uppercase tracking-wider">
                No Pesanan
              </span>
              <span className="flex-[2] text-[13px] font-bold text-slate-500 uppercase tracking-wider pl-8">
                Produk
              </span>
              <span className="flex-1 text-[13px] font-bold text-slate-500 uppercase tracking-wider text-center">
                Total
              </span>
              <span className="flex-1 text-[13px] font-bold text-slate-500 uppercase tracking-wider text-center">
                Tanggal
              </span>
              <span className="w-[130px] text-[13px] font-bold text-slate-500 uppercase tracking-wider text-center">
                Status
              </span>
              <span className="w-[80px]" />
            </div>

            {/* Divider */}
            <div className="border-b-2 border-black/[0.13] mb-2" />

            {/* Order rows */}
            {isLoading ? (
              <div className="text-center py-16 text-black/40 text-[16px] font-medium flex flex-col items-center justify-center gap-3">
                <Loader2 className="w-8 h-8 animate-spin text-[#006638]" />
                Memuat pesanan Anda...
              </div>
            ) : currentOrders.length === 0 ? (
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
                        <span className="w-[120px] text-[15px] font-bold text-[#273B4A]">
                          {order.kode_pesanan}
                        </span>

                        {/* Produk */}
                        <div className="flex-[2] flex items-center gap-3 pl-8">
                          <img
                            src={order.image || "/images/beras1.png"}
                            alt="product"
                            className="w-[60px] h-[40px] object-cover rounded-md flex-shrink-0 border border-slate-200"
                            onError={(e) => {
                              e.target.src = "/images/beras.png";
                            }}
                          />

                          <span className="text-[15px] font-medium text-[#273B4A]">
                            {order.productCount || order.products?.length || 1}{" "}
                            produk
                          </span>
                        </div>

                        {/* Total */}
                        <span className="flex-1 text-[15px] font-bold text-[#273B4A] text-center">
                          {order.total}
                        </span>

                        {/* Tanggal */}
                        <span className="flex-1 text-[15px] font-medium text-[#273B4A] text-center">
                          {order.date}
                        </span>

                        {/* Status */}
                        <div className="w-[130px] flex justify-center">
                          <span
                            className={`inline-flex items-center justify-center px-3 py-1 rounded-[3px] border text-[13px] font-semibold text-center leading-[18px] ${badge.bg} ${badge.border} ${badge.text}`}
                          >
                            {order.status}
                          </span>
                        </div>

                        {/* Detail / Bayar */}
                        <div className="w-[80px] flex items-center justify-center gap-2">
                           {order.status === "Menunggu Pembayaran" && order.snap_token && (
                              <button 
                                onClick={() => {
                                  window.snap.pay(order.snap_token, {
                                    onSuccess: async function() {
                                      try {
                                        await api.put(`/orders/${order.id}`, { status: "Diproses" });
                                      } catch (e) {
                                        console.error("Gagal mengupdate status pesanan", e);
                                      }
                                      await swalSuccess("Pembayaran berhasil!", "Status pesanan Anda telah diperbarui.");
                                      window.location.reload();
                                    },
                                    onPending: async function() {
                                      await swalInfo("Menunggu pembayaran...", "Pesanan Anda sedang menunggu pembayaran.");
                                    },
                                    onError: async function() {
                                      await swalError("Pembayaran gagal!", "Silakan coba lagi atau gunakan metode lain.");
                                    },
                                    onClose: async function() {
                                      await swalInfo("Pembayaran ditutup", "Anda dapat melanjutkan pembayaran nanti.");
                                    }
                                  });
                                }}
                                className="px-3 py-1 bg-amber-500 hover:bg-amber-600 text-white text-[12px] font-bold rounded-[6px] transition"
                              >
                                Bayar
                              </button>
                           )}
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="w-[35px] h-[35px] flex items-center justify-center hover:bg-emerald-50 rounded-lg transition"
                          >
                            <ChevronRight
                              className="w-5 h-5 text-[#029154]"
                              strokeWidth={2.5}
                            />
                          </button>
                        </div>
                      </div>

                      {!isLast && (
                        <div className="border-b-2 border-black/[0.13]" />
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Bottom: pagination info + page buttons */}
          <div className="flex items-center justify-between mt-6 px-2">
            <span className="text-[14px] font-semibold text-black/[0.51]">
              Menampilkan {Math.min(startIndex + 1, filteredOrders.length)}-
              {Math.min(
                startIndex + currentOrders.length,
                filteredOrders.length,
              )}{" "}
              dari {filteredOrders.length} produk
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
                  className={`w-[32px] h-[32px] rounded-[5px] text-[14px] font-bold flex items-center justify-center transition ${
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
                onClick={() =>
                  setCurrentPage((p) => Math.min(p + 1, totalPages))
                }
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
