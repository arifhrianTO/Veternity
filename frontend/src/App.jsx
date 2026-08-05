import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import AuthPage from "./pages/AuthPage";
import RequireAuth from "./components/common/RequireAuth";

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
import KoperasiProfilPage from "./pages/koperasi/profil";
import DashboardGuard from "./components/layout/DashboardGuard";

function App() {
  return (
    <Routes>
      {/* Home / Landing Page */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<AuthPage />} />
      <Route path="/register" element={<AuthPage />} />

      {/* Rute Petani */}
      <Route path="/petani" element={<Navigate to="/petani/dashboard" replace />} />
      <Route path="/petani/dashboard" element={<RequireAuth><MitraDashboardPage /></RequireAuth>} />
      <Route path="/petani/produk" element={<RequireAuth><MitraProdukPage /></RequireAuth>} />
      <Route path="/petani/pesanan" element={<RequireAuth><MitraPesananPage /></RequireAuth>} />
      <Route path="/petani/penawaran" element={<RequireAuth><MitraPenawaranPage /></RequireAuth>} />
      <Route path="/petani/profil" element={<RequireAuth><ProfilPage /></RequireAuth>} />

      {/* Rute Nelayan */}
      <Route path="/nelayan" element={<Navigate to="/nelayan/dashboard" replace />} />
      <Route path="/nelayan/dashboard" element={<RequireAuth><MitraDashboardPage /></RequireAuth>} />
      <Route path="/nelayan/produk" element={<RequireAuth><MitraProdukPage /></RequireAuth>} />
      <Route path="/nelayan/pesanan" element={<RequireAuth><MitraPesananPage /></RequireAuth>} />
      <Route path="/nelayan/penawaran" element={<RequireAuth><MitraPenawaranPage /></RequireAuth>} />
      <Route path="/nelayan/profil" element={<RequireAuth><ProfilPage /></RequireAuth>} />

      {/* Rute Pembeli */}
      <Route path="/pembeli" element={<Navigate to="/pembeli/marketplace" replace />} />
      <Route path="/pembeli/marketplace" element={<RequireAuth><MarketplacePage /></RequireAuth>} />
      <Route path="/pembeli/keranjang" element={<RequireAuth><KeranjangPage /></RequireAuth>} />
      <Route path="/pembeli/checkout" element={<RequireAuth><CheckoutPage /></RequireAuth>} />
      <Route path="/pembeli/pesanan" element={<RequireAuth><PesananPembeliPage /></RequireAuth>} />
      <Route path="/pembeli/penawaran" element={<RequireAuth><PenawaranPembeliPage /></RequireAuth>} />
      <Route path="/pembeli/profil" element={<RequireAuth><ProfilPage /></RequireAuth>} />

      {/* Rute Admin */}
      <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
      <Route path="/admin/dashboard" element={<RequireAuth><AdminDashboardPage /></RequireAuth>} />
      <Route path="/admin/pengguna" element={<RequireAuth><PenggunaPage /></RequireAuth>} />
      <Route path="/admin/kategori" element={<RequireAuth><KategoriPage /></RequireAuth>} />
      <Route path="/admin/logistik" element={<RequireAuth><LogistikPage /></RequireAuth>} />
      <Route path="/admin/monitoring" element={<RequireAuth><MonitoringPage /></RequireAuth>} />
      <Route path="/admin/profil" element={<RequireAuth><ProfilPage /></RequireAuth>} />

      {/* Rute Koperasi */}
      <Route path="/koperasi" element={<Navigate to="/koperasi/dashboard" replace />} />
      <Route path="/koperasi/dashboard" element={<RequireAuth><KoperasiDashboardPage /></RequireAuth>} />
      <Route path="/koperasi/petani-binaan" element={<RequireAuth><MitraBinaanPage /></RequireAuth>} />
      <Route path="/koperasi/petani-binaan/:id" element={<RequireAuth><DetailMitraPage /></RequireAuth>} />
      <Route path="/koperasi/nelayan-binaan" element={<RequireAuth><MitraBinaanPage /></RequireAuth>} />
      <Route path="/koperasi/nelayan-binaan/:id" element={<RequireAuth><DetailMitraPage /></RequireAuth>} />
      <Route path="/koperasi/KelolaProduk" element={<RequireAuth><KelolaProdukPage /></RequireAuth>} />
      <Route path="/koperasi/penawaran" element={<RequireAuth><KoperasiPenawaranPage /></RequireAuth>} />
      <Route path="/koperasi/pengiriman" element={<RequireAuth><PengirimanPage /></RequireAuth>} />
      <Route path="/koperasi/profil" element={<RequireAuth><ProfilPage /></RequireAuth>} />
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
