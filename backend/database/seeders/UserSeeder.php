<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Product;
use App\Models\Category;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->command->info('Membuat akun Admin & Koperasi...');

        $admin = User::updateOrCreate(
            ['email' => 'admin@veternity.local'],
            [
                'role' => 'admin',
                'nama_lengkap' => 'Administrator Veternity',
                'no_hp' => '081100000001',
                'tanggal_lahir' => '1990-01-01',
                'kelamin' => 'Laki-laki',
                'alamat' => 'Jl. Merdeka No. 1, Jakarta Pusat',
                'password' => 'password',
            ]
        );

        $koperasiNames = [
            'Koperasi Tani Makmur',
            'Koperasi Nelayan Sejahtera',
            'Koperasi Agri Bersama',
            'Koperasi Mina Bahari',
            'Koperasi Pangan Nusantara',
            'Koperasi Tani Mandiri',
        ];

        $koperasis = [];
        foreach ($koperasiNames as $i => $nama) {
            $no = $i + 1;
            $koperasis[] = User::updateOrCreate(
                ['email' => "koperasi{$no}@veternity.local"],
                [
                    'role' => 'koperasi',
                    'nama_lengkap' => $nama,
                    'no_hp' => '0811000000' . str_pad((string) (10 + $no), 2, '0', STR_PAD_LEFT),
                    'tanggal_lahir' => '1985-05-15',
                    'kelamin' => 'Laki-laki',
                    'alamat' => 'Jl. Koperasi No. ' . $no . ', Daerah ' . $nama,
                    'password' => 'password',
                ]
            );
        }

        $this->command->info('Membuat akun Petani & Nelayan...');

        $petaniBinaan = User::updateOrCreate(
            ['email' => 'petani1@veternity.local'],
            [
                'role' => 'petani_binaan',
                'nama_lengkap' => 'Budi Santoso',
                'no_hp' => '081200000001',
                'nik' => '3201010101900001',
                'rekening' => '1234567890',
                'tanggal_lahir' => '1990-01-01',
                'kelamin' => 'Laki-laki',
                'alamat' => 'Desa Sukamaju, Kec. Cibinong',
                'password' => 'password',
                'koperasi_id' => $koperasis[0]->id,
            ]
        );

        $petaniMandiri = User::updateOrCreate(
            ['email' => 'petani2@veternity.local'],
            [
                'role' => 'petani',
                'nama_lengkap' => 'Joko Susilo',
                'no_hp' => '081200000002',
                'nik' => '3201010101900002',
                'rekening' => '2345678901',
                'tanggal_lahir' => '1988-07-20',
                'kelamin' => 'Laki-laki',
                'alamat' => 'Desa Sumber Jaya, Kec. Cileungsi',
                'password' => 'password',
            ]
        );

        $nelayanBinaan = User::updateOrCreate(
            ['email' => 'nelayan1@veternity.local'],
            [
                'role' => 'nelayan_binaan',
                'nama_lengkap' => 'Made Surya',
                'no_hp' => '081200000003',
                'nik' => '5101010101900003',
                'rekening' => '3456789012',
                'tanggal_lahir' => '1992-03-11',
                'kelamin' => 'Laki-laki',
                'alamat' => 'Jl. Pantai Indah No. 2, Kec. Benoa',
                'password' => 'password',
                'koperasi_id' => $koperasis[0]->id,
            ]
        );

        $nelayanMandiri = User::updateOrCreate(
            ['email' => 'nelayan2@veternity.local'],
            [
                'role' => 'nelayan',
                'nama_lengkap' => 'Agus Salim',
                'no_hp' => '081200000004',
                'nik' => '7371010101900004',
                'rekening' => '4567890123',
                'tanggal_lahir' => '1987-11-05',
                'kelamin' => 'Laki-laki',
                'alamat' => 'Jl. Pelabuhan No. 5, Kec. Makassar',
                'password' => 'password',
            ]
        );

        $this->command->info('Membuat produk untuk Petani & Nelayan...');

        $category = fn (string $nama) => Category::where('nama_kategori', $nama)->firstOrFail()->id;

        $products = [
            [
                'user' => $petaniBinaan,
                'items' => [
                    ['nama_produk' => 'Beras Pandan Wangi', 'kategori' => 'Padi & Serealia', 'gambar' => 'products/beras.png', 'stok' => 500, 'harga' => 13500, 'masa_layak' => 180],
                    ['nama_produk' => 'Cabai Merah Keriting', 'kategori' => 'Sayur', 'gambar' => 'products/sayur.png', 'stok' => 200, 'harga' => 35000, 'masa_layak' => 14],
                    ['nama_produk' => 'Kentang Manado', 'kategori' => 'Umbi', 'gambar' => 'products/umbi.png', 'stok' => 300, 'harga' => 15000, 'masa_layak' => 30],
                    ['nama_produk' => 'Mangga Manalagi', 'kategori' => 'Buah', 'gambar' => 'products/buah.png', 'stok' => 150, 'harga' => 20000, 'masa_layak' => 10],
                ],
            ],
            [
                'user' => $petaniMandiri,
                'items' => [
                    ['nama_produk' => 'Beras Merah Organik', 'kategori' => 'Padi & Serealia', 'gambar' => 'products/beras1.png', 'stok' => 250, 'harga' => 18500, 'masa_layak' => 180],
                    ['nama_produk' => 'Bayam Hijau', 'kategori' => 'Sayur', 'gambar' => 'products/sayur.png', 'stok' => 100, 'harga' => 5000, 'masa_layak' => 5],
                    ['nama_produk' => 'Ubi Jalar Cilembu', 'kategori' => 'Umbi', 'gambar' => 'products/umbi.png', 'stok' => 400, 'harga' => 9000, 'masa_layak' => 45],
                    ['nama_produk' => 'Pisang Ambon', 'kategori' => 'Buah', 'gambar' => 'products/buah.png', 'stok' => 120, 'harga' => 12000, 'masa_layak' => 7],
                ],
            ],
            [
                'user' => $nelayanBinaan,
                'items' => [
                    ['nama_produk' => 'Ikan Tuna Segar', 'kategori' => 'Ikan Air Laut', 'gambar' => 'products/ikan.png', 'stok' => 80, 'harga' => 55000, 'masa_layak' => 3],
                    ['nama_produk' => 'Udang Vaname', 'kategori' => 'Udang & Krustasea', 'gambar' => 'products/udang.png', 'stok' => 100, 'harga' => 75000, 'masa_layak' => 3],
                    ['nama_produk' => 'Ikan Bandeng', 'kategori' => 'Ikan Air Laut', 'gambar' => 'products/ikan1.png', 'stok' => 120, 'harga' => 28000, 'masa_layak' => 3],
                    ['nama_produk' => 'Ikan Kembung', 'kategori' => 'Ikan Air Laut', 'gambar' => 'products/ikan.png', 'stok' => 90, 'harga' => 25000, 'masa_layak' => 3],
                ],
            ],
            [
                'user' => $nelayanMandiri,
                'items' => [
                    ['nama_produk' => 'Ikan Tongkol', 'kategori' => 'Ikan Air Laut', 'gambar' => 'products/ikan1.png', 'stok' => 110, 'harga' => 30000, 'masa_layak' => 3],
                    ['nama_produk' => 'Cumi-Cumi Segar', 'kategori' => 'Cumi & Moluska', 'gambar' => 'products/ikan.png', 'stok' => 70, 'harga' => 65000, 'masa_layak' => 3],
                    ['nama_produk' => 'Ikan Lele', 'kategori' => 'Ikan Air Tawar', 'gambar' => 'products/ikan.png', 'stok' => 200, 'harga' => 18000, 'masa_layak' => 3],
                    ['nama_produk' => 'Udang Windu', 'kategori' => 'Udang & Krustasea', 'gambar' => 'products/udang.png', 'stok' => 85, 'harga' => 80000, 'masa_layak' => 3],
                ],
            ],
        ];

        foreach ($products as $data) {
            foreach ($data['items'] as $item) {
                Product::updateOrCreate(
                    [
                        'user_id' => $data['user']->id,
                        'nama_produk' => $item['nama_produk'],
                    ],
                    [
                        'category_id' => $category($item['kategori']),
                        'stok' => $item['stok'],
                        'satuan' => 'Kg',
                        'berat_gram' => 1000,
                        'harga_harapan' => $item['harga'],
                        'tanggal_panen' => now()->subDays(rand(0, 2))->toDateString(),
                        'masa_layak' => $item['masa_layak'],
                        'gambar' => $item['gambar'],
                        'status' => 'Aktif',
                    ]
                );
            }
        }

        $this->command->info('Seeder User berhasil: 1 admin, 6 koperasi, 2 petani & 2 nelayan (16 produk).');
    }
}
