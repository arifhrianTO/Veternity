<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;
use App\Models\Commodity;
use App\Models\Product;

class CategoryCommoditySeeder extends Seeder
{
    /**
     * Taksonomi kategori & komoditas untuk marketplace.
     * 'bapanas' => nama persis komoditas di scrap Bapanas (null jika tidak tersedia).
     */
    private array $categories = [
        [
            'nama_kategori' => 'Padi & Serealia',
            'tipe' => 'pertanian',
            'gambar' => '/images/beras.png',
            'commodities' => [
                ['nama' => 'Beras Premium', 'bapanas' => 'Beras Premium'],
                ['nama' => 'Beras Medium', 'bapanas' => 'Beras Medium'],
                ['nama' => 'Beras SPHP', 'bapanas' => 'Beras SPHP'],
                ['nama' => 'Jagung', 'bapanas' => 'Jagung Tk. Peternak'],
                ['nama' => 'Gandum', 'bapanas' => null],
                ['nama' => 'Sorgum', 'bapanas' => null],
            ],
        ],
        [
            'nama_kategori' => 'Sayur',
            'tipe' => 'pertanian',
            'gambar' => '/images/sayur.png',
            'commodities' => [
                ['nama' => 'Cabai Merah Besar', 'bapanas' => 'Cabai Merah Besar'],
                ['nama' => 'Cabai Keriting', 'bapanas' => 'Cabai Merah Keriting'],
                ['nama' => 'Cabai Rawit', 'bapanas' => 'Cabai Rawit Merah'],
                ['nama' => 'Bawang Merah', 'bapanas' => 'Bawang Merah'],
                ['nama' => 'Bawang Putih', 'bapanas' => 'Bawang Putih (Bonggol)'],
                ['nama' => 'Tomat', 'bapanas' => null],
                ['nama' => 'Kentang', 'bapanas' => null],
                ['nama' => 'Wortel', 'bapanas' => null],
                ['nama' => 'Kangkung', 'bapanas' => null],
                ['nama' => 'Bayam', 'bapanas' => null],
                ['nama' => 'Sawi', 'bapanas' => null],
                ['nama' => 'Kubis', 'bapanas' => null],
                ['nama' => 'Brokoli', 'bapanas' => null],
                ['nama' => 'Terong', 'bapanas' => null],
                ['nama' => 'Timun', 'bapanas' => null],
                ['nama' => 'Buncis', 'bapanas' => null],
                ['nama' => 'Kacang Panjang', 'bapanas' => null],
                ['nama' => 'Labu', 'bapanas' => null],
                ['nama' => 'Selada', 'bapanas' => null],
                ['nama' => 'Daun Bawang', 'bapanas' => null],
            ],
        ],
        [
            'nama_kategori' => 'Buah',
            'tipe' => 'pertanian',
            'gambar' => '/images/buah.png',
            'commodities' => [
                ['nama' => 'Pisang', 'bapanas' => null],
                ['nama' => 'Mangga', 'bapanas' => null],
                ['nama' => 'Jeruk', 'bapanas' => null],
                ['nama' => 'Apel', 'bapanas' => null],
                ['nama' => 'Alpukat', 'bapanas' => null],
                ['nama' => 'Durian', 'bapanas' => null],
                ['nama' => 'Pepaya', 'bapanas' => null],
                ['nama' => 'Semangka', 'bapanas' => null],
                ['nama' => 'Melon', 'bapanas' => null],
                ['nama' => 'Salak', 'bapanas' => null],
                ['nama' => 'Nanas', 'bapanas' => null],
                ['nama' => 'Rambutan', 'bapanas' => null],
                ['nama' => 'Anggur', 'bapanas' => null],
            ],
        ],
        [
            'nama_kategori' => 'Umbi',
            'tipe' => 'pertanian',
            'gambar' => '/images/umbi.png',
            'commodities' => [
                ['nama' => 'Singkong', 'bapanas' => null],
                ['nama' => 'Ubi Jalar', 'bapanas' => null],
                ['nama' => 'Talas', 'bapanas' => null],
            ],
        ],
        [
            'nama_kategori' => 'Kacang-kacangan',
            'tipe' => 'pertanian',
            'gambar' => '/images/kacang.jpg',
            'commodities' => [
                ['nama' => 'Kedelai', 'bapanas' => 'Kedelai Biji Kering'],
                ['nama' => 'Kacang Tanah', 'bapanas' => null],
                ['nama' => 'Kacang Hijau', 'bapanas' => null],
                ['nama' => 'Kacang Merah', 'bapanas' => null],
            ],
        ],
        [
            'nama_kategori' => 'Peternakan',
            'tipe' => 'pertanian',
            'gambar' => '/images/peternakan.jpg',
            'commodities' => [
                ['nama' => 'Daging Sapi', 'bapanas' => 'Daging Sapi Murni'],
                ['nama' => 'Daging Ayam', 'bapanas' => 'Daging Ayam Ras'],
                ['nama' => 'Telur Ayam', 'bapanas' => 'Telur Ayam Ras'],
                ['nama' => 'Daging Kerbau Segar', 'bapanas' => 'Daging Kerbau Segar (Lokal)'],
                ['nama' => 'Daging Kerbau Beku', 'bapanas' => 'Daging Kerbau Beku (Impor)'],
                ['nama' => 'Daging Kambing', 'bapanas' => null],
            ],
        ],
        [
            'nama_kategori' => 'Bahan Pokok & Olahan',
            'tipe' => 'pertanian',
            'gambar' => '/images/bahan_pokok.jpg',
            'commodities' => [
                ['nama' => 'Gula Pasir', 'bapanas' => 'Gula Pasir Lokal/Curah'],
                ['nama' => 'Minyak Goreng Curah', 'bapanas' => 'Minyak Goreng Curah'],
                ['nama' => 'Minyak Goreng Kemasan', 'bapanas' => 'Minyak Goreng Kemasan'],
                ['nama' => 'Minyak Kita', 'bapanas' => 'Minyak Kita'],
                ['nama' => 'Tepung Terigu', 'bapanas' => 'Tepung Terigu Curah'],
                ['nama' => 'Tepung Terigu Kemasan', 'bapanas' => 'Tepung Terigu Kemasan'],
                ['nama' => 'Garam', 'bapanas' => 'Garam konsumsi'],
            ],
        ],
        [
            'nama_kategori' => 'Ikan Air Laut',
            'tipe' => 'perikanan',
            'gambar' => '/images/ikan_laut.jpg',
            'commodities' => [
                ['nama' => 'Ikan Kembung', 'bapanas' => 'Ikan Kembung'],
                ['nama' => 'Ikan Tongkol', 'bapanas' => 'Ikan Tongkol'],
                ['nama' => 'Ikan Bandeng', 'bapanas' => 'Ikan Bandeng'],
                ['nama' => 'Ikan Tuna', 'bapanas' => null],
                ['nama' => 'Ikan Cakalang', 'bapanas' => null],
                ['nama' => 'Ikan Tenggiri', 'bapanas' => null],
                ['nama' => 'Ikan Kakap', 'bapanas' => null],
                ['nama' => 'Ikan Kerapu', 'bapanas' => null],
                ['nama' => 'Ikan Bawal', 'bapanas' => null],
                ['nama' => 'Ikan Teri', 'bapanas' => null],
                ['nama' => 'Ikan Layang', 'bapanas' => null],
                ['nama' => 'Ikan Lemuru', 'bapanas' => null],
            ],
        ],
        [
            'nama_kategori' => 'Ikan Air Tawar',
            'tipe' => 'perikanan',
            'gambar' => '/images/ikan.png',
            'commodities' => [
                ['nama' => 'Ikan Nila', 'bapanas' => null],
                ['nama' => 'Ikan Lele', 'bapanas' => null],
                ['nama' => 'Ikan Gurame', 'bapanas' => null],
                ['nama' => 'Ikan Mas', 'bapanas' => null],
                ['nama' => 'Ikan Patin', 'bapanas' => null],
                ['nama' => 'Ikan Mujair', 'bapanas' => null],
                ['nama' => 'Ikan Gabus', 'bapanas' => null],
            ],
        ],
        [
            'nama_kategori' => 'Udang & Krustasea',
            'tipe' => 'perikanan',
            'gambar' => '/images/udang.jpg',
            'commodities' => [
                ['nama' => 'Udang Vaname', 'bapanas' => null],
                ['nama' => 'Udang Windu', 'bapanas' => null],
                ['nama' => 'Udang Putih', 'bapanas' => null],
                ['nama' => 'Udang Jerbung', 'bapanas' => null],
                ['nama' => 'Kepiting', 'bapanas' => null],
                ['nama' => 'Rajungan', 'bapanas' => null],
                ['nama' => 'Lobster', 'bapanas' => null],
            ],
        ],
        [
            'nama_kategori' => 'Cumi & Moluska',
            'tipe' => 'perikanan',
            'gambar' => '/images/cumi.png',
            'commodities' => [
                ['nama' => 'Cumi-cumi', 'bapanas' => null],
                ['nama' => 'Sotong', 'bapanas' => null],
                ['nama' => 'Gurita', 'bapanas' => null],
                ['nama' => 'Kerang Hijau', 'bapanas' => null],
                ['nama' => 'Kerang Dara', 'bapanas' => null],
                ['nama' => 'Tiram', 'bapanas' => null],
            ],
        ],
        [
            'nama_kategori' => 'Rumput Laut & Lainnya',
            'tipe' => 'perikanan',
            'gambar' => '/images/rumput_laut.png',
            'commodities' => [
                ['nama' => 'Rumput Laut Eucheuma', 'bapanas' => null],
                ['nama' => 'Rumput Laut Gracilaria', 'bapanas' => null],
            ],
        ],
    ];

