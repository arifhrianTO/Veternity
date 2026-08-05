<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Product;
use App\Models\Order;
use App\Models\Offer;
use App\Models\OrderItem;
use App\Models\User;
use App\Traits\KoperasiScope;

class DashboardController extends Controller
{
    use KoperasiScope;

    public function petani(Request $request)
    {
        $userId = $request->user()->id;

        // 1. Total Hasil Panen (Jumlah semua stok produk)
        $totalHasilPanen = Product::where('user_id', $userId)->sum('stok');

        // 2. Pendapatan (Total dari order yang selesai)
        $pendapatan = Order::where('petani_id', $userId)
            ->where('status', 'Selesai')
            ->sum('total_harga');

        // 3. Produk Aktif
        $produkAktif = Product::where('user_id', $userId)
            ->where('status', 'Aktif')
            ->count();

        // 4. Produk Hampir Kadaluarsa (Masa layak <= 3 hari - sebagai contoh)
        $produkHampirKadaluarsa = Product::where('user_id', $userId)
            ->where('masa_layak', '<=', 3)
            ->count();

        // 5. Penawaran Terbaru (3 terbaru)
        $latestOffers = Offer::with(['pembeli', 'product'])
            ->where('petani_id', $userId)
            ->orderBy('created_at', 'desc')
            ->take(3)
            ->get()
            ->map(function ($offer) {
                return [
                    'id' => $offer->kode_penawaran,
                    'buyer' => $offer->pembeli->nama_lengkap ?? 'Unknown',
                    'product' => $offer->product ? ($offer->product.nama_produk ?? $offer->product.category->nama_kategori ?? 'Unknown') : 'Unknown',
                    'quantity' => $offer->jumlah_diminta . ' ' . ($offer->product->satuan ?? 'Kg'),
                    'offerPrice' => 'Rp ' . number_format($offer->harga_tawaran, 0, ',', '.'),
                    'status' => $offer->status,
                    'statusVariant' => $this->getOfferVariant($offer->status),
                    'date' => $offer->created_at->format('d M Y')
                ];
            });

        // 6. Pesanan Terbaru (3 terbaru)
        $latestOrders = Order::with(['pembeli'])
            ->where('petani_id', $userId)
            ->orderBy('created_at', 'desc')
            ->take(3)
            ->get()
            ->map(function ($order) {
                return [
                    'id' => $order->kode_pesanan,
                    'buyer' => $order->pembeli->nama_lengkap ?? 'Unknown',
                    // Ambil nama produk dari item pertama untuk representasi sederhana di dashboard
                    'product' => 'Berbagai Produk', 
                    'quantity' => '-',
                    'total' => 'Rp ' . number_format($order->total_harga, 0, ',', '.'),
                    'status' => $order->status,
                    'statusVariant' => $this->getOrderVariant($order->status),
                    'date' => $order->created_at->format('d M Y')
                ];
            });

        return response()->json([
            'stats' => [
                'totalHasilPanen' => $totalHasilPanen . ' KG',
                'pendapatan' => 'Rp ' . number_format($pendapatan, 0, ',', '.'),
                'produkAktif' => (string) $produkAktif,
                'produkHampirKadaluarsa' => (string) $produkHampirKadaluarsa
            ],
            'latestOffers' => $latestOffers,
            'latestOrders' => $latestOrders
        ]);
    }

