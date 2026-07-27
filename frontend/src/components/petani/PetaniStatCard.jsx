import React from "react";

export default function PetaniStatCard({ title, value, subtitle, icon: Icon, iconSrc, accent }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 flex items-center gap-4">
      <div className={`w-14 h-14 rounded-lg flex items-center justify-center text-white bg-gradient-to-br ${accent || 'from-slate-900 to-emerald-700'}`}>
        {iconSrc ? (
          <img src={iconSrc} alt={title} className="w-7 h-7 object-contain" />
        ) : Icon ? (
          <Icon className="w-6 h-6" />
        ) : (
          <span />
        )}
      </div>
      <div>
        <div className="text-sm text-slate-500">{title}</div>
        <div className="text-xl font-bold text-slate-900">{value}</div>
        <div className="text-xs text-slate-500">{subtitle}</div>
      </div>
    </div>
  );
}
