import { useState, useEffect } from "react";
import Sidebar from "../../components/layout/Sidebar";
import { ChevronRight, ChevronLeft, Loader2 } from "lucide-react";
import api from "../../config/axios";

const tabItems = [
  { key: "semua", label: "Semua" },
  { key: "dalam-proses", label: "Dalam Proses" },
  { key: "dikirim", label: "Dikirim" },
  { key: "selesai", label: "Selesai" },
];

function getStatusBadge(status) {
  switch (status) {
    case "Diproses":
      return (
        <span className="inline-flex items-center justify-center px-3 py-1 rounded-[12px] bg-purple-100 border border-purple-300 text-[14px] font-semibold text-purple-700">
          Diproses
        </span>
      );
    case "Menunggu Pembayaran":
      return (
        <span className="inline-flex items-center justify-center px-3 py-1 rounded-[12px] bg-amber-100 border border-amber-300 text-[14px] font-semibold text-amber-700">
          Menunggu Pembayaran
        </span>
      );
    case "Dikirim":
      return (
        <span className="inline-flex items-center justify-center px-3 py-1 rounded-[12px] bg-sky-100 border border-sky-300 text-[14px] font-semibold text-sky-700">
          Dikirim
        </span>
      );
    case "Selesai":
      return (
        <span className="inline-flex items-center justify-center px-3 py-1 rounded-[12px] bg-[rgba(105,255,120,0.19)] border border-[#008A1E] text-[14px] font-semibold text-[#006638]">
          Selesai
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

export default function PesananPage() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        // Fallback token
        const testToken = localStorage.getItem("token") || "11|bRDttRF4eF1WuflHocapjNqoF26hfU4a2AusID1E7a2abeb3";
        localStorage.setItem("token", testToken);

        const response = await api.get('/orders');
        // Transform data from backend to match UI structure
        const formattedOrders = response.data.map(order => ({
          id: order.id,
          kode: order.kode_pesanan,
          buyer: order.pembeli ? order.pembeli.nama_lengkap : 'Unknown',
          product: order.items && order.items.length > 0 ? order.items[0].nama_produk : 'Berbagai Produk',
          quantity: order.items && order.items.length > 0 ? `${order.items[0].jumlah_beli} Kg` : '-',
          total: `Rp ${Number(order.total_harga).toLocaleString('id-ID')}`,
          date: new Date(order.tanggal_pesanan).toLocaleDateString('id-ID', {day: '2-digit', month: '2-digit', year: '2-digit'}),
          status: order.status,
          waybill: order.catatan ? order.catatan.replace('Resi: ', '') : null,
        }));
        setOrders(formattedOrders);
      } catch (err) {
        console.error("Gagal mengambil data pesanan:", err);
        setError("Gagal memuat pesanan.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const [activeTab, setActiveTab] = useState("semua");
  const [page, setPage] = useState(1);
  const itemsPerPage = 4;

  const filteredOrders = Array.isArray(orders) ? orders.filter((order) => {
    if (activeTab === "semua") return true;
    if (activeTab === "dalam-proses") return order.status === "Diproses";
    if (activeTab === "dikirim") return order.status === "Dikirim";
    if (activeTab === "selesai") return order.status === "Selesai";
    return true;
  }) : [];

  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / itemsPerPage));
  const startIndex = (page - 1) * itemsPerPage;
  const currentOrders = filteredOrders.slice(startIndex, startIndex + itemsPerPage);

  const handleTabChange = (tabKey) => {
    setActiveTab(tabKey);
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-white font-[Montserrat] text-slate-900">
      <div className="flex w-full min-h-screen p-4 pl-[304px]">
        <Sidebar />

        {/* Outer Container Wrapper */}
        <div className="flex-1 bg-[rgba(222,236,225,0.19)] border border-[rgba(0,154,38,0.19)] rounded-[20px] p-8 relative">
          
          {/* Top Header */}
          <div className="flex items-end justify-between border-b border-[#029154] pb-2 mb-4">
            <div>
              <h2 className="text-[24px] font-semibold text-[#005941]">Pesanan</h2>
              <p className="text-[14px] text-slate-500">Kelola pesanan pelanggan Anda</p>
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
                    <th className="pb-4 px-2">No Pesanan</th>
                    <th className="pb-4 px-2">Pembeli</th>
                    <th className="pb-4 px-2">Produk</th>
                    <th className="pb-4 px-2">Total</th>
                    <th className="pb-4 px-2">Status</th>
                    <th className="pb-4 px-2">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan="6" className="text-center py-10">
                        <div className="flex items-center justify-center gap-2 text-[#006638]">
                           <Loader2 className="w-6 h-6 animate-spin" />
                           <span className="font-semibold">Memuat pesanan...</span>
                        </div>
                      </td>
                    </tr>
                  ) : error ? (
                    <tr>
                      <td colSpan="6" className="text-center py-10 text-red-500 font-semibold bg-red-50">
                        {error}
                      </td>
                    </tr>
                  ) : currentOrders.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center py-10 text-slate-500 font-medium">
                        Belum ada pesanan masuk.
                      </td>
                    </tr>
                  ) : (
                    currentOrders.map((order, index) => (
                      <tr key={`${order.id}-${index}`} className="border-b border-black/[0.13] last:border-b-0 hover:bg-slate-50/50 transition">
                        <td className="py-4 px-2 text-[14px] font-semibold text-[#273B4A]">{order.kode}</td>
                        <td className="py-4 px-2 text-[14px] font-semibold text-[#273B4A]">{order.buyer}</td>
                        <td className="py-4 px-2 text-[14px] font-semibold text-[#273B4A]">
                          {order.product} <br/> <span className="text-slate-500 font-normal">{order.quantity}</span>
                        </td>
                        <td className="py-4 px-2 text-[14px] font-semibold text-[#273B4A]">{order.total}</td>
                        <td className="py-4 px-2">
                          {getStatusBadge(order.status)}
                        </td>
                        <td className="py-4 px-2">
                          {order.status === "Diproses" ? (
                            <button 
                              onClick={() => {
                                const resi = prompt(`Masukkan nomor resi untuk pesanan ${order.kode}:`);
                                if (resi) {
                                  // Panggil API untuk update status dan resi
                                  const updateOrder = async () => {
                                     try {
                                        await api.put(`/orders/${order.id}`, {
                                           status: 'Dikirim',
                                           waybill: resi
                                        });
                                        
                                        // Update state order secara lokal agar UI reaktif
                                        const updatedOrders = orders.map(o => {
                                          if (o.id === order.id) {
                                            return { ...o, status: "Dikirim", waybill: resi, courier: "jne" };
                                          }
                                          return o;
                                        });
                                        setOrders(updatedOrders);
                                        alert(`Pesanan ${order.kode} berhasil dikirim dengan resi: ${resi}`);
                                     } catch (error) {
                                        console.error("Gagal update resi", error);
                                        alert("Gagal menyimpan resi.");
                                     }
                                  };
                                  updateOrder();
                                }
                              }}
                              className="px-3 py-1 bg-[#006638] text-white text-[12px] font-bold rounded-[6px] hover:bg-[#00522c]"
                            >
                              Kirim (Input Resi)
                            </button>
                          ) : order.status === "Dikirim" ? (
                             <span className="text-[12px] font-semibold text-slate-500">Resi: {order.waybill || "Terkirim"}</span>
                          ) : (
                             <span className="text-[12px] font-semibold text-slate-500">-</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Bottom Pagination Info & Controls */}
          <div className="flex items-center justify-between mt-6 px-2">
            <span className="text-[16px] font-semibold text-black/[0.51]">
              Menampilkan {Math.min(startIndex + 1, filteredOrders.length)}-
              {Math.min(startIndex + currentOrders.length, filteredOrders.length)} dari {filteredOrders.length} pesanan
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
    </div>
  );
}
