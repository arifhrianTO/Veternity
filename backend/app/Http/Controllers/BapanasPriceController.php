<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\BapanasPrice;
use Illuminate\Http\Request;

class BapanasPriceController extends Controller
{
    // Untuk dropdown pilihan komoditas saat tambah produk
    public function commodities()
    {
        return response()->json(
            BapanasPrice::select('commodity_name')
                ->distinct()
                ->orderBy('commodity_name')
                ->pluck('commodity_name')
        );
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