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
        (ci) => !checkoutItems.some((co) => co.name === ci.name),
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
    <div className="h-screen overflow-hidden bg-white font-[Montserrat] text-slate-900">
      <div className="w-full h-full p-6 flex flex-col">
        {/* Top bar: back arrow + title - reduced from 40px/24px */}
        <div className="flex items-center gap-3 mb-4 flex-shrink-0">
          <button
            onClick={() => navigate("/pembeli/keranjang")}
            className="w-[32px] h-[32px] flex items-center justify-center hover:bg-slate-50 rounded-lg transition"
          >
            <ArrowLeft className="w-5 h-5 text-[#006638]" strokeWidth={3} />
          </button>
          <h1 className="text-[18px] font-semibold text-[#005941]">CheckOut</h1>
        </div>

        {/* Two-column layout */}
        <div className="flex flex-col lg:flex-row gap-4 flex-1 min-h-0">
          {/* LEFT COLUMN: Address + Shipping + Payment - border matches panel 2 */}
          <div className="w-full lg:w-[520px] border border-black/[0.2] rounded-[10px] bg-[rgba(0,55,138,0.01)] p-4 flex-shrink-0 overflow-y-auto">
            {/* Section 1: Alamat Pengiriman */}
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-[26px] h-[26px] rounded-full bg-[#006638] flex items-center justify-center flex-shrink-0">
                <span className="text-white text-[14px] font-semibold">1</span>
              </div>
              <h3 className="text-[15px] font-semibold text-black">
                Alamat Pengiriman
              </h3>
            </div>

            <div className="border border-[#006638] rounded-[12px] p-3 mb-4 relative">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#006638] flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-[11px] font-medium text-black/50 leading-[14px]">
                    Jl. Ahmad Yani, Tlk. Tering, Kec. Batam Kota, Kota Batam,
                    Kepulauan Riau 29461
                  </p>
                  <p className="text-[11px] font-semibold text-black mt-1">
                    08xxxxxxx
                  </p>
                </div>
                <button className="text-[12px] font-semibold text-[#006638] hover:underline flex-shrink-0">
                  Ubah
                </button>
              </div>
            </div>

            {/* Section 2: Metode Pembelian */}
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-[26px] h-[26px] rounded-full bg-[#006638] flex items-center justify-center flex-shrink-0">
                <span className="text-white text-[14px] font-semibold">2</span>
              </div>
              <h3 className="text-[15px] font-semibold text-black">
                Metode Pembelian
              </h3>
            </div>

            <div className="space-y-2 mb-4">
              {shippingOptions.map((opt) => {
                const isSelected = shippingMethod === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => setShippingMethod(opt.id)}
                    className={`w-full flex items-center justify-between rounded-[12px] px-3 py-2 border transition text-left ${
                      isSelected
                        ? "border-[#006638] bg-[rgba(2,145,84,0.03)]"
                        : "border-black/[0.25] bg-white hover:border-black/40"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {/* Radio circle - reduced from 30px to 20px */}
                      <div
                        className={`w-[20px] h-[20px] rounded-full flex items-center justify-center flex-shrink-0 ${
                          isSelected ? "bg-[#006638]" : "border border-black"
                        }`}
                      >
                        {isSelected && (
                          <div className="w-[7px] h-[7px] rounded-full bg-white" />
                        )}
                      </div>
                      <div>
                        <p className="text-[13px] font-semibold text-black">
                          {opt.label}
                        </p>
                        <p className="text-[12px] font-semibold text-black/50">
                          {opt.desc}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`text-[13px] font-semibold ${opt.costColor}`}
                    >
                      {opt.cost}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Section 3: Pilih Pembayaran */}
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-[26px] h-[26px] rounded-full bg-[#006638] flex items-center justify-center flex-shrink-0">
                <span className="text-white text-[14px] font-semibold">3</span>
              </div>
              <h3 className="text-[15px] font-semibold text-black">
                Pilih Pembayaran
              </h3>
            </div>

            <div className="space-y-2">
              {paymentOptions.map((opt) => {
                const isSelected = paymentMethod === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => setPaymentMethod(opt.id)}
                    className={`w-full flex items-center gap-3 rounded-[12px] px-3 py-2 border transition text-left ${
                      isSelected
                        ? "border-[#006638] bg-[rgba(2,145,84,0.03)]"
                        : "border-black/[0.25] bg-white hover:border-black/40"
                    }`}
                  >
                    <div
                      className={`w-[20px] h-[20px] rounded-full flex items-center justify-center flex-shrink-0 ${
                        isSelected ? "bg-[#006638]" : "border border-black"
                      }`}
                    >
                      {isSelected && (
                        <div className="w-[7px] h-[7px] rounded-full bg-white" />
                      )}
                    </div>
                    <p className="text-[14px] font-semibold text-black">
                      {opt.label}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* RIGHT COLUMN: Ringkasan Pembelian */}
          <div className="flex-1 border border-black/[0.2] rounded-[10px] bg-[rgba(39,59,74,0.01)] p-4 flex flex-col overflow-y-auto">
            <h3 className="text-[15px] font-semibold text-black mb-3">
              Ringkasan Pembelian
            </h3>

            {/* Product list - image reduced from 98x65 to 72x48 */}
            <div className="space-y-3 mb-3">
              {checkoutItems.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-[60px] h-[40px] object-cover rounded-[5px] flex-shrink-0"
                    onError={(e) => {
                      e.target.src = "/images/beras.png";
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-[13px] font-semibold text-[#273B4A] truncate">
                      {item.name}
                    </h4>
                    <p className="text-[12px] font-semibold text-black/[0.43] mt-0.5">
                      {item.quantity || 1} kg
                    </p>
                  </div>
                  <span className="text-[12px] font-bold text-black/[0.6] flex-shrink-0">
                    Rp{" "}
                    {(
                      parsePrice(item.price) * (item.quantity || 1)
                    ).toLocaleString("id-ID")}{" "}
                    {item.unit}
                  </span>
                </div>
              ))}
            </div>

            {/* Divider */}
            <div className="border-t border-black/[0.3] my-2" />

            {/* Sub Total */}
            <div className="flex justify-between items-center mb-2">
              <span className="text-[14px] font-bold text-black/[0.6]">
                Sub Total
              </span>
              <span className="text-[14px] font-bold text-black">
                Rp {subTotal.toLocaleString("id-ID")}
              </span>
            </div>

            {/* Ongkos Kirim */}
            <div className="flex justify-between items-center mb-2">
              <span className="text-[14px] font-bold text-black/[0.6]">
                Ongkos Kirim
              </span>
              <span
                className={`text-[14px] font-semibold ${shippingCost === 0 ? "text-[#006638]" : "text-black"}`}
              >
                {shippingCost === 0
                  ? "Gratis"
                  : `Rp ${shippingCost.toLocaleString("id-ID")}`}
              </span>
            </div>

            {/* Divider */}
            <div className="border-t border-black/[0.3] my-2" />

            {/* Total Pembayaran */}
            <div className="flex justify-between items-center mb-4">
              <span className="text-[16px] font-bold text-black">
                Total Pembayaran
              </span>
              <span className="text-[16px] font-bold text-black">
                Rp {totalPayment.toLocaleString("id-ID")}
              </span>
            </div>

            {/* Spacer to push button to bottom */}
            <div className="flex-1" />

            {/* Pesan button */}
            <button
              onClick={handleOrder}
              className="w-full h-[42px] bg-[#006638] hover:bg-[#00522c] rounded-[8px] text-white text-[15px] font-bold transition flex-shrink-0"
            >
              Pesan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
