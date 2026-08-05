import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2, Landmark, QrCode, Wallet, Store } from "lucide-react";
import api from "../../config/axios"; // Menggunakan axios instance yang sudah ada auth token
import { swalSuccess, swalError, swalWarning, swalInfo } from "../../utils/swal";

export default function CheckoutPage() {
  const [checkoutItems, setCheckoutItems] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("");
  const navigate = useNavigate();

  // State untuk Data RajaOngkir
  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [fullAddress, setFullAddress] = useState(""); // State baru untuk Alamat Lengkap

  // State untuk Loading dan Error Provinsi/Kota
  const [loadingProvinces, setLoadingProvinces] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);

  // State untuk mengelompokkan item berdasarkan toko/koperasi
  const [groupedItems, setGroupedItems] = useState({});
  // State untuk menyimpan pilihan ongkir masing-masing toko
  const [shippingMethods, setShippingMethods] = useState({});
  // State untuk menyimpan daftar ongkir dari API untuk masing-masing toko
  const [courierCostsByStore, setCourierCostsByStore] = useState({});
  // State loading untuk masing-masing toko
  const [loadingCostByStore, setLoadingCostByStore] = useState({});
  const [shippingErrorByStore, setShippingErrorByStore] = useState({});
  // State daftar kurir aktif (dari tabel couriers yang dikelola admin)
  const [activeCouriers, setActiveCouriers] = useState([]);

  // --- Fungsi Interaksi API RajaOngkir ---

  const fetchProvinces = async () => {
    setLoadingProvinces(true);
    try {
      const res = await api.get("/shipping/provinces");
      if (res.data.success) {
        setProvinces(res.data.data);
      }
    } catch (error) {
      console.error("Gagal mengambil provinsi", error);
    } finally {
      setLoadingProvinces(false);
    }
  };

  useEffect(() => {
    Promise.resolve().then(() => {
      let items = [];
      const saved = localStorage.getItem("checkoutItems");
      if (saved) {
        items = JSON.parse(saved);
      } else {
        const cart = localStorage.getItem("cart");
        if (cart) {
          items = JSON.parse(cart);
        }
      }

      setCheckoutItems(items);

      // Mengelompokkan items berdasarkan penjual (petani_id) agar selaras dengan grouping order di backend
      if (items.length > 0) {
        const groups = items.reduce((acc, item) => {
          const storeKey = item.petani_id || "Toko Default";
          if (!acc[storeKey]) {
            acc[storeKey] = {
              storeName: item.koperasi || "Toko Default",
              items: [],
            };
          }
          acc[storeKey].items.push(item);
          return acc;
        }, {});
        setGroupedItems(groups);
      }

      // Ambil data provinsi saat pertama dimuat
      fetchProvinces();

      // Ambil daftar kurir aktif yang dikelola admin
      api
        .get("/shipping/couriers")
        .then((res) => {
          if (res.data.success) {
            setActiveCouriers(res.data.data);
          }
        })
        .catch((error) => {
          console.error("Gagal mengambil daftar kurir aktif", error);
        });

      // Auto-fill alamat dari profil pembeli
      setFullAddress("poltek");
    });
  }, []);

  const subTotal = checkoutItems.reduce((acc, item) => {
    return acc + (item.priceNum || 0) * (item.quantity || 1);
  }, 0);

  // Total Berat Keseluruhan (untuk referensi, jika diperlukan)
  const totalWeight = checkoutItems.reduce((acc, item) => {
    const itemWeight = item.weight ? item.weight : 1000;
    return acc + itemWeight * (item.quantity || 1);
  }, 0);

  // Menghitung total ongkos kirim dari semua toko
  const totalShippingCost = Object.keys(groupedItems).reduce((acc, storeKey) => {
    const selectedService = shippingMethods[storeKey];
    if (selectedService && courierCostsByStore[storeKey]) {
      const selectedShipping = courierCostsByStore[storeKey].find(c => c.service === selectedService);
      return acc + (selectedShipping ? selectedShipping.cost : 0);
    }
    return acc;
  }, 0);

  const totalPayment = subTotal + totalShippingCost;

  const handleProvinceChange = async (e) => {
    const provId = e.target.value;
    setSelectedProvince(provId);
    setSelectedCity("");
    setCourierCostsByStore({});
    setShippingMethods({});
    setShippingErrorByStore({});

    if (!provId) return;

    setLoadingCities(true);
    try {
      const res = await api.get(`/shipping/cities/${provId}`);
      if (res.data.success) {
        setCities(res.data.data);
      }
    } catch (error) {
      console.error("Gagal mengambil kota", error);
    } finally {
      setLoadingCities(false);
    }
  };

  const handleCityChange = async (e) => {
    const cityId = e.target.value;
    setSelectedCity(cityId);
    setCourierCostsByStore({});
    setShippingMethods({});
    setShippingErrorByStore({});

    if (!cityId) return;

    // Hitung ongkir otomatis saat kota dipilih untuk semua toko
    // Kirim semua kode kurir aktif (kolon-separated) agar semua layanan tampil
    const courierList = activeCouriers.map((c) => c.kode).join(":") || "jne";

    Object.keys(groupedItems).forEach((storeKey) => {
      checkShippingCost(storeKey, cityId, courierList);
    });
  };

  const checkShippingCost = async (storeKey, cityId, courier) => {
    setLoadingCostByStore((prev) => ({ ...prev, [storeKey]: true }));
    setShippingErrorByStore((prev) => ({ ...prev, [storeKey]: "" }));

    // Ambil origin dari item pertama di toko tersebut (asumsi satu toko dari satu origin)
    const itemsInStore = groupedItems[storeKey].items;
    const originCityId = itemsInStore[0]?.originCityId || 153; // fallback 153 jika kosong

    const storeWeight = itemsInStore.reduce((acc, item) => {
      const w = item.weight || 1000;
      return acc + w * (item.quantity || 1);
    }, 0);

    try {
      const res = await api.post("/shipping/cost", {
        origin_city_id: originCityId,
        destination_city_id: cityId,
        weight: storeWeight,
        courier: courier,
      });

      if (res.data.success && res.data.data.length > 0) {
        setCourierCostsByStore((prev) => ({
          ...prev,
          [storeKey]: res.data.data,
        }));
        setShippingMethods((prev) => ({
          ...prev,
          [storeKey]: res.data.data[0].service, // Default ke service pertama
        }));
      } else {
        setCourierCostsByStore((prev) => ({ ...prev, [storeKey]: [] }));
        setShippingErrorByStore((prev) => ({
          ...prev,
          [storeKey]: "Kurir tidak tersedia.",
        }));
      }
    } catch (error) {
      console.error(`Gagal menghitung ongkir untuk ${storeKey}`, error);
      setShippingErrorByStore((prev) => ({
        ...prev,
        [storeKey]: "Gagal menghitung ongkos kirim.",
      }));
    } finally {
      setLoadingCostByStore((prev) => ({ ...prev, [storeKey]: false }));
    }
  };

  const handleOrder = async () => {
    if (checkoutItems.length === 0) {
      swalWarning("Tidak ada produk", "Tidak ada produk untuk dipesan!");
      return;
    }

    if (!selectedCity || !fullAddress.trim()) {
      swalWarning("Alamat belum lengkap", "Mohon lengkapi alamat pengiriman dan pilih kota tujuan!");
      return;
    }

    if (!paymentMethod) {
      swalWarning("Metode pembayaran belum dipilih", "Silakan pilih metode pembayaran terlebih dahulu!");
      return;
    }

    // Cek apakah setiap toko sudah memiliki layanan pengiriman yang dipilih (jika ada ongkir)
    const stores = Object.keys(groupedItems);
    for (let i = 0; i < stores.length; i++) {
      const storeKey = stores[i];
      if (courierCostsByStore[storeKey] && courierCostsByStore[storeKey].length > 0) {
        if (!shippingMethods[storeKey]) {
          swalWarning("Layanan pengiriman belum dipilih", `Mohon pilih layanan pengiriman untuk toko ${groupedItems[storeKey].storeName}!`);
          return;
        }
      }
    }

    // Bangun detail pengiriman per penjual (petani_id) untuk disimpan ke order/shipment
    const shippingDetails = {};
    Object.keys(groupedItems).forEach((storeKey) => {
      const selectedService = shippingMethods[storeKey];
      const costs = courierCostsByStore[storeKey] || [];
      const selected = costs.find((c) => c.service === selectedService);
      if (selected) {
        shippingDetails[storeKey] = {
          kurir: selected.code || selected.name || "",
          layanan: selected.service,
          ongkos: selected.cost,
        };
      }
    });

    try {
      const payload = {
        products: checkoutItems.map(item => ({
          product_id: item.id,
          cart_id: item.cart_id, // Untuk referensi penghapusan dari keranjang
          kuantitas: item.quantity,
          harga: item.priceNum
        })),
        shippingDetails: shippingDetails,
        fullAddress: fullAddress,
        provinsi_id: selectedProvince,
        kota_id: selectedCity,
        total_berat_gram: totalWeight,
        ongkos_kirim: totalShippingCost,
        total: totalPayment,
        paymentMethod: paymentMethod,
      };

      const res = await api.post('/orders', payload);

      if (res.data.success) {
        // Hapus items dari keranjang di frontend
        localStorage.removeItem("checkoutItems");
        const orderIds = res.data.order_ids || [];

        // Panggil Midtrans Snap
        if (res.data.snap_token) {
           window.snap.pay(res.data.snap_token, {
              onSuccess: async function(){
                 try {
                    if (orderIds.length > 0) {
                       await Promise.all(orderIds.map(id => api.put(`/orders/${id}`, { status: "Diproses" })));
                    }
                 } catch (e) {
                    console.error("Gagal mengupdate status pesanan", e);
                 }
                 await swalSuccess("Pembayaran berhasil!", "Status pesanan Anda telah diperbarui.");
                 navigate("/pembeli/pesanan");
              },
              onPending: async function(){
                 await swalInfo("Menunggu pembayaran...", "Pesanan Anda sedang menunggu pembayaran.");
                 navigate("/pembeli/pesanan");
              },
              onError: async function(){
                 await swalError("Pembayaran gagal!", "Silakan coba lagi atau gunakan metode lain.");
                 navigate("/pembeli/pesanan");
              },
              onClose: async function(){
                 await swalInfo("Pembayaran ditutup", "Anda dapat melanjutkan pembayaran nanti di halaman Pesanan.");
                 navigate("/pembeli/pesanan");
              }
           });
        } else {
           // Jika tidak ada token (misal gratis/bypass)
           await swalSuccess("Pesanan berhasil dibuat!");
           navigate("/pembeli/pesanan");
        }
      }
    } catch (error) {
       console.error("Gagal membuat pesanan", error);
       swalError("Gagal memproses pesanan", "Silakan coba lagi.");
    }
  };

  const paymentOptions = [
    {
      id: "Transfer Bank",
      label: "Transfer Bank / Virtual Account",
      icon: Landmark,
      channels: "BCA, BNI, BRI, Mandiri, Permata",
      description: "Bayar lewat transfer ke nomor virtual account bank",
    },
    {
      id: "qris",
      label: "QRIS",
      icon: QrCode,
      channels: "QRIS, GoPay, ShopeePay",
      description: "Scan QR menggunakan aplikasi e-wallet atau m-banking",
    },
    {
      id: "ewallet",
      label: "E-Wallet",
      icon: Wallet,
      channels: "GoPay, ShopeePay",
      description: "Bayar langsung dari saldo e-wallet Anda",
    },
    {
      id: "retail",
      label: "Retail Store",
      icon: Store,
      channels: "Indomaret, Alfamart",
      description: "Bayar tunai di gerai retail terdekat",
    },
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

            <div className="border border-[#006638] rounded-[12px] p-4 mb-4 relative bg-white">
              <div className="space-y-3">
                {/* Dropdown Provinsi */}
                <div>
                  <label className="block text-[12px] font-semibold text-black/70 mb-1">
                    Provinsi
                  </label>
                  <select
                    className="w-full border border-black/20 rounded-[8px] p-2 text-[13px] outline-none focus:border-[#006638]"
                    value={selectedProvince}
                    onChange={handleProvinceChange}
                    disabled={loadingProvinces}
                  >
                    <option value="">-- Pilih Provinsi --</option>
                    {provinces.map((prov) => (
                      <option key={prov.id} value={prov.id}>
                        {prov.name}
                      </option>
                    ))}
                  </select>
                  {loadingProvinces && (
                    <span className="text-[11px] text-[#006638] flex items-center mt-1">
                      <Loader2 className="w-3 h-3 animate-spin mr-1" />{" "}
                      Memuat...
                    </span>
                  )}
                </div>

                {/* Dropdown Kota */}
                <div>
                  <label className="block text-[12px] font-semibold text-black/70 mb-1">
                    Kota / Kabupaten
                  </label>
                  <select
                    className="w-full border border-black/20 rounded-[8px] p-2 text-[13px] outline-none focus:border-[#006638]"
                    value={selectedCity}
                    onChange={handleCityChange}
                    disabled={!selectedProvince || loadingCities}
                  >
                    <option value="">-- Pilih Kota/Kabupaten --</option>
                    {cities.map((city) => (
                      <option key={city.id} value={city.id}>
                        {city.name}
                      </option>
                    ))}
                  </select>
                  {loadingCities && (
                    <span className="text-[11px] text-[#006638] flex items-center mt-1">
                      <Loader2 className="w-3 h-3 animate-spin mr-1" />{" "}
                      Memuat...
                    </span>
                  )}
                </div>

                {/* Textarea Alamat Lengkap */}
                <div>
                  <label className="block text-[12px] font-semibold text-black/70 mb-1">
                    Detail Alamat (Jalan, RT/RW, Patokan)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Masukkan alamat lengkap..."
                    value={fullAddress}
                    onChange={(e) => setFullAddress(e.target.value)}
                    className="w-full border border-black/20 rounded-[8px] p-2 text-[13px] outline-none focus:border-[#006638] resize-none"
                  ></textarea>
                </div>
              </div>
            </div>

            {/* Section 2: Metode Pengiriman Per Toko */}
            <div className="flex items-center gap-2.5 mb-2 mt-6">
              <div className="w-[26px] h-[26px] rounded-full bg-[#006638] flex items-center justify-center flex-shrink-0">
                <span className="text-white text-[14px] font-semibold">2</span>
              </div>
              <h3 className="text-[15px] font-semibold text-black">
                Layanan Pengiriman
              </h3>
            </div>

            <div className="space-y-4 mb-4">
              {!selectedCity ? (
                <div className="p-3 border border-yellow-300 bg-yellow-50 rounded-[12px] text-yellow-700 text-[13px]">
                  Silakan pilih Provinsi dan Kota pengiriman terlebih dahulu untuk melihat opsi ongkos kirim.
                </div>
              ) : (
                Object.keys(groupedItems).map((storeKey) => {
                  const storeName = groupedItems[storeKey].storeName;
                  const isLoading = loadingCostByStore[storeKey];
                  const error = shippingErrorByStore[storeKey];
                  const costs = courierCostsByStore[storeKey] || [];
                  const selectedMethod = shippingMethods[storeKey];

                  return (
                    <div key={storeKey} className="border border-[#006638] rounded-[12px] p-4 bg-white">
                      <div className="flex items-center gap-2 mb-3">
                        <img src="/images/iconKoperasi.png" alt="Toko" className="w-5 h-5 opacity-80" />
                        <h4 className="font-semibold text-[14px] text-black">Dikirim dari {storeName}</h4>
                      </div>

                      {isLoading ? (
                        <div className="flex items-center justify-center p-3 border border-black/10 rounded-[8px] bg-slate-50">
                          <Loader2 className="w-4 h-4 animate-spin text-[#006638] mr-2" />
                          <span className="text-[12px] text-black/70">Menghitung ongkos kirim...</span>
                        </div>
                      ) : error ? (
                        <div className="p-2 border border-red-300 bg-red-50 rounded-[8px] text-red-600 text-[12px]">
                          {error}
                        </div>
                      ) : costs.length === 0 ? (
                        <div className="p-2 border border-black/10 rounded-[8px] bg-white text-[12px] text-black/50">
                          Layanan kurir tidak tersedia untuk pengiriman ini.
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {costs.map((cost) => {
                            const isSelected = selectedMethod === cost.service;
                            return (
                              <button
                                key={`${cost.code}-${cost.service}`}
                                onClick={() => setShippingMethods(prev => ({ ...prev, [storeKey]: cost.service }))}
                                className={`w-full flex items-center justify-between rounded-[8px] px-3 py-2 border transition text-left ${
                                  isSelected
                                    ? "border-[#006638] bg-[rgba(2,145,84,0.03)]"
                                    : "border-black/[0.25] bg-white hover:border-black/40"
                                }`}
                              >
                                <div className="flex items-center gap-3">
                                  <div
                                    className={`w-[18px] h-[18px] rounded-full flex items-center justify-center flex-shrink-0 ${
                                      isSelected ? "bg-[#006638]" : "border border-black"
                                    }`}
                                  >
                                    {isSelected && <div className="w-[6px] h-[6px] rounded-full bg-white" />}
                                  </div>
                                  <div>
                                    <p className="text-[12px] font-bold text-black uppercase">
                                      {cost.name || "Kurir"} - {cost.service}
                                    </p>
                                    <p className="text-[11px] font-medium text-black/50 mt-0.5">
                                      {cost.description ? `${cost.description} • ` : ""}Estimasi: {cost.etd} hari
                                    </p>
                                  </div>
                                </div>
                                <span className={`text-[13px] font-bold ${isSelected ? "text-black" : "text-black/70"}`}>
                                  Rp {cost.cost.toLocaleString("id-ID")}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {/* Section 3: Pilih Pembayaran */}
            <div className="flex items-center gap-2.5 mb-2 mt-6">
              <div className="w-[26px] h-[26px] rounded-full bg-[#006638] flex items-center justify-center flex-shrink-0">
                <span className="text-white text-[14px] font-semibold">3</span>
              </div>
              <h3 className="text-[15px] font-semibold text-black">
                Pilih Pembayaran
              </h3>
            </div>

            <div className="space-y-2.5">
              {paymentOptions.map((opt) => {
                const isSelected = paymentMethod === opt.id;
                const Icon = opt.icon;
                return (
                  <button
                    key={opt.id}
                    onClick={() => setPaymentMethod(opt.id)}
                    className={`w-full flex items-center gap-3.5 rounded-[12px] px-3.5 py-3 border transition text-left ${
                      isSelected
                        ? "border-[#006638] bg-[rgba(2,145,84,0.04)] ring-1 ring-[#006638]/20"
                        : "border-black/[0.25] bg-white hover:border-black/40"
                    }`}
                  >
                    <div
                      className={`w-[42px] h-[42px] rounded-[10px] flex items-center justify-center flex-shrink-0 ${
                        isSelected ? "bg-[#006638] text-white" : "bg-[#EAF6F1] text-[#006638]"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-[14px] font-bold text-black">
                          {opt.label}
                        </p>
                        <div
                          className={`w-[20px] h-[20px] rounded-full flex items-center justify-center flex-shrink-0 ${
                            isSelected ? "bg-[#006638]" : "border border-black/30"
                          }`}
                        >
                          {isSelected && (
                            <div className="w-[7px] h-[7px] rounded-full bg-white" />
                          )}
                        </div>
                      </div>
                      <p className="text-[12px] font-semibold text-[#006638] mt-0.5">
                        {opt.channels}
                      </p>
                      <p className="text-[11px] text-black/50 mt-0.5">
                        {opt.description}
                      </p>
                    </div>
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
                      (item.priceNum || 0) * (item.quantity || 1)
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

            {/* Ongkos Kirim Total */}
            <div className="flex justify-between items-center mb-2">
              <span className="text-[14px] font-bold text-black/[0.6]">
                Total Ongkos Kirim
              </span>
              <span
                className={`text-[14px] font-semibold ${totalShippingCost === 0 ? "text-[#006638]" : "text-black"}`}
              >
                {totalShippingCost === 0
                  ? "Gratis / Belum Dipilih"
                  : `Rp ${totalShippingCost.toLocaleString("id-ID")}`}
              </span>
            </div>

            {/* Divider */}
            <div className="border-t border-black/[0.3] my-2" />

            {/* Total Pembayaran */}
            <div className="flex justify-between items-center mb-4">
              <span className="text-[16px] font-bold text-black">
                Total Pembayaran
              </span>
              <span className="text-[16px] font-bold text-[#006638]">
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
