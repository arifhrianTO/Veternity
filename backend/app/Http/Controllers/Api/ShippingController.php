<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Courier;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class ShippingController extends Controller
{
    private $apiKey;
    private $baseUrl;

    public function __construct()
    {
        $this->apiKey = env('RAJAONGKIR_SHIPPING_KEY');
        // Base URL Komerce v1, TANPA trailing slash
        $this->baseUrl = rtrim(env('RAJAONGKIR_BASE_URL', 'https://rajaongkir.komerce.id/api/v1'), '/');
    }

    public function getProvinces()
    {
        try {
            $response = Http::withHeaders([
                'key' => $this->apiKey
            ])->get($this->baseUrl . '/destination/province');

            if ($response->successful()) {
                $provinces = $response->json()['data'] ?? [];
                return response()->json([
                    'success' => true,
                    'data' => $provinces
                ]);
            }

            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil data provinsi dari RajaOngkir',
                'error' => $response->json() // aktifkan sementara buat debug
            ], 400);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan sistem: ' . $e->getMessage()
            ], 500);
        }
    }

    public function getCities($provinceId)
    {
        try {
            $response = Http::withHeaders([
                'key' => $this->apiKey
            ])->get($this->baseUrl . '/destination/city/' . $provinceId);

            if ($response->successful()) {
                $cities = $response->json()['data'] ?? [];
                return response()->json([
                    'success' => true,
                    'data' => $cities
                ]);
            }

            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil data kota dari RajaOngkir',
                'error' => $response->json()
            ], 400);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan sistem: ' . $e->getMessage()
            ], 500);
        }
    }

    public function checkCost(Request $request)
    {
        $request->validate([
            'origin_city_id' => 'required|integer', // Menambahkan validasi untuk origin
            'destination_city_id' => 'required|integer',
            'weight' => 'required|integer', // Dalam gram
            'courier' => 'required|string' // jne, pos, tiki, dst
        ]);

        try {
            // Origin sekarang dinamis, diambil dari frontend. Fallback ke 153 (Jakarta Selatan) jika gagal
            $originCityId = $request->input('origin_city_id', env('RAJAONGKIR_ORIGIN_CITY_ID', 153));

            // Endpoint baru: form-urlencoded, bukan JSON
            $response = Http::asForm()->withHeaders([
                'key' => $this->apiKey
            ])->post($this->baseUrl . '/calculate/domestic-cost', [
                'origin' => $originCityId,
                'destination' => $request->destination_city_id,
                'weight' => $request->weight,
                'courier' => strtolower($request->courier),
                'price' => 'lowest'
            ]);

            if ($response->successful()) {
                $costs = $response->json()['data'] ?? [];
                return response()->json([
                    'success' => true,
                    'data' => $costs
                ]);
            }

            // Relay pesan error dari API (misal: kode kurir tidak valid)
            $apiMessage = $response->json()['meta']['message'] ?? null;
            return response()->json([
                'success' => false,
                'message' => $apiMessage
                    ? 'RajaOngkir: ' . $apiMessage
                    : 'Gagal menghitung ongkos kirim dari RajaOngkir',
                'error' => $response->json()
            ], 400);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan sistem: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Daftar kurir aktif dari tabel couriers (dipakai checkout frontend).
     */
    public function getActiveCouriers()
    {
        $couriers = Courier::where('status', 'Aktif')
            ->orderBy('created_at', 'asc')
            ->get(['kode', 'nama']);

        return response()->json([
            'success' => true,
            'data' => $couriers
        ]);
    }

    public function trackWaybill(Request $request)
    {
        $request->validate([
            'waybill' => 'required|string',
            'courier' => 'required|string'
        ]);

        try {
            // Endpoint baru: form-urlencoded
            $response = Http::asForm()->withHeaders([
                'key' => $this->apiKey
            ])->post($this->baseUrl . '/waybill', [
                'waybill' => $request->waybill,
                'courier' => strtolower($request->courier)
            ]);

            if ($response->successful()) {
                $trackingData = $response->json()['data'] ?? [];
                return response()->json([
                    'success' => true,
                    'data' => $trackingData
                ]);
            }

            return response()->json([
                'success' => false,
                'message' => 'Gagal melacak resi dari RajaOngkir',
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