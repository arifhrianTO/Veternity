<?php

namespace Database\Seeders;

// use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            CategorySeeder::class,
            // RajaOngkirSeeder::class, // Anda dapat me-uncomment ini jika sudah mensetting RAJAONGKIR_API_KEY di .env
        ]);
    }
}
