import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import AuthPage from "./pages/AuthPage";

// Petani
import DashboardPage from "./pages/petani/dashboard";
import ProdukPage from "./pages/petani/produk";
import PesananPage from "./pages/petani/pesanan";
import PenawaranPage from "./pages/petani/penawaran";
import ProfilPage from "./pages/petani/profil";

// Nelayan
import DashboardNelayanPage from "./pages/nelayan/dashboard";
import ProdukNelayanPage from "./pages/nelayan/produk";
import PesananNelayanPage from "./pages/nelayan/pesanan";
import PenawaranNelayanPage from "./pages/nelayan/penawaran";
import ProfilNelayanPage from "./pages/nelayan/profil";

// Pembeli 
import MarketplacePage from "./pages/pembeli/marketplace";
import KeranjangPage from "./pages/pembeli/keranjang";
import PesananPembeliPage from "./pages/pembeli/pesanan";
import PenawaranPembeliPage from "./pages/pembeli/penawaran";
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
import NelayanBinaanPage from "./pages/koperasi/NelayanBinaan";
import DetailPetaniPage from "./pages/koperasi/DetailPetani";
import DetailNelayanPage from "./pages/koperasi/DetailNelayan";
import KelolaProdukPage from "./pages/koperasi/KelolaProduk";
import KoperasiPenawaranPage from "./pages/koperasi/penawaran";
import PengirimanPage from "./pages/koperasi/pengiriman";
import KoperasiProfilPage from "./pages/koperasi/profil";
import DashboardGuard from "./components/layout/DashboardGuard";

function App() {
  return (
    <Routes>
      {/* Home / Landing Page */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<AuthPage />} />
      <Route path="/register" element={<AuthPage />} />

      {/* Rute Petani — hanya role petani & petani_binaan */}
      <Route element={<DashboardGuard allowedRoles={["petani", "petani_binaan"]} />}>
        <Route path="/petani" element={<Navigate to="/petani/dashboard" replace />} />
        <Route path="/petani/dashboard" element={<DashboardPage />} />
        <Route path="/petani/produk" element={<ProdukPage />} />
        <Route path="/petani/pesanan" element={<PesananPage />} />
        <Route path="/petani/penawaran" element={<PenawaranPage />} />
        <Route path="/petani/profil" element={<ProfilPage />} />
      </Route>

      {/* Rute Nelayan — hanya role nelayan & nelayan_binaan */}
      <Route element={<DashboardGuard allowedRoles={["nelayan", "nelayan_binaan"]} />}>
        <Route path="/nelayan" element={<Navigate to="/nelayan/dashboard" replace />} />
        <Route path="/nelayan/dashboard" element={<DashboardNelayanPage />} />
        <Route path="/nelayan/produk" element={<ProdukNelayanPage />} />
        <Route path="/nelayan/pesanan" element={<PesananNelayanPage />} />
        <Route path="/nelayan/penawaran" element={<PenawaranNelayanPage />} />
        <Route path="/nelayan/profil" element={<ProfilNelayanPage />} />
      </Route>

      {/* Rute Pembeli — hanya role pembeli */}
      <Route element={<DashboardGuard allowedRoles={["pembeli"]} />}>
        <Route path="/pembeli" element={<Navigate to="/pembeli/marketplace" replace />} />
        <Route path="/pembeli/marketplace" element={<MarketplacePage />} />
        <Route path="/pembeli/keranjang" element={<KeranjangPage />} />
        <Route path="/pembeli/checkout" element={<CheckoutPage />} />
        <Route path="/pembeli/pesanan" element={<PesananPembeliPage />} />
        <Route path="/pembeli/profil" element={<ProfilPembeliPage />} />
      </Route>

      {/* Rute Admin — hanya role admin */}
      <Route element={<DashboardGuard allowedRoles={["admin"]} />}>
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
        <Route path="/admin/pengguna" element={<PenggunaPage />} /> 
        <Route path="/admin/kategori" element={<KategoriPage />} />
        <Route path="/admin/logistik" element={<LogistikPage />} />
        <Route path="/admin/monitoring" element={<MonitoringPage />} />
        <Route path="/admin/profil" element={<AdminProfilPage />} />
      </Route>

      {/* Rute Koperasi — hanya role koperasi */}
      <Route element={<DashboardGuard allowedRoles={["koperasi"]} />}>
        <Route path="/koperasi" element={<Navigate to="/koperasi/dashboard" replace />} />
        <Route path="/koperasi/dashboard" element={<KoperasiDashboardPage />} />
        <Route path="/koperasi/PetaniBinaan" element={<PetaniBinaanPage />} />
        <Route path="/koperasi/petani-binaan/:id" element={<DetailPetaniPage />} />
        <Route path="/koperasi/nelayan-binaan" element={<NelayanBinaanPage />} />
        <Route path="/koperasi/nelayan-binaan/:id" element={<DetailNelayanPage />} />
        <Route path="/koperasi/KelolaProduk" element={<KelolaProdukPage />} />
        <Route path="/koperasi/penawaran" element={<KoperasiPenawaranPage />} />
        <Route path="/koperasi/pengiriman" element={<PengirimanPage />} />
        <Route path="/koperasi/profil" element={<KoperasiProfilPage />} />
      </Route>

      {/* Fallback ke Home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
