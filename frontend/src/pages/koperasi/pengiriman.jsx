import { useState, useEffect } from "react";
import Sidebar from "../../components/layout/Sidebar";
import PageHeader from "../../components/layout/PageHeader";
import api from "../../config/axios";
import { Search, ChevronDown, ChevronLeft, ChevronRight, Pencil, X, Loader2 } from "lucide-react";
import { swalError } from "../../utils/swal";

const STATUS_OPTIONS = ["Menunggu Pembayaran", "Diproses", "Dikirim", "Selesai", "Dibatalkan"];

export default function PengirimanPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("Semua");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedItem, setSelectedItem] = useState(null);
  const [editForm, setEditForm] = useState({ resi: "", status: "", kurir: "", layanan: "" });

  const [pengirimanList, setPengirimanList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const itemsPerPage = 5;

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setFetchError(null);
      const res = await api.get("/koperasi/orders");
      setPengirimanList(res.data || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setFetchError("Gagal mengambil data pengiriman dari server.");
      setPengirimanList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    Promise.resolve().then(() => fetchOrders());
  }, []);

  const getStatusBadge = (status) => {
    const map = {
      Selesai: "bg-[rgba(0,174,43,0.19)] border border-[#006638] text-[#006638]",
      Dikirim: "bg-[rgba(105,170,255,0.19)] border border-[#0220E1] text-[#0220E1]",
      Diproses: "bg-[rgba(215,105,255,0.19)] border border-[#790097] text-[#BC02E1]",
      "Menunggu Pembayaran": "bg-[#FFD469]/20 border border-[#956100] text-[#DC8800]",
      Dibatalkan: "bg-[#FF696B]/20 border border-[#950002] text-[#DC0004]",
    };
    const cls = map[status] || "bg-gray-100 border border-gray-400 text-gray-600";
    return (
      <span className={`${cls} px-2 py-0.5 text-[12px] font-medium rounded-[3px] inline-flex items-center justify-center`}>
        {status}
      </span>
    );
  };

  // Filter Data
  const filteredData = pengirimanList.filter((item) => {
    const noResi = item.shipment?.nomor_resi || "-";
    const matchesSearch =
      item.kode_pesanan?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.pembeli?.nama_lengkap?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      noResi.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "Semua" || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.max(1, Math.ceil(filteredData.length / itemsPerPage));
  const currentData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleOpenEdit = (item) => {
    setSelectedItem(item);
    setEditForm({
      resi: item.shipment?.nomor_resi || "",
      status: item.status,
      kurir: item.shipment?.kurir || "",
      layanan: item.shipment?.layanan || "",
    });
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.put(`/orders/${selectedItem.id}`, {
        status: editForm.status,
        waybill: editForm.resi,
        kurir: editForm.kurir,
        layanan: editForm.layanan,
      });
      await fetchOrders();
      setSelectedItem(null);
    } catch (error) {
      console.error("Gagal update pengiriman:", error);
      swalError("Gagal memperbarui pengiriman", error.response?.data?.message || "Terjadi kesalahan saat menyimpan pengiriman.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white font-['Montserrat'] text-slate-900 relative">
      <div className="flex w-full min-h-screen p-4 pl-[304px]">
        {/* Sidebar Koperasi */}
        <Sidebar />

        {/* Main Content Area */}
        <div className="flex-1 bg-[rgba(222,236,225,0.19)] border border-[rgba(0,154,38,0.19)] rounded-[20px] p-6 flex flex-col h-[calc(100vh-32px)] overflow-hidden">
          <PageHeader title="Pengiriman" />

          {/* Filter & Search Bar */}
          <div className="flex items-center justify-between mb-4 shrink-0">
              {/* Input Search */}
              <div className="relative w-[300px] h-[42px]">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#005941]" />
                <input
                  type="text"
                  placeholder="Cari Pengiriman..."
                  value={searchTerm}
                  onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                  className="w-full h-full bg-white border border-[#006638] rounded-full pl-12 pr-4 text-[15px] text-[#006638] font-medium outline-none placeholder-[#006638]"
                />
              </div>

              {/* Status Dropdown Filter */}
              <div className="relative w-[130px] h-[42px]">
                <select
                  value={statusFilter}
                  onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                  className="w-full h-full bg-white border border-[#024D70] rounded-[5px] px-3 pr-8 text-[15px] text-[#00378A] font-medium outline-none appearance-none cursor-pointer"
                >
                  <option value="Semua">Status</option>
                  <option value="Diproses">Diproses</option>
                  <option value="Dikirim">Dikirim</option>
                  <option value="Selesai">Selesai</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#00378A] pointer-events-none" />
              </div>
            </div>

          {/* Main Table Area */}
          <div className="bg-white/50 border border-[#029154] rounded-[15px] p-4 shadow-[0_0_4px_rgba(0,0,0,0.25)] flex flex-col flex-1 min-h-0">
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-2 pb-2 text-[#273B4A] font-bold text-[13px] text-center items-center border-b-2 border-black/10 shrink-0">
                <div className="col-span-3">Invoice</div>
                <div className="col-span-2">Pembeli</div>
                <div className="col-span-2">Logistik</div>
                <div className="col-span-2">No Resi</div>
                <div className="col-span-2">Status</div>
                <div className="col-span-1">Aksi</div>
              </div>

            {/* Table Rows */}
            <div className="divide-none flex-1 min-h-[250px] block">
              {loading ? (
                <div className="flex items-center justify-center gap-2 text-[#006638] py-10">
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <span className="font-semibold">Memuat pengiriman...</span>
                </div>
              ) : fetchError ? (
                <div className="text-center py-10 text-red-500 font-semibold bg-red-50">{fetchError}</div>
              ) : currentData.length === 0 ? (
                <div className="text-center py-10 text-slate-500 font-medium">Belum ada data pengiriman.</div>
              ) : (
                currentData.map((item) => (
                  <div
                    key={item.id}
                    className="grid grid-cols-12 gap-2 py-2 text-center items-center text-[#273B4A] font-semibold text-[13px] border-b border-black/10 last:border-0 hover:bg-slate-50 transition"
                  >
                    <div className="col-span-3">{item.kode_pesanan}</div>
                    <div className="col-span-2">{item.pembeli?.nama_lengkap || "-"}</div>
                    <div className="col-span-2">{item.shipment?.kurir || "-"}</div>
                    <div className="col-span-2 text-[14px] font-medium text-black/60">{item.shipment?.nomor_resi || "-"}</div>
                    <div className="col-span-2 flex justify-center">
                      {getStatusBadge(item.status)}
                    </div>
                    <div className="col-span-1 flex justify-center">
                      <button
                        onClick={() => handleOpenEdit(item)}
                        className="w-7 h-7 bg-white border border-[#0220E1] rounded-[5px] shadow-[0_0_3px_rgba(0,0,0,0.25)] flex items-center justify-center hover:bg-blue-50 transition text-[#0004ED]"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Table Footer / Pagination */}
            {filteredData.length > itemsPerPage && (
              <div className="flex items-center justify-between pt-3 border-t border-black/10 mt-2 shrink-0">
                <span className="text-[14px] sm:text-[15px] font-semibold text-black/50">
                  Menampilkan {(currentPage - 1) * itemsPerPage + 1}-
                  {Math.min(currentPage * itemsPerPage, filteredData.length)} dari {filteredData.length} pengiriman
                </span>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    disabled={currentPage === 1}
                    className="p-1 transition text-black/40 hover:text-black disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`w-8 h-8 rounded-[5px] text-[15px] font-semibold flex items-center justify-center transition ${
                        currentPage === i + 1
                          ? "bg-[#006638] text-white"
                          : "bg-white border border-[#006638] text-[#006638] hover:bg-slate-50"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}

                  <button
                    onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="p-1 transition text-black/40 hover:text-black disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MODAL UPDATE PENGIRIMAN */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-[500px] rounded-[20px] p-6 shadow-2xl relative">
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-4 right-5 hover:bg-slate-100 transition p-1 rounded-full text-slate-600"
            >
              <X className="w-6 h-6" />
            </button>

            <h3 className="text-[20px] font-bold text-[#005941] mb-4">
              Update Status Pengiriman
            </h3>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="block text-[14px] font-semibold text-[#273B4A] mb-1">
                  Invoice
                </label>
                <input
                  type="text"
                  disabled
                  value={selectedItem.kode_pesanan}
                  className="w-full bg-gray-100 border rounded-[8px] p-2.5 text-[14px] text-gray-600 font-medium cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-[14px] font-semibold text-[#273B4A] mb-1">
                  Kurir
                </label>
                <input
                  type="text"
                  value={editForm.kurir}
                  onChange={(e) => setEditForm({ ...editForm, kurir: e.target.value })}
                  placeholder="Contoh: JNT Cargo"
                  className="w-full border border-gray-300 rounded-[8px] p-2.5 text-[14px] text-[#273B4A] font-semibold outline-none focus:border-[#006638]"
                />
              </div>

              <div>
                <label className="block text-[14px] font-semibold text-[#273B4A] mb-1">
                  Nomor Resi
                </label>
                <input
                  type="text"
                  value={editForm.resi}
                  onChange={(e) => setEditForm({ ...editForm, resi: e.target.value })}
                  className="w-full border border-gray-300 rounded-[8px] p-2.5 text-[14px] text-[#273B4A] font-semibold outline-none focus:border-[#006638]"
                />
              </div>

              <div>
                <label className="block text-[14px] font-semibold text-[#273B4A] mb-1">
                  Status Pengiriman
                </label>
                <select
                  value={editForm.status}
                  onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                  className="w-full border border-gray-300 rounded-[8px] p-2.5 text-[14px] text-[#273B4A] font-semibold outline-none focus:border-[#006638] bg-white"
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setSelectedItem(null)}
                  disabled={isSubmitting}
                  className="px-4 py-2 border rounded-[8px] text-[14px] font-semibold text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-[#006638] text-white rounded-[8px] text-[14px] font-semibold hover:bg-emerald-800 transition disabled:opacity-50 flex items-center gap-2"
                >
                  {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
