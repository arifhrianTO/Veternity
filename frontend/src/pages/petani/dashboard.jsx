import React from "react";
import PetaniSidebar from "../../components/petani/PetaniSidebar";
import PetaniStatCard from "../../components/petani/PetaniStatCard";
import PetaniOffers from "../../components/petani/PetaniOffers";
import PetaniOrders from "../../components/petani/PetaniOrders";
import { dashboardMetrics, latestOffers, latestOrders } from "../../data/petaniData";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-white font-[Montserrat] text-slate-900">
      <div className="flex max-w-[1440px] mx-auto py-8 gap-6 px-4">
        <PetaniSidebar />

        {/* Outer Container Wrapper */}
        <div className="flex-1 bg-[rgba(222,236,225,0.19)] border border-[rgba(0,154,38,0.19)] rounded-[20px] p-8 min-h-[971px] relative">
          
          {/* Top Header */}
          <div className="flex items-center justify-between border-b border-[#029154] pb-6 mb-6">
            <div>
              <h2 className="text-[24px] font-semibold text-[#005941]">Dashboard Petani</h2>
              <p className="text-[14px] text-slate-500">Ringkasan aktivitas dan performa penjualan Anda</p>
            </div>
            <div className="flex items-center gap-4">
              <img 
                src="/images/ikan1.png" 
                alt="avatar" 
                className="w-14 h-14 rounded-full border border-slate-100 object-cover" 
              />
            </div>
          </div>

          {/* Banner Halo Selamat Datang */}
          <div className="mb-6 rounded-[20px] bg-gradient-to-r from-[#005941] via-[#008A1E] to-[#8AD035] p-6 text-white flex items-center justify-between overflow-hidden relative shadow-sm">
            <div className="z-10 max-w-[60%]">
              <p className="text-[15px] font-medium opacity-90">Halo, Selamat Datang</p>
              <h1 className="text-[28px] font-bold mt-1 mb-2 leading-tight">Budi Santoso!</h1>
              <p className="text-[14px] opacity-80 leading-relaxed">
                Kelola hasil panen dan tingkatkan pendapatan anda bersama TaniNelayan.
              </p>
            </div>
            
            {/* Karakter / Ilustrasi Petani */}
            <div className="absolute right-4 bottom-0 h-full flex items-end pointer-events-none">
              <img 
                src="/images/petani-banner.png" 
                alt="Petani Banner" 
                className="h-[120%] object-contain object-bottom"
                onError={(e) => {
                  // Fallback jika file gambar belum ada
                  e.target.style.display = 'none';
                }}
              />
            </div>
          </div>

          {/* Stat Cards Container */}
          <div className="bg-white/50 border border-[#029154] shadow-[0_0_4px_rgba(0,0,0,0.25)] rounded-[20px] p-6 mb-6">
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              {dashboardMetrics.map((m) => (
                <PetaniStatCard key={m.title} {...m} />
              ))}
            </div>
          </div>

          {/* Offers & Orders Grid Section */}
          <div className="grid gap-6 lg:grid-cols-2">
            <PetaniOffers offers={latestOffers} />
            <PetaniOrders orders={latestOrders} />
          </div>

        </div>
      </div>
    </div>
  );
}