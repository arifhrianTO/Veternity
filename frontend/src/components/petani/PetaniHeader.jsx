import React from "react";

export default function PetaniHeader() {
  return (
    <header className="bg-gradient-to-r from-[#024D70] to-[#ABE147] rounded-2xl p-6 text-white flex items-center justify-between">
      <div>
        <p className="text-sm font-medium opacity-90">Halo, Selamat Datang</p>
        <h1 className="text-2xl font-bold">Budi Santoso!</h1>
        <p className="text-sm opacity-90">Kelola hasil panen dan tingkatkan pendapatan anda bersama TaniNelayan.</p>
      </div>

      <div className="flex items-center gap-4">
        <div className="bg-white rounded-full p-1">
          <img src="/images/ikan1.png" alt="avatar" className="w-12 h-12 rounded-full" />
        </div>
      </div>
    </header>
  );
}
