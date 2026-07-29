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

      {/* Modal - Rectangle 4228: 931×665, white, rounded-20 */}
      <div
        className="relative bg-white rounded-[20px] w-[95vw] max-w-[931px] max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button - Ellipse 112: red circle 40×40, top-right */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 w-[40px] h-[40px] bg-[#A20003] hover:bg-[#8a0003] rounded-full flex items-center justify-center transition-colors"
        >
          <X className="w-[20px] h-[20px] text-white" strokeWidth={3.5} />
        </button>

        {/* Content container */}
        <div className="p-8 md:p-10">
          {/* Top section: image + info */}
          <div className="flex flex-col md:flex-row gap-8">
            {/* image 22: product image 462×308, rounded-10 */}
            <div className="w-full md:w-[462px] h-[250px] md:h-[308px] flex-shrink-0 rounded-[10px] overflow-hidden bg-slate-50">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = "/images/beras.png";
                }}
              />
            </div>

            {/* Group 89: product info panel */}
            <div className="flex-1 flex flex-col justify-start min-w-0">
              {/* Product name - 32px bold #273B4A */}
              <h2
                className="font-bold text-[24px] md:text-[32px] leading-[39px] text-[#273B4A] font-[Montserrat]"
              >
                {product.name}
              </h2>

              {/* Location - 20px medium rgba(0,0,0,0.43) */}
              <p className="text-[16px] md:text-[20px] leading-[24px] text-black/[0.43] font-medium mt-1">
                {product.location}
              </p>

              {/* Star rating row */}
              <div className="flex items-center gap-1 mt-3">
                {stars.map((filled, i) => (
                  <Star
                    key={i}
                    className={`w-[24px] h-[24px] md:w-[30px] md:h-[30px] ${
                      filled
                        ? "fill-amber-400 text-amber-400"
                        : "fill-gray-200 text-gray-200"
                    }`}
                  />
                ))}
                <span className="text-[16px] md:text-[20px] leading-[24px] text-black/[0.43] font-medium ml-2">
                  {product.rating}
                </span>
              </div>

              {/* Koperasi row */}
              <div className="flex items-center gap-2 mt-3">
                <div className="w-[28px] h-[26px] md:w-[33px] md:h-[31px] bg-[url('/images/tag.png')] bg-contain bg-no-repeat shrink-0 opacity-70" />
                <span className="text-[14px] md:text-[16px] leading-[20px] text-black/[0.43] font-medium">
                  {product.koperasi}
                </span>
              </div>

              {/* Price - 32px bold #006638 */}
              <p className="font-bold text-[24px] md:text-[32px] leading-[39px] text-[#006638] mt-4">
                {product.price} <span className="text-[20px] font-normal">/ kg</span>
              </p>

              {/* Stock info - 20px medium, line-height 35px, rgba(0,0,0,0.43) */}
              <div className="text-[14px] md:text-[18px] leading-[30px] md:leading-[35px] text-black/[0.43] font-medium mt-3 space-y-0">
                <p>Stok tersedia : {product.stock || "50kg"}</p>
                <p>Tanggal Panen: {product.harvestDate || "01-01-26"}</p>
                <p>Masa Layak: {product.shelfLife || "7 hari"}</p>
              </div>
            </div>
          </div>

          {/* Bottom section: quantity + action buttons */}
          <div className="mt-6 md:mt-8">
            {/* Quantity selector - Rectangle 4229: 485×81, border, rounded-10 */}
            <div className="flex items-center justify-center w-full max-w-[485px] h-[65px] md:h-[81px] border border-black/[0.3] rounded-[10px] mx-auto md:mx-0">
              {/* Minus button */}
              <button
                onClick={decreaseQty}
                className="flex-1 h-full flex items-center justify-center text-[#273B4A] hover:bg-slate-50 transition rounded-l-[10px] border-r border-black/[0.25]"
              >
                <Minus className="w-7 h-7 md:w-9 md:h-9" strokeWidth={3} />
              </button>

              {/* Quantity display - 32px bold #273B4A */}
              <div className="flex-[2] h-full flex items-center justify-center">
                <span className="font-bold text-[24px] md:text-[32px] leading-[39px] text-[#273B4A]">
                  {quantity} kg
                </span>
              </div>

              {/* Plus button */}
              <button
                onClick={increaseQty}
                className="flex-1 h-full flex items-center justify-center text-[#273B4A] hover:bg-slate-50 transition rounded-r-[10px] border-l border-black/[0.25]"
              >
                <Plus className="w-7 h-7 md:w-9 md:h-9" strokeWidth={3} />
              </button>
            </div>

            {/* Action buttons row */}
            <div className="flex flex-col md:flex-row gap-4 mt-6">
              {/* Masukkan Keranjang - Rectangle 4230: outlined, border 3px #029154 */}
              <button
                onClick={handleAddToCart}
                className="flex-1 h-[70px] md:h-[91px] border-[3px] border-[#029154] rounded-[10px] text-[#029154] font-bold text-[20px] md:text-[28px] leading-[39px] hover:bg-[#029154]/5 transition-colors"
              >
                Masukkan Keranjang
              </button>

              {/* Beli Sekarang - Rectangle 4231: filled #029154 */}
              <button
                onClick={handleBuyNow}
                className="flex-1 h-[70px] md:h-[91px] bg-[#029154] rounded-[10px] text-white font-bold text-[20px] md:text-[28px] leading-[39px] hover:bg-[#027a47] transition-colors"
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
