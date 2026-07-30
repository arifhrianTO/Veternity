<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Category;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            [
                'nama_kategori' => 'Sayur',
                'tipe' => 'pertanian',
                'gambar' => '/images/sayur.png'
            ],
            [
                'nama_kategori' => 'Buah',
                'tipe' => 'pertanian',
                'gambar' => '/images/buah.png'
            ],
            [
                'nama_kategori' => 'Ikan',
                'tipe' => 'perikanan',
                'gambar' => '/images/ikan.png'
            ],
            [
                'nama_kategori' => 'Beras',
                'tipe' => 'pertanian',
                'gambar' => '/images/beras.png'
            ],
            [
                'nama_kategori' => 'Umbi',
                'tipe' => 'pertanian',
                'gambar' => '/images/umbi.png'
            ],
        ];

        foreach ($categories as $category) {
            Category::create($category);
        }
    }
}
