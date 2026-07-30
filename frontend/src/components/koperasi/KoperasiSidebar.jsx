import React from "react";
import { NavLink } from "react-router-dom";

export default function KoperasiSidebar() {
  const koperasiNav = [
    { to: "/koperasi/dashboard", label: "Dashboard", icon: "dashboards.png" },
    { to: "/koperasi/PetaniBinaan", label: "Petani Binaan", icon: "user.png" },
    { to: "/koperasi/nelayan-binaan", label: "Nelayan Binaan", icon: "user.png" },
    { to: "/koperasi/KelolaProduk", label: "Kelola Produk", icon: "shoppping-bag.png" },
    { to: "/koperasi/penawaran", label: "Penawaran", icon: "tag.png" },
    { to: "/koperasi/pengiriman", label: "Pengiriman", icon: "clipboard.png" },
    { to: "/koperasi/profil", label: "Profil", icon: "user.png" },
  ];

  return (
    <aside className="w-72 bg-white rounded-2xl p-6 flex-shrink-0 border border-slate-200">
      {/* Header Logo */}
      <div className="flex items-center gap-3 mb-6">
        <img src="/images/latar.png" alt="logo" className="w-10 h-10" />
        <div>
          <div className="text-lg font-bold text-[#006638] font-sans">TaniNelayan</div>
        </div>
      </div>

      {/* Profil Koperasi */}
      <div className="mb-6 flex items-center gap-3">
        <img src="/images/ikan1.png" alt="avatar" className="w-14 h-14 rounded-full border" />
        <div>
          <div className="font-semibold text-black">Koperasi Sejahtera</div>
          <div className="text-xs text-emerald-700 font-semibold">Koperasi</div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="space-y-3">
        {koperasiNav.map((n) => (
          <NavLink
            key={n.to}
            to={n.to}
            className={({ isActive }) =>
              `flex items-center gap-3 w-full text-left px-4 py-3 rounded-2xl font-semibold transition cursor-pointer select-none ${
                isActive
                  ? "bg-emerald-700 text-white"
                  : "text-slate-700 hover:bg-slate-50"
              }`
            }
          >
            {({ isActive }) => (
              <div className="flex items-center gap-3 pointer-events-none w-full">
                <div
                  className={`w-8 h-8 rounded flex items-center justify-center flex-shrink-0 ${
                    isActive ? "bg-white" : "bg-slate-100"
                  }`}
                >
                  {n.icon ? (
                    <img
                      src={`/images/${n.icon}`}
                      alt={n.label}
                      className="w-5 h-5 object-contain"
                    />
                  ) : (
                    <span className="text-sm">●</span>
                  )}
                </div>
                <span>{n.label}</span>
              </div>
            )}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}