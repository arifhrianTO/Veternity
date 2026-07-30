<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Offer;
use App\Models\OfferHistory;

class OfferController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $offers = Offer::with(['pembeli', 'product', 'histories' => function($query) {
            $query->orderBy('created_at', 'desc');
        }])
        ->where('petani_id', $request->user()->id)
        ->orderBy('created_at', 'desc')
        ->get();

        return response()->json($offers);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Dipanggil oleh Pembeli/Koperasi untuk membuat penawaran awal
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $offer = Offer::with(['pembeli', 'product', 'histories' => function($query) {
            $query->orderBy('created_at', 'desc');
        }])->findOrFail($id);
        
        if ($offer->petani_id !== request()->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return response()->json($offer);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $offer = Offer::findOrFail($id);

        if ($offer->petani_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'status' => 'required|string|in:Menunggu,Diterima,Ditolak,Counter',
            'harga_tawaran' => 'sometimes|numeric', // Jika ada counter offer
            'aksi_label' => 'required|string' // Untuk log riwayat
        ]);

        // Update offer utama
        $updateData = ['status' => $validated['status']];
        if (isset($validated['harga_tawaran'])) {
            $updateData['harga_tawaran'] = $validated['harga_tawaran'];
        }
        $offer->update($updateData);

        // Catat di tabel history
        OfferHistory::create([
            'offer_id' => $offer->id,
            'aktor_id' => $request->user()->id,
            'aksi' => $validated['aksi_label'],
            'harga_terkait' => $validated['harga_tawaran'] ?? null
        ]);

        return response()->json([
            'message' => 'Penawaran berhasil diperbarui',
            'offer' => $offer
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        // Penawaran biasanya tidak dihapus
    }
}
