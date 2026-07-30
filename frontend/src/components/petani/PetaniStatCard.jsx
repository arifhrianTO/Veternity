import React from "react";

export default function PetaniStatCard({ title, value, subtitle, icon: Icon, accent }) {
  return (
    <div className="rounded-xl border border-slate-100 bg-white p-4 flex items-center justify-between gap-4 shadow-sm hover:border-emerald-100 transition-colors">
      <div>
        <div className="text-xs text-slate-500 font-medium">{title}</div>
        <div className="text-xl font-bold text-slate-900 my-0.5">{value}</div>
        {subtitle && <div className="text-[11px] text-slate-400">{subtitle}</div>}
      </div>
      <div className={`w-14 h-14 rounded-full flex items-center justify-center shrink-0 text-white shadow-inner bg-gradient-to-br ${accent || 'from-slate-900 to-emerald-700'}`}>
        {Icon ? (
          <Icon className="w-6 h-6" />
        ) : (
          <span />
        )}
      </div>
    </div>
  );
}
