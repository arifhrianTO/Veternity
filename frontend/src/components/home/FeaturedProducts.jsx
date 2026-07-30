import React from "react";
import { ArrowRight, Star, Store } from "lucide-react";
import { products } from "../../data/mockData";

export default function FeaturedProducts() {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold bg-gradient-to-r from-[#00378A] to-[#0453C9] bg-clip-text text-transparent">
          Produk Unggulan
        </h2>
        <a
          href="#"
          className="text-sm font-semibold text-emerald-700 inline-flex items-center gap-1 hover:underline"
        >
          Lihat Selengkapnya <ArrowRight className="w-3.5 h-3.5" />
        </a>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((p, i) => {
          return (
            <div
              key={i}
              className="rounded-2xl border border-slate-100 overflow-hidden shadow-xs hover:shadow-lg transition-shadow bg-white"
            >
              <div
                className="h-48 bg-slate-50 flex items-center justify-center overflow-hidden"
              >
                <img
                  src={p.image}
                  alt={p.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h4 className="font-bold text-slate-800">{p.name}</h4>
                <p className="text-xs text-slate-400 mb-2">{p.location}</p>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-emerald-700 text-sm">
                    {p.price}{" "}
                    <span className="font-normal text-slate-400">{p.unit}</span>
                  </span>
                  <span className="flex items-center gap-1 text-xs font-semibold text-slate-600">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />{" "}
                    {p.rating}
                  </span>
                </div>
                <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                  <Store className="w-3.5 h-3.5" /> {p.koperasi}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
