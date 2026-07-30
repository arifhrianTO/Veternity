import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

// Petani
import DashboardPage from "./pages/petani/Dashboard";
import ProdukPage from "./pages/petani/Produk";
import PesananPage from "./pages/petani/Pesanan";
import PenawaranPage from "./pages/petani/Penawaran";
import ProfilPage from "./pages/petani/Profil";

// Pembeli 
import MarketplacePage from "./pages/pembeli/Marketplace";
import KeranjangPage from "./pages/pembeli/Keranjang";
import PesananPembeliPage from "./pages/pembeli/Pesanan";
import ProfilPembeliPage from "./pages/pembeli/Profil";
import CheckoutPage from "./pages/pembeli/Checkout";

function App() {
  return (
    <Routes>
      {/* Home / Landing Page */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

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
