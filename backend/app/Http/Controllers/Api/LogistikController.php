<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Courier;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class LogistikController extends Controller
{
    private $apiKey;
    private $baseUrl;

    public function __construct()
    {
        $this->apiKey = env('RAJAONGKIR_SHIPPING_KEY');
        $this->baseUrl = rtrim(env('RAJAONGKIR_BASE_URL', 'https://rajaongkir.komerce.id/api/v1'), '/');
    }

    /**
     * Daftar kurir/logistik (pagination 5 data per halaman).
     */
    public function index(Request $request)
    {
        $query = Courier::query();

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('kode', 'like', "%{$search}%")
                    ->orWhere('nama', 'like', "%{$search}%")
                    ->orWhere('deskripsi', 'like', "%{$search}%");
            });
        }

        $couriers = $query->orderBy('created_at', 'asc')->paginate(5);

        return response()->json([
            'success' => true,
            'data' => $couriers->items(),
            'current_page' => $couriers->currentPage(),
            'last_page' => $couriers->lastPage(),
            'total' => $couriers->total(),
            'per_page' => $couriers->perPage(),
        ]);
    }

    /**
     * Tambah kurir baru (bisa manual / custom).
     */
    public function store(Request $request)
    {
        $request->validate([
            'kode' => 'required|string|max:50|unique:couriers,kode',
            'nama' => 'required|string|max:255',
            'deskripsi' => 'nullable|string',
            'status' => 'required|in:Aktif,Tidak Aktif',
        ]);

        $courier = Courier::create([
            'kode' => strtolower($request->kode),
            'nama' => $request->nama,
            'deskripsi' => $request->deskripsi,
            'status' => $request->status,
            'sumber' => 'manual',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Kurir berhasil ditambahkan.',
            'data' => $courier
        ], 201);
    }

    /**
     * Perbarui kurir (nama, area layanan, status).
     */
    public function update(Request $request, $id)
    {
        $courier = Courier::findOrFail($id);

        $request->validate([
            'nama' => 'required|string|max:255',
            'deskripsi' => 'nullable|string',
            'status' => 'required|in:Aktif,Tidak Aktif',
        ]);

        $courier->update([
            'nama' => $request->nama,
            'deskripsi' => $request->deskripsi,
            'status' => $request->status,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Kurir berhasil diperbarui.',
            'data' => $courier
        ]);
    }

    /**
     * Hapus kurir.
     */
    public function destroy($id)
    {
        $courier = Courier::findOrFail($id);
        $courier->delete();

        return response()->json([
            'success' => true,
            'message' => 'Kurir berhasil dihapus.'
        ]);
    }

    /**
     * Cek area layanan via API RajaOngkir.
     * Body: origin_city_id, destination_city_id, weight.
     * Mengembalikan kurir mana saja yang melayani area tsb beserta layanan/harga/etd.
     */
    public function checkArea(Request $request)
    {
        $request->validate([
            'origin_city_id' => 'required|integer',
            'destination_city_id' => 'required|integer',
            'weight' => 'required|integer|min:1',
        ]);

        try {
            $courierCodes = Courier::orderBy('created_at', 'asc')->pluck('kode')->implode(':');

            if (empty($courierCodes)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Belum ada kurir yang terdaftar.',
                ], 400);
            }

            $response = Http::asForm()->withHeaders([
                'key' => $this->apiKey
            ])->post($this->baseUrl . '/calculate/domestic-cost', [
                'origin' => $request->origin_city_id,
                'destination' => $request->destination_city_id,
                'weight' => $request->weight,
                'courier' => $courierCodes,
                'price' => 'lowest',
            ]);

            if ($response->successful()) {
                $data = $response->json()['data'] ?? [];

                // Kelompokkan per kurir (kode) untuk memudahkan frontend
                $grouped = collect($data)->groupBy('code')->map(function ($services) {
                    return [
                        'code' => $services->first()['code'] ?? '',
                        'name' => $services->first()['name'] ?? '',
                        'services' => $services->map(function ($s) {
                            return [
                                'service' => $s['service'] ?? '',
                                'description' => $s['description'] ?? '',
                                'cost' => $s['cost'] ?? 0,
                                'etd' => $s['etd'] ?? '',
                            ];
                        })->values(),
                    ];
                })->values();

                return response()->json([
                    'success' => true,
                    'data' => $grouped,
                ]);
            }

            // Relay pesan error dari API (misal: kode kurir tidak valid)
            $apiMessage = $response->json()['meta']['message'] ?? null;
            return response()->json([
                'success' => false,
                'message' => $apiMessage
                    ? 'RajaOngkir: ' . $apiMessage
                    : 'Gagal cek area dari RajaOngkir.',
                'error' => $response->json()
            ], 400);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan sistem: ' . $e->getMessage()
            ], 500);
        }
    }
}
