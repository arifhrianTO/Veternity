import React, { useState } from "react";
import PetaniSidebar from "../../components/petani/PetaniSidebar";
import ProductDetailModal from "../../components/pembeli/ProductDetailModal";
import { products } from "../../mockData";
import { Star } from "lucide-react";

export default function MarketplacePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [selectedLocation, setSelectedLocation] = useState("Semua");
  const [selectedPrice, setSelectedPrice] = useState("Semua");
  const [selectedSort, setSelectedSort] = useState("Terbaru");
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleAddToCart = (product, qty = 1) => {
    const saved = localStorage.getItem("cart");
    const cart = saved ? JSON.parse(saved) : [];
    
    const existingIndex = cart.findIndex((item) => item.name === product.name);
    if (existingIndex > -1) {
      cart[existingIndex].quantity += qty;
    } else {
      cart.push({ ...product, quantity: qty });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    alert(`${product.name} (${qty} kg) telah ditambahkan ke keranjang.`);
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.koperasi.toLowerCase().includes(searchTerm.toLowerCase());
    
    let productCategory = "Semua";
    const nameLower = p.name.toLowerCase();
    if (nameLower.includes("beras")) productCategory = "Beras";
    else if (nameLower.includes("ikan") || nameLower.includes("tongkol") || nameLower.includes("udang")) productCategory = "Ikan";
    else if (nameLower.includes("sayur")) productCategory = "Sayur";
    else if (nameLower.includes("buah")) productCategory = "Buah";
    else if (nameLower.includes("telur")) productCategory = "Telur";

    const matchesCategory = selectedCategory === "Semua" || productCategory === selectedCategory;
    const matchesLocation = selectedLocation === "Semua" || p.location.includes(selectedLocation);
    
    return matchesSearch && matchesCategory && matchesLocation;
  });

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      <div className="flex max-w-[1440px] mx-auto py-8 gap-6 px-4">
        <PetaniSidebar />

        {/* Rectangle 4166 / Wrapper utama */}
        <div className="flex-1 bg-[rgba(222,236,225,0.19)] border border-[rgba(0,154,38,0.19)] rounded-[20px] p-8 min-h-[971px] relative">
          
          {/* Header & Judul */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#029154] pb-6 mb-6">
            <h2 className="text-2xl font-semibold text-[#005941] font-sans">MarketPlace</h2>
            
            {/* Profil avatar kecil kanan atas */}
            <div className="flex items-center gap-4">
              <img src="/images/ikan1.png" alt="avatar" className="w-14 h-14 rounded-full border border-slate-100" />
            </div>
          </div>

          {/* Group 36 & Filter Controls */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            {/* Search Bar */}
            <div className="relative w-full md:w-[371px] h-[42px] bg-white border border-[#006638] rounded-[50px] flex items-center px-4">
              <img 
                src="/images/search.png" 
                alt="search" 
                className="w-5 h-5 mr-2 object-contain shrink-0" 
              />
              <input
                type="text"
                placeholder="Cari Produk..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full text-sm outline-none bg-transparent placeholder-[#006638] text-[#006638] font-medium"
              />
            </div>

            {/* Filter Dropdowns */}
            <div className="flex flex-wrap items-center gap-3">
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
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
            {filteredProducts.map((p, idx) => (
              <div
                key={idx}
                className="w-full max-w-[308px] h-[433px] bg-white rounded-[20px] shadow-[0px_0px_5px_rgba(0,0,0,0.25)] flex flex-col justify-between overflow-hidden mx-auto transition-transform hover:scale-[1.01]"
              >
                <div>
                  {/* Image container */}
                  <div className="h-[206px] w-full bg-slate-50 relative overflow-hidden">
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
                    <h4 className="font-bold text-[20px] leading-[24px] text-[#273B4A] line-clamp-1">{p.name}</h4>
                    
                    <p className="text-[15px] leading-[18px] text-[rgba(0,0,0,0.43)] font-medium mt-1">
                      {p.location}
                    </p>

                    <div className="flex items-center justify-between mt-[23px]">
                      <span className="font-bold text-[16px] leading-[20px] text-[#00A75C]">
                        {p.price} <span className="font-normal text-slate-400">{p.unit}</span>
                      </span>

                      <div className="flex items-center gap-1">
                        <Star className="w-[20px] h-[20px] fill-amber-400 text-amber-400" />
                        <span className="text-[15px] text-[rgba(0,0,0,0.43)] font-medium">{p.rating}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mt-[17px]">
                      <div className="w-[28px] h-[26px] bg-[url('/images/tag.png')] bg-contain bg-no-repeat shrink-0 opacity-70" />
                      <span className="text-[15px] text-[rgba(0,0,0,0.43)] font-medium">{p.koperasi}</span>
                    </div>
                  </div>
                </div>

                {/* Button Action */}
                <div className="p-4 pt-0">
                  <button
                    onClick={() => setSelectedProduct(p)}
                    className="w-full h-[50px] bg-[#006638] hover:bg-[#00522c] text-white rounded-[10px] text-[20px] font-bold transition flex items-center justify-center"
                  >
                    Lihat Detail
                  </button>
                </div>
              </div>
            ))}
          </div>

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