import { useState, useEffect } from "react";
import { Star, X, Minus, Plus, Send } from "lucide-react";

export default function ProductDetailModal({ product, onClose, onAddToCart, onSubmitOffer }) {
  const [quantity, setQuantity] = useState(1);
  const [showOfferForm, setShowOfferForm] = useState(false);
  const [offerPrice, setOfferPrice] = useState("");
  const [offerMessage, setOfferMessage] = useState("");
  const [isSubmittingOffer, setIsSubmittingOffer] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

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

  const handleSubmitOfferClick = async () => {
    if (!offerPrice || Number(offerPrice) <= 0) {
      alert("Masukkan harga tawaran yang valid.");
      return;
    }
    setIsSubmittingOffer(true);
    try {
      await onSubmitOffer(product, quantity, Number(offerPrice), offerMessage);
      onClose();
    } catch {
      // error sudah ditangani di parent (swal), cukup stop loading di sini
    } finally {
      setIsSubmittingOffer(false);
    }
  };

  const fullStars = Math.floor(product.rating);
  const stars = Array.from({ length: 5 }, (_, i) => i < fullStars);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/[0.43]" />

      <div
        className="relative bg-white rounded-[16px] w-[92vw] max-w-[760px] max-h-[88vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 w-[32px] h-[32px] bg-[#A20003] hover:bg-[#8a0003] rounded-full flex items-center justify-center transition-colors"
        >
          <X className="w-[16px] h-[16px] text-white" strokeWidth={3.5} />
        </button>

        <div className="p-6 md:p-7">
          <div className="flex flex-col md:flex-row gap-6">
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

            <div className="flex-1 flex flex-col justify-start min-w-0">
              <h2 className="font-bold text-[18px] md:text-[22px] leading-[28px] text-[#273B4A] font-[Montserrat]">
                {product.name}
              </h2>

              <p className="text-[13px] md:text-[14px] leading-[18px] text-black/[0.43] font-medium mt-1">
                {product.location}
              </p>

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

              <div className="flex items-center gap-2 mt-2">
                <img
                  src="/images/iconKoperasi.png"
                  alt="koperasi icon"
                  className="w-[18px] h-[17px] md:w-[20px] md:h-[19px] object-contain shrink-0 opacity-80"
                />
                <span className="text-[12px] md:text-[13px] leading-[16px] text-black/[0.43] font-medium">
                  {product.koperasi}{" "}
                  {product.sellerRole && (
                    <span className="text-[11px]">• {product.sellerRole}</span>
                  )}
                </span>
              </div>

              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                {product.kategori && product.kategori !== "-" && (
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#006638]/10 text-[#006638] border border-[#006638]/20">
                    {product.kategori}
                  </span>
                )}
                {product.komoditas && product.komoditas !== "-" && (
                  <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">
                    {product.komoditas}
                  </span>
                )}
              </div>

              <p className="font-bold text-[18px] md:text-[22px] leading-[28px] text-[#006638] mt-3">
                {product.price}{" "}
                <span className="text-[14px] font-normal">/ kg (Harga Harapan)</span>
              </p>

              {product.harga_acuan && (
                <p className="text-[12px] md:text-[13px] leading-[18px] text-black/[0.5] font-medium mt-1">
                  Harga Acuan Bapanas:{" "}
                  <span className="font-semibold text-[#273B4A]">
                    Rp {Number(product.harga_acuan).toLocaleString('id-ID')} / kg
                  </span>
                  {product.harga_acuan_tanggal && (
                    <span className="text-black/[0.35]"> (update {new Date(product.harga_acuan_tanggal).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })})</span>
                  )}
                </p>
              )}

              <div className="text-[12px] md:text-[13px] leading-[19px] md:leading-[21px] text-black/[0.43] font-medium mt-2 space-y-0">
                <p>Stok tersedia : {product.stock || "50kg"}</p>
                <p>Tanggal Panen: {product.harvestDate || "01-01-26"}</p>
                <p>Masa Layak: {product.shelfLife || "7 hari"}</p>
              </div>
            </div>
          </div>

          <div className="mt-5 md:mt-6">
            <div className="flex items-center justify-center w-full max-w-[320px] h-[44px] md:h-[52px] border border-black/[0.3] rounded-[8px] mx-auto md:mx-0">
              <button
                onClick={decreaseQty}
                className="flex-1 h-full flex items-center justify-center text-[#273B4A] hover:bg-slate-50 transition rounded-l-[8px] border-r border-black/[0.25]"
              >
                <Minus className="w-4 h-4 md:w-5 md:h-5" strokeWidth={3} />
              </button>

              <div className="flex-[2] h-full flex items-center justify-center">
                <span className="font-bold text-[16px] md:text-[18px] leading-[22px] text-[#273B4A]">
                  {quantity} kg
                </span>
              </div>

              <button
                onClick={increaseQty}
                className="flex-1 h-full flex items-center justify-center text-[#273B4A] hover:bg-slate-50 transition rounded-r-[8px] border-l border-black/[0.25]"
              >
                <Plus className="w-4 h-4 md:w-5 md:h-5" strokeWidth={3} />
              </button>
            </div>

            <div className="flex flex-col md:flex-row gap-3 mt-5">
              <button
                onClick={handleAddToCart}
                className="flex-1 h-[46px] md:h-[52px] border-2 border-[#029154] rounded-[8px] text-[#029154] font-bold text-[14px] md:text-[16px] leading-[22px] hover:bg-[#029154]/5 transition-colors"
              >
                Masukkan Keranjang
              </button>

              <button
                onClick={() => setShowOfferForm((v) => !v)}
                className="flex-1 h-[46px] md:h-[52px] bg-[#029154] rounded-[8px] text-white font-bold text-[14px] md:text-[16px] leading-[22px] hover:bg-[#027a47] transition-colors flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                {showOfferForm ? "Batal Ajukan Penawaran" : "Ajukan Penawaran"}
              </button>
            </div>

            {showOfferForm && (
              <div className="mt-4 p-4 bg-[#00378A]/5 border border-[#00378A]/20 rounded-[10px] space-y-3">
                <div>
                  <label className="text-[13px] font-semibold text-[#273B4A] block mb-1.5">
                    Harga Tawaran (per kg)
                  </label>
                  <div className="flex items-center border border-black/[0.3] rounded-[8px] overflow-hidden bg-white">
                    <span className="px-3 text-[13px] font-semibold text-slate-400 bg-slate-50 h-[42px] flex items-center border-r border-black/[0.15]">
                      Rp
                    </span>
                    <input
                      type="number"
                      min="1"
                      value={offerPrice}
                      onChange={(e) => setOfferPrice(e.target.value)}
                      placeholder={`Harga harapan penjual: ${product.price}`}
                      className="flex-1 h-[42px] px-3 text-[13px] outline-none"
                    />
                  </div>
                  <div className="flex items-center gap-3 mt-1.5 text-[11px] text-black/[0.4] font-medium">
                    <span>Harapan Penjual: {product.price}</span>
                    {product.harga_acuan && (
                      <span>· Acuan Bapanas: Rp {Number(product.harga_acuan).toLocaleString('id-ID')}</span>
                    )}
                  </div>
                </div>

                <div>
                  <label className="text-[13px] font-semibold text-[#273B4A] block mb-1.5">
                    Pesan untuk Penjual (opsional)
                  </label>
                  <textarea
                    value={offerMessage}
                    onChange={(e) => setOfferMessage(e.target.value)}
                    placeholder="Contoh: Bisa nego kalau ambil banyak?"
                    rows={2}
                    className="w-full border border-black/[0.3] rounded-[8px] px-3 py-2 text-[13px] outline-none resize-none"
                  />
                </div>

                <p className="text-[12px] text-black/[0.43] font-medium">
                  Jumlah yang ditawar: <span className="font-semibold text-[#273B4A]">{quantity} kg</span> (ubah lewat kontrol jumlah di atas)
                </p>

                <button
                  onClick={handleSubmitOfferClick}
                  disabled={isSubmittingOffer}
                  className="w-full h-[42px] bg-[#00378A] hover:bg-[#002c6d] text-white font-bold text-[14px] rounded-[8px] transition-colors disabled:opacity-60"
                >
                  {isSubmittingOffer ? "Mengirim..." : "Kirim Penawaran"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}