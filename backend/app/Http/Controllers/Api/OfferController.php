<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Offer;
use App\Models\OfferHistory;
use App\Traits\KoperasiScope;

class OfferController extends Controller
{
    use KoperasiScope;

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $user = $request->user();

        $query = Offer::with(['pembeli', 'petani', 'product.category', 'histories' => function($query) {
            $query->orderBy('created_at', 'desc');
        }]);

        // Koperasi melihat penawaran dirinya + anggota binaannya
        if ($user->role === 'koperasi') {
            $query->whereIn('petani_id', $this->sellerIds($user));
        } else {
            $query->where('petani_id', $user->id);
        }

        $offers = $query->orderBy('created_at', 'desc')->get();

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
        $offer = Offer::with(['pembeli', 'petani', 'product.category', 'histories' => function($query) {
            $query->orderBy('created_at', 'desc');
        }])->findOrFail($id);

        if (! $this->canManageOffer(request()->user(), $offer)) {
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

        if (! $this->canManageOffer($request->user(), $offer)) {
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
            'offer' => $offer->load(['pembeli', 'product'])
        ]);
    }

    /**
     * Cek otorisasi: pemilik produk (petani/nelayan) atau koperasi pembina.
     */
    private function canManageOffer($user, Offer $offer): bool
    {
        if ($offer->petani_id === $user->id) {
            return true;
        }

        return $user->role === 'koperasi'
            && in_array($offer->petani_id, $this->binaanIds($user));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        // Penawaran biasanya tidak dihapus
    }
}
