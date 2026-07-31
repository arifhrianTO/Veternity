import { Phone, Mail, MapPin } from "lucide-react";
import { Logo } from "./Header";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-[#ABE147] via-[#017B46] to-[#024D70] text-emerald-50">
      <div className="max-w-7xl mx-auto px-6 py-12 grid sm:grid-cols-3 gap-10">
        <div className="sm:pr-10">
          <div className="flex items-center gap-2 mb-3">
            <Logo className="w-9 h-9" />
            <span className="font-bold text-lg text-white">TaniNelayan</span>
          </div>
          <p className="text-sm text-white/80 max-w-xs">
            Platform digital untuk distribusi dan pendampingan petani serta
            nelayan Indonesia.
          </p>
        </div>
        <div className="sm:border-l sm:border-white/30 sm:pl-10 sm:pr-10">
          <h4 className="font-bold text-white mb-3">Navigasi</h4>
          <ul className="space-y-2 text-sm text-white/80">
            <li>
              <a href="#" className="hover:text-white">
                Beranda
              </a>
            </li>
            <li>
              <a href="#produk" className="hover:text-white">
                Produk
              </a>
            </li>
            <li>
              <a href="#koperasi" className="hover:text-white">
                Koperasi
              </a>
            </li>
          </ul>
        </div>
        <div className="sm:border-l sm:border-white/30 sm:pl-10">
          <h4 className="font-bold text-white mb-3">Kontak</h4>
          <ul className="space-y-3 text-sm text-white/80">
            <li className="flex items-center gap-2">
              <Phone className="w-4 h-4" /> 0852-7414-2805
            </li>
            <li className="flex items-center gap-2">
              <Mail className="w-4 h-4" /> TaniNelayan@gmail.com
            </li>
            <li className="flex items-start gap-2">
              <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
              <span>
                Jl. Ahmad Yani, Tlk. Tering, Kec. Batam Kota, Kota Batam,
                Kepulauan Riau 29461
              </span>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/20 py-4 text-center text-xs text-white/70 bg-[#00378A]">
        ©2026 TaniNelayan. All Right Reserve
      </div>
    </footer>
  );
}
