<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;

class HomeController extends Controller
{
    /**
     * Statistik ringkas untuk halaman utama (public).
     */
    public function stats()
    {
        $petani = User::whereIn('role', ['petani', 'petani_binaan'])->count();
        $nelayan = User::whereIn('role', ['nelayan', 'nelayan_binaan'])->count();
        $koperasi = User::where('role', 'koperasi')->count();
        $produk = Product::where('status', 'Aktif')->count();
        $transaksi = Order::where('status', 'Selesai')->count();

        return response()->json([
            'success' => true,
            'data' => [
                'petani' => $petani,
                'nelayan' => $nelayan,
                'koperasi' => $koperasi,
                'produk' => $produk,
                'transaksi' => $transaksi,
            ],
        ]);
    }

    /**
     * Daftar koperasi untuk bagian "Koperasi" di halaman utama (public).
     * Menyertakan kota, jumlah anggota binaan, jumlah produk, dan tipe
     * (pertanian/perikanan) yang diambil dari tipe kategori produknya.
     */
    public function koperasi()
    {
        $koperasis = User::with('city')
            ->withCount('binaan')
            ->withCount('products')
            ->where('role', 'koperasi')
            ->orderBy('nama_lengkap')
            ->get()
            ->map(function (User $user) {
                $productTypes = Product::where(function ($q) use ($user) {
                    $q->where('user_id', $user->id)
                        ->orWhereIn('user_id', $user->binaan()->pluck('id'));
                })
                    ->join('categories', 'categories.id', '=', 'products.category_id')
                    ->where('products.status', 'Aktif')
                    ->distinct()
                    ->pluck('categories.tipe');

                $hasPerikanan = $productTypes->contains('perikanan');

                return [
                    'id' => $user->id,
                    'nama' => $user->nama_lengkap,
                    'kota' => $user->city->nama_kota ?? ($user->alamat ?? '-'),
                    'alamat' => $user->alamat ?? '-',
                    'logo' => $user->foto_profil,
                    'jumlah_anggota' => (int) $user->binaan_count,
                    'jumlah_produk' => (int) $user->products_count,
                    'tipe' => $hasPerikanan ? 'Perikanan' : 'Pertanian',
                ];
            });

        return response()->json([
            'success' => true,
            'data' => $koperasis,
        ]);
    }
}
