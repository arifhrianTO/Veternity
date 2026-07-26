import React from "react";
import { ArrowRight, ShoppingBag } from "lucide-react";

export default function Hero() {
  return (
    <section className="max-w-7xl ml-auto pl-6 md:pl-12 grid md:grid-cols-2 gap-10 items-center">
      <div className="py-12 md:py-20 pr-6">
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
          <button className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-l from-[#ABE147] via-[#017B46] to-[#024D70] text-white font-semibold hover:opacity-90 transition-opacity">
            Mulai Sekarang <ArrowRight className="w-4 h-4" />
          </button>
          <button className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-slate-200 font-semibold text-slate-700 hover:border-emerald-600 hover:text-emerald-700 transition-colors">
            Jelajahi Produk <ShoppingBag className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div className="relative w-full h-full min-h-[350px] md:min-h-[500px] flex items-end justify-end">
        {/* Gambar Blur di belakang */}
        <img
          src="/images/blur.png"
          alt="Blur Effect"
          className="absolute right-0 bottom-0 w-[120%] h-[120%] object-contain opacity-70 animate-pulse duration-[3000ms] translate-x-20"
        />
        {/* Gambar Latar (Petani & Nelayan) di depan, ditarik ke paling bawah (bottom-0) dan menempel ke kanan layar */}
        <img
          src="/images/latar.png"
          alt="Petani Nelayan"
          className="relative z-10 w-full h-full object-contain md:object-right-bottom translate-x-6 md:translate-x-12 translate-y-4 md:translate-y-8 scale-105"
        />
      </div>
    </section>
  );
}