    public function nelayan(Request $request)
    {
        $userId = $request->user()->id;

        // 1. Total Hasil Panen (Jumlah semua stok produk)
        $totalHasilPanen = Product::where('user_id', $userId)->sum('stok');

        // 2. Pendapatan (Total dari order yang selesai)
        $pendapatan = Order::where('petani_id', $userId)
            ->where('status', 'Selesai')
            ->sum('total_harga');

        // 3. Produk Aktif
        $produkAktif = Product::where('user_id', $userId)
            ->where('status', 'Aktif')
            ->count();

        // 4. Produk Hampir Kadaluarsa (Masa layak <= 3 hari - sebagai contoh)
        $produkHampirKadaluarsa = Product::where('user_id', $userId)
            ->where('masa_layak', '<=', 3)
            ->count();

        // 5. Penawaran Terbaru (3 terbaru)
        $latestOffers = Offer::with(['pembeli', 'product'])
            ->where('petani_id', $userId)
            ->orderBy('created_at', 'desc')
            ->take(3)
            ->get()
            ->map(function ($offer) {
                return [
                    'id' => $offer->kode_penawaran,
                    'buyer' => $offer->pembeli->nama_lengkap ?? 'Unknown',
                    'product' => $offer->product ? ($offer->product.nama_produk ?? $offer->product.category->nama_kategori ?? 'Unknown') : 'Unknown',
                    'quantity' => $offer->jumlah_diminta . ' ' . ($offer->product->satuan ?? 'Kg'),
                    'offerPrice' => 'Rp ' . number_format($offer->harga_tawaran, 0, ',', '.'),
                    'status' => $offer->status,
                    'statusVariant' => $this->getOfferVariant($offer->status),
                    'date' => $offer->created_at->format('d M Y')
                ];
            });

        // 6. Pesanan Terbaru (3 terbaru)
        $latestOrders = Order::with(['pembeli'])
            ->where('petani_id', $userId)
            ->orderBy('created_at', 'desc')
            ->take(3)
            ->get()
            ->map(function ($order) {
                return [
                    'id' => $order->kode_pesanan,
                    'buyer' => $order->pembeli->nama_lengkap ?? 'Unknown',
                    // Ambil nama produk dari item pertama untuk representasi sederhana di dashboard
                    'product' => 'Berbagai Produk', 
                    'quantity' => '-',
                    'total' => 'Rp ' . number_format($order->total_harga, 0, ',', '.'),
                    'status' => $order->status,
                    'statusVariant' => $this->getOrderVariant($order->status),
                    'date' => $order->created_at->format('d M Y')
                ];
            });

        return response()->json([
            'stats' => [
                'totalHasilPanen' => $totalHasilPanen . ' KG',
                'pendapatan' => 'Rp ' . number_format($pendapatan, 0, ',', '.'),
                'produkAktif' => (string) $produkAktif,
                'produkHampirKadaluarsa' => (string) $produkHampirKadaluarsa
            ],
            'latestOffers' => $latestOffers,
            'latestOrders' => $latestOrders
        ]);
    }

    private function getOfferVariant($status) {
        if ($status === 'Diterima') return 'emerald';
        if ($status === 'Menunggu') return 'yellow';
        if ($status === 'Ditolak') return 'red';
        return 'blue';
    }

    private function getOrderVariant($status) {
        if ($status === 'Selesai') return 'emerald';
        if ($status === 'Dikirim') return 'blue';
        if ($status === 'Diproses') return 'purple';
        if ($status === 'Menunggu Pembayaran') return 'yellow';
        return 'slate';
    }

