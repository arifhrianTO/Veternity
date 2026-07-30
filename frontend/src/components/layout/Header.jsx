import React from "react";
import { Leaf } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

export function Logo({ className = "w-8 h-8" }) {
  return (
    <div className={`${className} rounded-full bg-emerald-700 flex items-center justify-center shrink-0`}>
      <Leaf className="w-4 h-4 text-white" />
    </div>
  );
}

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  const scrollToSection = (e, id) => {
    e.preventDefault();
    // Jika sedang tidak di halaman utama, navigasi ke landing page dulu
    if (location.pathname !== "/") {
      navigate("/");
      return;
    }
    if (id === "beranda") {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } else {
      const element = document.getElementById(id);
      if (element) {
        const offset = 80;
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = element.getBoundingClientRect().top;
        const elementPosition = elementRect - bodyRect;
        const offsetPosition = elementPosition - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-[#F8F7F4]/95 backdrop-blur border-b border-slate-200/60">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <a href="#" onClick={(e) => scrollToSection(e, "beranda")} className="flex items-center gap-2">
          <Logo />
          <span className="font-bold text-lg">
            <span className="text-slate-900">Tani</span>
            <span className="text-emerald-700">Nelayan</span>
          </span>
        </a>
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-700">
          <a
            href="#"
            onClick={(e) => scrollToSection(e, "beranda")}
            className="hover:text-emerald-700 transition-colors"
          >
            Beranda
          </a>
          <a
            href="#produk"
            onClick={(e) => scrollToSection(e, "produk")}
            className="hover:text-emerald-700 transition-colors"
          >
            Produk
          </a>
          <a
            href="#koperasi"
            onClick={(e) => scrollToSection(e, "koperasi")}
            className="hover:text-emerald-700 transition-colors"
          >
            Koperasi
          </a>
        </nav>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/login")}
            className="hidden sm:inline-flex px-5 py-2 rounded-lg border border-slate-200 text-sm font-semibold text-slate-700 hover:border-emerald-600 hover:text-emerald-700 transition-colors"
          >
            Masuk
          </button>
          <button
            onClick={() => navigate("/register")}
            className="px-5 py-2 rounded-lg bg-gradient-to-r from-[#ABE147] via-[#017B46] to-[#024D70] text-sm font-semibold text-white hover:opacity-90 transition-opacity"
          >
            Daftar
          </button>
        </div>
      </div>
    </header>
  );
}
