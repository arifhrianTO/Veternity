import { useState, useEffect } from "react";
import { ArrowRight, Star, Store, Loader2 } from "lucide-react";
import api from "../../config/axios";

const productImage = (path) => {
  if (!path) return "/images/beras.png";
  if (path.startsWith("http")) return path;
  return `http://localhost:8000/storage/${path}`;
};

const formatRp = (val) => `Rp ${Number(val || 0).toLocaleString("id-ID")}`;

export default function FeaturedProducts() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api
      .get("/products/featured", { params: { limit: 4 } })
      .then((res) => {
        const list = Array.isArray(res.data) ? res.data : [];
        setProducts(list);
      })
      .catch((err) => console.error("Gagal mengambil produk unggulan:", err))
      .finally(() => setIsLoading(false));
  }, []);

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

      {isLoading ? (
        <div className="flex items-center justify-center gap-2 text-[#006638] py-16">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="font-semibold">Memuat produk unggulan...</span>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-16 text-slate-400 font-medium">
          Belum ada produk unggulan.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((p, i) => (
            <div
              key={p.id ?? i}
              className="rounded-2xl border border-slate-100 overflow-hidden shadow-xs hover:shadow-lg transition-shadow bg-white"
            >
              <div className="h-48 bg-slate-50 flex items-center justify-center overflow-hidden">
                <img
                  src={productImage(p.gambar)}
                  alt={p.nama_produk}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/images/beras.png";
                  }}
                />
              </div>
              <div className="p-4">
                <h4 className="font-bold text-slate-800 line-clamp-1">{p.nama_produk}</h4>
                <p className="text-xs text-slate-400 mb-2">
                  {p.user?.city?.nama_kota || p.user?.alamat || "Indonesia"}
                </p>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-emerald-700 text-sm">
                    {formatRp(p.harga_harapan)}{" "}
                    <span className="font-normal text-slate-400">/{p.satuan}</span>
                  </span>
                  <span className="flex items-center gap-1 text-xs font-semibold text-slate-600">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> 4.8
                  </span>
                </div>
                <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                  <Store className="w-3.5 h-3.5" /> {p.user?.nama_lengkap || "Penjual"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
