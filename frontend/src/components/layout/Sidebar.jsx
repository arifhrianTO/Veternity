import React from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  Users, 
  ShoppingBag, 
  Tag, 
  ClipboardList,
  LogOut
} from "lucide-react";

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname;

  // Determine Actor based on URL path
  let actor = "Petani"; // default fallback
  if (path.startsWith("/admin")) actor = "Admin";
  else if (path.startsWith("/koperasi")) actor = "Koperasi";
  else if (path.startsWith("/pembeli")) actor = "Pembeli";
  else if (path.startsWith("/nelayan")) actor = "Nelayan";

  // Navigation Data
  const navigations = {
    Admin: [
      { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { to: "/admin/pengguna", label: "Pengguna", icon: Users },
      { to: "/admin/kategori", label: "Kategori", icon: Tag },
      { to: "/admin/logistik", label: "Logistik", icon: ClipboardList },
      { to: "/admin/monitoring", label: "Monitoring", icon: ShoppingBag },
      { to: "/admin/profil", label: "Profil", icon: Users },
    ],
    Koperasi: [
      { to: "/koperasi/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { to: "/koperasi/PetaniBinaan", label: "Petani Binaan", icon: Users },
      { to: "/koperasi/nelayan-binaan", label: "Nelayan Binaan", icon: Users },
      { to: "/koperasi/KelolaProduk", label: "Kelola Produk", icon: ShoppingBag },
      { to: "/koperasi/penawaran", label: "Penawaran", icon: Tag },
      { to: "/koperasi/pengiriman", label: "Pengiriman", icon: ClipboardList },
      { to: "/koperasi/profil", label: "Profil", icon: Users },
    ],
    Petani: [
      { to: "/petani/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { to: "/petani/produk", label: "Produk Saya", icon: ShoppingBag },
      { to: "/petani/pesanan", label: "Pesanan", icon: ClipboardList },
      { to: "/petani/penawaran", label: "Penawaran", icon: Tag },
      { to: "/petani/profil", label: "Profil", icon: Users },
    ],
    Nelayan: [
      { to: "/nelayan/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { to: "/nelayan/produk", label: "Produk Saya", icon: ShoppingBag },
      { to: "/nelayan/pesanan", label: "Pesanan", icon: ClipboardList },
      { to: "/nelayan/penawaran", label: "Penawaran", icon: Tag },
      { to: "/nelayan/profil", label: "Profil", icon: Users },
    ],
    Pembeli: [
      { to: "/pembeli/marketplace", label: "Katalog Produk", icon: ShoppingBag },
      { to: "/pembeli/keranjang", label: "Keranjang", icon: ClipboardList },
      { to: "/pembeli/pesanan", label: "Pesanan Saya", icon: Tag },
      { to: "/pembeli/profil", label: "Profil", icon: Users },
    ],
  };

  const navList = navigations[actor];

  // User Profile Data
  const profiles = {
    Admin: { name: "Admin", roleDisplay: "Admin", avatar: "/images/ikan1.png" },
    Koperasi: { name: "Koperasi Sejahtera", roleDisplay: "Koperasi", avatar: "/images/ikan1.png" },
    Petani: { name: "Budi santoso", roleDisplay: "Petani", avatar: "/images/ikan1.png" },
    Nelayan: { name: "Budi santoso", roleDisplay: "Nelayan", avatar: "/images/ikan1.png" },
    Pembeli: { name: "PT Sejahtera", roleDisplay: "Pembeli", avatar: "/images/ikan1.png" },
  };

  const profile = profiles[actor];

  const handleLogout = () => {
    // Clear user data (customize as needed depending on where token is saved)
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    // Redirect to login
    navigate("/login");
  };

  return (
    <aside className="w-72 bg-white flex flex-col p-6 flex-shrink-0 shadow-[4px_0_10px_rgba(0,0,0,0.03)] fixed top-0 left-0 h-screen z-50 font-['Montserrat']">
      
      {/* Hide Scrollbar Style */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { display: none; }
        .custom-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* Profile Section */}
      <div className="mb-6 flex items-center gap-3">
        <img src={profile.avatar} alt="avatar" className="w-12 h-12 rounded-full border border-slate-200 object-cover" />
        <div className="min-w-0 flex-1">
          <div className="text-sm font-bold text-[#273B4A] truncate">{profile.name}</div>
          
          {actor === "Pembeli" ? (
             <div className="bg-[#FFD469]/20 border border-[#956100] text-[#DC8800] rounded-[4px] px-1.5 py-0.5 text-[11px] font-bold w-fit mt-0.5 inline-block uppercase tracking-wider">
               {profile.roleDisplay}
             </div>
          ) : (
            <div className="text-[11px] text-[#006638] font-bold uppercase tracking-wider mt-0.5">{profile.roleDisplay}</div>
          )}
        </div>
      </div>

      {/* Navigation Menu (Scrollable if needed) */}
      <nav className="flex-1 overflow-y-auto custom-scrollbar space-y-1.5">
        {navList.map((n) => {
          const Icon = n.icon;
          return (
            <NavLink
              key={n.to}
              to={n.to}
              className={({ isActive }) => {
                const baseClasses = "flex items-center gap-3 w-full text-left px-3.5 py-3 text-sm font-semibold transition-all duration-200 select-none group";
                
                if (actor === "Pembeli") {
                  return `${baseClasses} rounded-[50px] ${
                    isActive
                      ? "bg-gradient-to-r from-[#024D70] to-[#029255] text-white shadow-sm"
                      : "text-[#006638] hover:bg-emerald-50"
                  }`;
                }
                
                // For Admin, Koperasi, Petani
                return `${baseClasses} rounded-[14px] ${
                  isActive
                    ? "bg-[#006638] text-white shadow-sm"
                    : "text-[#273B4A] hover:bg-emerald-50 hover:text-[#006638]"
                }`;
              }}
            >
              {({ isActive }) => (
                <>
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors duration-200 ${
                      isActive ? "bg-white/20" : "bg-slate-100 group-hover:bg-white"
                    }`}
                  >
                    <Icon 
                      className={`w-4 h-4 ${
                        isActive ? "text-white" : "text-[#006638]"
                      }`} 
                      strokeWidth={isActive ? 2.5 : 2}
                    />
                  </div>
                  <span className="truncate">{n.label}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom Action: Logout */}
      <div className="mt-auto pt-6 border-t border-slate-100">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full text-left px-3.5 py-3 text-sm font-semibold text-red-500 hover:bg-red-50 hover:text-red-600 rounded-[14px] transition-all duration-200 select-none group"
        >
          <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 bg-red-50 group-hover:bg-red-100 transition-colors duration-200">
            <LogOut className="w-4 h-4" strokeWidth={2.5} />
          </div>
          <span>Keluar</span>
        </button>
      </div>

    </aside>
  );
}
