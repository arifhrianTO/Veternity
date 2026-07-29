import React from "react";
import { NavLink } from "react-router-dom";

export default function AdminSidebar() {
  const adminNav = [
    { to: "/admin/dashboard", label: "Dashboard", icon: "dashboards.png" },
    { to: "/admin/pengguna", label: "Pengguna", icon: "user.png" },
    { to: "/admin/kategori", label: "Kategori", icon: "tag.png" },
    { to: "/admin/logistik", label: "Logistik", icon: "clipboard.png" },
    { to: "/admin/monitoring", label: "Monitoring", icon: "shoppping-bag.png" },
    { to: "/admin/profil", label: "Profil", icon: "user.png" },
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

      {/* Profil Admin */}
      <div className="mb-6 flex items-center gap-3">
        <img src="/images/ikan1.png" alt="avatar" className="w-14 h-14 rounded-full border" />
        <div>
          <div className="font-semibold text-black">Admin</div>
          <div className="text-xs text-emerald-700 font-semibold">Admin</div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="space-y-3">
        {adminNav.map((n) => (
          <NavLink
            key={n.to}
            to={n.to}
            className={({ isActive }) =>
              `flex items-center gap-3 w-full text-left px-4 py-3 rounded-2xl font-semibold transition ${
                isActive
                  ? "bg-emerald-700 text-white"
                  : "text-slate-700 hover:bg-slate-50"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div
                  className={`w-8 h-8 rounded flex items-center justify-center ${
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
                {n.label}
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}