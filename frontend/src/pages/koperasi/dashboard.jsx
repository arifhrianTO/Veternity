import React from "react";
import Sidebar from "../../components/layout/Sidebar";
import { Wheat, Fish, ShoppingBag, Wallet } from "lucide-react";

export default function KoperasiDashboard() {
  // Dummy data penjualan terbaik menggunakan path lokal /images/beras.png
  const bestSellers = [
    { id: 1, name: "Beras Premium", weight: "50 kg", image: "/images/beras.png" },
    { id: 2, name: "Beras Premium", weight: "50 kg", image: "/images/beras.png" },
    { id: 3, name: "Beras Premium", weight: "50 kg", image: "/images/beras.png" },
    { id: 4, name: "Beras Premium", weight: "50 kg", image: "/images/beras.png" },
    { id: 5, name: "Beras Premium", weight: "50 kg", image: "/images/beras.png" },
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
            <h1 className="text-[24px] font-semibold text-[#005941]">Dashboard</h1>
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

          {/* Banner Welcome Card */}
          <div className="relative w-full h-[158px] bg-gradient-to-r from-[#024D70] via-[#017B46] to-[#ABE147] rounded-[20px] p-6 text-white flex justify-between items-center overflow-hidden mb-6 shadow-sm">
            <div className="z-10">
              <h3 className="text-[20px] font-semibold leading-tight">
                Halo, Selamat Datang
              </h3>
              <h2 className="text-[32px] font-bold leading-tight my-1">
                Koperasi Sejahtera!
              </h2>
              <p className="text-[15px] font-medium text-white/80 max-w-[420px]">
                Kelola produk petani dan nelayan binaan bersama TaniNelayan.
              </p>
            </div>
            
            {/* Background Graphic Asset */}
            <div className="hidden md:block w-48 h-48 -mr-4 -mb-8">
              <img 
                src="/images/koperasi-banner-icon.png" 
                alt="Illustration" 
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.style.display = 'none';
                }}
              />
            </div>
          </div>

          {/* Stat Cards Grid (4 Cards) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            
            {/* Card 1: Petani Binaan */}
            <div className="bg-white p-5 rounded-[20px] shadow-[0_0_4px_rgba(0,0,0,0.25)] flex justify-between items-center h-[152px]">
              <div className="flex flex-col justify-between h-full">
                <span className="text-[16px] font-medium text-[#004734]/60">
                  Petani binaan
                </span>
                <span className="text-[20px] font-bold text-[#273B4A]">
                  25
                </span>
                <span className="text-[16px] font-medium text-[#004734]/60">
                  Total petani binaan
                </span>
              </div>
              <div className="w-[70px] h-[70px] rounded-full bg-gradient-to-b from-[#029154] to-[#00B467] flex items-center justify-center text-white shadow-md">
                <Wheat className="w-9 h-9" />
              </div>
            </div>

            {/* Card 2: Nelayan Binaan */}
            <div className="bg-white p-5 rounded-[20px] shadow-[0_0_4px_rgba(0,0,0,0.25)] flex justify-between items-center h-[152px]">
              <div className="flex flex-col justify-between h-full">
                <span className="text-[16px] font-medium text-[#004734]/60">
                  Nelayan binaan
                </span>
                <span className="text-[20px] font-bold text-[#273B4A]">
                  19
                </span>
                <span className="text-[16px] font-medium text-[#004734]/60">
                  Total nelayan binaan
                </span>
              </div>
              <div className="w-[70px] h-[70px] rounded-full bg-gradient-to-b from-[#028391] to-[#00B1B4] flex items-center justify-center text-white shadow-md">
                <Fish className="w-9 h-9" />
              </div>
            </div>

            {/* Card 3: Produk Aktif */}
            <div className="bg-white p-5 rounded-[20px] shadow-[0_0_4px_rgba(0,0,0,0.25)] flex justify-between items-center h-[152px]">
              <div className="flex flex-col justify-between h-full">
                <span className="text-[16px] font-medium text-[#004734]/60">
                  Produk Aktif
                </span>
                <span className="text-[20px] font-bold text-[#273B4A]">
                  5
                </span>
                <span className="text-[16px] font-medium text-[#004734]/60">
                  Produk
                </span>
              </div>
              <div className="w-[70px] h-[70px] rounded-full bg-gradient-to-b from-[#FF7700] to-[#FFB619] flex items-center justify-center text-white shadow-md">
                <ShoppingBag className="w-9 h-9" />
              </div>
            </div>

            {/* Card 4: Total Penjualan */}
            <div className="bg-white p-5 rounded-[20px] shadow-[0_0_4px_rgba(0,0,0,0.25)] flex justify-between items-center h-[152px]">
              <div className="flex flex-col justify-between h-full">
                <span className="text-[16px] font-medium text-[#004734]/60">
                  Total Penjualan
                </span>
                <span className="text-[20px] font-bold text-[#273B4A]">
                  Rp. 4.000.000
                </span>
                <span className="text-[16px] font-medium text-[#004734]/60">
                  Total bulan ini
                </span>
              </div>
              <div className="w-[70px] h-[70px] rounded-full bg-gradient-to-b from-[#0646C7] to-[#001FEC] flex items-center justify-center text-white shadow-md">
                <Wallet className="w-9 h-9" />
              </div>
            </div>

          </div>

          {/* Section Bawah: Grafik & Penjualan Terbaik */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Grafik Penjualan Panel */}
            <div className="lg:col-span-8 bg-white border border-[#029154] rounded-[20px] p-6 h-[473px]">
              <h2 className="text-[20px] font-semibold text-[#005941] mb-4">
                Grafik penjualan
              </h2>
            </div>

            {/* Penjualan Terbaik Panel */}
            <div className="lg:col-span-4 bg-white border border-[#029154] rounded-[20px] p-6 h-[473px] overflow-y-auto">
              <h2 className="text-[20px] font-semibold text-[#005941] mb-4">
                Penjualan terbaik
              </h2>
              <div className="space-y-4">
                {bestSellers.map((item, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-[98px] h-[65px] object-cover rounded-[5px] border border-slate-100"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/images/beras.png";
                      }}
                    />
                    <div className="flex flex-col">
                      <span className="font-semibold text-[16px] text-[#273B4A]">
                        {item.name}
                      </span>
                      <span className="font-semibold text-[16px] text-black/40">
                        {item.weight}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
