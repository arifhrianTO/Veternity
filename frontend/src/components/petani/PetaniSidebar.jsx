import React from "react";
import { NavLink, useLocation } from "react-router-dom";

export default function PetaniSidebar() {
  const location = useLocation();
  const isPembeli = location.pathname.startsWith("/pembeli");

  const petaniNav = [
    { to: "/petani/dashboard", label: "Dashboard", icon: "dashboards.png" },
    { to: "/petani/produk", label: "Produk Saya", icon: "shoppping-bag.png" },
    { to: "/petani/pesanan", label: "Pesanan", icon: "clipboard.png" },
    { to: "/petani/penawaran", label: "Penawaran", icon: "tag.png" },
    { to: "/petani/profil", label: "Profil", icon: "user.png" },
  ];

  const pembeliNav = [
    { to: "/pembeli/marketplace", label: "MarketPlace", icon: "shoppping-bag.png" },
    { to: "/pembeli/keranjang", label: "Keranjang", icon: "clipboard.png" },
    { to: "/pembeli/pesanan", label: "Pesanan Saya", icon: "tag.png" },
    { to: "/pembeli/profil", label: "Profil", icon: "user.png" },
  ];

  const nav = isPembeli ? pembeliNav : petaniNav;
  const userRole = isPembeli ? "Pembeli" : "Petani";
  const userName = isPembeli ? "Budi santoso" : "Budi santoso";

  return (
    <aside className="w-72 bg-white rounded-2xl p-6 flex-shrink-0 border border-slate-200">
      <div className="flex items-center gap-3 mb-6">
        <img src="/images/latar.png" alt="logo" className="w-10 h-10" />
        <div>
          <div className="text-lg font-bold text-[#006638] font-sans">TaniNelayan</div>
        </div>
      </div>

      <div className="mb-6 flex items-center gap-3">
        <img src="/images/ikan1.png" alt="avatar" className="w-14 h-14 rounded-full border" />
        <div>
          <div className="font-semibold text-black">{userName}</div>
          {isPembeli ? (
            <div className="bg-[rgba(220,136,0,0.23)] border border-[#AC6A00] text-[#A26400] rounded-[4px] px-2 py-0.5 text-xs font-semibold w-fit mt-1">
              {userRole}
            </div>
          ) : (
            <div className="text-xs text-emerald-700 font-semibold">{userRole}</div>
          )}
        </div>
      </div>

      <nav className="space-y-3">
        {nav.map((n) => (
          <NavLink
            key={n.to}
            to={n.to}
            className={({ isActive }) => {
              if (isPembeli) {
                return `flex items-center gap-3 w-full text-left px-4 py-3 rounded-[50px] font-semibold transition ${
                  isActive
                    ? "bg-gradient-to-r from-[#024D70] to-[#029255] text-white"
                    : "text-[#006638] hover:bg-slate-50"
                }`;
              }
              return `flex items-center gap-3 w-full text-left px-4 py-3 rounded-2xl font-semibold transition ${
                isActive ? "bg-emerald-700 text-white" : "text-slate-700 hover:bg-slate-50"
              }`;
            }}
          >
            {({ isActive }) => (
              <>
                <div className={`w-8 h-8 rounded flex items-center justify-center ${isActive ? 'bg-white' : 'bg-slate-100'}`}>
                  {n.icon ? (
                    <img src={`/images/${n.icon}`} alt={n.label} className="w-5 h-5 object-contain" />
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
