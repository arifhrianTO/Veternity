<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Product;
use App\Models\Order;
use App\Models\Offer;

class DashboardController extends Controller
{
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
                    'product' => $offer->product->kategori ?? 'Unknown',
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
                    'product' => $offer->product->kategori ?? 'Unknown',
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
}