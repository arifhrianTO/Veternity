import { ArrowRight, ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Hero() {
  const navigate = useNavigate();
  return (
    <section className="max-w-7xl ml-auto pl-6 md:pl-12 grid grid-cols-1 md:grid-cols-12 gap-6 items-center overflow-hidden">
      
      <div className="md:col-span-5 py-12 md:py-20 pr-6 z-10">
        <h1 className="text-3xl sm:text-4xl font-extrabold leading-tight">
          <span className="text-emerald-700">Dari Bumi Dan Laut,</span> <br />
          <span className="text-[#0A2A6B]">Langsung Ketangan Konsumen.</span>
        </h1>
        <p className="mt-5 text-[#000000] font-normal leading-relaxed max-w-md">
          TaniNelayan adalah jembatan digital bagi petani dan nelayan Indonesia.
          Kelola hasil panen, pantau logistik, dan perluas jangkauan pasar
          dengan satu platform yang mudah digunakan.
        </p>
        <div className="mt-7 flex flex-wrap gap-4">
          <button
            onClick={() => navigate("/register")}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-l from-[#ABE147] via-[#017B46] to-[#024D70] text-white font-semibold hover:opacity-90 transition-opacity"
          >
            Mulai Sekarang <ArrowRight className="w-4 h-4" />
          </button>
          <button className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-slate-200 font-semibold text-slate-700 hover:border-emerald-600 hover:text-emerald-700 transition-colors">
            Jelajahi Produk <ShoppingBag className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="md:col-span-7 relative w-full h-full min-h-[380px] md:min-h-[520px] flex items-end justify-end">
        
        <img
          src="/images/latar.png"
          alt="Petani Nelayan"
          className="relative z-10 w-full h-full object-cover object-right-bottom"
        />

        <img
          src="/images/blur.png"
          alt="Blur Effect"
          className="absolute inset-0 z-20 w-full h-full object-cover pointer-events-none opacity-90"
        />

        <div className="absolute inset-0 z-30 pointer-events-none bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-white via-white/40 to-transparent" />
        
      </div>
    </section>
  );
}