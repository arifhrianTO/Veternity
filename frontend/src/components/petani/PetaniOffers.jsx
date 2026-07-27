import React from "react";
import PetaniStatusBadge from "./PetaniStatusBadge";

export default function PetaniOffers({ offers = [] }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold">Penawaran Terbaru</h3>
        <button className="text-sm text-emerald-700 font-semibold">Lihat semua+</button>
      </div>
      <div className="space-y-4">
        {offers.map((o) => (
          <div key={o.id} className="flex items-center gap-4 p-3 rounded-lg border border-slate-100">
            <img src={`/images/${(o.product||'beras').toLowerCase().split(' ')[0]}.png`} alt="prod" className="w-16 h-12 object-cover rounded" />
            <div className="flex-1">
              <div className="font-semibold text-slate-900">{o.buyer}</div>
              <div className="text-sm text-slate-500">{o.product} • {o.quantity}</div>
            </div>
            <div className="text-right">
              <div className="text-sm text-slate-500">{o.date}</div>
              <div className="mt-1 font-semibold text-slate-900">{o.offerPrice || o.price}</div>
            </div>
            <div className="pl-4">
              <PetaniStatusBadge variant={o.statusVariant || 'emerald'}>{o.status}</PetaniStatusBadge>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4">
        <button className="w-full rounded-lg border border-emerald-600 text-emerald-700 py-2 font-semibold">Lihat semua Penawaran</button>
      </div>
    </div>
  );
}
