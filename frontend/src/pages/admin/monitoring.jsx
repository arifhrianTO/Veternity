import { useState } from "react";
import Sidebar from "../../components/layout/Sidebar";
import {
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function MonitoringPage() {
  const [activeTab, setActiveTab] = useState("produk"); // 'produk' | 'penjualan'
  const [subTabPenjualan, setSubTabPenjualan] = useState("semua"); // 'semua' | 'dalam_proses' | 'dikirim' | 'selesai'

  // State Filter Produk
  const [searchProduk, setSearchProduk] = useState("");
  const [filterKategori, setFilterKategori] = useState("");
  const [filterStatusProduk, setFilterStatusProduk] = useState("");

  // Sample Data Produk (Menggunakan path /image)
  const [produkList] = useState([
    {
      id: 1,
      nama: "Beras Premium",
      gambar: "/image/beras.png",
      kategori: "Beras",
      pemilik: "Budi Santoso",
      stok: "50 Kg",
      harga: "Rp 14.000 / kg",
      tanggalPanen: "01-01-25",
      masaLayak: "7 Hari",
      status: "Aktif",
    },
    {
      id: 2,
      nama: "Beras Premium",
      gambar: "/images/beras.png",
      kategori: "Beras",
      pemilik: "Budi Santoso",
      stok: "50 Kg",
      harga: "Rp 14.000 / kg",
      tanggalPanen: "01-01-25",
      masaLayak: "7 Hari",
      status: "Aktif",
    },
    {
      id: 3,
      nama: "Beras Premium",
      gambar: "/image/beras.png",
      kategori: "Beras",
      pemilik: "Budi Santoso",
      stok: "50 Kg",
      harga: "Rp 14.000 / kg",
      tanggalPanen: "01-01-25",
      masaLayak: "7 Hari",
      status: "Aktif",
    },
  ]);

  // Sample Data Penjualan
  const [penjualanList] = useState([
    {
      id: 1,
      noPesanan: "BTC-982-IU7",
      pembeli: "Koperasi Mitra",
      produk: "Beras Premium",
      gambar: "/image/beras.png",
      jumlah: "55 Kg",
      total: "Rp 1.400.000",
      tanggal: "01-01-25",
      status: "Diproses",
    },
    {
      id: 2,
      noPesanan: "BTC-982-IU7",
      pembeli: "Koperasi Mitra",
      produk: "Beras Premium",
      gambar: "/image/beras.png",
      jumlah: "55 Kg",
      total: "Rp 1.400.000",
      tanggal: "01-01-25",
      status: "Mengunggu Pembayaran",
    },
    {
      id: 3,
      noPesanan: "BTC-982-IU7",
      pembeli: "Koperasi Mitra",
      produk: "Beras Premium",
      gambar: "/images/beras.png",
      jumlah: "55 Kg",
      total: "Rp 1.400.000",
      tanggal: "01-01-25",
      status: "Dikirim",
    },
    {
      id: 4,
      noPesanan: "BTC-982-IU7",
      pembeli: "Koperasi Mitra",
      produk: "Beras Premium",
      gambar: "/image/beras.png",
      jumlah: "55 Kg",
      total: "Rp 1.400.000",
      tanggal: "01-01-25",
      status: "Diproses",
    },
  ]);

  // Helper badge warna status penjualan
  const renderStatusPenjualan = (status) => {
    switch (status) {
      case "Diproses":
        return (
          <span className="inline-block bg-[rgba(172,105,255,0.19)] text-[#4B0066] border border-[#520066] text-xs font-semibold px-3 py-1 rounded-[3px]">
            Diproses
          </span>
        );
      case "Mengunggu Pembayaran":
        return (
          <span className="inline-block bg-[rgba(255,212,105,0.19)] text-[#AC6A00] border border-[#956100] text-xs font-semibold px-3 py-1 rounded-[3px]">
            Mengunggu Pembayaran
          </span>
        );
      case "Dikirim":
        return (
          <span className="inline-block bg-[rgba(1,132,254,0.19)] text-[#00378A] border border-[#00378A] text-xs font-semibold px-3 py-1 rounded-[3px]">
            Dikirim
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
        
        {/* AdminSidebar Komponen */}
        <Sidebar />

        {/* Area Konten Utama */}
        <div className="flex-1 bg-[rgba(222,236,225,0.19)] border border-[rgba(0,154,38,0.19)] rounded-[20px] p-8 relative">
          
          {/* Header Panel */}
          <div className="flex items-center justify-between pb-6 mb-6 border-b border-[#029154]">
            <h1 className="text-[24px] font-semibold text-[#005941]">Monitoring</h1>
            <div className="w-10 h-10 rounded-full bg-[#C1E0FF] flex items-center justify-center text-[#0184FE]">
              <span className="font-bold">A</span>
            </div>
          </div>

          {/* Main Tab Switcher (Produk / Penjualan) */}
          <div className="inline-flex bg-white rounded-xl p-1.5 shadow-sm border border-slate-100 mb-6">
            <button
              onClick={() => setActiveTab("produk")}
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
              onClick={() => setActiveTab("penjualan")}
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
                    onChange={(e) => setSearchProduk(e.target.value)}
                    className="w-full pl-12 pr-4 py-2.5 rounded-full border border-[#006638] text-sm text-[#006638] placeholder-[#006638] focus:outline-none bg-white"
                  />
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                  <div className="relative">
                    <select
                      value={filterKategori}
                      onChange={(e) => setFilterKategori(e.target.value)}
                      className="appearance-none bg-white border border-[#024D70] text-[#00378A] text-sm font-medium px-4 py-2.5 pr-10 rounded-md focus:outline-none cursor-pointer"
                    >
                      <option value="">Kategori</option>
                      <option value="Beras">Beras</option>
                      <option value="Sayur">Sayur</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#00378A] pointer-events-none" />
                  </div>

                  <div className="relative">
                    <select
                      value={filterStatusProduk}
                      onChange={(e) => setFilterStatusProduk(e.target.value)}
                      className="appearance-none bg-white border border-[#024D70] text-[#00378A] text-sm font-medium px-4 py-2.5 pr-10 rounded-md focus:outline-none cursor-pointer"
                    >
                      <option value="">Status</option>
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
                      {produkList.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50/50 transition">
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={item.gambar}
                                alt={item.nama}
                                className="w-20 h-14 object-cover rounded-md border"
                              />
                              <span className="font-semibold text-[#273B4A] text-sm">
                                {item.nama}
                              </span>
                            </div>
                          </td>
                          <td className="py-4 px-4 font-semibold text-[#273B4A] text-center text-sm">
                            {item.kategori}
                          </td>
                          <td className="py-4 px-4 font-semibold text-[#273B4A] text-center text-sm">
                            {item.pemilik}
                          </td>
                          <td className="py-4 px-4 font-semibold text-[#273B4A] text-center text-sm">
                            {item.stok}
                          </td>
                          <td className="py-4 px-4 font-medium text-black text-center text-sm">
                            {item.harga}
                          </td>
                          <td className="py-4 px-4 font-semibold text-[#273B4A] text-center text-sm">
                            {item.tanggalPanen}
                          </td>
                          <td className="py-4 px-4 font-semibold text-[#273B4A] text-center text-sm">
                            {item.masaLayak}
                          </td>
                          <td className="py-4 px-4 text-center">
                            <span className="inline-block bg-[rgba(0,174,43,0.19)] text-[#006638] border border-[#006638] text-xs font-semibold px-3 py-1 rounded-[3px]">
                              {item.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination Produk */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 text-sm text-black/50 font-semibold">
                  <div>Menampilkan 1-3 dari 8 produk</div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 text-black/40 hover:text-black transition">
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button className="w-9 h-9 rounded-md bg-[#006638] text-white font-semibold flex items-center justify-center">
                      1
                    </button>
                    <button className="w-9 h-9 rounded-md bg-white border border-[#006638] text-[#006638] font-semibold flex items-center justify-center hover:bg-slate-50">
                      2
                    </button>
                    <button className="p-2 text-black/40 hover:text-black transition">
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
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
                    onClick={() => setSubTabPenjualan(subTab.id)}
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
                        <th className="py-3 px-4 text-center">Jumlah</th>
                        <th className="py-3 px-4 text-center">Total</th>
                        <th className="py-3 px-4 text-center">Tanggal</th>
                        <th className="py-3 px-4 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-black/10">
                      {penjualanList.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50/50 transition">
                          <td className="py-4 px-4 font-semibold text-[#273B4A] text-center text-sm">
                            {item.noPesanan}
                          </td>
                          <td className="py-4 px-4 font-semibold text-[#273B4A] text-center text-sm">
                            {item.pembeli}
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center justify-center gap-3">
                              <img
                                src={item.gambar}
                                alt={item.produk}
                                className="w-20 h-14 object-cover rounded-md border"
                              />
                              <span className="font-semibold text-[#273B4A] text-sm">
                                {item.produk}
                              </span>
                            </div>
                          </td>
                          <td className="py-4 px-4 font-semibold text-[#273B4A] text-center text-sm">
                            {item.jumlah}
                          </td>
                          <td className="py-4 px-4 font-semibold text-[#273B4A] text-center text-sm">
                            {item.total}
                          </td>
                          <td className="py-4 px-4 font-semibold text-[#273B4A] text-center text-sm">
                            {item.tanggal}
                          </td>
                          <td className="py-4 px-4 text-center">
                            {renderStatusPenjualan(item.status)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination Penjualan */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 text-sm text-black/50 font-semibold">
                  <div>Menampilkan 1-4 dari 8 produk</div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 text-black/40 hover:text-black transition">
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button className="w-9 h-9 rounded-md bg-[#006638] text-white font-semibold flex items-center justify-center">
                      1
                    </button>
                    <button className="w-9 h-9 rounded-md bg-white border border-[#006638] text-[#006638] font-semibold flex items-center justify-center hover:bg-slate-50">
                      2
                    </button>
                    <button className="p-2 text-black/40 hover:text-black transition">
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
}
