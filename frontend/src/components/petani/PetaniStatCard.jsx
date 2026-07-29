import React from "react";

export default function PetaniStatCard({ title, value, subtitle, icon: Icon, iconSrc, accent }) {
  return (
    <div className="rounded-xl border border-slate-100 bg-white p-4 flex items-center gap-4 shadow-sm">
      <div className={`w-14 h-14 rounded-xl flex items-center justify-center shrink-0 text-white bg-gradient-to-br ${accent || 'from-slate-900 to-emerald-700'}`}>
        {iconSrc ? (
          <img src={iconSrc} alt={title} className="w-7 h-7 object-contain" />
        ) : Icon ? (
          <Icon className="w-6 h-6" />
        ) : (
          <span />
        )}
      </div>
      <div>
        <div className="text-xs text-slate-500 font-medium">{title}</div>
        <div className="text-xl font-bold text-slate-900 my-0.5">{value}</div>
        <div className="text-[11px] text-slate-400">{subtitle}</div>
      </div>
    </div>
  );
}