<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Category;
use App\Models\Product;
use App\Models\User;
use App\Traits\KoperasiScope;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    use KoperasiScope;

    /**
     * Cek apakah user berhak mengelola produk (pemilik langsung,
     * atau Koperasi untuk produk anggota binaannya).
     */
    private function canManageProduct(User $user, Product $product): bool
    {
        if ($product->user_id === $user->id) {
            return true;
        }

        if ($user->role === 'koperasi' && in_array($product->user_id, $this->binaanIds($user))) {
            return true;
        }

        return false;
    }
    /**
     * Resolusi category_id dari input (bisa berupa category_id atau nama kategori).
     */
    private function resolveCategoryId(array $validated): ?int
    {
        if (!empty($validated['category_id'])) {
            return (int) $validated['category_id'];
        }

        if (!empty($validated['kategori'])) {
            $category = Category::where('nama_kategori', $validated['kategori'])->first();
            if ($category) {
                return $category->id;
            }
        }

        return null;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        // Katalog publik: kembalikan semua produk beserta data user (pemilik) yang aktif
        $products = Product::with('user')->where('status', 'Aktif')->get();
        return response()->json($products);
    }

    /**
     * Display a listing of the resource for the logged in user (Petani)
     */
    public function myProducts(Request $request)
    {
        $user = $request->user();

        // Untuk Koperasi, tampilkan juga produk anggota binaannya
        if ($user->role === 'koperasi') {
            $products = Product::with(['user', 'category'])
                ->whereIn('user_id', $this->sellerIds($user))
                ->get();
        } else {
            $products = Product::where('user_id', $user->id)->get();
        }

        return response()->json($products);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'kategori' => 'nullable|string',
            'category_id' => 'nullable|integer|exists:categories,id',
            'stok' => 'required|numeric',
            'harga_harapan' => 'required|numeric',
            'tanggal_panen' => 'required|date',
            'masa_layak' => 'required|integer',
            'berat_gram' => 'nullable|integer',
            'gambar' => 'nullable|image|max:5120', // Maks 5MB
            'pemilik_id' => 'nullable|integer',
        ]);

        if ($request->hasFile('gambar')) {
            $path = $request->file('gambar')->store('products', 'public');
            $validated['gambar'] = $path;
        }

        $user = $request->user();

        // Penentu pemilik produk (Koperasi boleh menunjuk anggota binaannya)
        if ($user->role === 'koperasi' && !empty($validated['pemilik_id'])) {
            if (!in_array((int) $validated['pemilik_id'], $this->binaanIds($user))) {
                return response()->json(['message' => 'Pemilik produk bukan anggota binaan Anda'], 422);
            }
            $validated['user_id'] = (int) $validated['pemilik_id'];
        } else {
            $validated['user_id'] = $user->id;
        }

        $validated['category_id'] = $this->resolveCategoryId($validated);
        $validated['status'] = 'Aktif'; // Default status
        $validated['satuan'] = 'Kg';
        unset($validated['pemilik_id'], $validated['kategori']);

        $product = Product::create($validated);

        return response()->json([
            'message' => 'Produk berhasil ditambahkan',
            'product' => $product->load(['user', 'category'])
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $product = Product::with(['user', 'category'])->findOrFail($id);

        // Publik bisa lihat produk aktif; pemilik/koperasi binaan bisa lihat semua
        $user = request()->user();
        $isPublicActive = $product->status === 'Aktif';
        if (! $isPublicActive && (! $user || ! $this->canManageProduct($user, $product))) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return response()->json($product);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $product = Product::findOrFail($id);

        if (! $this->canManageProduct($request->user(), $product)) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'kategori' => 'nullable|string',
            'category_id' => 'nullable|integer|exists:categories,id',
            'stok' => 'sometimes|required|numeric',
            'harga_harapan' => 'sometimes|required|numeric',
            'tanggal_panen' => 'sometimes|required|date',
            'masa_layak' => 'sometimes|required|integer',
            'berat_gram' => 'nullable|integer',
            'gambar' => 'nullable|image|max:5120',
        ]);

        if ($request->hasFile('gambar')) {
            // Hapus gambar lama jika ada
            if ($product->gambar && Storage::disk('public')->exists($product->gambar)) {
                Storage::disk('public')->delete($product->gambar);
            }
            $path = $request->file('gambar')->store('products', 'public');
            $validated['gambar'] = $path;
        }

        if ($request->filled('kategori') || $request->filled('category_id')) {
            $validated['category_id'] = $this->resolveCategoryId($validated);
        }
        unset($validated['kategori']);

        $product->update($validated);

        return response()->json([
            'message' => 'Produk berhasil diperbarui',
            'product' => $product->load(['user', 'category'])
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $product = Product::findOrFail($id);

        if (! $this->canManageProduct(request()->user(), $product)) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Hapus gambar fisik
        if ($product->gambar && Storage::disk('public')->exists($product->gambar)) {
            Storage::disk('public')->delete($product->gambar);
        }

        $product->delete();

        return response()->json(['message' => 'Produk berhasil dihapus']);
    }
}
