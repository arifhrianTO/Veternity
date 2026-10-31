import React, { useState } from "react";
import PageHeader from "../../components/layout/PageHeader";
import api from "../../config/axios";
import { storageUrl } from "../../config/storage";
import ProductDetailModal from "../../components/pembeli/ProductDetailModal";
import { Star, Search } from "lucide-react";
import { swalSuccess, swalError } from "../../utils/swal";

const sellerRoleLabels = {
  petani: "Petani",
  petani_binaan: "Petani",
  nelayan: "Nelayan",
  nelayan_binaan: "Nelayan",
  koperasi: "Koperasi",
  pembeli: "Pembeli",
  admin: "Admin",
};

export default function MarketplacePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [selectedLocation, setSelectedLocation] = useState("Semua");
  const [selectedPrice, setSelectedPrice] = useState("Semua");
  const [selectedSort, setSelectedSort] = useState("Terbaru");
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Ambil data produk dari backend (API)
  React.useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get('/products');
        // Transform mapping dari DB ke format yang dibutuhkan UI (mockData format)
        const formattedProducts = response.data.map(p => ({
          id: p.id,
          name: p.nama_produk,
          location: "Indonesia",
          price: `Rp ${Number(p.harga_harapan).toLocaleString('id-ID')}`,
          priceNum: Number(p.harga_harapan),
          harga_acuan: p.harga_acuan ? Number(p.harga_acuan) : null,   // ← tambahkan baris ini
          unit: `/${p.satuan}`,
          rating: 4.8,
          koperasi: p.user?.nama_lengkap || "Petani",
          sellerRole: p.user?.role ? sellerRoleLabels[p.user.role] || "Penjual" : "Penjual",
          petani_id: p.user_id,
          image: storageUrl(p.gambar, "/images/beras.png"),
          stock: `${p.stok}${p.satuan}`,
          harvestDate: new Date(p.tanggal_panen).toLocaleDateString(),
          shelfLife: `${p.masa_layak} hari`,
          originCityId: p.user_id === 1 ? 78 : 54,
          kategori: p.category?.nama_kategori || p.kategori || "-",
          komoditas: p.commodity?.nama_komoditas || p.komoditas_acuan || "-"
        }));
        setProducts(formattedProducts);
      } catch (error) {
        console.error("Gagal mengambil produk:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleAddToCart = async (product, qty = 1) => {
    try {
       // Panggil API untuk tambah ke keranjang
       const res = await api.post('/carts', {
          product_id: product.id,
          kuantitas: qty
       });
       if(res.data.success) {
          window.dispatchEvent(new Event("cart:updated"));
          swalSuccess("Ditambahkan ke keranjang", `${product.name} (${qty} kg) telah ditambahkan ke keranjang.`);
       }
    } catch (error) {
       console.error("Gagal tambah ke keranjang", error);
       swalError("Gagal menambahkan ke keranjang", "Pastikan Anda sudah login.");
    }
  };
  const handleSubmitOffer = async (product, qty, offerPrice, message) => {
  try {
    const res = await api.post('/offers', {
      product_id: product.id,
      jumlah_diminta: qty,
      harga_tawaran: offerPrice,
      pesan_pembeli: message || null,
    });
    swalSuccess("Penawaran Terkirim", `Penawaran untuk ${product.name} sudah dikirim ke penjual. Menunggu respon.`);
    return res.data;
  } catch (error) {
    console.error("Gagal mengajukan penawaran", error);
    const msg = error.response?.data?.message || "Terjadi kesalahan, pastikan Anda sudah login.";
    swalError("Gagal Mengajukan Penawaran", msg);
    throw error; // biar modal tetap terbuka & loading state berhenti
  }
};

  // Opsi kategori dinamis dari data produk asli
  const categoryOptions = ["Semua", ...new Set(products.map((p) => p.kategori).filter((k) => k && k !== "-"))];

  const filteredProducts = products.filter((p) => {
    // Tambahkan pengaman agar tidak crash jika p.name atau p.koperasi undefined/null
    const safeName = p.name || "";
    const safeKoperasi = p.koperasi || "";

    const matchesSearch = safeName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          safeKoperasi.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === "Semua" || p.kategori === selectedCategory;
    
    const safeLocation = p.location || "";
    const matchesLocation = selectedLocation === "Semua" || safeLocation.includes(selectedLocation);
    
    return matchesSearch && matchesCategory && matchesLocation;
  });

  return (
    <div className="font-['Montserrat'] text-slate-900">
      {/* Rectangle 4166 / Wrapper utama */}
      <div className="bg-[rgba(222,236,225,0.19)] border border-[rgba(0,154,38,0.19)] rounded-[20px] p-6 sm:p-8 relative">
          
          <PageHeader title="Katalog Produk" simple />

          {/* Group 36 & Filter Controls */}
          <div className="flex items-center justify-between gap-4 mb-8">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-[371px] h-[42px] bg-white border border-[#006638] rounded-[50px] flex items-center px-4">
              <Search className="w-5 h-5 mr-2 text-[#006638] shrink-0" />
              <input
                type="text"
                placeholder="Cari Produk..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full text-sm outline-none bg-transparent placeholder-[#006638] text-[#006638] font-medium"
              />
            </div>

            {/* Filter Dropdowns */}
            <div className="flex items-center gap-3">
              {/* Filter Terbaru */}
              <select
                value={selectedSort}
                onChange={(e) => setSelectedSort(e.target.value)}
                className="h-[42px] w-[153px] px-3 bg-white border border-[#024D70] rounded-[5px] text-sm text-[#00378A] font-medium outline-none cursor-pointer"
              >
                <option value="Terbaru">Terbaru</option>
                <option value="Terpopuler">Terpopuler</option>
              </select>

              {/* Filter Kategori */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="h-[42px] w-[153px] px-3 bg-white border border-[#024D70] rounded-[5px] text-sm text-[#00378A] font-medium outline-none cursor-pointer"
              >
                {categoryOptions.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>

              {/* Filter Harga */}
              <select
                value={selectedPrice}
                onChange={(e) => setSelectedPrice(e.target.value)}
                className="h-[42px] w-[153px] px-3 bg-white border border-[#024D70] rounded-[5px] text-sm text-[#00378A] font-medium outline-none cursor-pointer"
              >
                <option value="Semua">Harga</option>
                <option value="Murah">Termurah</option>
                <option value="Mahal">Termahal</option>
              </select>

              {/* Filter Wilayah */}
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="h-[42px] w-[153px] px-3 bg-white border border-[#024D70] rounded-[5px] text-sm text-[#00378A] font-medium outline-none cursor-pointer"
              >
                <option value="Semua">Wilayah</option>
                <option value="Bogor">Bogor</option>
                <option value="Batam">Batam</option>
                <option value="Bandung">Bandung</option>
              </select>
            </div>
          </div>

          {/* Grid Card Produk */}
          {isLoading ? (
             <div className="flex justify-center items-center py-20 text-[#006638]">
               Memuat Produk...
             </div>
          ) : (
<div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {filteredProducts.map((p, idx) => (
              <div
                key={idx}
                onClick={() => setSelectedProduct(p)}
                className="group w-full h-full bg-white rounded-xl shadow-[0_1px_4px_rgba(0,0,0,0.12)] flex flex-col justify-between overflow-hidden cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
              >
                <div>
                  {/* Image container */}
                  <div className="aspect-[4/3] w-full bg-slate-50 relative overflow-hidden border-b border-slate-100">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      onError={(e) => {
                        e.target.src = "/images/beras.png";
                      }}
                    />
                  </div>

                  {/* Body Content */}
                  <div className="p-3">
                    <h4 className="font-semibold text-[14px] leading-[18px] text-[#273B4A] line-clamp-2 min-h-[36px]">{p.name}</h4>

                    <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-[#006638]/10 text-[#006638] border border-[#006638]/20">
                        {p.kategori}
                      </span>
                      {p.komoditas && p.komoditas !== "-" && (
                        <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-500">
                          {p.komoditas}
                        </span>
                      )}
                    </div>

                    <p className="text-[12px] leading-[16px] text-[rgba(0,0,0,0.43)] font-medium mt-1 line-clamp-1">
                      {p.location}
                    </p>

                    <div className="flex items-center justify-between gap-2 mt-2">
                      <span className="font-bold text-[16px] leading-[20px] text-[#00A75C]">
                        {p.price} <span className="font-medium text-[12px] text-slate-400">{p.unit}</span>
                      </span>

                      <div className="flex items-center gap-0.5 shrink-0">
                        <Star className="w-[14px] h-[14px] fill-amber-400 text-amber-400" />
                        <span className="text-[12px] text-[rgba(0,0,0,0.43)] font-medium">{p.rating}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 mt-2 min-w-0">
                      <img src="/images/iconKoperasi.png" alt="koperasi icon" className="w-[16px] h-[16px] object-contain shrink-0 opacity-80" />
                      <span className="text-[12px] text-[rgba(0,0,0,0.43)] font-medium truncate">
                        {p.koperasi} <span className="text-[11px]">• {p.sellerRole}</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Button Action */}
                <div className="px-3 pb-3 pt-1 mt-auto">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedProduct(p);
                    }}
                    className="w-full h-[36px] bg-[#006638] hover:bg-[#00522c] text-white rounded-lg text-[13px] font-bold transition flex items-center justify-center"
                  >
                    Lihat Detail
                  </button>
                </div>
              </div>
            ))}
          </div>
          )}

      </div>

      {/* Product Detail Popup Modal */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={handleAddToCart}
          onSubmitOffer={handleSubmitOffer}
        />
        
      )}
      
    </div>
    
  );
}