    public function koperasi(Request $request)
    {
        $user = $request->user();
        $ids = $this->sellerIds($user);

        // 1. Jumlah anggota binaan
        $petaniBinaan = User::where('koperasi_id', $user->id)
            ->where('role', 'petani_binaan')
            ->count();
        $nelayanBinaan = User::where('koperasi_id', $user->id)
            ->where('role', 'nelayan_binaan')
            ->count();

        // 2. Produk aktif (koperasi + binaan)
        $produkAktif = Product::whereIn('user_id', $ids)
            ->where('status', 'Aktif')
            ->count();

        // 3. Total penjualan dari pesanan selesai
        $totalPenjualan = Order::whereIn('petani_id', $ids)
            ->where('status', 'Selesai')
            ->sum('total_harga');

        // 4. Grafik penjualan per bulan (7 bulan terakhir)
        $grafikPenjualan = collect(range(6, 0))->map(function ($i) use ($ids) {
            $month = now()->startOfMonth()->subMonths($i);
            $sum = Order::whereIn('petani_id', $ids)
                ->where('status', 'Selesai')
                ->whereYear('tanggal_pesanan', $month->year)
                ->whereMonth('tanggal_pesanan', $month->month)
                ->sum('total_harga');

            return [
                'bulan' => $month->format('M'),
                'penjualan' => round($sum / 1000000, 2),
            ];
        })->values();

        // 5. Penjualan terbaik (top 5 produk berdasarkan jumlah terjual)
        $penjualanTerbaik = OrderItem::whereIn('order_id', function ($query) use ($ids) {
            $query->select('id')->from('orders')->whereIn('petani_id', $ids);
        })
            ->selectRaw('product_id, nama_produk, SUM(jumlah_beli) as total_qty, SUM(subtotal) as total_penjualan')
            ->groupBy('product_id', 'nama_produk')
            ->orderByDesc('total_qty')
            ->limit(5)
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->product_id,
                    'nama' => $item->nama_produk,
                    'qty' => (float) $item->total_qty,
                    'total' => 'Rp ' . number_format($item->total_penjualan, 0, ',', '.'),
                ];
            });

        return response()->json([
            'stats' => [
                'petaniBinaan' => (string) $petaniBinaan,
                'nelayanBinaan' => (string) $nelayanBinaan,
                'produkAktif' => (string) $produkAktif,
                'totalPenjualan' => 'Rp ' . number_format($totalPenjualan, 0, ',', '.'),
            ],
            'grafikPenjualan' => $grafikPenjualan,
            'penjualanTerbaik' => $penjualanTerbaik,
        ]);
    }

    public function admin(Request $request)
    {
        // 1. Total pengguna (non-admin? termasuk semua; tampilkan keseluruhan)
        $totalPengguna = User::count();

        // 2. Total kategori
        $totalKategori = \App\Models\Category::count();

        // 3. Produk aktif
        $produkAktif = Product::where('status', 'Aktif')->count();

        // 4. Total penjualan bulan ini (order Selesai)
        $totalPenjualan = Order::where('status', 'Selesai')
            ->whereMonth('tanggal_pesanan', now()->month)
            ->whereYear('tanggal_pesanan', now()->year)
            ->sum('total_harga');

        // 5. Grafik transaksi per bulan (7 bulan terakhir)
        $grafikTransaksi = collect(range(6, 0))->map(function ($i) {
            $month = now()->startOfMonth()->subMonths($i);
            $sum = Order::where('status', 'Selesai')
                ->whereYear('tanggal_pesanan', $month->year)
                ->whereMonth('tanggal_pesanan', $month->month)
                ->sum('total_harga');

            return [
                'bulan' => $month->format('M'),
                'penjualan' => round($sum / 1000000, 2),
            ];
        })->values();

        // 6. Kategori terlaris (top 5 berdasarkan jumlah produk terjual)
        $topCategories = \App\Models\OrderItem::whereIn('order_id', function ($query) {
            $query->select('id')->from('orders')->where('status', 'Selesai');
        })
            ->join('products', 'products.id', '=', 'order_items.product_id')
            ->join('categories', 'categories.id', '=', 'products.category_id')
            ->selectRaw('categories.id, categories.nama_kategori, SUM(order_items.jumlah_beli) as total_qty, COUNT(DISTINCT order_items.order_id) as total_transaksi')
            ->groupBy('categories.id', 'categories.nama_kategori')
            ->orderByDesc('total_qty')
            ->limit(5)
            ->get();

        $maxQty = $topCategories->max('total_qty') ?: 1;
        $kategoriTerlaris = $topCategories->map(function ($item) use ($maxQty) {
            return [
                'nama' => $item->nama_kategori,
                'transaksi' => (int) $item->total_transaksi,
                'jumlah' => (int) $item->total_qty,
                'persentase' => round(((int) $item->total_qty / $maxQty) * 100),
            ];
        });

        return response()->json([
            'stats' => [
                'total_pengguna' => (string) $totalPengguna,
                'total_kategori' => (string) $totalKategori,
                'produk_aktif' => (string) $produkAktif,
                'total_penjualan' => 'Rp ' . number_format($totalPenjualan, 0, ',', '.'),
            ],
            'grafik_transaksi' => $grafikTransaksi,
            'kategori_terlaris' => $kategoriTerlaris,
        ]);
    }
}