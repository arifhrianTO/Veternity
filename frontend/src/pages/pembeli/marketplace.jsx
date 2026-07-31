import React, { useState } from "react";
import Sidebar from "../../components/layout/Sidebar";
import api from "../../config/axios";
import ProductDetailModal from "../../components/pembeli/ProductDetailModal";
import { Star, Search } from "lucide-react";

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
            location: "Indonesia", // Jika ada relasi kota di tabel users nanti bisa ditarik
            price: `Rp ${Number(p.harga_harapan).toLocaleString('id-ID')}`,
            priceNum: Number(p.harga_harapan),
            unit: `/${p.satuan}`,
            rating: 4.8, // Mock
            koperasi: p.user?.name || "Petani", 
            image: p.gambar ? `http://localhost:8000/storage/${p.gambar}` : "/images/beras.png",
            stock: `${p.stok}${p.satuan}`,
            harvestDate: new Date(p.tanggal_panen).toLocaleDateString(),
            shelfLife: `${p.masa_layak} hari`,
            originCityId: p.user_id === 1 ? 78 : 54, // Mock city ID untuk hitung ongkir
            kategori: p.kategori
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
          alert(`${product.name} (${qty} kg) telah ditambahkan ke keranjang.`);
       }
    } catch (error) {
       console.error("Gagal tambah ke keranjang", error);
       alert("Gagal menambahkan ke keranjang. Pastikan Anda sudah login.");
    }
  };

  const filteredProducts = products.filter((p) => {
    // Tambahkan pengaman agar tidak crash jika p.name atau p.koperasi undefined/null
    const safeName = p.name || "";
    const safeKoperasi = p.koperasi || "";

    const matchesSearch = safeName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          safeKoperasi.toLowerCase().includes(searchTerm.toLowerCase());
    
    let productCategory = "Semua";
    const nameLower = safeName.toLowerCase();
    if (nameLower.includes("beras")) productCategory = "Beras";
    else if (nameLower.includes("ikan") || nameLower.includes("tongkol") || nameLower.includes("udang")) productCategory = "Ikan";
    else if (nameLower.includes("sayur")) productCategory = "Sayur";
    else if (nameLower.includes("buah")) productCategory = "Buah";
    else if (nameLower.includes("telur")) productCategory = "Telur";

    const matchesCategory = selectedCategory === "Semua" || productCategory === selectedCategory;
    
    const safeLocation = p.location || "";
    const matchesLocation = selectedLocation === "Semua" || safeLocation.includes(selectedLocation);
    
    return matchesSearch && matchesCategory && matchesLocation;
  });

  return (
    <div className="min-h-screen bg-white font-['Montserrat'] text-slate-900">
      <div className="flex w-full min-h-screen p-4 pl-[304px]">
        <Sidebar />

        {/* Rectangle 4166 / Wrapper utama */}
        <div className="flex-1 bg-[rgba(222,236,225,0.19)] border border-[rgba(0,154,38,0.19)] rounded-[20px] p-8 relative">
          
          {/* Header & Judul */}
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-[#029154] pb-4 mb-4">
            <h2 className="text-2xl font-semibold text-[#005941]">Katalog Produk</h2>
            
            {/* Profil avatar kecil kanan atas */}
            <div className="flex items-center gap-4">
              <img src="/images/ikan1.png" alt="avatar" className="w-10 h-10 rounded-full border border-slate-100" />
            </div>
          </div>

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
                <option value="Semua">Kategori</option>
                <option value="Beras">Beras</option>
                <option value="Ikan">Ikan</option>
                <option value="Telur">Telur</option>
                <option value="Sayur">Sayur</option>
                <option value="Buah">Buah</option>
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
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
            {filteredProducts.map((p, idx) => (
              <div
                key={idx}
                className="w-full max-w-[308px] h-fit bg-white rounded-[20px] shadow-[0px_0px_5px_rgba(0,0,0,0.25)] flex flex-col justify-between overflow-hidden mx-auto transition-transform hover:scale-[1.01]"
              >
                <div>
                  {/* Image container */}
                  <div className="h-[170px] w-full bg-slate-50 relative overflow-hidden border-b border-slate-100">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = "/images/beras.png";
                      }}
                    />
                  </div>

                  {/* Body Content */}
                  <div className="p-4 relative">
                    <h4 className="font-bold text-[18px] leading-[22px] text-[#273B4A] line-clamp-1">{p.name}</h4>
                    
                    <p className="text-[14px] leading-[18px] text-[rgba(0,0,0,0.43)] font-medium mt-1">
                      {p.location}
                    </p>

                    <div className="flex items-center justify-between mt-[18px]">
                      <span className="font-bold text-[18px] leading-[20px] text-[#00A75C]">
                        {p.price} <span className="font-medium text-sm text-slate-400">{p.unit}</span>
                      </span>

                      <div className="flex items-center gap-1">
                        <Star className="w-[18px] h-[18px] fill-amber-400 text-amber-400" />
                        <span className="text-[14px] text-[rgba(0,0,0,0.43)] font-medium">{p.rating}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mt-[14px]">
                      <img src="/images/iconKoperasi.png" alt="koperasi icon" className="w-[20px] h-[20px] object-contain shrink-0 opacity-80" />
                      <span className="text-[14px] text-[rgba(0,0,0,0.43)] font-medium">{p.koperasi}</span>
                    </div>
                  </div>
                </div>

                {/* Button Action */}
                <div className="p-4 pt-4 mt-auto">
                  <button
                    onClick={() => setSelectedProduct(p)}
                    className="w-full h-[45px] bg-[#006638] hover:bg-[#00522c] text-white rounded-[10px] text-[16px] font-bold transition flex items-center justify-center"
                  >
                    Lihat Detail
                  </button>
                </div>
              </div>
            ))}
          </div>
          )}

        </div>
      </div>

      {/* Product Detail Popup Modal */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={handleAddToCart}
        />
      )}
    </div>
  );
}
