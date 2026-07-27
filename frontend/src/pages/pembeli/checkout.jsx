import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin } from "lucide-react";

export default function CheckoutPage() {
  const [checkoutItems, setCheckoutItems] = useState([]);
  const [shippingMethod, setShippingMethod] = useState("reguler");
  const [paymentMethod, setPaymentMethod] = useState("transfer");
  const navigate = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem("checkoutItems");
    if (saved) {
      setCheckoutItems(JSON.parse(saved));
    } else {
      // Fallback to full cart
      const cart = localStorage.getItem("cart");
      if (cart) setCheckoutItems(JSON.parse(cart));
    }
  }, []);

  const parsePrice = (priceStr) => {
    return parseInt(priceStr.replace(/[^0-9]/g, ""), 10) || 0;
  };

  const subTotal = checkoutItems.reduce((acc, item) => {
    return acc + parsePrice(item.price) * (item.quantity || 1);
  }, 0);

  const shippingCost = shippingMethod === "express" ? 14000 : 0;
  const totalPayment = subTotal + shippingCost;

  const handleOrder = () => {
    if (checkoutItems.length === 0) {
      alert("Tidak ada produk untuk dipesan!");
      return;
    }

    const orderId = `TRX-${Math.floor(100000 + Math.random() * 900000)}`;
    const newOrder = {
      id: orderId,
      products: checkoutItems,
      total: `Rp ${totalPayment.toLocaleString("id-ID")}`,
      date: new Date().toLocaleDateString("id-ID"),
      status: "Diproses",
      shippingMethod:
        shippingMethod === "reguler"
          ? "Pengiriman Reguler"
          : shippingMethod === "express"
          ? "Pengiriman Express"
          : "Ambil Sendiri",
      paymentMethod: paymentMethod === "transfer" ? "Transfer Bank" : "QRIS",
    };

    // Save order
    const savedOrders = localStorage.getItem("orders");
    const orders = savedOrders ? JSON.parse(savedOrders) : [];
    orders.unshift(newOrder);
    localStorage.setItem("orders", JSON.stringify(orders));

    // Remove checked-out items from cart
    const cart = localStorage.getItem("cart");
    if (cart) {
      const cartItems = JSON.parse(cart);
      const remaining = cartItems.filter(
        (ci) => !checkoutItems.some((co) => co.name === ci.name)
      );
      localStorage.setItem("cart", JSON.stringify(remaining));
    }
    localStorage.removeItem("checkoutItems");

    alert(`Pesanan ${orderId} berhasil dibuat!`);
    navigate("/pembeli/pesanan");
  };

  const shippingOptions = [
    {
      id: "reguler",
      label: "Pengiriman Reguler",
      desc: "2 - 3 hari",
      cost: "Gratis",
      costColor: "text-[#006638]",
    },
    {
      id: "express",
      label: "Pengiriman Express",
      desc: "1 hari",
      cost: "Rp 14.000",
      costColor: "text-black",
    },
    {
      id: "pickup",
      label: "Ambil sendiri",
      desc: "Ambil sendiri di lokasi petani",
      cost: "Gratis",
      costColor: "text-[#006638]",
    },
  ];

  const paymentOptions = [
    { id: "transfer", label: "Transfer Bank" },
    { id: "qris", label: "QRIS" },
  ];

  return (
    <div className="min-h-screen bg-white font-[Montserrat] text-slate-900">
      <div className="max-w-[1440px] mx-auto px-6 py-6">
        {/* Top bar: back arrow + title */}
        <div className="flex items-center gap-3 mb-8">
          <button
            onClick={() => navigate("/pembeli/keranjang")}
            className="w-[40px] h-[40px] flex items-center justify-center hover:bg-slate-50 rounded-lg transition"
          >
            <ArrowLeft className="w-7 h-7 text-[#006638]" strokeWidth={3} />
          </button>
          <h1 className="text-[24px] font-semibold text-[#005941]">CheckOut</h1>
        </div>

        {/* Two-column layout */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* LEFT COLUMN: Address + Shipping + Payment */}
          <div className="w-full lg:w-[621px] border border-black/[0.2] rounded-[10px] bg-[rgba(0,55,138,0.01)] p-6 flex-shrink-0">

            {/* Section 1: Alamat Pengiriman */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-[35px] h-[35px] rounded-full bg-[#006638] flex items-center justify-center flex-shrink-0">
                <span className="text-white text-[20px] font-semibold">1</span>
              </div>
              <h3 className="text-[20px] font-semibold text-black">Alamat Pengiriman</h3>
            </div>

            <div className="border border-[#006638] rounded-[20px] p-5 mb-8 relative">
              <div className="flex items-start gap-3">
                <MapPin className="w-6 h-6 text-[#006638] flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-[16px] font-medium text-black/50 leading-[20px]">
                    Jl. Ahmad Yani, Tlk. Tering, Kec. Batam Kota, Kota Batam, Kepulauan Riau 29461
                  </p>
                  <p className="text-[16px] font-semibold text-black mt-2">08xxxxxxx</p>
                </div>
                <button className="text-[16px] font-semibold text-[#006638] hover:underline flex-shrink-0">
                  Ubah
                </button>
              </div>
            </div>

            {/* Section 2: Metode Pembelian */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-[35px] h-[35px] rounded-full bg-[#006638] flex items-center justify-center flex-shrink-0">
                <span className="text-white text-[20px] font-semibold">2</span>
              </div>
              <h3 className="text-[20px] font-semibold text-black">Metode Pembelian</h3>
            </div>

            <div className="space-y-4 mb-8">
              {shippingOptions.map((opt) => {
                const isSelected = shippingMethod === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => setShippingMethod(opt.id)}
                    className={`w-full flex items-center justify-between rounded-[20px] px-5 py-4 border transition text-left ${
                      isSelected
                        ? "border-[#006638] bg-[rgba(2,145,84,0.03)]"
                        : "border-black/[0.25] bg-white hover:border-black/40"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      {/* Radio circle */}
                      <div
                        className={`w-[30px] h-[30px] rounded-full flex items-center justify-center flex-shrink-0 ${
                          isSelected ? "bg-[#006638]" : "border border-black"
                        }`}
                      >
                        {isSelected && (
                          <div className="w-[10px] h-[10px] rounded-full bg-white" />
                        )}
                      </div>
                      <div>
                        <p className="text-[16px] font-semibold text-black">{opt.label}</p>
                        <p className="text-[15px] font-semibold text-black/50">{opt.desc}</p>
                      </div>
                    </div>
                    <span className={`text-[16px] font-semibold ${opt.costColor}`}>{opt.cost}</span>
                  </button>
                );
              })}
            </div>

            {/* Section 3: Pilih Pembayaran */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-[35px] h-[35px] rounded-full bg-[#006638] flex items-center justify-center flex-shrink-0">
                <span className="text-white text-[20px] font-semibold">3</span>
              </div>
              <h3 className="text-[20px] font-semibold text-black">Pilih Pembayaran</h3>
            </div>

            <div className="space-y-4">
              {paymentOptions.map((opt) => {
                const isSelected = paymentMethod === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => setPaymentMethod(opt.id)}
                    className={`w-full flex items-center gap-4 rounded-[20px] px-5 py-4 border transition text-left ${
                      isSelected
                        ? "border-[#006638] bg-[rgba(2,145,84,0.03)]"
                        : "border-black/[0.25] bg-white hover:border-black/40"
                    }`}
                  >
                    <div
                      className={`w-[30px] h-[30px] rounded-full flex items-center justify-center flex-shrink-0 ${
                        isSelected ? "bg-[#006638]" : "border border-black"
                      }`}
                    >
                      {isSelected && (
                        <div className="w-[10px] h-[10px] rounded-full bg-white" />
                      )}
                    </div>
                    <p className="text-[20px] font-semibold text-black">{opt.label}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* RIGHT COLUMN: Ringkasan Pembelian */}
          <div className="flex-1 border border-black/[0.2] rounded-[10px] bg-[rgba(39,59,74,0.01)] p-6 flex flex-col">
            <h3 className="text-[20px] font-semibold text-black mb-6">Ringkasan Pembelian</h3>

            {/* Product list */}
            <div className="space-y-5 mb-6">
              {checkoutItems.map((item, idx) => (
                <div key={idx} className="flex items-center gap-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-[98px] h-[65px] object-cover rounded-[5px] flex-shrink-0"
                    onError={(e) => { e.target.src = "/images/beras.png"; }}
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-[16px] font-semibold text-[#273B4A] truncate">{item.name}</h4>
                    <p className="text-[16px] font-semibold text-black/[0.43] mt-0.5">
                      {item.quantity || 1} kg
                    </p>
                  </div>
                  <span className="text-[15px] font-bold text-black/[0.6] flex-shrink-0">
                    Rp {(parsePrice(item.price) * (item.quantity || 1)).toLocaleString("id-ID")} {item.unit}
                  </span>
                </div>
              ))}
            </div>

            {/* Divider */}
            <div className="border-t border-black/[0.3] my-4" />

            {/* Sub Total */}
            <div className="flex justify-between items-center mb-3">
              <span className="text-[20px] font-bold text-black/[0.6]">Sub Total</span>
              <span className="text-[20px] font-bold text-black">
                Rp {subTotal.toLocaleString("id-ID")}
              </span>
            </div>

            {/* Ongkos Kirim */}
            <div className="flex justify-between items-center mb-4">
              <span className="text-[20px] font-bold text-black/[0.6]">Ongkos Kirim</span>
              <span className={`text-[20px] font-semibold ${shippingCost === 0 ? "text-[#006638]" : "text-black"}`}>
                {shippingCost === 0 ? "Gratis" : `Rp ${shippingCost.toLocaleString("id-ID")}`}
              </span>
            </div>

            {/* Divider */}
            <div className="border-t border-black/[0.3] my-4" />

            {/* Total Pembayaran */}
            <div className="flex justify-between items-center mb-8">
              <span className="text-[24px] font-bold text-black">Total Pembayaran</span>
              <span className="text-[24px] font-bold text-black">
                Rp {totalPayment.toLocaleString("id-ID")}
              </span>
            </div>

            {/* Spacer to push button to bottom */}
            <div className="flex-1" />

            {/* Pesan button */}
            <button
              onClick={handleOrder}
              className="w-full h-[91px] bg-[#006638] hover:bg-[#00522c] rounded-[10px] text-white text-[40px] font-bold transition"
            >
              Pesan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
