import React, { useState, useEffect } from "react";
import { Star, X, Minus, Plus } from "lucide-react";

export default function ProductDetailModal({ product, onClose, onAddToCart }) {
  const [quantity, setQuantity] = useState(1);

  // Lock body scroll when modal open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // Close on Escape key
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  if (!product) return null;

  const decreaseQty = () => setQuantity((q) => Math.max(1, q - 1));
  const increaseQty = () => setQuantity((q) => q + 1);

  const handleAddToCart = () => {
    onAddToCart(product, quantity);
    onClose();
  };

  const handleBuyNow = () => {
    onAddToCart(product, quantity);
    // Navigate to keranjang
    window.location.href = "/pembeli/keranjang";
  };

  // Render stars based on rating
  const fullStars = Math.floor(product.rating);
  const stars = Array.from({ length: 5 }, (_, i) => i < fullStars);

  return (
    /* Overlay - Rectangle 4227 */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      {/* Dark backdrop */}
      <div className="absolute inset-0 bg-black/[0.43]" />

      {/* Modal - reduced from 931x665 to a tighter 760px max width */}
      <div
        className="relative bg-white rounded-[16px] w-[92vw] max-w-[760px] max-h-[88vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button - reduced from 40x40 to 32x32 */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 w-[32px] h-[32px] bg-[#A20003] hover:bg-[#8a0003] rounded-full flex items-center justify-center transition-colors"
        >
          <X className="w-[16px] h-[16px] text-white" strokeWidth={3.5} />
        </button>

        {/* Content container - reduced padding */}
        <div className="p-6 md:p-7">
          {/* Top section: image + info */}
          <div className="flex flex-col md:flex-row gap-6">
            {/* image - reduced from 462x308 to 340x220 */}
            <div className="w-full md:w-[340px] h-[190px] md:h-[220px] flex-shrink-0 rounded-[8px] overflow-hidden bg-slate-50">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = "/images/beras.png";
                }}
              />
            </div>

            {/* Product info panel */}
            <div className="flex-1 flex flex-col justify-start min-w-0">
              {/* Product name - reduced from 32px to 22px */}
              <h2 className="font-bold text-[18px] md:text-[22px] leading-[28px] text-[#273B4A] font-[Montserrat]">
                {product.name}
              </h2>

              {/* Location - reduced from 20px to 14px */}
              <p className="text-[13px] md:text-[14px] leading-[18px] text-black/[0.43] font-medium mt-1">
                {product.location}
              </p>

              {/* Star rating row - reduced from 30px to 18px */}
              <div className="flex items-center gap-1 mt-2">
                {stars.map((filled, i) => (
                  <Star
                    key={i}
                    className={`w-[16px] h-[16px] md:w-[18px] md:h-[18px] ${
                      filled
                        ? "fill-amber-400 text-amber-400"
                        : "fill-gray-200 text-gray-200"
                    }`}
                  />
                ))}
                <span className="text-[13px] md:text-[14px] leading-[18px] text-black/[0.43] font-medium ml-1.5">
                  {product.rating}
                </span>
              </div>

              {/* Koperasi row - reduced icon size */}
              <div className="flex items-center gap-2 mt-2">
                <img
                  src="/images/iconKoperasi.png"
                  alt="koperasi icon"
                  className="w-[18px] h-[17px] md:w-[20px] md:h-[19px] object-contain shrink-0 opacity-80"
                />
                <span className="text-[12px] md:text-[13px] leading-[16px] text-black/[0.43] font-medium">
                  {product.koperasi}
                </span>
              </div>

              {/* Price - reduced from 32px to 22px */}
              <p className="font-bold text-[18px] md:text-[22px] leading-[28px] text-[#006638] mt-3">
                {product.price}{" "}
                <span className="text-[14px] font-normal">/ kg</span>
              </p>

              {/* Stock info - reduced from 20px to 13px, tighter line-height */}
              <div className="text-[12px] md:text-[13px] leading-[19px] md:leading-[21px] text-black/[0.43] font-medium mt-2 space-y-0">
                <p>Stok tersedia : {product.stock || "50kg"}</p>
                <p>Tanggal Panen: {product.harvestDate || "01-01-26"}</p>
                <p>Masa Layak: {product.shelfLife || "7 hari"}</p>
              </div>
            </div>
          </div>

          {/* Bottom section: quantity + action buttons */}
          <div className="mt-5 md:mt-6">
            {/* Quantity selector - reduced from 485x81 to 320x52 */}
            <div className="flex items-center justify-center w-full max-w-[320px] h-[44px] md:h-[52px] border border-black/[0.3] rounded-[8px] mx-auto md:mx-0">
              {/* Minus button */}
              <button
                onClick={decreaseQty}
                className="flex-1 h-full flex items-center justify-center text-[#273B4A] hover:bg-slate-50 transition rounded-l-[8px] border-r border-black/[0.25]"
              >
                <Minus className="w-4 h-4 md:w-5 md:h-5" strokeWidth={3} />
              </button>

              {/* Quantity display - reduced from 32px to 18px */}
              <div className="flex-[2] h-full flex items-center justify-center">
                <span className="font-bold text-[16px] md:text-[18px] leading-[22px] text-[#273B4A]">
                  {quantity} kg
                </span>
              </div>

              {/* Plus button */}
              <button
                onClick={increaseQty}
                className="flex-1 h-full flex items-center justify-center text-[#273B4A] hover:bg-slate-50 transition rounded-r-[8px] border-l border-black/[0.25]"
              >
                <Plus className="w-4 h-4 md:w-5 md:h-5" strokeWidth={3} />
              </button>
            </div>

            {/* Action buttons row - reduced from 91px to 52px */}
            <div className="flex flex-col md:flex-row gap-3 mt-5">
              {/* Masukkan Keranjang - reduced border and font */}
              <button
                onClick={handleAddToCart}
                className="flex-1 h-[46px] md:h-[52px] border-2 border-[#029154] rounded-[8px] text-[#029154] font-bold text-[14px] md:text-[16px] leading-[22px] hover:bg-[#029154]/5 transition-colors"
              >
                Masukkan Keranjang
              </button>

              {/* Beli Sekarang - reduced font */}
              <button
                onClick={handleBuyNow}
                className="flex-1 h-[46px] md:h-[52px] bg-[#029154] rounded-[8px] text-white font-bold text-[14px] md:text-[16px] leading-[22px] hover:bg-[#027a47] transition-colors"
              >
                Beli Sekarang
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
