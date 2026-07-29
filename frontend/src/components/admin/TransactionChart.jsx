import React from "react";

export default function TransactionChart() {
  return (
    <div className="w-full h-[320px] bg-emerald-50/50 rounded-xl border border-dashed border-emerald-300 flex flex-col items-center justify-center text-emerald-800 p-4">
      <svg className="w-12 h-12 mb-2 text-emerald-500 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
      </svg>
      <p className="font-semibold text-sm">Grafik Transaksi Admin</p>
      <p className="text-xs text-emerald-600 mt-1">Integrasikan dengan Recharts / Chart.js di sini</p>
    </div>
  );
}