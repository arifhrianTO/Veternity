import { useState, useEffect } from "react";
import Sidebar from "../../components/layout/Sidebar";
import PageHeader from "../../components/layout/PageHeader";
import {
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Loader2
} from "lucide-react";
import api from "../../config/axios";

const storageUrl = (path) => {
  if (!path) return "/images/beras.png";
  if (path.startsWith("http")) return path;
  return `http://localhost:8000/storage/${path}`;
};

const Pagination = ({ page, lastPage, total, setPage }) => {
  if (total === 0) return null;
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 text-sm text-black/50 font-semibold">
      <div>Total {total} data</div>
      <div className="flex items-center gap-2">
        <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="p-2 text-black/40 hover:text-black transition disabled:opacity-30">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button className="w-9 h-9 rounded-md bg-[#006638] text-white font-semibold flex items-center justify-center">
          {page}
        </button>
        <button onClick={() => setPage(p => Math.min(lastPage, p + 1))} disabled={page === lastPage} className="p-2 text-black/40 hover:text-black transition disabled:opacity-30">
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default function MonitoringPage() {
  const [activeTab, setActiveTab] = useState("produk"); // 'produk' | 'penjualan'
  
  // State Filter Produk
  const [searchProduk, setSearchProduk] = useState("");
  const [filterKategori, setFilterKategori] = useState("");
  const [filterStatusProduk, setFilterStatusProduk] = useState("");
  const [produkList, setProdukList] = useState([]);
  const [kategoriOptions, setKategoriOptions] = useState([]);
  const [loadingProduk, setLoadingProduk] = useState(true);
  const [produkPage, setProdukPage] = useState(1);
  const [produkLastPage, setProdukLastPage] = useState(1);
  const [produkTotal, setProdukTotal] = useState(0);

  // State Filter Penjualan
  const [subTabPenjualan, setSubTabPenjualan] = useState("semua"); // 'semua' | 'dalam_proses' | 'dikirim' | 'selesai'
  const [penjualanList, setPenjualanList] = useState([]);
  const [loadingPenjualan, setLoadingPenjualan] = useState(true);
  const [penjualanPage, setPenjualanPage] = useState(1);
  const [penjualanLastPage, setPenjualanLastPage] = useState(1);
  const [penjualanTotal, setPenjualanTotal] = useState(0);

  // Fetch Kategori untuk dropdown
  useEffect(() => {
    api.get("/categories").then(res => {
      setKategoriOptions(res.data.data || []);
    }).catch(err => console.error(err));
  }, []);

  // Fetch Produk
  const fetchProduk = () => {
    setLoadingProduk(true);
    const params = {
      page: produkPage,
      search: searchProduk,
      category_id: filterKategori,
      status: filterStatusProduk
    };
    api.get("/admin/products", { params })
      .then(res => {
        setProdukList(res.data.data);
        setProdukLastPage(res.data.last_page);
        setProdukTotal(res.data.total);
      })
      .catch(err => console.error(err))
      .finally(() => setLoadingProduk(false));
  };

  useEffect(() => {
    if (activeTab === "produk") {
      const t = setTimeout(fetchProduk, 300);
      return () => clearTimeout(t);
    }
  }, [activeTab, produkPage, searchProduk, filterKategori, filterStatusProduk]);

  // Fetch Penjualan
  const fetchPenjualan = () => {
    setLoadingPenjualan(true);
    let statusParam = "";
    if (subTabPenjualan === "dalam_proses") statusParam = "Diproses";
    else if (subTabPenjualan === "dikirim") statusParam = "Dikirim";
    else if (subTabPenjualan === "selesai") statusParam = "Selesai";

    const params = {
      page: penjualanPage,
      status: statusParam
    };
    api.get("/admin/orders", { params })
      .then(res => {
        setPenjualanList(res.data.data);
        setPenjualanLastPage(res.data.last_page);
        setPenjualanTotal(res.data.total);
      })
      .catch(err => console.error(err))
      .finally(() => setLoadingPenjualan(false));
  };

  useEffect(() => {
    if (activeTab === "penjualan") {
      fetchPenjualan();
    }
  }, [activeTab, penjualanPage, subTabPenjualan]);

  // Helper badge warna status penjualan
  const renderStatusPenjualan = (status) => {
    switch (status) {
      case "Diproses":
        return (
          <span className="inline-block bg-[rgba(172,105,255,0.19)] text-[#4B0066] border border-[#520066] text-xs font-semibold px-3 py-1 rounded-[3px]">
            Diproses
          </span>
        );
      case "Menunggu Pembayaran":
        return (
          <span className="inline-block bg-[rgba(255,212,105,0.19)] text-[#AC6A00] border border-[#956100] text-xs font-semibold px-3 py-1 rounded-[3px]">
            Menunggu Pembayaran
          </span>
        );
      case "Dikirim":
        return (
          <span className="inline-block bg-[rgba(1,132,254,0.19)] text-[#00378A] border border-[#00378A] text-xs font-semibold px-3 py-1 rounded-[3px]">
            Dikirim
          </span>
        );
      case "Selesai":
        return (
          <span className="inline-block bg-[rgba(0,174,43,0.19)] text-[#006638] border border-[#006638] text-xs font-semibold px-3 py-1 rounded-[3px]">
            Selesai
          </span>
        );
      default:
        return (
          <span className="inline-block bg-slate-100 text-slate-700 border border-slate-300 text-xs font-semibold px-3 py-1 rounded-[3px]">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-white font-[Montserrat] text-slate-900">
      <div className="flex w-full min-h-screen p-4 pl-[304px]">
        
        <Sidebar />

        <div className="flex-1 bg-[rgba(222,236,225,0.19)] border border-[rgba(0,154,38,0.19)] rounded-[20px] p-8 relative">
          
          <PageHeader title="Monitoring" />

          {/* Main Tab Switcher (Produk / Penjualan) */}
          <div className="inline-flex bg-white rounded-xl p-1.5 shadow-sm border border-slate-100 mb-6">
            <button
              onClick={() => { setActiveTab("produk"); setProdukPage(1); }}
              className={`px-8 py-2.5 rounded-lg text-lg font-semibold transition relative ${
                activeTab === "produk"
                  ? "text-[#006638]"
                  : "text-black/40 hover:text-black/70"
              }`}
            >
              Produk
              {activeTab === "produk" && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#006638] rounded-full mx-6" />
              )}
            </button>
            <button
              onClick={() => { setActiveTab("penjualan"); setPenjualanPage(1); }}
              className={`px-8 py-2.5 rounded-lg text-lg font-semibold transition relative ${
                activeTab === "penjualan"
                  ? "text-[#006638]"
                  : "text-black/40 hover:text-black/70"
              }`}
            >
              Penjualan
              {activeTab === "penjualan" && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#006638] rounded-full mx-6" />
              )}
            </button>
          </div>

          {/* TAB CONTENT: PRODUK */}
          {activeTab === "produk" && (
            <>
              {/* Filter Bar Produk */}
              <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
                <div className="relative w-full md:w-80">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#006638]" />
                  <input
                    type="text"
                    placeholder="Cari Produk..."
                    value={searchProduk}
                    onChange={(e) => { setSearchProduk(e.target.value); setProdukPage(1); }}
                    className="w-full pl-12 pr-4 py-2.5 rounded-full border border-[#006638] text-sm text-[#006638] placeholder-[#006638] focus:outline-none bg-white"
                  />
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                  <div className="relative">
                    <select
                      value={filterKategori}
                      onChange={(e) => { setFilterKategori(e.target.value); setProdukPage(1); }}
                      className="appearance-none bg-white border border-[#024D70] text-[#00378A] text-sm font-medium px-4 py-2.5 pr-10 rounded-md focus:outline-none cursor-pointer"
                    >
                      <option value="">Semua Kategori</option>
                      {kategoriOptions.map(k => (
                        <option key={k.id} value={k.id}>{k.nama_kategori}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#00378A] pointer-events-none" />
                  </div>

                  <div className="relative">
                    <select
                      value={filterStatusProduk}
                      onChange={(e) => { setFilterStatusProduk(e.target.value); setProdukPage(1); }}
                      className="appearance-none bg-white border border-[#024D70] text-[#00378A] text-sm font-medium px-4 py-2.5 pr-10 rounded-md focus:outline-none cursor-pointer"
                    >
                      <option value="">Semua Status</option>
                      <option value="Aktif">Aktif</option>
                      <option value="Non-Aktif">Non-Aktif</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#00378A] pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Table Container Card Produk */}
              <div className="bg-white/60 border border-[#029154] rounded-2xl p-6 shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="text-[#273B4A] font-bold text-base">
                        <th className="py-3 px-4">Produk</th>
                        <th className="py-3 px-4 text-center">Kategori</th>
                        <th className="py-3 px-4 text-center">Pemilik</th>
                        <th className="py-3 px-4 text-center">Stok</th>
                        <th className="py-3 px-4 text-center">Harga Harapan</th>
                        <th className="py-3 px-4 text-center">Tanggal Panen</th>
                        <th className="py-3 px-4 text-center">Masa Layak</th>
                        <th className="py-3 px-4 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-black/10">
                      {loadingProduk ? (
                        <tr><td colSpan={8} className="py-8 text-center"><Loader2 className="w-6 h-6 animate-spin mx-auto text-[#006638]" /></td></tr>
                      ) : produkList.length === 0 ? (
                        <tr><td colSpan={8} className="py-8 text-center text-slate-500">Tidak ada produk ditemukan</td></tr>
                      ) : produkList.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50/50 transition">
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={storageUrl(item.gambar)}
                                alt={item.nama_produk}
                                className="w-16 h-12 object-cover rounded-md border"
                              />
                              <span className="font-semibold text-[#273B4A] text-sm max-w-[150px] truncate" title={item.nama_produk}>
                                {item.nama_produk}
                              </span>
                            </div>
                          </td>
                          <td className="py-4 px-4 font-semibold text-[#273B4A] text-center text-sm">
                            {item.category?.nama_kategori || "-"}
                          </td>
                          <td className="py-4 px-4 font-semibold text-[#273B4A] text-center text-sm">
                            {item.user?.nama_lengkap || "-"}
                          </td>
                          <td className="py-4 px-4 font-semibold text-[#273B4A] text-center text-sm">
                            {item.stok} {item.satuan}
                          </td>
                          <td className="py-4 px-4 font-medium text-black text-center text-sm whitespace-nowrap">
                            Rp {Number(item.harga_harapan).toLocaleString("id-ID")}
                          </td>
                          <td className="py-4 px-4 font-semibold text-[#273B4A] text-center text-sm whitespace-nowrap">
                            {new Date(item.tanggal_panen).toLocaleDateString('id-ID', {day:'numeric', month:'short', year:'numeric'})}
                          </td>
                          <td className="py-4 px-4 font-semibold text-[#273B4A] text-center text-sm">
                            {item.masa_layak} Hari
                          </td>
                          <td className="py-4 px-4 text-center">
                            <span className={`inline-block border text-xs font-semibold px-3 py-1 rounded-[3px] ${item.status === 'Aktif' ? 'bg-[rgba(0,174,43,0.19)] text-[#006638] border-[#006638]' : 'bg-red-50 text-red-600 border-red-300'}`}>
                              {item.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <Pagination page={produkPage} lastPage={produkLastPage} total={produkTotal} setPage={setProdukPage} />
              </div>
            </>
          )}

          {/* TAB CONTENT: PENJUALAN */}
          {activeTab === "penjualan" && (
            <>
              {/* Sub-Tab Filter Penjualan */}
              <div className="inline-flex bg-white rounded-xl p-1 shadow-sm border border-slate-100 mb-6">
                {[
                  { id: "semua", label: "Semua" },
                  { id: "dalam_proses", label: "Dalam Proses" },
                  { id: "dikirim", label: "Dikirim" },
                  { id: "selesai", label: "Selesai" },
                ].map((subTab) => (
                  <button
                    key={subTab.id}
                    onClick={() => { setSubTabPenjualan(subTab.id); setPenjualanPage(1); }}
                    className={`px-6 py-2 rounded-lg text-sm font-semibold transition relative ${
                      subTabPenjualan === subTab.id
                        ? "text-[#006638]"
                        : "text-black/40 hover:text-black/70"
                    }`}
                  >
                    {subTab.label}
                    {subTabPenjualan === subTab.id && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#006638] rounded-full mx-4" />
                    )}
                  </button>
                ))}
              </div>

              {/* Table Container Card Penjualan */}
              <div className="bg-white/60 border border-[#029154] rounded-2xl p-6 shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="text-[#273B4A] font-bold text-base">
                        <th className="py-3 px-4 text-center">No Pesanan</th>
                        <th className="py-3 px-4 text-center">Pembeli</th>
                        <th className="py-3 px-4 text-center">Produk</th>
                        <th className="py-3 px-4 text-center">Total Item</th>
                        <th className="py-3 px-4 text-center">Total Nilai</th>
                        <th className="py-3 px-4 text-center">Tanggal</th>
                        <th className="py-3 px-4 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-black/10">
                      {loadingPenjualan ? (
                        <tr><td colSpan={7} className="py-8 text-center"><Loader2 className="w-6 h-6 animate-spin mx-auto text-[#006638]" /></td></tr>
                      ) : penjualanList.length === 0 ? (
                        <tr><td colSpan={7} className="py-8 text-center text-slate-500">Tidak ada penjualan ditemukan</td></tr>
                      ) : penjualanList.map((item) => {
                        const firstProduct = item.items[0];
                        const totalItemQty = item.items.reduce((sum, i) => sum + Number(i.jumlah_beli), 0);
                        return (
                          <tr key={item.id} className="hover:bg-slate-50/50 transition">
                            <td className="py-4 px-4 font-semibold text-[#273B4A] text-center text-sm">
                              {item.kode_pesanan}
                            </td>
                            <td className="py-4 px-4 font-semibold text-[#273B4A] text-center text-sm">
                              {item.pembeli?.nama_lengkap || "-"}
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex items-center gap-3">
                                {firstProduct && (
                                  <>
                                    <img
                                      src={storageUrl(firstProduct.product?.gambar)}
                                      alt={firstProduct.nama_produk}
                                      className="w-12 h-10 object-cover rounded-md border"
                                    />
                                    <div className="flex flex-col">
                                      <span className="font-semibold text-[#273B4A] text-sm truncate max-w-[150px]" title={firstProduct.nama_produk}>
                                        {firstProduct.nama_produk}
                                      </span>
                                      {item.items.length > 1 && (
                                        <span className="text-xs text-slate-500">+{item.items.length - 1} produk lain</span>
                                      )}
                                    </div>
                                  </>
                                )}
                              </div>
                            </td>
                            <td className="py-4 px-4 font-semibold text-[#273B4A] text-center text-sm">
                              {totalItemQty}
                            </td>
                            <td className="py-4 px-4 font-semibold text-[#273B4A] text-center text-sm whitespace-nowrap">
                              Rp {Number(item.total_harga).toLocaleString("id-ID")}
                            </td>
                            <td className="py-4 px-4 font-semibold text-[#273B4A] text-center text-sm whitespace-nowrap">
                              {new Date(item.tanggal_pesanan).toLocaleDateString('id-ID', {day:'numeric', month:'short', year:'numeric'})}
                            </td>
                            <td className="py-4 px-4 text-center">
                              {renderStatusPenjualan(item.status)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <Pagination page={penjualanPage} lastPage={penjualanLastPage} total={penjualanTotal} setPage={setPenjualanPage} />
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
}
