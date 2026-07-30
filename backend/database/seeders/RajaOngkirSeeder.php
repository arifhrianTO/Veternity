<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use App\Models\Province;
use App\Models\City;

class RajaOngkirSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Ganti dengan API Key RajaOngkir Anda. 
        // Lebih baik taruh di .env: env('RAJAONGKIR_API_KEY')
        $apiKey = env('RAJAONGKIR_API_KEY', 'your_rajaongkir_api_key_here'); 

        if ($apiKey === 'your_rajaongkir_api_key_here' || empty($apiKey)) {
            $this->command->warn('API Key RajaOngkir belum di set di .env (RAJAONGKIR_API_KEY). Melewati seeder ini.');
            // Untuk testing jika API key belum ada, bisa sediakan mock data
            // return; 
        }

        $this->command->info('Mengambil data Provinsi dari RajaOngkir...');
        
        $response = Http::withHeaders([
            'key' => $apiKey
        ])->get('https://api.rajaongkir.com/starter/province');

        if ($response->successful()) {
            $provinces = $response->json()['rajaongkir']['results'];
            
            foreach ($provinces as $province) {
                Province::updateOrCreate(
                    ['id' => $province['province_id']],
                    ['nama_provinsi' => $province['province']]
                );
            }
            $this->command->info('Data Provinsi berhasil di-seed.');
        } else {
            $this->command->error('Gagal mengambil data Provinsi: ' . $response->body());
        }

        $this->command->info('Mengambil data Kota dari RajaOngkir...');

        $responseCity = Http::withHeaders([
            'key' => $apiKey
        ])->get('https://api.rajaongkir.com/starter/city');

        if ($responseCity->successful()) {
            $cities = $responseCity->json()['rajaongkir']['results'];
            
            foreach ($cities as $city) {
                City::updateOrCreate(
                    ['id' => $city['city_id']],
                    [
                        'province_id' => $city['province_id'],
                        'tipe' => $city['type'], // Kabupaten atau Kota
                        'nama_kota' => $city['city_name'],
                        'kode_pos' => $city['postal_code'],
                    ]
                );
            }
            $this->command->info('Data Kota berhasil di-seed.');
        } else {
            $this->command->error('Gagal mengambil data Kota: ' . $responseCity->body());
        }
    }
}
