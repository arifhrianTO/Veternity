import { useEffect, useState } from "react";
import { X, Check, Truck, Loader2 } from "lucide-react";
import api from "../../config/axios";

const defaultTrackingSteps = [
  { key: "created", label: "Pesanan dibuat" },
  { key: "processed", label: "Diproses" },
  { key: "shipped", label: "Dikirim" },
  { key: "completed", label: "Selesai" },
];

function getStatusBadgePopup(status) {
  switch (status) {
    case "Dikirim":
      return { bg: "bg-[rgba(105,147,255,0.19)]", border: "border-[#00378A]", text: "text-[#00378A]" };
    case "Menunggu Pembayaran":
      return { bg: "bg-[rgba(255,212,105,0.19)]", border: "border-[#956100]", text: "text-[#DC8800]" };
    case "Diproses":
      return { bg: "bg-[rgba(172,105,255,0.19)]", border: "border-[#520066]", text: "text-[#4B0066]" };
    case "Selesai":
      return { bg: "bg-[rgba(105,255,120,0.19)]", border: "border-[#008A1E]", text: "text-[#006638]" };
    default:
      return { bg: "bg-slate-100", border: "border-slate-300", text: "text-slate-600" };
  }
}

export default function OrderDetailModal({ order, onClose }) {
  const [trackingHistory, setTrackingHistory] = useState([]);
  const [isLoadingTracking, setIsLoadingTracking] = useState(false);
  const [trackingError, setTrackingError] = useState("");

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  // Escape key close
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  // Fetch tracking data if order is shipped and has a waybill
  useEffect(() => {
    const fetchTracking = async () => {
      const resi = order.tracking?.resi;
      const courier = order.tracking?.courier || "jne";

      if (order.status === "Dikirim" && resi) {
        setIsLoadingTracking(true);
        try {
          const res = await api.post("/shipping/track", {
            waybill: resi,
            courier: courier,
          });

          if (res.data.success && res.data.data.manifest) {
            setTrackingHistory(res.data.data.manifest);
          } else {
             // Fallback history jika resi belum terdaftar/dummy
             setTrackingHistory([
               { manifest_description: "Pesanan diserahkan ke kurir (Data Dummy)", manifest_date: order.tracking.created, manifest_time: "" }
             ]);
          }
        } catch (error) {
          console.error("Gagal melacak pesanan:", error);
          setTrackingError("Gagal mengambil status kurir terbaru.");
        } finally {
          setIsLoadingTracking(false);
        }
      }
    };

    fetchTracking();
  }, [order]);

  if (!order) return null;

  const tracking = order.tracking || { currentStep: 1 };
  const currentStep = order.status === "Selesai" ? 4 : order.status === "Dikirim" ? 3 : order.status === "Diproses" ? 2 : 1;
  const badge = getStatusBadgePopup(order.status);

  const handleConfirmReceived = async () => {
    try {
      // Update status ke backend
      await api.put(`/orders/${order.id}`, {
        status: "Selesai"
      });
      alert("Pesanan dikonfirmasi diterima!");
      window.location.reload(); // Refresh the page to update the order list
    } catch (error) {
      console.error("Gagal mengonfirmasi pesanan:", error);
      alert("Gagal mengonfirmasi pesanan. Coba lagi.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={onClose}>
      {/* Dark backdrop */}
      <div className="absolute inset-0 bg-black/[0.43]" />

      {/* Modal - 622x752, white, rounded-20 */}
      <div
        className="relative bg-white rounded-[20px] w-[95vw] max-w-[622px] max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button - red circle */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-[40px] h-[40px] bg-[#A20003] hover:bg-[#8a0003] rounded-full flex items-center justify-center transition-colors"
        >
          <X className="w-[20px] h-[20px] text-white" strokeWidth={3.5} />
        </button>

        <div className="p-8">
          {/* Title */}
          <h2 className="text-[24px] font-bold text-[#273B4A] leading-[29px]">Detail Pesanan</h2>

          {/* Divider */}
          <div className="border-b border-black/[0.15] my-4" />

          {/* No Pesanan label + value + status badge */}
          <p className="text-[14px] font-bold text-slate-400 uppercase tracking-wider">no pesanan</p>
          <div className="flex items-center justify-between mt-1">
            <span className="text-[18px] font-bold text-[#273B4A]">{order.kode_pesanan || order.id}</span>
            <span
              className={`inline-flex items-center justify-center px-3 py-1 rounded-[3px] border text-[14px] font-bold ${badge.bg} ${badge.border} ${badge.text}`}
            >
              {order.status}
            </span>
          </div>

          {/* Divider */}
          <div className="border-b border-black/[0.15] my-4" />

          {/* Tracking Pesanan */}
          <h3 className="text-[18px] font-bold text-[#273B4A] mb-6">Tracking Pesanan</h3>

          {/* Tracking timeline */}
          <div className="flex items-start justify-between mb-6 px-2">
            {defaultTrackingSteps.map((step, idx) => {
              const stepNum = idx + 1;
              const isDone = stepNum <= currentStep;
              const isShippingStep = step.key === "shipped";

              // Get timestamp for this step
              const timestamp = tracking[step.key];

              return (
                <div key={step.key} className="flex flex-col items-center relative" style={{ flex: 1 }}>
                  {/* Connector line (before circle, not on first) */}
                  {idx > 0 && (
                    <div
                      className={`absolute top-[20px] right-1/2 h-[5px] ${
                        isDone ? "bg-[#029154]" : "bg-black/[0.15]"
                      }`}
                      style={{ width: "100%", zIndex: 0 }}
                    />
                  )}

                  {/* Circle */}
                  <div
                    className={`relative z-10 w-[40px] h-[40px] rounded-full flex items-center justify-center ${
                      isDone ? "bg-[#029154]" : "bg-black/[0.15]"
                    }`}
                  >
                    {isShippingStep && isDone ? (
                      <Truck className="w-5 h-5 text-white" />
                    ) : (
                      <Check className="w-5 h-5 text-white" strokeWidth={3} />
                    )}
                  </div>

                  {/* Label */}
                  <span className="text-[13px] md:text-[14px] font-bold text-black text-center mt-2 leading-[15px]">
                    {step.label}
                  </span>

                  {/* Timestamp */}
                  <span className="text-[12px] md:text-[13px] font-medium text-black/[0.4] text-center mt-1 leading-[15px]">
                    {timestamp || (isDone ? "Selesai" : "-")}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Live Courier Tracking Section */}
          {order.status === "Dikirim" && order.tracking?.resi && (
            <div className="mb-6 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <h4 className="text-[14px] font-bold text-[#273B4A] mb-3">
                Riwayat Perjalanan (Resi: <span className="uppercase">{order.tracking.resi}</span>)
              </h4>
              
              {isLoadingTracking ? (
                <div className="flex items-center gap-2 text-[#006638]">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-[13px] font-medium">Melacak paket...</span>
                </div>
              ) : trackingError ? (
                <div className="text-[13px] text-red-500 font-medium">{trackingError}</div>
              ) : trackingHistory.length > 0 ? (
                <div className="space-y-3 mt-2">
                  {trackingHistory.map((history, idx) => (
                    <div key={idx} className="flex gap-3 text-[13px]">
                      <div className="w-[120px] flex-shrink-0 text-slate-500 font-medium">
                        {history.manifest_date} <br/> {history.manifest_time}
                      </div>
                      <div className="flex-1 text-[#273B4A] font-semibold border-l-2 border-[#006638] pl-3">
                        {history.manifest_description}
                        {history.city_name ? ` - ${history.city_name}` : ''}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                 <div className="text-[13px] text-slate-500 font-medium">Menunggu update dari kurir...</div>
              )}
            </div>
          )}

          {/* Divider */}
          <div className="border-b border-black/[0.15] my-4" />

          {/* Rincian Pesanan */}
          <h3 className="text-[18px] font-bold text-[#273B4A] mb-4">Rincian Pesanan</h3>

          {/* Product rows */}
          <div className="space-y-3">
            {(order.products || []).map((product, idx) => {
              const qty = product.quantity || 1;
              const priceNum = parseInt((product.price || "0").replace(/[^0-9]/g, ""), 10);
              const lineTotal = priceNum * qty;

              return (
                <div key={idx} className="flex items-center justify-between">
                  <span className="text-[15px] md:text-[16px] font-semibold text-black/[0.7] flex-1">
                    {product.name}
                  </span>
                  <span className="text-[15px] md:text-[16px] font-medium text-black/[0.5] w-[80px] text-center">
                    {qty} kg
                  </span>
                  <span className="text-[15px] md:text-[16px] font-bold text-black w-[140px] text-right">
                    Rp {lineTotal.toLocaleString("id-ID")}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Konfirmasi Diterima button - only show for "Dikirim" status */}
          {order.status === "Dikirim" && (
            <button
              onClick={handleConfirmReceived}
              className="w-full h-[50px] bg-[#006638] hover:bg-[#00522c] rounded-[10px] mt-8 flex items-center justify-center gap-2 transition"
            >
              <Check className="w-[20px] h-[20px] text-white" strokeWidth={3} />
              <span className="text-[18px] font-bold text-white">Konfirmasi Diterima</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
