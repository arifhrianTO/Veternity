import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import Hero from "./components/Hero";
import StatsBar from "./components/StatsBar";
import Categories from "./components/Categories";
import FeaturedProducts from "./components/FeaturedProducts";
import KoperasiSection from "./components/KoperasiSection";
import Footer from "./components/Footer";

// Petani
import DashboardPage from "./pages/petani/dashboard";
import ProdukPage from "./pages/petani/produk";
import PesananPage from "./pages/petani/pesanan";
import PenawaranPage from "./pages/petani/penawaran";
import ProfilPage from "./pages/petani/profil";

// Pembeli 
import MarketplacePage from "./pages/pembeli/marketplace";
import KeranjangPage from "./pages/pembeli/keranjang";
import PesananPembeliPage from "./pages/pembeli/pesanan";
import ProfilPembeliPage from "./pages/pembeli/profil";
import CheckoutPage from "./pages/pembeli/checkout";

// Admin
import AdminDashboardPage from "./pages/admin/dashboard";
import PenggunaPage from "./pages/admin/pengguna"; 
import KategoriPage from "./pages/admin/kategori";
import LogistikPage from "./pages/admin/logistik";
import MonitoringPage from "./pages/admin/monitoring";
import AdminProfilPage from "./pages/admin/profil";

// Koperasi
import KoperasiDashboardPage from "./pages/koperasi/dashboard";
import PetaniBinaanPage from "./pages/koperasi/PetaniBinaan"; 
import KelolaProdukPage from "./pages/koperasi/KelolaProduk";
import KoperasiPenawaranPage from "./pages/koperasi/penawaran";
import PengirimanPage from "./pages/koperasi/pengiriman";
import KoperasiProfilPage from "./pages/koperasi/profil";

function HomePage() {
  return (
    <div className="min-h-screen bg-[#F8F7F4] font-sans text-slate-800">
      <Header />
      <Hero />
      <StatsBar />
      <div className="bg-white w-full border-y border-slate-100 py-16">
        <section id="produk" className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-extrabold text-center mb-10 bg-gradient-to-r from-[#00378A] to-[#0453C9] bg-clip-text text-transparent">
            Produk
          </h2>
          <Categories />
          <FeaturedProducts />
        </section>
      </div>
      <KoperasiSection />
      <Footer />
    </div>
  );
}

function App() {
  return (
    <Routes>
      {/* Home / Landing Page */}
      <Route path="/" element={<HomePage />} />

      {/* Rute Petani */}
      <Route path="/petani" element={<Navigate to="/petani/dashboard" replace />} />
      <Route path="/petani/dashboard" element={<DashboardPage />} />
      <Route path="/petani/produk" element={<ProdukPage />} />
      <Route path="/petani/pesanan" element={<PesananPage />} />
      <Route path="/petani/penawaran" element={<PenawaranPage />} />
      <Route path="/petani/profil" element={<ProfilPage />} />

      {/* Rute Pembeli */}
      <Route path="/pembeli" element={<Navigate to="/pembeli/marketplace" replace />} />
      <Route path="/pembeli/marketplace" element={<MarketplacePage />} />
      <Route path="/pembeli/keranjang" element={<KeranjangPage />} />
      <Route path="/pembeli/checkout" element={<CheckoutPage />} />
      <Route path="/pembeli/pesanan" element={<PesananPembeliPage />} />
      <Route path="/pembeli/profil" element={<ProfilPembeliPage />} />

      {/* Rute Admin */}
      <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
      <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
      <Route path="/admin/pengguna" element={<PenggunaPage />} /> 
      <Route path="/admin/kategori" element={<KategoriPage />} />
      <Route path="/admin/logistik" element={<LogistikPage />} />
      <Route path="/admin/monitoring" element={<MonitoringPage />} />
      <Route path="/admin/profil" element={<AdminProfilPage />} />

      {/* Rute Koperasi */}
      <Route path="/koperasi" element={<Navigate to="/koperasi/dashboard" replace />} />
      <Route path="/koperasi/dashboard" element={<KoperasiDashboardPage />} />
      <Route path="/koperasi/PetaniBinaan" element={<PetaniBinaanPage />} />
      <Route path="/koperasi/KelolaProduk" element={<KelolaProdukPage />} />
      <Route path="/koperasi/penawaran" element={<KoperasiPenawaranPage />} />
      <Route path="/koperasi/pengiriman" element={<PengirimanPage />} />
      <Route path="/koperasi/profil" element={<KoperasiProfilPage />} />

      {/* Fallback ke Home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;