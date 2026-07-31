import { ArrowRight } from "lucide-react";
import { categories } from "../../data/mockData";

export default function Categories() {
  return (
    <div className="mb-14">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold bg-gradient-to-r from-[#00378A] to-[#0453C9] bg-clip-text text-transparent">
          Kategori Produk
        </h2>
        <a
          href="#"
          className="text-sm font-semibold text-emerald-700 inline-flex items-center gap-1 hover:underline"
        >
          Lihat Selengkapnya <ArrowRight className="w-3.5 h-3.5" />
        </a>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {categories.map((c, i) => {
          return (
            <button
              key={i}
              className="border border-slate-100 rounded-2xl py-8 flex flex-col items-center gap-3 shadow-xs hover:border-emerald-300 hover:shadow-md transition-all group bg-white"
            >
              <img
                src={c.image}
                alt={c.name}
                className="w-20 h-20 sm:w-24 sm:h-24 object-contain group-hover:scale-110 transition-transform duration-300 drop-shadow-sm"
              />
              <span className="font-semibold text-slate-700 mt-2">
                {c.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
