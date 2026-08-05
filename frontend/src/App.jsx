import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import AuthPage from "./pages/AuthPage";
import DashboardGuard from "./components/layout/DashboardGuard";

// Mitra (Petani & Nelayan)
import MitraDashboardPage from "./pages/mitra/dashboard";
import MitraProdukPage from "./pages/mitra/produk";
import MitraPesananPage from "./pages/mitra/pesanan";
import MitraPenawaranPage from "./pages/mitra/penawaran";

// Universal
import ProfilPage from "./pages/common/Profil";

// Pembeli 
import MarketplacePage from "./pages/pembeli/marketplace";
import KeranjangPage from "./pages/pembeli/keranjang";
import PesananPembeliPage from "./pages/pembeli/pesanan";
import PenawaranPembeliPage from "./pages/pembeli/penawaran";
import CheckoutPage from "./pages/pembeli/checkout";
// Admin
import AdminDashboardPage from "./pages/admin/dashboard";
import PenggunaPage from "./pages/admin/pengguna"; 
import KategoriPage from "./pages/admin/kategori";
import LogistikPage from "./pages/admin/logistik";
import MonitoringPage from "./pages/admin/monitoring";

// Koperasi
import KoperasiDashboardPage from "./pages/koperasi/dashboard";
import MitraBinaanPage from "./pages/koperasi/MitraBinaan"; 
import DetailMitraPage from "./pages/koperasi/DetailMitra";
import KelolaProdukPage from "./pages/koperasi/KelolaProduk";
import KoperasiPenawaranPage from "./pages/koperasi/penawaran";
import PengirimanPage from "./pages/koperasi/pengiriman";

function App() {
  return (
    <Routes>
      {/* Home / Landing Page */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<AuthPage />} />
      <Route path="/register" element={<AuthPage />} />

      {/* Rute Mitra (Petani) — hanya role petani & petani_binaan */}
      <Route element={<DashboardGuard allowedRoles={["petani", "petani_binaan"]} />}>
        <Route path="/petani" element={<Navigate to="/petani/dashboard" replace />} />
        <Route path="/petani/dashboard" element={<MitraDashboardPage />} />
        <Route path="/petani/produk" element={<MitraProdukPage />} />
        <Route path="/petani/pesanan" element={<MitraPesananPage />} />
        <Route path="/petani/penawaran" element={<MitraPenawaranPage />} />
        <Route path="/petani/profil" element={<ProfilPage />} />
      </Route>

      {/* Rute Mitra (Nelayan) — hanya role nelayan & nelayan_binaan */}
      <Route element={<DashboardGuard allowedRoles={["nelayan", "nelayan_binaan"]} />}>
        <Route path="/nelayan" element={<Navigate to="/nelayan/dashboard" replace />} />
        <Route path="/nelayan/dashboard" element={<MitraDashboardPage />} />
        <Route path="/nelayan/produk" element={<MitraProdukPage />} />
        <Route path="/nelayan/pesanan" element={<MitraPesananPage />} />
        <Route path="/nelayan/penawaran" element={<MitraPenawaranPage />} />
        <Route path="/nelayan/profil" element={<ProfilPage />} />
      </Route>

      {/* Rute Pembeli — hanya role pembeli */}
      <Route element={<DashboardGuard allowedRoles={["pembeli"]} />}>
        <Route path="/pembeli" element={<Navigate to="/pembeli/marketplace" replace />} />
        <Route path="/pembeli/marketplace" element={<MarketplacePage />} />
        <Route path="/pembeli/keranjang" element={<KeranjangPage />} />
        <Route path="/pembeli/checkout" element={<CheckoutPage />} />
        <Route path="/pembeli/pesanan" element={<PesananPembeliPage />} />
        <Route path="/pembeli/penawaran" element={<PenawaranPembeliPage />} />
        <Route path="/pembeli/profil" element={<ProfilPage />} />
      </Route>

      {/* Rute Admin — hanya role admin */}
      <Route element={<DashboardGuard allowedRoles={["admin"]} />}>
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
        <Route path="/admin/pengguna" element={<PenggunaPage />} /> 
        <Route path="/admin/kategori" element={<KategoriPage />} />
        <Route path="/admin/logistik" element={<LogistikPage />} />
        <Route path="/admin/monitoring" element={<MonitoringPage />} />
        <Route path="/admin/profil" element={<ProfilPage />} />
      </Route>

      {/* Rute Koperasi — hanya role koperasi */}
      <Route element={<DashboardGuard allowedRoles={["koperasi"]} />}>
        <Route path="/koperasi" element={<Navigate to="/koperasi/dashboard" replace />} />
        <Route path="/koperasi/dashboard" element={<KoperasiDashboardPage />} />
        <Route path="/koperasi/petani-binaan" element={<MitraBinaanPage />} />
        <Route path="/koperasi/petani-binaan/:id" element={<DetailMitraPage />} />
        <Route path="/koperasi/nelayan-binaan" element={<MitraBinaanPage />} />
        <Route path="/koperasi/nelayan-binaan/:id" element={<DetailMitraPage />} />
        <Route path="/koperasi/KelolaProduk" element={<KelolaProdukPage />} />
        <Route path="/koperasi/penawaran" element={<KoperasiPenawaranPage />} />
        <Route path="/koperasi/pengiriman" element={<PengirimanPage />} />
        <Route path="/koperasi/profil" element={<ProfilPage />} />
      </Route>

      {/* Fallback ke Home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
