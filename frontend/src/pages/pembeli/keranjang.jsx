import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/layout/Sidebar";
import { Trash2, Check, Loader2 } from "lucide-react";
import api from "../../config/axios";
import { swalWarning } from "../../utils/swal";

export default function KeranjangPage() {
  const [cartItems, setCartItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const fetchCart = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/carts');
      
      const formattedItems = res.data.map(item => ({
        cart_id: item.id,
        id: item.product_id, // Untuk checkout
        name: item.product.nama_produk,
        price: `Rp ${Number(item.product.harga_harapan).toLocaleString('id-ID')}`,
        priceNum: Number(item.product.harga_harapan),
        quantity: Number(item.kuantitas),
        unit: `/${item.product.satuan}`,
        image: item.product.gambar ? `http://localhost:8000/storage/${item.product.gambar}` : "/images/beras.png",
        koperasi: item.product.user?.name || "Koperasi",
        originCityId: item.product.user_id === 1 ? 78 : 54, // Mock city ID
        stock: `${item.product.stok} ${item.product.satuan}`
      }));

      setCartItems(formattedItems);
      // Select all by default
      setSelectedItems(formattedItems.map((_, i) => i));
    } catch (error) {
      console.error("Gagal memuat keranjang", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    Promise.resolve().then(() => fetchCart());
  }, []);

  const updateQuantity = async (index, change) => {
    const item = cartItems[index];
    let newQty = item.quantity + change;
    if (newQty <= 0) newQty = 1;

    // Optimistic UI Update
    const newItems = [...cartItems];
    newItems[index].quantity = newQty;
    setCartItems(newItems);

    try {
      await api.put(`/carts/${item.cart_id}`, { kuantitas: newQty });
    } catch (error) {
      console.error("Gagal update kuantitas", error);
      // Revert if error
      fetchCart();
    }
  };

  const removeItem = async (index) => {
    const item = cartItems[index];
    
    // Optimistic UI Update
    const newItems = [...cartItems];
    newItems.splice(index, 1);
    setCartItems(newItems);
    setSelectedItems((prev) =>
      prev.filter((i) => i !== index).map((i) => (i > index ? i - 1 : i)),
    );

    try {
      await api.delete(`/carts/${item.cart_id}`);
    } catch (error) {
      console.error("Gagal menghapus produk", error);
      fetchCart();
    }
  };

  const toggleSelect = (index) => {
    setSelectedItems((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index],
    );
  };

  const calculateTotal = () => {
    return selectedItems.reduce((acc, idx) => {
      const item = cartItems[idx];
      if (!item) return acc;
      return acc + (item.priceNum * item.quantity);
    }, 0);
  };

  const handleCheckout = () => {
    if (selectedItems.length === 0) {
      swalWarning("Belum ada produk dipilih", "Pilih minimal satu produk untuk checkout!");
      return;
    }
    // Store selected items for checkout page
    const checkoutItems = selectedItems
      .map((idx) => cartItems[idx])
      .filter(Boolean);
    localStorage.setItem("checkoutItems", JSON.stringify(checkoutItems));
    navigate("/pembeli/checkout");
  };

  return (
    <div className="min-h-screen bg-white font-[Montserrat] text-slate-900">
      <div className="flex w-full min-h-screen p-4 pl-[304px]">
        <Sidebar />

        {/* Main content area - matches marketplace wrapper */}
        <div className="flex-1 bg-[rgba(222,236,225,0.19)] border border-[rgba(0,154,38,0.19)] rounded-[16px] p-6 relative">
          {/* Header - reduced from 24px to 18px */}
          <div className="flex items-start justify-between border-b border-[#029154] pb-3 mb-3">
            <h2 className="text-[18px] font-semibold text-[#005941]">
              Keranjang
            </h2>
            <img
              src="/images/ikan1.png"
              alt="avatar"
              className="w-8 h-8 rounded-full border border-slate-100"
            />
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-20 text-[#006638]">
               <Loader2 className="w-6 h-6 animate-spin mr-2"/>
               Memuat Keranjang...
            </div>
          ) : cartItems.length === 0 ? (
            <div className="text-center py-16 text-black/40 text-[14px] font-medium">
              Keranjang belanja Anda kosong. Silakan kunjungi MarketPlace untuk
              berbelanja.
            </div>
          ) : (
            <>
              {/* Column headers - reduced from 20px to 14px */}
              <div className="flex items-center px-3 mb-3">
                <div className="w-[36px]" />
                <div className="w-[100px]" />
                <span className="flex-[2] text-[14px] font-semibold text-[#005941]">
                  Produk
                </span>
                <span className="flex-1 text-[14px] font-semibold text-[#005941] text-center">
                  Harga
                </span>
                <span className="flex-1 text-[14px] font-semibold text-[#005941] text-center">
                  Jumlah
                </span>
                <span className="flex-1 text-[14px] font-semibold text-[#005941] text-center">
                  Total
                </span>
                <div className="w-[36px]" />
              </div>

              {/* Cart rows - reduced padding */}
              <div className="space-y-3">
                {cartItems.map((item, idx) => {
                  const itemTotal = item.priceNum * item.quantity;
                  const isSelected = selectedItems.includes(idx);

                  return (
                    <div
                      key={idx}
                      className="flex items-center bg-white rounded-[8px] shadow-[0_0_4px_rgba(0,0,0,0.25)] px-3 py-3 gap-3"
                    >
                      {/* Checkbox - reduced from 35px to 26px */}
                      <button
                        onClick={() => toggleSelect(idx)}
                        className={`w-[26px] h-[26px] rounded-[4px] flex items-center justify-center flex-shrink-0 transition ${
                          isSelected
                            ? "bg-[#006638]"
                            : "bg-white border-2 border-[#006638]"
                        }`}
                      >
                        {isSelected && (
                          <Check
                            className="w-4 h-4 text-white"
                            strokeWidth={3}
                          />
                        )}
                      </button>

                      {/* Product image - reduced from 98x65 to 72x48 */}
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-[72px] h-[48px] object-cover rounded-[5px] flex-shrink-0"
                        onError={(e) => {
                          e.target.src = "/images/beras.png";
                        }}
                      />

                      {/* Product info - reduced from 16px to 14px */}
                      <div className="flex-[2] min-w-0">
                        <h4 className="text-[14px] font-semibold text-[#273B4A] truncate">
                          {item.name}
                        </h4>
                        <p className="text-[13px] font-semibold text-black/[0.43] mt-0.5">
                          {item.stock || "50 kg"}
                        </p>
                      </div>

                      {/* Harga */}
                      <div className="flex-1 text-center">
                        <span className="text-[13px] font-medium text-black">
                          {item.price} {item.unit}
                        </span>
                      </div>

                      {/* Jumlah - quantity selector, reduced from 135x49 to 104x36 */}
                      <div className="flex-1 flex justify-center">
                        <div className="flex items-center w-[104px] h-[36px] border border-black/[0.3] rounded-[8px] bg-white">
                          <button
                            onClick={() => updateQuantity(idx, -1)}
                            className="flex-1 h-full text-[#00378A] text-[18px] font-medium hover:bg-slate-50 transition rounded-l-[8px] flex items-center justify-center leading-none"
                          >
                            -
                          </button>
                          <span className="flex-1 text-center text-[12px] font-medium text-black">
                            {item.quantity} kg
                          </span>
                          <button
                            onClick={() => updateQuantity(idx, 1)}
                            className="flex-1 h-full text-[#00378A] text-[18px] font-medium hover:bg-slate-50 transition rounded-r-[8px] flex items-center justify-center leading-none"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Total */}
                      <div className="flex-1 text-center">
                        <span className="text-[13px] font-medium text-black">
                          Rp {itemTotal.toLocaleString("id-ID")} {item.unit}
                        </span>
                      </div>

                      {/* Delete button - reduced from 40px to 32px */}
                      <button
                        onClick={() => removeItem(idx)}
                        className="w-[32px] h-[32px] bg-white border border-[#E10206] shadow-[0_0_3px_rgba(0,0,0,0.25)] rounded-[5px] flex items-center justify-center flex-shrink-0 hover:bg-red-50 transition"
                      >
                        <Trash2 className="w-4 h-4 text-[#FF0000]" />
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Bottom total bar - reduced further to 13-15px, tighter padding */}
              <div className="flex items-center justify-between mt-5 bg-[rgba(2,145,84,0.15)] border border-black/[0.1] rounded-[8px] px-4 py-3">
                <span className="text-[14px] font-semibold text-[#006638]">
                  Total Belanja
                </span>

                <div className="flex items-center gap-3">
                  <span className="text-[15px] font-bold text-black">
                    Rp {calculateTotal().toLocaleString("id-ID")}
                  </span>

                  <button
                    onClick={handleCheckout}
                    className="h-[34px] px-5 bg-[#006638] hover:bg-[#00522c] rounded-[6px] text-white text-[13px] font-bold transition"
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
