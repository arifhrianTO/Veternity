<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Commodity;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class CommodityController extends Controller
{
    /**
     * Daftar komoditas per kategori (publik, untuk dropdown cascade).
     */
    public function byCategory($categoryId)
    {
        Category::findOrFail($categoryId);

        $commodities = Commodity::where('category_id', $categoryId)
            ->orderBy('nama_komoditas')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $commodities,
        ]);
    }

    /**
     * Tambah komoditas baru.
     */
    public function store(Request $request)
    {
        $request->validate([
            'category_id' => 'required|integer|exists:categories,id',
            'nama_komoditas' => 'required|string|max:255',
            'bapanas_match' => 'nullable|string|max:255',
            'satuan' => 'nullable|string|max:20',
            'gambar' => 'nullable|image|max:5120',
        ]);

        $data = [
            'category_id' => $request->category_id,
            'nama_komoditas' => $request->nama_komoditas,
            'bapanas_match' => $request->bapanas_match,
            'satuan' => $request->satuan ?: 'Kg',
            'gambar' => $request->gambar,
        ];

        if ($request->hasFile('gambar')) {
            $data['gambar'] = $request->file('gambar')->store('commodities', 'public');
        }

        $commodity = Commodity::create($data);

        return response()->json([
            'success' => true,
            'message' => 'Komoditas berhasil ditambahkan.',
            'data' => $commodity,
        ], 201);
    }

    /**
     * Perbarui komoditas.
     */
    public function update(Request $request, $id)
    {
        $commodity = Commodity::findOrFail($id);

        $request->validate([
            'category_id' => 'sometimes|required|integer|exists:categories,id',
            'nama_komoditas' => 'sometimes|required|string|max:255',
            'bapanas_match' => 'nullable|string|max:255',
            'satuan' => 'nullable|string|max:20',
            'gambar' => 'nullable|image|max:5120',
        ]);

        $data = [
            'category_id' => $request->category_id ?? $commodity->category_id,
            'nama_komoditas' => $request->nama_komoditas ?? $commodity->nama_komoditas,
            'bapanas_match' => $request->filled('bapanas_match') ? $request->bapanas_match : null,
            'satuan' => $request->satuan ?: $commodity->satuan,
        ];

        if ($request->hasFile('gambar')) {
            if ($commodity->gambar && Storage::disk('public')->exists($commodity->gambar)) {
                Storage::disk('public')->delete($commodity->gambar);
            }
            $data['gambar'] = $request->file('gambar')->store('commodities', 'public');
        }

        $commodity->update($data);

        return response()->json([
            'success' => true,
            'message' => 'Komoditas berhasil diperbarui.',
            'data' => $commodity,
        ]);
    }

    /**
     * Hapus komoditas.
     */
    public function destroy($id)
    {
        $commodity = Commodity::findOrFail($id);
        $commodity->delete();

        return response()->json([
            'success' => true,
            'message' => 'Komoditas berhasil dihapus.',
        ]);
    }
}
