import React from "react";
import PetaniStatusBadge from "./PetaniStatusBadge";

export default function PetaniOrders({ orders = [] }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold">Pesanan Terbaru</h3>
        <button className="text-sm text-emerald-700 font-semibold">Lihat semua+</button>
      </div>

      <div className="space-y-3">
        <div className="hidden md:grid grid-cols-4 gap-4 text-slate-500 font-semibold mb-2">
          <div>No pesanan</div>
          <div>Produk</div>
          <div>Jumlah</div>
          <div className="text-right">Status</div>
        </div>

        {orders.map((o) => (
          <div key={o.id} className="grid grid-cols-4 gap-4 items-center p-3 rounded-lg border border-slate-100">
            <div className="font-semibold">{o.id}</div>
            <div className="flex items-center gap-3">
              <img src={`/images/${(o.product||'beras').toLowerCase().split(' ')[0]}.png`} alt="prod" className="w-12 h-10 object-cover rounded" />
              <div>{o.product}</div>
            </div>
            <div>{o.quantity}</div>
            <div className="flex justify-end">
              <PetaniStatusBadge variant={o.statusVariant || 'emerald'}>{o.status}</PetaniStatusBadge>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4">
        <button className="w-full rounded-lg border border-emerald-600 text-emerald-700 py-2 font-semibold">Lihat semua Pesanan</button>
      </div>
    </div>
  );
}
