<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Order;

class OrderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $orders = Order::with(['items', 'pembeli'])
            ->where('petani_id', $request->user()->id)
            ->orderBy('created_at', 'desc')
            ->get();
            
        return response()->json($orders);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Fitur ini biasanya dipanggil oleh Aktor Pembeli/Koperasi
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $order = Order::with(['items', 'pembeli'])->findOrFail($id);
        
        // Pastikan hanya petani terkait (atau pembeli) yang bisa lihat
        if ($order->petani_id !== request()->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return response()->json($order);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $order = Order::findOrFail($id);

        if ($order->petani_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'status' => 'required|string|in:Menunggu Pembayaran,Diproses,Dikirim,Selesai,Dibatalkan',
        ]);

        $order->update($validated);

        return response()->json([
            'message' => 'Status pesanan berhasil diperbarui',
            'order' => $order
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        // Pesanan biasanya tidak dihapus untuk histori, tapi kita sediakan jika diperlukan
    }
}
