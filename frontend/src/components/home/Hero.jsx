import { ArrowRight, ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Hero() {
  const navigate = useNavigate();

  const scrollToProduk = () => {
    const element = document.getElementById("produk");
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
  };

  return (
    <section className="relative w-full overflow-hidden bg-slate-950">
      {/* Background Image */}
      <img
        src="/images/latarterbaru.jpg"
        alt="Latar Belakang Petani dan Nelayan JALA"
        className="absolute inset-0 w-full h-full object-cover object-center filter brightness-75 contrast-105"
      />

      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-900/75 to-slate-950/40" />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/30" />

      {/* Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 sm:py-24 md:py-32">
        {/* Headline */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight text-white max-w-3xl">
          <span className="text-emerald-400">Dari Bumi Dan Laut,</span> <br />
          <span className="text-white drop-shadow-sm">Langsung Ketangan Konsumen.</span>
        </h1>

        {/* Subtitle / Description */}
        <p className="mt-5 text-slate-200 text-sm sm:text-base md:text-lg leading-relaxed max-w-2xl font-normal drop-shadow">
          JALA adalah jembatan digital bagi petani dan nelayan Indonesia.
          Kelola hasil panen, pantau logistik, dan perluas jangkauan pasar
          dengan satu platform yang mudah digunakan.
        </p>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <button
            onClick={() => navigate("/register")}
            className="inline-flex items-center gap-2.5 px-6 sm:px-7 py-3 sm:py-3.5 rounded-xl bg-gradient-to-r from-[#ABE147] via-[#017B46] to-[#024D70] text-white font-semibold shadow-lg shadow-emerald-950/40 hover:opacity-95 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
          >
            Mulai Sekarang <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <button
            onClick={scrollToProduk}
            className="inline-flex items-center gap-2.5 px-6 sm:px-7 py-3 sm:py-3.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/25 text-white font-semibold backdrop-blur-md transition-all cursor-pointer hover:border-emerald-400/50"
          >
            Jelajahi Produk <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
