import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import Hero from "./components/Hero";
import StatsBar from "./components/StatsBar";
import Categories from "./components/Categories";
import FeaturedProducts from "./components/FeaturedProducts";
import KoperasiSection from "./components/KoperasiSection";
import Footer from "./components/Footer";
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

function HomePage() {
  return (
    <div className="min-h-screen bg-[#F8F7F4] font-sans text-slate-800">
      <Header />
      <Hero />
      <StatsBar />
      {/* Bungkus bagian Produk dengan background putih penuh */}
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

      {/* Fallback ke Home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
