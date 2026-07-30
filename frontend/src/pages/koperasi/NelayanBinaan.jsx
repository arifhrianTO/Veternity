import React, { useState } from "react";
import Sidebar from "../../components/layout/Sidebar";
import { Search, ChevronDown, Plus, Eye, ArrowLeft, Edit3, Trash2, X, ChevronLeft, ChevronRight } from "lucide-react";

export default function NelayanBinaan() {
  // State Modal Detail Nelayan
  const [selectedNelayan, setSelectedNelayan] = useState(null);
  const [activeTab, setActiveTab] = useState("produk"); // 'produk' | 'riwayat'

  // Dummy Data Nelayan Binaan
  const listNelayan = [
    {
      id: 1,
      no: 1,
      nama: "Ahmad Syafiq",
      nik: "098765432109876",
      noHp: "081234567890",
      status: "Aktif",
      jumlahProduk: 5,
      alamat: "Batu Ampar, Batam",
      tglLahir: "17-08-1995",
      rekening: "73829292938399",
      foto: "/images/user.png",
    },
    {
      id: 2,
      no: 2,
      nama: "Hasanuddin",
      nik: "098765432109876",
      noHp: "081234567890",
      status: "Aktif",
      jumlahProduk: 3,
      alamat: "Batu Ampar, Batam",
      tglLahir: "12-05-1990",
      rekening: "73829292938399",
      foto: "/images/user.png",
    },
    {
      id: 3,
      no: 3,
      nama: "Rahmat Hidayat",
      nik: "098765432109876",
      noHp: "081234567890",
      status: "Aktif",
      jumlahProduk: 4,
      alamat: "Sekupang, Batam",
      tglLahir: "23-11-1988",
      rekening: "73829292938399",
      foto: "/images/user.png",
    },
    {
      id: 4,
      no: 4,
      nama: "Samsul Bahri",
      nik: "098765432109876",
      noHp: "081234567890",
      status: "Aktif",
      jumlahProduk: 6,
      alamat: "Nongsa, Batam",
      tglLahir: "05-09-1992",
      rekening: "73829292938399",
      foto: "/images/user.png",
    },
    {
      id: 5,
      no: 5,
      nama: "Zulkifli",
      nik: "098765432109876",
      noHp: "081234567890",
      status: "Aktif",
      jumlahProduk: 2,
      alamat: "Belakang Padang, Batam",
      tglLahir: "14-02-1985",
      rekening: "73829292938399",
      foto: "/images/user.png",
    },
    {
      id: 6,
      no: 6,
      nama: "Arifin",
      nik: "098765432109876",
      noHp: "081234567890",
      status: "Aktif",
      jumlahProduk: 7,
      alamat: "Batu Aji, Batam",
      tglLahir: "30-07-1994",
      rekening: "73829292938399",
      foto: "/images/user.png",
    },
  ];

  // Dummy Produk di Modal
  const produkList = [
    {
      id: 1,
      nama: "Ikan Tuna",
      stok: "50 Kg",
      harga: "Rp 45.000 / kg",
      tglTangkapan: "01-01-25",
      masaLayak: "7 Hari",
      status: "Aktif",
      image: "/images/ikan.png",
    },
    {
      id: 2,
      nama: "Ikan Tongkol",
      stok: "30 Kg",
      harga: "Rp 25.000 / kg",
      tglTangkapan: "01-01-25",
      masaLayak: "7 Hari",
      status: "Aktif",
      image: "/images/ikan.png",
    },
  ];

  // Dummy Riwayat di Modal
  const riwayatList = [
    {
      id: 1,
      noPesanan: "BTC-982-IU7",
      pembeli: "Koperasi Mitra Nelayan",
      produk: "Ikan Tuna",
      jumlah: "25 Kg",
      total: "Rp 1.125.000",
      tanggal: "01-01-25",
      status: "Diproses",
      image: "/images/ikan.png",
    },
    {
      id: 2,
      noPesanan: "BTC-983-IU8",
      pembeli: "Koperasi Mitra Nelayan",
      produk: "Ikan Tongkol",
      jumlah: "15 Kg",
      total: "Rp 375.000",
      tanggal: "01-01-25",
      status: "Mengunggu Pembayaran",
      image: "/images/ikan.png",
    },
  ];

  return (
    <div className="min-h-screen bg-white font-['Montserrat'] text-slate-900">
      <div className="flex w-full min-h-screen p-4 pl-[304px]">
        {/* Sidebar Koperasi */}
        <Sidebar />

        {/* Outer Main Container */}
        <div className="flex-1 bg-[rgba(222,236,225,0.19)] border border-[rgba(0,154,38,0.19)] rounded-[20px] p-8 relative">
          
          {/* Header Panel */}
          <div className="flex items-start justify-between border-b border-[#029154] pb-4 mb-4">
            <h1 className="text-[24px] font-semibold text-[#005941]">Nelayan Binaan</h1>
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center overflow-hidden border border-red-200">
              <img
                src="/images/user.png"
                alt="Avatar"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/images/user.png";
                }}
              />
            </div>
          </div>

          {/* Action Bar (Search, Status Filter, Wilayah Filter, Tambah Nelayan) */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            {/* Input Search */}
            <div className="relative w-full sm:w-[371px] h-[42px]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#005941]" />
              <input
                type="text"
                placeholder="Cari Nelayan..."
                className="w-full h-full bg-white border border-[#006638] rounded-full pl-12 pr-4 text-[15px] font-medium text-[#006638] placeholder-[#006638] focus:outline-none"
              />
            </div>

            {/* Filters & Button Add */}
            <div className="flex items-center gap-3 flex-wrap">
              {/* Dropdown Status */}
              <div className="relative w-[140px] sm:w-[153px] h-[42px]">
                <select className="w-full h-full appearance-none bg-white border border-[#024D70] rounded-[5px] px-4 pr-8 text-[15px] font-medium text-[#00378A] focus:outline-none cursor-pointer">
                  <option value="">Status</option>
                  <option value="aktif">Aktif</option>
                  <option value="nonaktif">Non-Aktif</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#00378A] pointer-events-none" />
              </div>

              {/* Dropdown Wilayah */}
              <div className="relative w-[140px] sm:w-[153px] h-[42px]">
                <select className="w-full h-full appearance-none bg-white border border-[#024D70] rounded-[5px] px-4 pr-8 text-[15px] font-medium text-[#00378A] focus:outline-none cursor-pointer">
                  <option value="">Wilayah</option>
                  <option value="batam">Batam</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#00378A] pointer-events-none" />
              </div>

              {/* Tombol Tambah Nelayan */}
              <button className="w-[180px] sm:w-[215px] h-[42px] bg-gradient-to-r from-[#006638] to-[#029154] rounded-[5px] text-white flex items-center justify-center gap-2 font-semibold text-[18px] sm:text-[20px] hover:opacity-95 transition shadow-sm">
                <span>Tambah Nelayan</span>
                <Plus className="w-6 h-6 stroke-[2.5]" />
              </button>
            </div>
          </div>

          {/* Table Container */}
          <div className="bg-white rounded-[20px] border border-[#029154] shadow-[0_0_4px_rgba(0,0,0,0.25)] p-6 min-h-[680px] flex flex-col justify-between">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-[#273B4A] font-bold text-[16px] border-b border-slate-100">
                    <th className="py-4 px-3 w-[60px]">No</th>
                    <th className="py-4 px-3">Nama</th>
                    <th className="py-4 px-3">NIK</th>
                    <th className="py-4 px-3">No HP</th>
                    <th className="py-4 px-3">Status</th>
                    <th className="py-4 px-3 text-center">Jumlah Produk</th>
                    <th className="py-4 px-3 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/10 text-[16px]">
                  {listNelayan.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50 transition">
                      <td className="py-4 px-3 font-semibold text-[#273B4A]">{item.no}</td>
                      <td className="py-4 px-3 font-semibold text-[#273B4A]">{item.nama}</td>
                      <td className="py-4 px-3 font-medium text-black">{item.nik}</td>
                      <td className="py-4 px-3 font-semibold text-[#273B4A]">{item.noHp}</td>
                      <td className="py-4 px-3">
                        <span className="bg-[rgba(0,174,43,0.19)] border border-[#006638] text-[#006638] px-3 py-0.5 rounded-[3px] text-[15px] font-medium inline-block">
                          {item.status}
                        </span>
                      </td>
                      <td className="py-4 px-3 text-center font-semibold text-[#273B4A]">
                        {item.jumlahProduk}
                      </td>
                      <td className="py-4 px-3 text-center">
                        <button
                          onClick={() => {
                            setSelectedNelayan(item);
                            setActiveTab("produk");
                          }}
                          className="w-9 h-9 rounded-full border-2 border-[#006638] flex items-center justify-center text-[#006638] hover:bg-emerald-50 transition mx-auto"
                          title="View Detail"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination & Info */}
            <div className="flex flex-wrap items-center justify-between border-t border-slate-100 pt-4 mt-6 gap-4">
              <span className="text-[15px] sm:text-[16px] font-semibold text-black/50">
                Menampilkan 1-6 dari 8 nelayan
              </span>
              <div className="flex items-center gap-2">
                <button className="p-1 text-black/40 hover:text-black transition">
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button className="w-9 h-9 bg-[#006638] text-white rounded-[5px] font-semibold text-[20px] flex items-center justify-center">
                  1
                </button>
                <button className="w-9 h-9 bg-white border border-[#006638] text-[#006638] rounded-[5px] font-semibold text-[20px] flex items-center justify-center hover:bg-emerald-50 transition">
                  2
                </button>
                <button className="p-1 text-black/40 hover:text-black transition">
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ========================================================== */}
      {/* MODAL POPUP DETAIL NELAYAN                                 */}
      {/* ========================================================== */}
      {selectedNelayan && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-[20px] w-full max-w-[1280px] max-h-[90vh] overflow-y-auto p-6 sm:p-8 relative shadow-2xl border border-[#006638]">
            
            {/* Header Modal / Arrow Back */}
            <div className="flex items-center justify-between mb-6 border-b border-[#029154] pb-4">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setSelectedNelayan(null)}
                  className="w-9 h-9 flex items-center justify-center border-2 border-[#006638] rounded-full text-[#006638] hover:bg-emerald-50 transition"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <h2 className="text-[22px] sm:text-[24px] font-semibold text-[#005941]">
                  Detail Nelayan
                </h2>
              </div>
              <button
                onClick={() => setSelectedNelayan(null)}
                className="text-slate-400 hover:text-slate-600 transition"
              >
                <X className="w-7 h-7" />
              </button>
            </div>

            {/* Profil Card */}
            <div className="border border-[#006638] rounded-[20px] p-6 sm:p-8 mb-6 relative bg-white flex flex-col md:flex-row items-center md:items-start gap-8">
              <img
                src={selectedNelayan.foto}
                alt={selectedNelayan.nama}
                className="w-[200px] h-[200px] sm:w-[240px] sm:h-[240px] rounded-full object-cover flex-shrink-0 border border-slate-200"
              />

              <div className="flex-1 w-full">
                <div className="flex justify-between items-start mb-4">
                  <h1 className="text-[28px] sm:text-[32px] font-semibold text-[#006638] leading-tight">
                    {selectedNelayan.nama}
                  </h1>
                  <button className="p-2 border-2 border-[#006638] rounded-lg text-[#006638] hover:bg-emerald-50 transition">
                    <Edit3 className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid grid-cols-[140px_1fr] sm:grid-cols-[160px_1fr] gap-y-3 text-[16px] sm:text-[18px] font-semibold text-black">
                  <div>Nik :</div>
                  <div>{selectedNelayan.nik}</div>

                  <div>No Hp :</div>
                  <div>{selectedNelayan.noHp}</div>

                  <div>Alamat :</div>
                  <div>{selectedNelayan.alamat}</div>

                  <div>Tanggal Lahir :</div>
                  <div>{selectedNelayan.tglLahir}</div>

                  <div>Rekening :</div>
                  <div>{selectedNelayan.rekening}</div>
                </div>
              </div>
            </div>

            {/* Tab Switcher */}
            <div className="w-[280px] sm:w-[334px] h-[50px] sm:h-[60px] bg-white shadow-[0_0_5px_rgba(0,0,0,0.25)] rounded-[10px] flex items-center mb-6 p-1 relative">
              <button
                onClick={() => setActiveTab("produk")}
                className={`flex-1 text-center text-[18px] sm:text-[20px] font-semibold transition ${
                  activeTab === "produk" ? "text-[#006638]" : "text-black/40"
                }`}
              >
                Produk
              </button>
              <button
                onClick={() => setActiveTab("riwayat")}
                className={`flex-1 text-center text-[18px] sm:text-[20px] font-semibold transition ${
                  activeTab === "riwayat" ? "text-[#006638]" : "text-black/40"
                }`}
              >
                Riwayat
              </button>
              
              <div
                className={`absolute bottom-1.5 h-[3px] bg-[#006638] transition-all duration-300 w-[100px] sm:w-[120px] ${
                  activeTab === "produk" ? "left-[20px] sm:left-[24px]" : "left-[155px] sm:left-[188px]"
                }`}
              />
            </div>

            {/* Content Tab */}
            <div className="border border-[#006638] rounded-[20px] p-6 bg-white min-h-[280px]">
              {activeTab === "produk" && (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="text-[#273B4A] font-bold text-[16px] border-b border-slate-100 pb-4">
                        <th className="py-3 px-4">Produk</th>
                        <th className="py-3 px-4">Stok</th>
                        <th className="py-3 px-4">Harga Harapan</th>
                        <th className="py-3 px-4">Tanggal Tangkapan</th>
                        <th className="py-3 px-4">Masa Layak</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4 text-center">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-[15px] font-semibold text-[#273B4A]">
                      {produkList.map((prod) => (
                        <tr key={prod.id}>
                          <td className="py-4 px-4">
                            <span>{prod.nama}</span>
                          </td>
                          <td className="py-4 px-4">{prod.stok}</td>
                          <td className="py-4 px-4 text-black font-normal">{prod.harga}</td>
                          <td className="py-4 px-4">{prod.tglTangkapan}</td>
                          <td className="py-4 px-4">{prod.masaLayak}</td>
                          <td className="py-4 px-4">
                            <span className="bg-[rgba(0,174,43,0.19)] border border-[#006638] text-[#006638] px-3 py-1 rounded-[3px] text-[14px] font-medium inline-block">
                              {prod.status}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center justify-center gap-2">
                              <button className="w-[38px] h-[38px] rounded-[5px] border border-[#0220E1] flex items-center justify-center text-[#0004ED] hover:bg-blue-50 transition">
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button className="w-[38px] h-[38px] rounded-[5px] border border-[#E10206] flex items-center justify-center text-[#FF0000] hover:bg-red-50 transition">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {activeTab === "riwayat" && (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="text-[#273B4A] font-bold text-[16px] border-b border-slate-100 pb-4">
                        <th className="py-3 px-4">No Pesanan</th>
                        <th className="py-3 px-4">Pembeli</th>
                        <th className="py-3 px-4">Produk</th>
                        <th className="py-3 px-4">Jumlah</th>
                        <th className="py-3 px-4">Total</th>
                        <th className="py-3 px-4">Tanggal</th>
                        <th className="py-3 px-4 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-[15px] font-semibold text-[#273B4A]">
                      {riwayatList.map((rw) => (
                        <tr key={rw.id}>
                          <td className="py-4 px-4">{rw.noPesanan}</td>
                          <td className="py-4 px-4">{rw.pembeli}</td>
                          <td className="py-4 px-4">
                            <span>{rw.produk}</span>
                          </td>
                          <td className="py-4 px-4">{rw.jumlah}</td>
                          <td className="py-4 px-4">{rw.total}</td>
                          <td className="py-4 px-4">{rw.tanggal}</td>
                          <td className="py-4 px-4 text-center">
                            {rw.status === "Diproses" && (
                              <span className="bg-[rgba(172,105,255,0.19)] border border-[#520066] text-[#4B0066] px-4 py-1.5 rounded-[3px] text-[14px] font-semibold inline-block">
                                Diproses
                              </span>
                            )}
                            {rw.status === "Mengunggu Pembayaran" && (
                              <span className="bg-[rgba(255,212,105,0.19)] border border-[#956100] text-[#DC8800] px-3 py-1.5 rounded-[3px] text-[13px] font-semibold inline-block">
                                Mengunggu Pembayaran
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
