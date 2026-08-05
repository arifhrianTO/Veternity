<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\BapanasPrice;
use Illuminate\Http\Request;

class BapanasPriceController extends Controller
{
    // Untuk dropdown pilihan komoditas saat tambah produk (menghilangkan
    // duplikat akibat whitespace di awal nama dari data scrap Bapanas)
    public function commodities()
    {
        $names = BapanasPrice::selectRaw('TRIM(commodity_name) AS name')
            ->whereNotNull('commodity_name')
            ->where('commodity_name', '!=', '')
            ->distinct()
            ->orderBy('name')
            ->pluck('name')
            ->unique()
            ->values();

        return response()->json($names);
    }

    // Untuk preview harga acuan realtime saat petani pilih komoditas
    public function latestPrice(Request $request)
    {
        $request->validate(['commodity' => 'required|string']);

        $data = BapanasPrice::latestFor($request->commodity);

        if (! $data) {
            return response()->json(['message' => 'Harga acuan belum tersedia'], 404);
        }

        return response()->json([
            'commodity_name' => $data->commodity_name,
            'price' => $data->price,
            'date' => $data->date,
        ]);
    }
}