    public function run(): void
    {
        // 1. Pastikan kategori & komoditas baru sudah ada lebih dulu
        foreach ($this->categories as $categoryData) {
            $category = Category::updateOrCreate(
                ['nama_kategori' => $categoryData['nama_kategori']],
                ['tipe' => $categoryData['tipe'], 'gambar' => $categoryData['gambar']]
            );

            foreach ($categoryData['commodities'] as $commodity) {
                Commodity::updateOrCreate(
                    [
                        'category_id' => $category->id,
                        'nama_komoditas' => $commodity['nama'],
                    ],
                    ['bapanas_match' => $commodity['bapanas']]
                );
            }
        }

        // 2. Perbaiki produk orphan (category_id null) berdasarkan nama produk
        $this->assignOrphanProducts();
    }

    /**
     * Perbaiki produk yang category_id-nya null: tebak kategori dari nama produk,
     * lalu coba pasangkan komoditas terbaik berdasarkan kesamaan nama.
     */
    private function assignOrphanProducts(): void
    {
        $rules = [
            'beras' => 'Padi & Serealia',
            'gabah' => 'Padi & Serealia',
            'jagung' => 'Padi & Serealia',
            'cabai' => 'Sayur',
            'bawang' => 'Sayur',
            'tomat' => 'Sayur',
            'kangkung' => 'Sayur',
            'bayam' => 'Sayur',
            'sawi' => 'Sayur',
            'kubis' => 'Sayur',
            'terong' => 'Sayur',
            'wortel' => 'Sayur',
            'kentang' => 'Sayur',
            'ubi' => 'Umbi',
            'singkong' => 'Umbi',
            'talas' => 'Umbi',
            'pisang' => 'Buah',
            'mangga' => 'Buah',
            'jeruk' => 'Buah',
            'apel' => 'Buah',
            'alpukat' => 'Buah',
            'durian' => 'Buah',
            'pepaya' => 'Buah',
            'semangka' => 'Buah',
            'melon' => 'Buah',
            'salak' => 'Buah',
            'nanas' => 'Buah',
            'rambutan' => 'Buah',
            'anggur' => 'Buah',
            'kedelai' => 'Kacang-kacangan',
            'kacang' => 'Kacang-kacangan',
            'daging sapi' => 'Peternakan',
            'daging ayam' => 'Peternakan',
            'telur' => 'Peternakan',
            'sapi' => 'Peternakan',
            'kambing' => 'Peternakan',
            'gula' => 'Bahan Pokok & Olahan',
            'minyak' => 'Bahan Pokok & Olahan',
            'tepung' => 'Bahan Pokok & Olahan',
            'garam' => 'Bahan Pokok & Olahan',
            'udang' => 'Udang & Krustasea',
            'kepiting' => 'Udang & Krustasea',
            'rajungan' => 'Udang & Krustasea',
            'lobster' => 'Udang & Krustasea',
            'cumi' => 'Cumi & Moluska',
            'sotong' => 'Cumi & Moluska',
            'gurita' => 'Cumi & Moluska',
            'kerang' => 'Cumi & Moluska',
            'tiram' => 'Cumi & Moluska',
            'lele' => 'Ikan Air Tawar',
            'nila' => 'Ikan Air Tawar',
            'gurame' => 'Ikan Air Tawar',
            'patin' => 'Ikan Air Tawar',
            'mujair' => 'Ikan Air Tawar',
            'gabus' => 'Ikan Air Tawar',
            'mas' => 'Ikan Air Tawar',
            'rumput laut' => 'Rumput Laut & Lainnya',
        ];

        $marineRegex = '/ikan|tuna|tongkol|kembung|bandeng|cakalang|tenggiri|kakap|kerapu|bawal|teri|layang|lemuru|sarden/';

        foreach (Product::whereNull('category_id')->get() as $product) {
            $name = strtolower($product->nama_produk);
            $categoryName = null;

            foreach ($rules as $keyword => $catName) {
                if (str_contains($name, $keyword)) {
                    $categoryName = $catName;
                    break;
                }
            }

            if (! $categoryName && preg_match($marineRegex, $name)) {
                $categoryName = 'Ikan Air Laut';
            }

            if (! $categoryName) {
                continue;
            }

            $category = Category::where('nama_kategori', $categoryName)->first();
            if (! $category) {
                continue;
            }

            $product->update(['category_id' => $category->id]);

            // Pasangkan komoditas terbaik (substring nama) sebagai best-effort
            $commodity = Commodity::where('category_id', $category->id)->get()
                ->first(function ($c) use ($name) {
                    $cName = strtolower($c->nama_komoditas);
                    return str_contains($name, $cName) || str_contains($cName, $name);
                });

            if ($commodity) {
                $product->update([
                    'commodity_id' => $commodity->id,
                    'komoditas_acuan' => $commodity->bapanas_match,
                ]);
            }
        }
    }
}
