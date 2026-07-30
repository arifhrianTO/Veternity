<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Product;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        // Ambil produk milik user yang sedang login
        $products = Product::where('user_id', $request->user()->id)->get();
        return response()->json($products);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'kategori' => 'required|string',
            'stok' => 'required|numeric',
            'harga_harapan' => 'required|numeric',
            'tanggal_panen' => 'required|date',
            'masa_layak' => 'required|integer',
            'gambar' => 'nullable|image|max:5120', // Maks 5MB
        ]);

        if ($request->hasFile('gambar')) {
            $path = $request->file('gambar')->store('products', 'public');
            $validated['gambar'] = $path;
        }

        $validated['user_id'] = $request->user()->id;
        $validated['status'] = 'Aktif'; // Default status
        $validated['satuan'] = 'Kg';

        $product = Product::create($validated);

        return response()->json([
            'message' => 'Produk berhasil ditambahkan',
            'product' => $product
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $product = Product::findOrFail($id);
        
        // Pastikan hanya pemilik yang bisa melihat detail (opsional)
        if ($product->user_id !== request()->user()->id) {
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

        if ($product->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'kategori' => 'sometimes|required|string',
            'stok' => 'sometimes|required|numeric',
            'harga_harapan' => 'sometimes|required|numeric',
            'tanggal_panen' => 'sometimes|required|date',
            'masa_layak' => 'sometimes|required|integer',
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

        $product->update($validated);

        return response()->json([
            'message' => 'Produk berhasil diperbarui',
            'product' => $product
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $product = Product::findOrFail($id);

        if ($product->user_id !== request()->user()->id) {
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
