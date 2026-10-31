import { useEffect, useRef, useState } from "react";
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  ShoppingBag,
  ShoppingCart,
  ClipboardList,
  Tag,
  User,
  LogOut,
  Menu,
  X,
  ChevronDown,
} from "lucide-react";
import NotificationBell from "../common/NotificationBell";
import { useUser } from "../../hooks/useUser";
import { useCartCount } from "../../hooks/useCartCount";
import { storageUrl } from "../../config/storage";
import api from "../../config/axios";

const navItems = [
  { to: "/pembeli/marketplace", label: "Katalog Produk", icon: ShoppingBag },
  { to: "/pembeli/pesanan", label: "Pesanan Saya", icon: ClipboardList },
  { to: "/pembeli/penawaran", label: "Penawaran Saya", icon: Tag },
];

export default function PembeliLayout() {
  const user = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const { count: cartCount, refresh: refreshCart } = useCartCount();

  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    refreshCart();
  }, [location.pathname, refreshCart]);

  const closeMenus = () => {
    setIsMobileOpen(false);
    setIsProfileOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await api.post("/logout");
    } catch {
      // abaikan error jaringan, tetap bersihkan sesi lokal
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      sessionStorage.removeItem("current_user");
      sessionStorage.removeItem("guard_user");
      navigate("/login");
    }
  };

  const avatar = storageUrl(user?.foto_profil, "/images/user.png");

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
      isActive
        ? "bg-[#006638] text-white"
        : "text-[#273B4A] hover:bg-emerald-50 hover:text-[#006638]"
    }`;

  return (
    <div className="min-h-screen bg-[#F8F7F4] font-['Montserrat'] text-slate-900 flex flex-col">
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200/70">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Brand */}
          <Link to="/pembeli/marketplace" onClick={closeMenus} className="flex items-center gap-2 shrink-0">
            <img src="/images/jala.png" alt="JALA" className="w-8 h-8 object-contain" />
            <span className="font-bold text-lg text-emerald-700">JALA</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <NavLink key={item.to} to={item.to} onClick={closeMenus} className={navLinkClass}>
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              to="/pembeli/keranjang"
              onClick={closeMenus}
              className="relative w-10 h-10 flex items-center justify-center rounded-full bg-white border border-slate-200 hover:bg-slate-50 transition text-[#273B4A]"
              title="Keranjang"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </Link>

            <NotificationBell />

            {/* Profile dropdown */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setIsProfileOpen((v) => !v)}
                className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-full hover:bg-slate-100 transition"
              >
                <img
                  src={avatar}
                  alt="avatar"
                  className="w-9 h-9 rounded-full border border-slate-200 object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/images/user.png";
                  }}
                />
                <span className="hidden lg:block max-w-[120px] truncate text-sm font-semibold text-[#273B4A]">
                  {user?.nama_lengkap || "Pembeli"}
                </span>
                <ChevronDown className="hidden lg:block w-4 h-4 text-slate-400" />
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 top-12 w-56 bg-white rounded-[14px] shadow-[0_8px_30px_rgba(0,0,0,0.18)] border border-slate-200 overflow-hidden z-50">
                  <div className="px-4 py-3 border-b border-slate-100">
                    <div className="text-sm font-bold text-[#273B4A] truncate">
                      {user?.nama_lengkap || "Pembeli"}
                    </div>
                    <div className="mt-0.5 inline-block bg-[#FFD469]/20 border border-[#956100] text-[#DC8800] rounded-[4px] px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                      Pembeli
                    </div>
                  </div>
                  <Link
                    to="/pembeli/profil"
                    className="flex items-center gap-2 px-4 py-3 text-sm font-semibold text-[#273B4A] hover:bg-emerald-50 transition"
                    onClick={closeMenus}
                  >
                    <User className="w-4 h-4" /> Profil Saya
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-3 text-sm font-semibold text-red-600 hover:bg-red-50 transition"
                  >
                    <LogOut className="w-4 h-4" /> Keluar
                  </button>
                </div>
              )}
            </div>

            {/* Mobile toggle */}
            <button
              onClick={() => setIsMobileOpen((v) => !v)}
              className="md:hidden w-10 h-10 flex items-center justify-center rounded-full bg-white border border-slate-200 hover:bg-slate-50 transition text-[#273B4A]"
              title="Menu"
            >
              {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        {isMobileOpen && (
          <nav className="md:hidden border-t border-slate-100 bg-white px-4 py-3 space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={closeMenus}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                    isActive
                      ? "bg-[#006638] text-white"
                      : "text-[#273B4A] hover:bg-emerald-50"
                  }`
                }
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </NavLink>
            ))}
            <NavLink
              to="/pembeli/profil"
              onClick={closeMenus}
              className={({ isActive }) =>
                `flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                  isActive
                    ? "bg-[#006638] text-white"
                    : "text-[#273B4A] hover:bg-emerald-50"
                }`
              }
            >
              <User className="w-4 h-4" /> Profil Saya
            </NavLink>
          </nav>
        )}
      </header>

      <main className="flex-1 w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Outlet />
      </main>
    </div>
  );
}