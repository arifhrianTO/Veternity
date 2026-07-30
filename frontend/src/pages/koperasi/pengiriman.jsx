import React, { useState } from "react";
import Sidebar from "../../components/layout/Sidebar";

export default function PengirimanPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("Semua");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedItem, setSelectedItem] = useState(null); // State untuk Modal Edit
  const [editForm, setEditForm] = useState({ resi: "", status: "" });

  // Data Pengiriman
  const initialData = [
    {
      id: 1,
      invoice: "IND-837448-73638",
      pembeli: "PT Sejahtera",
      logistik: "JNT Cargo",
      noResi: "88927799387402",
      status: "Selesai",
    },
    {
      id: 2,
      invoice: "IND-837448-73638",
      pembeli: "PT Sejahtera",
      logistik: "JNT Cargo",
      noResi: "88927799387402",
      status: "Dikirim",
    },
    {
      id: 3,
      invoice: "IND-837448-73638",
      pembeli: "PT Sejahtera",
      logistik: "JNT Cargo",
      noResi: "88927799387402",
      status: "Diproses",
    },
    {
      id: 4,
      invoice: "IND-837448-73638",
      pembeli: "PT Sejahtera",
      logistik: "JNT Cargo",
      noResi: "88927799387402",
      status: "Dikirim",
    },
    {
      id: 5,
      invoice: "IND-837448-73638",
      pembeli: "PT Sejahtera",
      logistik: "JNT Cargo",
      noResi: "88927799387402",
      status: "Selesai",
    },
  ];

  const [pengirimanList, setPengirimanList] = useState(initialData);

  // Helper Styling Badge Status
  const getStatusBadge = (status) => {
    switch (status) {
      case "Selesai":
        return (
          <span className="w-[75px] h-[22px] bg-[rgba(0,174,43,0.19)] border border-[#006638] text-[#006638] text-[15px] font-medium rounded-[3px] flex items-center justify-center">
            Selesai
          </span>
        );
      case "Dikirim":
        return (
          <span className="w-[75px] h-[22px] bg-[rgba(105,170,255,0.19)] border border-[#0220E1] text-[#0220E1] text-[15px] font-medium rounded-[3px] flex items-center justify-center">
            Dikirim
          </span>
        );
      case "Diproses":
        return (
          <span className="w-[75px] h-[22px] bg-[rgba(215,105,255,0.19)] border border-[#790097] text-[#BC02E1] text-[15px] font-medium rounded-[3px] flex items-center justify-center">
            Diproses
          </span>
        );
      default:
        return null;
    }
  };

  // Filter Data
  const filteredData = pengirimanList.filter((item) => {
    const matchesSearch =
      item.invoice.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.pembeli.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.noResi.includes(searchTerm);
    const matchesStatus =
      statusFilter === "Semua" || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Handle Open Modal
  const handleOpenEdit = (item) => {
    setSelectedItem(item);
    setEditForm({ resi: item.noResi, status: item.status });
  };

  // Handle Save Modal
  const handleSaveEdit = (e) => {
    e.preventDefault();
    setPengirimanList((prev) =>
      prev.map((item) =>
        item.id === selectedItem.id
          ? { ...item, noResi: editForm.resi, status: editForm.status }
          : item
      )
    );
    setSelectedItem(null);
  };

  return (
    <div className="min-h-screen bg-white font-['Montserrat'] text-slate-900 relative">
      <div className="flex w-full min-h-screen p-4 pl-[304px]">
        {/* Sidebar Koperasi */}
        <Sidebar />

        {/* Main Content Area */}
        <div className="flex-1 bg-[rgba(222,236,225,0.19)] border border-[rgba(0,154,38,0.19)] rounded-[20px] p-8 flex flex-col justify-between">
          <div>
            {/* Header Panel */}
            <div className="flex items-end justify-between border-b border-[#029154] pb-2 mb-4">
              <h1 className="text-[24px] font-semibold text-[#005941]">
                Pengiriman
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

            {/* Filter & Search Bar */}
            <div className="flex items-center justify-between mb-6">
              {/* Input Search */}
              <div className="relative w-[371px] h-[42px]">
                <input
                  type="text"
                  placeholder="Cari Pengiriman..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full h-full bg-white border border-[#006638] rounded-[50px] pl-11 pr-4 text-[15px] text-[#006638] font-medium outline-none placeholder-[#006638]"
                />
                <img
                  src="/images/search.png"
                  alt="Search"
                  className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 object-contain"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/images/search.png";
                  }}
                />
              </div>

              {/* Status Dropdown Filter */}
              <div className="relative w-[153px] h-[42px]">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full h-full bg-white border border-[#024D70] rounded-[5px] px-3 pr-8 text-[16px] text-[#00378A] font-medium outline-none appearance-none cursor-pointer"
                >
                  <option value="Semua">Status</option>
                  <option value="Diproses">Diproses</option>
                  <option value="Dikirim">Dikirim</option>
                  <option value="Selesai">Selesai</option>
                </select>
                <img
                  src="/images/expand-down.png"
                  alt="Expand"
                  className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none object-contain"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/images/expand-down.png";
                  }}
                />
              </div>
            </div>

            {/* Main Table Area */}
            <div className="bg-white/50 border border-[#029154] rounded-[20px] p-6 shadow-[0_0_4px_rgba(0,0,0,0.25)]">
              {/* Table Header */}
              <div className="grid grid-cols-12 gap-2 pb-4 text-[#273B4A] font-bold text-[16px] text-center items-center border-b border-black/10">
                <div className="col-span-3">Invoice</div>
                <div className="col-span-2">Pembeli</div>
                <div className="col-span-2">Logistik</div>
                <div className="col-span-2">No Resi</div>
                <div className="col-span-2">Status</div>
                <div className="col-span-1">Aksi</div>
              </div>

              {/* Table Rows */}
              <div className="divide-y divide-black/10">
                {filteredData.map((item) => (
                  <div
                    key={item.id}
                    className="grid grid-cols-12 gap-2 py-5 text-center items-center text-[#273B4A] font-semibold text-[16px]"
                  >
                    <div className="col-span-3">{item.invoice}</div>
                    <div className="col-span-2">{item.pembeli}</div>
                    <div className="col-span-2">{item.logistik}</div>
                    <div className="col-span-2 text-[15px]">{item.noResi}</div>
                    <div className="col-span-2 flex justify-center">
                      {getStatusBadge(item.status)}
                    </div>
                    <div className="col-span-1 flex justify-center">
                      <button
                        onClick={() => handleOpenEdit(item)}
                        className="w-[40px] h-[40px] bg-white border border-[#0220E1] rounded-[5px] shadow-[0_0_3px_rgba(0,0,0,0.25)] flex items-center justify-center hover:bg-blue-50 transition"
                      >
                        <img
                          src="/images/edit.png"
                          alt="Edit"
                          className="w-5 h-5 object-contain"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "/images/edit.png";
                          }}
                        />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Table Footer / Pagination */}
              <div className="flex items-center justify-between pt-6 border-t border-black/10 mt-2">
                <span className="text-[16px] font-semibold text-black/50">
                  Menampilkan 1-5 dari 8 produk
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    className="p-2 hover:opacity-70 transition"
                  >
                    <img
                      src="/images/chevron-left.png"
                      alt="Previous"
                      className="w-4 h-4 object-contain opacity-50"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/images/chevron-left.png";
                      }}
                    />
                  </button>

                  <button
                    onClick={() => setCurrentPage(1)}
                    className={`w-[40px] h-[40px] rounded-[5px] text-[24px] font-semibold flex items-center justify-center ${
                      currentPage === 1
                        ? "bg-[#006638] text-white"
                        : "bg-white border border-[#006638] text-[#006638]"
                    }`}
                  >
                    1
                  </button>

                  <button
                    onClick={() => setCurrentPage(2)}
                    className={`w-[40px] h-[40px] rounded-[5px] text-[24px] font-semibold flex items-center justify-center ${
                      currentPage === 2
                        ? "bg-[#006638] text-white"
                        : "bg-white border border-[#006638] text-[#006638]"
                    }`}
                  >
                    2
                  </button>

                  <button
                    onClick={() => setCurrentPage((p) => Math.min(p + 1, 2))}
                    className="p-2 hover:opacity-70 transition"
                  >
                    <img
                      src="/images/chevron-right.png"
                      alt="Next"
                      className="w-4 h-4 object-contain opacity-50"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/images/chevron-right.png";
                      }}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL UPDATE PENGIRIMAN */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-[500px] rounded-[20px] p-6 shadow-2xl relative">
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-4 right-5 hover:opacity-70 transition"
            >
              <img
                src="/images/close.png"
                alt="Close"
                className="w-5 h-5 object-contain"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/images/close.png";
                }}
              />
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
                  value={selectedItem.invoice}
                  className="w-full bg-gray-100 border rounded-[8px] p-2.5 text-[14px] text-gray-600 font-medium cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-[14px] font-semibold text-[#273B4A] mb-1">
                  Nomor Resi
                </label>
                <input
                  type="text"
                  value={editForm.resi}
                  onChange={(e) =>
                    setEditForm({ ...editForm, resi: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-[8px] p-2.5 text-[14px] text-[#273B4A] font-semibold outline-none focus:border-[#006638]"
                />
              </div>

              <div>
                <label className="block text-[14px] font-semibold text-[#273B4A] mb-1">
                  Status Pengiriman
                </label>
                <select
                  value={editForm.status}
                  onChange={(e) =>
                    setEditForm({ ...editForm, status: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-[8px] p-2.5 text-[14px] text-[#273B4A] font-semibold outline-none focus:border-[#006638]"
                >
                  <option value="Diproses">Diproses</option>
                  <option value="Dikirim">Dikirim</option>
                  <option value="Selesai">Selesai</option>
                </select>
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setSelectedItem(null)}
                  className="px-4 py-2 border rounded-[8px] text-[14px] font-semibold text-gray-600 hover:bg-gray-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#006638] text-white rounded-[8px] text-[14px] font-semibold hover:bg-emerald-800 transition"
                >
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
