<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BapanasPrice extends Model
{
    protected $fillable = [
        'commodity_name',
        'date',
        'price',
        'province_id',
        'city_id',
    ];
    public static function latestFor(string $commodityName)
    {
        return static::whereRaw('LOWER(TRIM(commodity_name)) = ?', [strtolower(trim($commodityName))])
            ->whereNull('province_id')
            ->whereNull('city_id')
            ->orderBy('date', 'desc')
            ->first();
    }
    /**
     * Mapping kategori umum ke commodity_name Bapanas.
     * Urutan dalam array = prioritas (diambil yang pertama ditemukan di DB).
     */
    private static array $categoryMap = [
        // Pertanian
        'padi'     => ['Beras Medium', 'Beras Premium', 'Beras SPHP'],
        'serealia' => ['Jagung Tk. Peternak', 'Beras Medium', 'Beras Premium'],
        'beras'    => ['Beras Medium', 'Beras Premium', 'Beras SPHP'],
        'sayur'    => ['Cabai Merah Besar', 'Cabai Merah Keriting', 'Cabai Rawit Merah', 'Bawang Merah'],
        'buah'     => ['Gula Pasir Lokal/Curah'],   // tidak ada buah eksplisit di Bapanas
        'umbi'     => ['Kedelai Biji Kering'],
        'jagung'   => ['Jagung Tk. Peternak'],
        'kedelai'  => ['Kedelai Biji Kering'],
        'gula'     => ['Gula Pasir Lokal/Curah'],
        'telur'    => ['Telur Ayam Ras'],
        'ayam'     => ['Daging Ayam Ras'],
        'daging'   => ['Daging Sapi Murni', 'Daging Ayam Ras'],
        'sapi'     => ['Daging Sapi Murni'],
        'bawang'   => ['Bawang Merah', 'Bawang Putih (Bonggol)'],
        'cabai'    => ['Cabai Merah Besar', 'Cabai Merah Keriting', 'Cabai Rawit Merah'],
        'minyak'   => ['Minyak Goreng Curah', 'Minyak Kita'],
        'tepung'   => ['Tepung Terigu Curah', 'Tepung Terigu Kemasan'],
        'garam'    => ['Garam konsumsi'],
        // Perikanan
        'ikan'     => ['Ikan Bandeng', 'Ikan Kembung', 'Ikan Tongkol'],
        'bandeng'  => ['Ikan Bandeng'],
        'kembung'  => ['Ikan Kembung'],
        'tongkol'  => ['Ikan Tongkol'],
        'udang'    => ['Ikan Kembung'],   // tidak ada udang di Bapanas, fallback ke ikan
        'cumi'     => ['Ikan Tongkol'],   // tidak ada cumi di Bapanas, fallback
        'lele'     => ['Ikan Bandeng'],
        'tuna'     => ['Ikan Kembung'],
    ];

    public static function latestForCategory(string $categoryName): ?static
    {
        $nameLower = strtolower(trim($categoryName));

        // Prioritas 1: exact match (nama kategori persis sama dengan commodity_name)
        $exact = static::whereRaw('LOWER(TRIM(commodity_name)) = ?', [trim($nameLower)])
            ->whereNull('province_id')
            ->whereNull('city_id')
            ->orderBy('date', 'desc')
            ->first();
        if ($exact) return $exact;

        // Prioritas 2: pakai mapping kategori → komoditas Bapanas
        // Cek apakah kata kunci dari mapping ada di dalam nama kategori input
        foreach (static::$categoryMap as $keyword => $candidates) {
            if (str_contains($nameLower, $keyword)) {
                foreach ($candidates as $commodity) {
                    $result = static::where('commodity_name', $commodity)
                        ->whereNull('province_id')
                        ->whereNull('city_id')
                        ->orderBy('date', 'desc')
                        ->first();
                    if ($result) return $result;
                }
                break; // jangan lanjut ke keyword lain jika sudah match
            }
        }

        // Prioritas 3: fuzzy LIKE — commodity_name mengandung kata dari kategori
        $words = explode(' ', $nameLower);
        foreach ($words as $word) {
            if (strlen($word) < 3) continue; // skip kata terlalu pendek
            $result = static::whereRaw('LOWER(commodity_name) LIKE ?', ["%{$word}%"])
                ->whereNull('province_id')
                ->whereNull('city_id')
                ->orderBy('date', 'desc')
                ->first();
            if ($result) return $result;
        }

        return null;
    }
    protected $casts = [
        'date' => 'date',
        'price' => 'decimal:2',
    ];

    public function province()
    {
        return $this->belongsTo(Province::class);
    }

    public function city()
    {
        return $this->belongsTo(City::class);
    }
}