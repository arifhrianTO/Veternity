<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\BapanasPrice;
use App\Models\Offer;
use App\Models\OfferHistory;
use App\Models\Product;
use App\Traits\KoperasiScope;

class OfferController extends Controller
{
    use KoperasiScope;

    /**
     * Ambil nama kategori produk untuk dicocokkan ke commodity_name Bapanas.
     * Coba kolom 'kategori' langsung dulu, fallback ke relasi category.
     */
    private function resolveProductKategoriName(Product $product): ?string
    {
        if (!empty($product->kategori)) {
            return $product->kategori;
        }
        return $product->category->nama_kategori ?? null;
    }

    /**
     * Sisipkan harga_acuan (dari Bapanas, data terbaru) berdasarkan nama/kategori produk.
     * Prioritas: nama produk spesifik → nama kategori → nama produk fuzzy
     */
    private function attachHargaAcuan(Offer $offer): Offer
    {
        $offer->harga_acuan = null;
        $offer->harga_acuan_tanggal = null;

        if ($offer->product) {
            $bapanas = null;

            // Prioritas 1: coba dari nama produk spesifik (mis. "Ikan Bandeng", "Ikan Tongkol")
            $namaProduk = $offer->product->nama_produk ?? null;
            if ($namaProduk) {
                $bapanas = BapanasPrice::latestForCategory($namaProduk);
            }

            // Prioritas 2: dari nama kategori (mis. "Ikan", "Beras", "Sayur")
            if (!$bapanas) {
                $kategoriName = $this->resolveProductKategoriName($offer->product);
                if ($kategoriName) {
                    $bapanas = BapanasPrice::latestForCategory($kategoriName);
                }
            }

            if ($bapanas) {
                $offer->harga_acuan = $bapanas->price;
                $offer->harga_acuan_tanggal = $bapanas->date;
            }
        }

        return $offer;
    }

    /**
     * Daftar penawaran milik penjual (petani/nelayan/koperasi).
     */
    public function index(Request $request)
    {
        $user = $request->user();

        $query = Offer::with(['pembeli', 'petani', 'product.category', 'histories' => function($query) {
            $query->orderBy('created_at', 'desc');
        }]);

        if ($user->role === 'koperasi') {
            $query->whereIn('petani_id', $this->sellerIds($user));
        } else {
            $query->where('petani_id', $user->id);
        }

        $offers = $query->orderBy('created_at', 'desc')->get()
            ->map(fn ($offer) => $this->attachHargaAcuan($offer));

        return response()->json($offers);
    }

    /**
     * Daftar penawaran milik pembeli (my-offers).
     */
    public function myOffers(Request $request)
    {
        $user = $request->user();

        $offers = Offer::with(['pembeli', 'petani', 'product.category', 'histories' => function($query) {
            $query->orderBy('created_at', 'asc');
        }])
            ->where('pembeli_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(fn ($offer) => $this->attachHargaAcuan($offer));

        return response()->json($offers);
    }

    /**
     * Store a newly created resource in storage.
     * Dipanggil oleh Pembeli untuk membuat penawaran awal.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'product_id'      => 'required|exists:products,id',
            'jumlah_diminta'  => 'required|numeric|min:0.1',
            'harga_tawaran'   => 'required|numeric|min:1',
            'pesan_pembeli'   => 'nullable|string|max:500',
        ]);

        $product = Product::findOrFail($validated['product_id']);
        $user = $request->user();

        // Pembeli tidak boleh menawar produk miliknya sendiri
        if ($product->user_id === $user->id) {
            return response()->json([
                'message' => 'Tidak bisa menawar produk milik sendiri.'
            ], 422);
        }

        $kodePenawaran = 'PNW-' . strtoupper(uniqid());

        $offer = Offer::create([
            'kode_penawaran'  => $kodePenawaran,
            'product_id'      => $product->id,
            'pembeli_id'      => $user->id,
            'petani_id'       => $product->user_id,
            'jumlah_diminta'  => $validated['jumlah_diminta'],
            'harga_tawaran'   => $validated['harga_tawaran'],
            'pesan_pembeli'   => $validated['pesan_pembeli'] ?? null,
            'status'          => 'Menunggu',
        ]);

        OfferHistory::create([
            'offer_id'       => $offer->id,
            'aktor_id'       => $user->id,
            'aksi'           => 'Penawaran diajukan',
            'harga_terkait'  => $validated['harga_tawaran'],
        ]);

        return response()->json([
            'message' => 'Penawaran berhasil diajukan. Menunggu respon penjual.',
            'offer'   => $offer->load(['product', 'pembeli']),
        ], 201);
    }

    public function show(string $id)
    {
        $offer = Offer::with(['pembeli', 'petani', 'product.category', 'histories' => function($query) {
            $query->orderBy('created_at', 'desc');
        }])->findOrFail($id);

        if (! $this->canManageOffer(request()->user(), $offer)) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $this->attachHargaAcuan($offer);

        return response()->json($offer);
    }

    public function update(Request $request, string $id)
    {
        $offer = Offer::findOrFail($id);
        $user  = $request->user();

        // Pembeli boleh update jika mereka adalah pemilik penawaran
        $isBuyer  = $offer->pembeli_id === $user->id;
        $isSeller = $this->canManageOffer($user, $offer);

        if (!$isBuyer && !$isSeller) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Pembeli hanya boleh merespon ketika status = Counter
        if ($isBuyer && !$isSeller) {
            if ($offer->status !== 'Counter') {
                return response()->json(['message' => 'Anda hanya bisa merespon penawaran counter dari penjual.'], 422);
            }
        }

        $validated = $request->validate([
            'status'        => 'required|string|in:Menunggu,Diterima,Ditolak,Counter',
            'harga_tawaran' => 'sometimes|numeric',
            'aksi_label'    => 'required|string',
        ]);

        $updateData = ['status' => $validated['status']];
        if (isset($validated['harga_tawaran'])) {
            $updateData['harga_tawaran'] = $validated['harga_tawaran'];
        }
        $offer->update($updateData);

        OfferHistory::create([
            'offer_id'      => $offer->id,
            'aktor_id'      => $user->id,
            'aksi'          => $validated['aksi_label'],
            'harga_terkait' => $validated['harga_tawaran'] ?? null,
        ]);

        $offer = $offer->load(['pembeli', 'product', 'histories']);
        $this->attachHargaAcuan($offer);

        return response()->json([
            'message' => 'Penawaran berhasil diperbarui',
            'offer'   => $offer,
        ]);
    }

    private function canManageOffer($user, Offer $offer): bool
    {
        if ($offer->petani_id === $user->id) {
            return true;
        }

        return $user->role === 'koperasi'
            && in_array($offer->petani_id, $this->binaanIds($user));
    }

    public function destroy(string $id)
    {
        // Penawaran biasanya tidak dihapus
    }
}