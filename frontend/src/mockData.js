import {
  Leaf,
  Sailboat,
  ShoppingBag,
  ShoppingCart,
  Store,
  Fish,
  Wheat,
  Carrot,
  Apple,
} from "lucide-react";

export const categories = [
  { name: "Sayur", image: "/images/sayur.png", bg: "bg-emerald-50" },
  { name: "Buah", image: "/images/buah.png", bg: "bg-emerald-50" },
  { name: "Ikan", image: "/images/ikan.png", bg: "bg-sky-50" },
  { name: "Beras", image: "/images/beras.png", bg: "bg-amber-50" },
  { name: "Umbi", image: "/images/umbi.png", bg: "bg-orange-50" },
];

export const products = [
  {
    name: "Beras Premium",
    location: "Bogor, Jawa Barat",
    price: "Rp 14.000",
    unit: "/kg",
    rating: 4.8,
    koperasi: "Koperasi Makmur",
    image: "/images/beras1.png",
  },
  {
    name: "Ikan Tongkol Segar",
    location: "Batam, Kepulauan Riau",
    price: "Rp 34.000",
    unit: "/kg",
    rating: 4.9,
    koperasi: "Koperasi Sejahtera",
    image: "/images/ikan1.png",
  },
  {
    name: "Telur",
    location: "Bandung, Jawa Barat",
    price: "Rp 25.000",
    unit: "/kg",
    rating: 4.5,
    koperasi: "Koperasi Maju",
    image: "/images/telur.png",
  },
  {
    name: "Udang Segar",
    location: "Batam, Kepulauan Riau",
    price: "Rp 50.000",
    unit: "/kg",
    rating: 4.8,
    koperasi: "Koperasi Sejahtera",
    image: "/images/udang.png",
  },
];

export const koperasiList = [
  { name: "Koperasi Makmur", location: "Bogor, Jawa Barat", tag: "Pertanian", tagColor: "bg-emerald-100 text-emerald-700", avatar: "bg-rose-100" },
  { name: "Koperasi Sejahtera", location: "Batam, Kepulauan Riau", tag: "Perikanan", tagColor: "bg-sky-100 text-sky-700", avatar: "bg-slate-100" },
  { name: "Koperasi Maju", location: "Bandung, Jawa Barat", tag: "Pertanian & Perikanan", tagColor: "bg-teal-100 text-teal-700", avatar: "bg-slate-100" },
  { name: "Koperasi Makmur", location: "Bogor, Jawa Barat", tag: "Pertanian", tagColor: "bg-emerald-100 text-emerald-700", avatar: "bg-rose-100" },
  { name: "Koperasi Sejahtera", location: "Batam, Kepulauan Riau", tag: "Perikanan", tagColor: "bg-sky-100 text-sky-700", avatar: "bg-slate-100" },
  { name: "Koperasi Maju", location: "Bandung, Jawa Barat", tag: "Pertanian & Perikanan", tagColor: "bg-teal-100 text-teal-700", avatar: "bg-slate-100" },
];

export const stats = [
  { icon: Leaf, iconBg: "bg-emerald-100 text-emerald-600", value: "150", label: "Petani Terdaftar" },
  { icon: Sailboat, iconBg: "bg-blue-100 text-blue-600", value: "132", label: "Nelayan Terdaftar", valueColor: "text-blue-700" },
  { icon: ShoppingBag, iconBg: "bg-orange-100 text-orange-600", value: "1250", label: "Produk Terdaftar", valueColor: "text-orange-600" },
  { icon: ShoppingCart, iconBg: "bg-purple-100 text-purple-600", value: "5476", label: "Transaksi Sukses", valueColor: "text-purple-700" },
  { icon: Store, iconBg: "bg-red-100 text-red-500", value: "25", label: "Koperasi Mitra", valueColor: "text-red-600" },
];

export const filters = ["Semua", "Pertanian", "Perikanan"];
