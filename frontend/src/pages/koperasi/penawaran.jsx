import React, { useState } from "react";
import Sidebar from "../../components/layout/Sidebar";

export default function PenawaranPage() {
  const [activeTab, setActiveTab] = useState("Semua");
  const [selectedItem, setSelectedItem] = useState(null); // State untuk mengontrol Modal
  const [showCounter, setShowCounter] = useState(false); // State toggle input Counter Offer
  const [counterPrice, setCounterPrice] = useState("");

  // Data penawaran
  const penawaranList = [
    {
      id: 1,
      nama: "Beras Premium",
      berat: "50 kg",
      gambar: "/images/beras.png",
      pemilik: "Budi Santoso",
      hargaAcuan: "Rp 14.000 / kg",
      hargaTawaran: "Rp 12.000 / kg",
      status: "Menunggu",
      tanggal: "01-01-26",
      pembeli: {
        nama: "PT Sejahtera",
        lokasi: "Bogor, Jawa Barat",
        pesan: "Halo pak jdjewakpourdncm ckdcnakodx c,cmdmcmdl;sd",
      },
      riwayat: [
        {
          tanggal: "1 januari 2026 10:30",
          keterangan: "Pembeli mengajukan penawaran",
          harga: "Rp 12.000 / kg",
        },
        {
          tanggal: "1 januari 2026 10:35",
          keterangan: "Menunggu respon",
          harga: null,
        },
      ],
    },
    {
      id: 2,
      nama: "Beras Premium",
      berat: "50 kg",
      gambar: "/images/beras.png",
      pemilik: "Budi Santoso",
      hargaAcuan: "Rp 14.000 / kg",
      hargaTawaran: "Rp 12.000 / kg",
      status: "Diterima",
      tanggal: "01-01-26",
      pembeli: {
        nama: "PT Sejahtera",
        lokasi: "Bogor, Jawa Barat",
        pesan: "Siap kirim segera ya pak",
      },
      riwayat: [
        {
          tanggal: "1 januari 2026 10:30",
          keterangan: "Pembeli mengajukan penawaran",
          harga: "Rp 12.000 / kg",
        },
      ],
    },
    {
      id: 3,
      nama: "Beras Premium",
      berat: "50 kg",
      gambar: "/images/beras.png",
      pemilik: "Budi Santoso",
      hargaAcuan: "Rp 14.000 / kg",
      hargaTawaran: "Rp 12.000 / kg",
      status: "Ditolak",
      tanggal: "01-01-26",
      pembeli: {
        nama: "PT Sejahtera",
        lokasi: "Bogor, Jawa Barat",
        pesan: "Harga kurang cocok",
      },
      riwayat: [],
    },
    {
      id: 4,
      nama: "Beras Premium",
      berat: "50 kg",
      gambar: "/images/beras.png",
      pemilik: "Budi Santoso",
      hargaAcuan: "Rp 14.000 / kg",
      hargaTawaran: "Rp 12.000 / kg",
      status: "Selesai",
      tanggal: "01-01-26",
      pembeli: {
        nama: "PT Sejahtera",
        lokasi: "Bogor, Jawa Barat",
        pesan: "Transaksi Selesai",
      },
      riwayat: [],
    },
  ];

  // Helper untuk styling badge status
  const getStatusBadge = (status) => {
    switch (status) {
      case "Menunggu":
        return (
          <div className="flex flex-col items-center gap-1">
            <span className="w-[116px] py-1 bg-[#FFD469]/20 border border-[#956100] text-[#DC8800] text-[15px] font-semibold text-center rounded-[3px]">
              Menunggu
            </span>
            <span className="text-[15px] font-medium text-black/25">01-01-26</span>
          </div>
        );
      case "Diterima":
        return (
          <div className="flex flex-col items-center gap-1">
            <span className="w-[116px] py-1 bg-[#69AAFF]/20 border border-[#002595] text-[#004DDC] text-[15px] font-semibold text-center rounded-[3px]">
              Diterima
            </span>
            <span className="text-[15px] font-medium text-black/25">01-01-26</span>
          </div>
        );
      case "Ditolak":
        return (
          <div className="flex flex-col items-center gap-1">
            <span className="w-[116px] py-1 bg-[#FF696B]/20 border border-[#950002] text-[#DC0004] text-[15px] font-semibold text-center rounded-[3px]">
              Ditolak
            </span>
            <span className="text-[15px] font-medium text-black/25">01-01-26</span>
          </div>
        );
      case "Selesai":
        return (
          <div className="flex flex-col items-center gap-1">
            <span className="w-[116px] py-1 bg-[#6EFF69]/20 border border-[#00950F] text-[#00DC0B] text-[15px] font-semibold text-center rounded-[3px]">
              Selesai
            </span>
            <span className="text-[15px] font-medium text-black/25">01-01-26</span>
          </div>
        );
      default:
        return null;
    }
  };

  // Filter data berdasarkan tab
  const filteredData =
    activeTab === "Semua"
      ? penawaranList
      : penawaranList.filter((item) => item.status === activeTab);

  const handleOpenModal = (item) => {
    setSelectedItem(item);
    setShowCounter(false);
  };

  const handleCloseModal = () => {
    setSelectedItem(null);
    setShowCounter(false);
  };

  return (
    <div className="min-h-screen bg-white font-['Montserrat'] text-slate-900 relative">
      <div className="flex w-full min-h-screen p-4 pl-[304px]">
        
        {/* Sidebar Koperasi */}
        <Sidebar />

        {/* Main Content Container */}
        <div className="flex-1 bg-[rgba(222,236,225,0.19)] border border-[rgba(0,154,38,0.19)] rounded-[20px] p-8 flex flex-col justify-between">
          <div>
            {/* Header Panel */}
            <div className="flex items-end justify-between border-b border-[#029154] pb-2 mb-4">
              <h1 className="text-[24px] font-semibold text-[#005941]">
                Penawaran
              </h1>
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center overflow-hidden border border-red-200 translate-y-[4px]">
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

            {/* Filter Status Tabs */}
            <div className="bg-white rounded-[10px] shadow-[0_0_5px_rgba(0,0,0,0.25)] p-2 mb-6 max-w-[727px]">
              <div className="flex items-center justify-between px-6 py-2">
                {["Semua", "Menunggu", "Diterima", "Ditolak"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`relative text-[20px] font-semibold pb-1 transition ${
                      activeTab === tab
                        ? "text-[#005941]"
                        : "text-black/40 hover:text-slate-800"
                    }`}
                  >
                    {tab}
                    {activeTab === tab && (
                      <div className="absolute left-1/2 -translate-x-1/2 bottom-0 w-[100%] h-[3px] bg-[#006638] rounded-full" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Table Header Labels */}
            <div className="grid grid-cols-12 px-6 py-2 text-[#273B4A] font-bold text-[16px] mb-2 items-center text-center">
              <div className="col-span-3 text-left">Produk</div>
              <div className="col-span-2">Pemilik</div>
              <div className="col-span-2">Harga Acuan</div>
              <div className="col-span-2">Harga Tawaran</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-1">Aksi</div>
            </div>

            {/* Cards List */}
            <div className="space-y-4">
              {filteredData.map((item) => (
                <div
                  key={item.id}
                  className="bg-white/50 border border-[#006638] rounded-[20px] shadow-[0_0_4px_rgba(0,0,0,0.25)] p-4 grid grid-cols-12 items-center text-center"
                >
                  {/* Produk */}
                  <div className="col-span-3 flex items-center gap-4 text-left">
                    <img
                      src={item.gambar}
                      alt={item.nama}
                      className="w-[98px] h-[65px] object-cover rounded-[5px] border border-slate-100"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/images/beras.png";
                      }}
                    />
                    <div className="flex flex-col">
                      <span className="font-semibold text-[#273B4A] text-[16px]">
                        {item.nama}
                      </span>
                      <span className="font-semibold text-black/40 text-[16px]">
                        {item.berat}
                      </span>
                    </div>
                  </div>

                  {/* Pemilik */}
                  <div className="col-span-2 font-medium text-black text-[15px]">
                    {item.pemilik}
                  </div>

                  {/* Harga Acuan */}
                  <div className="col-span-2 font-medium text-black text-[15px]">
                    {item.hargaAcuan}
                  </div>

                  {/* Harga Tawaran */}
                  <div className="col-span-2 font-medium text-black text-[15px]">
                    {item.hargaTawaran}
                  </div>

                  {/* Status & Tanggal */}
                  <div className="col-span-2 flex justify-center">
                    {getStatusBadge(item.status)}
                  </div>

                  {/* Tombol Detail */}
                  <div className="col-span-1 flex justify-center">
                    <button 
                      onClick={() => handleOpenModal(item)}
                      className="w-[129px] h-[47px] bg-gradient-to-r from-[#006638] to-[#029154] text-white font-semibold text-[20px] rounded-[30px] shadow-[0_0_4px_rgba(0,0,0,0.25)] hover:opacity-90 transition"
                    >
                      Detail
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* MODAL / POP-UP OVERLAY */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-[650px] rounded-[20px] p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            
            {/* Close Button Icon */}
            <button 
              onClick={handleCloseModal}
              className="absolute top-4 right-5 hover:opacity-70 transition p-1"
            >
              <img 
                src="/images/close.png" 
                alt="Close" 
                className="w-5 h-5 object-contain"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/images/icon-close.png";
                }}
              />
            </button>

            {/* Modal Header (Detail Produk & Harga) */}
            <div className="flex items-start justify-between border-b pb-4 mb-4 gap-4">
              <div className="flex gap-4 items-center">
                <img
                  src={selectedItem.gambar}
                  alt={selectedItem.nama}
                  className="w-[120px] h-[85px] object-cover rounded-[8px]"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/images/beras.png";
                  }}
                />
                <div>
                  <h3 className="text-[18px] font-bold text-[#273B4A]">
                    {selectedItem.nama}
                  </h3>
                  <p className="text-[14px] font-semibold text-black/40">
                    {selectedItem.berat}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="w-6 h-6 rounded-full bg-slate-300 overflow-hidden flex-shrink-0">
                      <img 
                        src="/images/user.png" 
                        alt="user" 
                        className="w-full h-full object-cover" 
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "/images/user.png";
                        }}
                      />
                    </div>
                    <span className="text-[14px] font-semibold text-black/60">
                      {selectedItem.pemilik}
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="mb-2">
                  <span className="block text-[12px] font-bold text-[#273B4A]">Harga Acuan</span>
                  <span className="text-[14px] font-medium text-black">{selectedItem.hargaAcuan}</span>
                </div>
                <div>
                  <span className="block text-[12px] font-bold text-[#273B4A]">Harga Tawaran</span>
                  <span className="text-[14px] font-bold text-[#029154]">{selectedItem.hargaTawaran}</span>
                </div>
              </div>
            </div>

            {/* Modal Body (Detail Pembeli) */}
            <div className="border border-black/20 rounded-[15px] p-4 mb-4">
              <h4 className="text-[14px] font-bold text-[#273B4A] mb-2">Pembeli</h4>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-teal-800 flex items-center justify-center overflow-hidden flex-shrink-0">
                    <img 
                      src="/images/buyer-avatar.png" 
                      alt="Buyer" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/images/user.png";
                      }}
                    />
                  </div>
                  <div>
                    <p className="font-bold text-[14px] text-slate-800">{selectedItem.pembeli?.nama}</p>
                    <div className="flex items-center gap-1 text-[12px] text-slate-500">
                      <img 
                        src="/images/location.png" 
                        alt="Location" 
                        className="w-3.5 h-3.5 object-contain"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "/images/icon-location.png";
                        }}
                      />
                      <span>{selectedItem.pembeli?.lokasi}</span>
                    </div>
                  </div>
                </div>

                {/* Contact Action Icons */}
                <div className="flex gap-2">
                  <button className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center hover:bg-green-200 transition">
                    <img 
                      src="/images/phone.png" 
                      alt="Phone" 
                      className="w-4 h-4 object-contain"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/images/icon-phone.png";
                      }}
                    />
                  </button>
                  <button className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center hover:bg-green-200 transition">
                    <img 
                      src="/images/chat.png" 
                      alt="Chat" 
                      className="w-4 h-4 object-contain"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/images/icon-chat.png";
                      }}
                    />
                  </button>
                  <button className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center hover:bg-green-200 transition">
                    <img 
                      src="/images/email.png" 
                      alt="Email" 
                      className="w-4 h-4 object-contain"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/images/icon-email.png";
                      }}
                    />
                  </button>
                </div>
              </div>

              <div className="mt-3 bg-slate-50 p-3 rounded-[8px] border border-slate-200">
                <p className="text-[11px] font-semibold text-slate-400 mb-1">Pesan pembeli</p>
                <p className="text-[13px] text-slate-700">{selectedItem.pembeli?.pesan}</p>
              </div>
            </div>

            {/* Riwayat Penawaran */}
            <div className="mb-5">
              <h4 className="text-[14px] font-bold text-[#273B4A] mb-3">Riwayat Penawaran</h4>
              <div className="space-y-3 pl-2">
                {selectedItem.riwayat && selectedItem.riwayat.length > 0 ? (
                  selectedItem.riwayat.map((rw, index) => (
                    <div key={index} className="flex items-start gap-3 relative">
                      <div className="flex flex-col items-center">
                        <div className="w-3 h-3 rounded-full bg-[#029154] mt-1" />
                        {index !== selectedItem.riwayat.length - 1 && (
                          <div className="w-[2px] h-8 bg-gray-300" />
                        )}
                      </div>
                      <div className="flex-1 flex justify-between text-[12px]">
                        <div>
                          <p className="text-gray-400 font-medium">{rw.tanggal}</p>
                          <p className="text-slate-800 font-semibold">{rw.keterangan}</p>
                        </div>
                        {rw.harga && (
                          <span className="font-bold text-[#029154]">{rw.harga}</span>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-[12px] text-gray-400">Belum ada riwayat penawaran.</p>
                )}
              </div>
            </div>

            {/* Aksi Buttons */}
            <div className="border-t pt-4">
              <h4 className="text-[14px] font-bold text-[#273B4A] mb-3">Aksi</h4>
              <div className="grid grid-cols-3 gap-3">
                <button className="py-2 px-4 bg-[#006638] text-white font-bold text-[14px] rounded-[8px] hover:bg-emerald-800 transition flex items-center justify-center gap-2">
                  <img 
                    src="/images/check.png" 
                    alt="Terima" 
                    className="w-4 h-4 object-contain brightness-0 invert"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/images/icon-check.png";
                    }}
                  />
                  Terima
                </button>
                <button className="py-2 px-4 border border-red-500 text-red-500 font-bold text-[14px] rounded-[8px] hover:bg-red-50 transition flex items-center justify-center gap-2">
                  <img 
                    src="/images/cancel.png" 
                    alt="Tolak" 
                    className="w-4 h-4 object-contain"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/images/icon-cancel.png";
                    }}
                  />
                  Tolak
                </button>
                <button 
                  onClick={() => setShowCounter(!showCounter)}
                  className="py-2 px-4 border border-blue-600 text-blue-600 font-bold text-[14px] rounded-[8px] hover:bg-blue-50 transition flex items-center justify-center gap-2"
                >
                  <img 
                    src="/images/counter.png" 
                    alt="Counter Offer" 
                    className="w-4 h-4 object-contain"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/images/icon-counter.png";
                    }}
                  />
                  Counter Offer
                </button>
              </div>

              {/* Form Input Counter Offer */}
              {showCounter && (
                <div className="mt-4 p-3 bg-slate-50 border rounded-[10px] transition-all">
                  <h5 className="text-[13px] font-bold text-[#273B4A] mb-2">Buat Counter Offer</h5>
                  <p className="text-[11px] text-gray-500 mb-1">Harga tawaran anda</p>
                  <div className="flex gap-2">
                    <div className="flex flex-1 border rounded-[6px] overflow-hidden bg-white">
                      <input
                        type="text"
                        placeholder="Masukkan Harga"
                        value={counterPrice}
                        onChange={(e) => setCounterPrice(e.target.value)}
                        className="w-full px-3 py-1.5 text-[13px] outline-none"
                      />
                      <span className="bg-gray-100 px-3 py-1.5 text-[13px] text-gray-500 font-medium flex items-center border-l">
                        /Kg
                      </span>
                    </div>
                    <button className="px-5 py-1.5 bg-[#003B7A] text-white text-[13px] font-bold rounded-[6px] hover:bg-blue-900 transition flex items-center gap-1.5">
                      <img 
                        src="/images/send.png" 
                        alt="Kirim" 
                        className="w-3.5 h-3.5 object-contain brightness-0 invert"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "/images/icon-send.png";
                        }}
                      />
                      Kirim
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
