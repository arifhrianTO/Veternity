import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PetaniSidebar from "../../components/petani/PetaniSidebar";
import { Trash2, Check } from "lucide-react";

export default function KeranjangPage() {
  const [cartItems, setCartItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem("cart");
    if (saved) {
      const items = JSON.parse(saved);
      setCartItems(items);
      // Select all by default
      setSelectedItems(items.map((_, i) => i));
    }
  }, []);

  const syncCart = (items) => {
    setCartItems(items);
    localStorage.setItem("cart", JSON.stringify(items));
  };

  const updateQuantity = (index, change) => {
    const newItems = [...cartItems];
    newItems[index].quantity += change;
    if (newItems[index].quantity <= 0) {
      newItems[index].quantity = 1;
    }
    syncCart(newItems);
  };

  const removeItem = (index) => {
    const newItems = [...cartItems];
    newItems.splice(index, 1);
    setSelectedItems((prev) =>
      prev.filter((i) => i !== index).map((i) => (i > index ? i - 1 : i))
    );
    syncCart(newItems);
  };

  const toggleSelect = (index) => {
    setSelectedItems((prev) =>
      prev.includes(index)
        ? prev.filter((i) => i !== index)
        : [...prev, index]
    );
  };

  const parsePrice = (priceStr) => {
    return parseInt(priceStr.replace(/[^0-9]/g, ""), 10) || 0;
  };

  const calculateTotal = () => {
    return selectedItems.reduce((acc, idx) => {
      const item = cartItems[idx];
      if (!item) return acc;
      return acc + parsePrice(item.price) * item.quantity;
    }, 0);
  };

  const handleCheckout = () => {
    if (selectedItems.length === 0) {
      alert("Pilih minimal satu produk untuk checkout!");
      return;
    }
    // Store selected items for checkout page
    const checkoutItems = selectedItems.map((idx) => cartItems[idx]).filter(Boolean);
    localStorage.setItem("checkoutItems", JSON.stringify(checkoutItems));
    navigate("/pembeli/checkout");
  };

  return (
    <div className="min-h-screen bg-white font-[Montserrat] text-slate-900">
      <div className="flex max-w-[1440px] mx-auto py-8 gap-6 px-4">
        <PetaniSidebar />

        {/* Main content area - matches marketplace wrapper */}
        <div className="flex-1 bg-[rgba(222,236,225,0.19)] border border-[rgba(0,154,38,0.19)] rounded-[20px] p-8 min-h-[971px] relative">

          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#029154] pb-6 mb-6">
            <h2 className="text-[24px] font-semibold text-[#005941]">Keranjang</h2>
            <img src="/images/ikan1.png" alt="avatar" className="w-14 h-14 rounded-full border border-slate-100" />
          </div>

          {cartItems.length === 0 ? (
            <div className="text-center py-20 text-black/40 text-[18px] font-medium">
              Keranjang belanja Anda kosong. Silakan kunjungi MarketPlace untuk berbelanja.
            </div>
          ) : (
            <>
              {/* Column headers */}
              <div className="flex items-center px-4 mb-4">
                <div className="w-[45px]" />
                <div className="w-[140px]" />
                <span className="flex-[2] text-[20px] font-semibold text-[#005941]">Produk</span>
                <span className="flex-1 text-[20px] font-semibold text-[#005941] text-center">Harga</span>
                <span className="flex-1 text-[20px] font-semibold text-[#005941] text-center">Jumlah</span>
                <span className="flex-1 text-[20px] font-semibold text-[#005941] text-center">Total</span>
                <div className="w-[50px]" />
              </div>

              {/* Cart rows */}
              <div className="space-y-4">
                {cartItems.map((item, idx) => {
                  const itemTotal = parsePrice(item.price) * item.quantity;
                  const isSelected = selectedItems.includes(idx);

                  return (
                    <div
                      key={idx}
                      className="flex items-center bg-white rounded-[10px] shadow-[0_0_4px_rgba(0,0,0,0.25)] px-4 py-5 gap-3"
                    >
                      {/* Checkbox */}
                      <button
                        onClick={() => toggleSelect(idx)}
                        className={`w-[35px] h-[35px] rounded-[5px] flex items-center justify-center flex-shrink-0 transition ${
                          isSelected
                            ? "bg-[#006638]"
                            : "bg-white border-2 border-[#006638]"
                        }`}
                      >
                        {isSelected && <Check className="w-5 h-5 text-white" strokeWidth={3} />}
                      </button>

                      {/* Product image */}
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-[98px] h-[65px] object-cover rounded-[5px] flex-shrink-0"
                        onError={(e) => { e.target.src = "/images/beras.png"; }}
                      />

                      {/* Product info */}
                      <div className="flex-[2] min-w-0">
                        <h4 className="text-[16px] font-semibold text-[#273B4A] truncate">{item.name}</h4>
                        <p className="text-[16px] font-semibold text-black/[0.43] mt-1">{item.stock || "50 kg"}</p>
                      </div>

                      {/* Harga */}
                      <div className="flex-1 text-center">
                        <span className="text-[15px] font-medium text-black">{item.price} {item.unit}</span>
                      </div>

                      {/* Jumlah - quantity selector */}
                      <div className="flex-1 flex justify-center">
                        <div className="flex items-center w-[135px] h-[49px] border border-black/[0.3] rounded-[10px] bg-white">
                          <button
                            onClick={() => updateQuantity(idx, -1)}
                            className="flex-1 h-full text-[#00378A] text-[28px] font-medium hover:bg-slate-50 transition rounded-l-[10px] flex items-center justify-center leading-none"
                          >
                            -
                          </button>
                          <span className="flex-1 text-center text-[15px] font-medium text-black">{item.quantity} kg</span>
                          <button
                            onClick={() => updateQuantity(idx, 1)}
                            className="flex-1 h-full text-[#00378A] text-[28px] font-medium hover:bg-slate-50 transition rounded-r-[10px] flex items-center justify-center leading-none"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Total */}
                      <div className="flex-1 text-center">
                        <span className="text-[15px] font-medium text-black">
                          Rp {itemTotal.toLocaleString("id-ID")} {item.unit}
                        </span>
                      </div>

                      {/* Delete button */}
                      <button
                        onClick={() => removeItem(idx)}
                        className="w-[40px] h-[40px] bg-white border border-[#E10206] shadow-[0_0_3px_rgba(0,0,0,0.25)] rounded-[5px] flex items-center justify-center flex-shrink-0 hover:bg-red-50 transition"
                      >
                        <Trash2 className="w-5 h-5 text-[#FF0000]" />
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Bottom total bar */}
              <div className="flex items-center justify-between mt-8 bg-[rgba(2,145,84,0.15)] border border-black/[0.1] rounded-[10px] px-6 py-6">
                <span className="text-[24px] font-semibold text-[#006638]">Total Belanja</span>

                <div className="flex items-center gap-6">
                  <span className="text-[24px] font-bold text-black">
                    Rp {calculateTotal().toLocaleString("id-ID")}
                  </span>

                  <button
                    onClick={handleCheckout}
                    className="h-[50px] px-8 bg-[#006638] hover:bg-[#00522c] rounded-[10px] text-white text-[20px] font-bold transition"
                  >
                    CheckOut
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
