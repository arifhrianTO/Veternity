<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use App\Traits\KoperasiScope;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class KoperasiController extends Controller
{
    use KoperasiScope;

    private function ensureKoperasi(Request $request)
    {
        if ($request->user()->role !== 'koperasi') {
            abort(403, 'Unauthorized');
        }
    }

    /**
     * Daftar anggota binaan koperasi (petani/nelayan binaan).
     */
    public function binaanIndex(Request $request)
    {
        $this->ensureKoperasi($request);
        $user = $request->user();

        $query = User::withCount('products')->where('koperasi_id', $user->id);

        if ($request->filled('role') && in_array($request->role, ['petani_binaan', 'nelayan_binaan'])) {
            $query->where('role', $request->role);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('nama_lengkap', 'like', "%{$search}%")
                    ->orWhere('nik', 'like', "%{$search}%")
                    ->orWhere('no_hp', 'like', "%{$search}%");
            });
        }

        return response()->json($query->orderBy('created_at', 'desc')->get());
    }

    /**
     * Tambah anggota binaan baru.
     */
    public function binaanStore(Request $request)
    {
        $this->ensureKoperasi($request);
        $user = $request->user();

        $validated = $request->validate([
            'role' => 'required|in:petani_binaan,nelayan_binaan',
            'nama_lengkap' => 'required|string|max:255',
            'nik' => 'nullable|string',
            'no_hp' => 'nullable|string|max:20',
            'tanggal_lahir' => 'nullable|date',
            'kelamin' => 'nullable|string',
            'alamat' => 'nullable|string',
            'rekening' => 'nullable|string',
            'foto_profil' => 'nullable|image|max:5120',
        ]);

        if ($request->hasFile('foto_profil')) {
            $validated['foto_profil'] = $request->file('foto_profil')->store('profiles', 'public');
        }

        // Auto-generate email unik & password default (anggota binaan dikelola koperasi)
        $baseEmail = 'binaan-' . Str::slug($validated['nama_lengkap']);
        $email = $baseEmail . '@tani.local';
        $i = 1;
        while (User::where('email', $email)->exists()) {
            $email = $baseEmail . '-' . ($i++) . '@tani.local';
        }

        $binaan = User::create([
            'role' => $validated['role'],
            'nama_lengkap' => $validated['nama_lengkap'],
            'email' => $email,
            'no_hp' => $validated['no_hp'] ?? null,
            'nik' => $validated['nik'] ?? null,
            'rekening' => $validated['rekening'] ?? null,
            'tanggal_lahir' => $validated['tanggal_lahir'] ?? now()->toDateString(),
            'kelamin' => $validated['kelamin'] ?? 'Laki-laki',
            'alamat' => $validated['alamat'] ?? '',
            'password' => Hash::make('password'),
            'koperasi_id' => $user->id,
            'foto_profil' => $validated['foto_profil'] ?? null,
        ]);

        return response()->json([
            'message' => 'Anggota binaan berhasil ditambahkan',
            'binaan' => $binaan
        ], 201);
    }

    /**
     * Detail anggota binaan (profil + produk + riwayat pesanan).
     */
    public function binaanShow(Request $request, int $id)
    {
        $this->ensureKoperasi($request);
        $user = $request->user();

        $binaan = User::withCount('products')->where('koperasi_id', $user->id)->findOrFail($id);

        $products = Product::with('category')->where('user_id', $id)->orderBy('created_at', 'desc')->get();

        $orders = Order::with(['pembeli', 'items'])
            ->where('petani_id', $id)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'binaan' => $binaan,
            'products' => $products,
            'orders' => $orders
        ]);
    }

    /**
     * Perbarui profil anggota binaan.
     */
    public function binaanUpdate(Request $request, int $id)
    {
        $this->ensureKoperasi($request);
        $user = $request->user();

        $binaan = User::where('koperasi_id', $user->id)->findOrFail($id);

        $validated = $request->validate([
            'nama_lengkap' => 'sometimes|required|string|max:255',
            'nik' => 'nullable|string',
            'no_hp' => 'nullable|string|max:20',
            'tanggal_lahir' => 'nullable|date',
            'kelamin' => 'nullable|string',
            'alamat' => 'nullable|string',
            'rekening' => 'nullable|string',
            'foto_profil' => 'nullable|image|max:5120',
        ]);

        if ($request->hasFile('foto_profil')) {
            if ($binaan->foto_profil) {
                Storage::disk('public')->delete($binaan->foto_profil);
            }
            $validated['foto_profil'] = $request->file('foto_profil')->store('profiles', 'public');
        }

        $binaan->update($validated);

        return response()->json([
            'message' => 'Profil binaan berhasil diperbarui',
            'binaan' => $binaan
        ]);
    }

    /**
     * Hapus anggota binaan.
     */
    public function binaanDestroy(Request $request, int $id)
    {
        $this->ensureKoperasi($request);
        $user = $request->user();

        $binaan = User::where('koperasi_id', $user->id)->findOrFail($id);
        $binaan->delete();

        return response()->json(['message' => 'Anggota binaan berhasil dihapus']);
    }

    /**
     * Produk milik koperasi + anggota binaannya.
     */
    public function produkIndex(Request $request)
    {
        $this->ensureKoperasi($request);
        $user = $request->user();
        $ids = $this->sellerIds($user);

        $products = Product::with(['user', 'category'])
            ->whereIn('user_id', $ids)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($products);
    }

    /**
     * Pesanan untuk koperasi + anggota binaannya.
     */
    public function orderIndex(Request $request)
    {
        $this->ensureKoperasi($request);
        $user = $request->user();
        $ids = $this->sellerIds($user);

        $orders = Order::with(['pembeli', 'items', 'shipment'])
            ->whereIn('petani_id', $ids)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($orders);
    }
}
