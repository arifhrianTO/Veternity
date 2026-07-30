import { Wheat, Briefcase, ShoppingBag, Clock } from "lucide-react";

export const dashboardMetrics = [
  { title: "Hasil Panen", value: "250 KG", subtitle: "Total bulan ini", icon: Wheat, accent: "from-[#029154] to-[#00B467]" },
  { title: "Pendapatan", value: "Rp 4.000.000", subtitle: "Total bulan ini", icon: Briefcase, accent: "from-[#0646C7] to-[#001FEC]" },
  { title: "Produk Aktif", value: "5", subtitle: "Produk", icon: ShoppingBag, accent: "from-[#FF7700] to-[#FFB619]" },
  { title: "Produk Hampir Kadaluarsa", value: "2", subtitle: "Produk", icon: Clock, accent: "from-red-600 to-red-500" },
];

export const latestOffers = [
  { id: "OF-1241", buyer: "PT Makmur", product: "Beras Premium", quantity: "55 kg", offerPrice: "Rp 14.000 / kg", status: "Baru", statusVariant: "emerald", date: "01 Jan 2026" },
  { id: "OF-1242", buyer: "PT Sejahtera", product: "Ikan Tongkol Segar", quantity: "90 kg", offerPrice: "Rp 33.000 / kg", status: "Menunggu respon", statusVariant: "yellow", date: "01 Jan 2026" },
  { id: "OF-1243", buyer: "PT Santoso", product: "Telur", quantity: "40 kg", offerPrice: "Rp 24.500 / kg", status: "Selesai", statusVariant: "blue", date: "03 Jan 2026" },
];

export const latestOrders = [
  { id: "PO-9001", buyer: "Koperasi Sejahtera", product: "Beras Premium", quantity: "50 kg", total: "Rp 700.000", status: "Dalam Proses", statusVariant: "yellow", date: "02 Jan 2026" },
  { id: "PO-9002", buyer: "PT Makmur", product: "Ikan Tongkol Segar", quantity: "70 kg", total: "Rp 2.380.000", status: "Dikirim", statusVariant: "blue", date: "03 Jan 2026" },
  { id: "PO-9003", buyer: "Koperasi Maju", product: "Telur", quantity: "100 kg", total: "Rp 2.500.000", status: "Selesai", statusVariant: "emerald", date: "01 Jan 2026" },
];
