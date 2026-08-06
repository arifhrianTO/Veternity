import { useState, useEffect, useRef } from "react";
import { ArrowRight, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import api from "../../config/axios";

const bgPalette = [
  "bg-emerald-50",
  "bg-amber-50",
  "bg-orange-50",
  "bg-sky-50",
  "bg-teal-50",
  "bg-rose-50",
];

const categoryImage = (path) => {
  if (!path) return "/images/placeholder-category.png";
  if (path.startsWith("http") || path.startsWith("/images")) return path;
  return `http://localhost:8000/storage/${path}`;
};

export default function Categories() {
  const scrollRef = useRef(null);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    api
      .get("/categories")
      .then((res) => {
        const list = (res.data?.data || []).slice().sort((a, b) => (a.id ?? 0) - (b.id ?? 0));
        setCategories(list);
      })
      .catch((err) => console.error("Gagal mengambil kategori:", err))
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    if (isPaused || isLoading || categories.length === 0) return;
    const timer = setInterval(() => {
      const el = scrollRef.current;
      if (!el) return;
      const maxScroll = el.scrollWidth - el.clientWidth;
      if (el.scrollLeft >= maxScroll - 4) {
        el.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        el.scrollBy({ left: 220, behavior: "smooth" });
      }
    }, 3000);
    return () => clearInterval(timer);
  }, [isPaused, isLoading, categories.length]);

  const scrollBy = (dir) => {
    const el = scrollRef.current;
    if (el) el.scrollBy({ left: dir * 220, behavior: "smooth" });
  };

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

      <div className="relative">
        {!isLoading && categories.length > 0 && (
          <>
            <button
              onClick={() => scrollBy(-1)}
              aria-label="Kategori sebelumnya"
              className="absolute -left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white border border-slate-200 shadow-md flex items-center justify-center text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 transition"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scrollBy(1)}
              aria-label="Kategori selanjutnya"
              className="absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white border border-slate-200 shadow-md flex items-center justify-center text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 transition"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        <div
          ref={scrollRef}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2 text-[#006638] py-10 w-full">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="font-semibold">Memuat kategori...</span>
            </div>
          ) : (
            categories.map((c, i) => (
              <button
                key={c.id}
                className="snap-start shrink-0 border border-slate-100 rounded-2xl py-8 px-8 flex flex-col items-center gap-3 shadow-xs hover:border-emerald-300 hover:shadow-md transition-all group bg-white"
              >
                <div className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center ${bgPalette[i % bgPalette.length]}`}>
                  <img
                    src={categoryImage(c.gambar)}
                    alt={c.nama_kategori}
                    className="w-16 h-16 sm:w-20 sm:h-20 object-contain group-hover:scale-110 transition-transform duration-300 drop-shadow-sm"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/images/placeholder-category.png";
                    }}
                  />
                </div>
                <span className="font-semibold text-slate-700 mt-2 text-sm text-center">
                  {c.nama_kategori}
                </span>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
