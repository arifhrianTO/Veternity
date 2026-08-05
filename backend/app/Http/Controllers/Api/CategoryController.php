<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Commodity;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class CategoryController extends Controller
{
    /**
     * Daftar kategori publik (untuk dropdown petani/nelayan/pembeli).
     * ?tipe=pertanian|perikanan untuk filter.
     * ?with_commodities=1 untuk menyertakan daftar komoditas per kategori.
     */
    public function index(Request $request)
    {
        $query = Category::query();

        if ($request->filled('tipe')) {
            $query->where('tipe', $request->tipe);
        }

        if ($request->boolean('with_commodities')) {
            $query->with('commodities');
        }

        $categories = $query->orderBy('nama_kategori')->get();

        return response()->json([
            'success' => true,
            'data' => $categories,
        ]);
    }

    /**
     * Daftar kategori untuk halaman admin (termasuk jumlah & daftar komoditas).
     */
    public function adminIndex()
    {
        $categories = Category::with(['commodities'])
            ->withCount('commodities')
            ->orderBy('nama_kategori')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $categories,
        ]);
    }

    /**
     * Tambah kategori baru.
     */
    public function store(Request $request)
    {
        $request->validate([
            'nama_kategori' => 'required|string|max:255|unique:categories,nama_kategori',
            'tipe' => 'required|in:pertanian,perikanan',
            'gambar' => 'nullable|image|max:5120',
        ]);

        $data = [
            'nama_kategori' => $request->nama_kategori,
            'tipe' => $request->tipe,
            'gambar' => $request->gambar, // bisa path string (untuk seed/url)
        ];

        if ($request->hasFile('gambar')) {
            $data['gambar'] = $request->file('gambar')->store('categories', 'public');
        }

        $category = Category::create($data);

        return response()->json([
            'success' => true,
            'message' => 'Kategori berhasil ditambahkan.',
            'data' => $category->load('commodities'),
        ], 201);
    }

    /**
     * Perbarui kategori.
     */
    public function update(Request $request, $id)
    {
        $category = Category::findOrFail($id);

        $request->validate([
            'nama_kategori' => 'required|string|max:255|unique:categories,nama_kategori,' . $category->id,
            'tipe' => 'required|in:pertanian,perikanan',
            'gambar' => 'nullable|image|max:5120',
        ]);

        $data = [
            'nama_kategori' => $request->nama_kategori,
            'tipe' => $request->tipe,
        ];

        if ($request->hasFile('gambar')) {
            if ($category->gambar && Storage::disk('public')->exists($category->gambar)) {
                Storage::disk('public')->delete($category->gambar);
            }
            $data['gambar'] = $request->file('gambar')->store('categories', 'public');
        } elseif ($request->filled('gambar')) {
            $data['gambar'] = $request->gambar;
        }

        $category->update($data);

        return response()->json([
            'success' => true,
            'message' => 'Kategori berhasil diperbarui.',
            'data' => $category->load('commodities'),
        ]);
    }

    /**
     * Hapus kategori (produk terkait menanggalkan category_id).
     */
    public function destroy($id)
    {
        $category = Category::findOrFail($id);
        $category->delete();

        return response()->json([
            'success' => true,
            'message' => 'Kategori berhasil dihapus.',
        ]);
    }
}
