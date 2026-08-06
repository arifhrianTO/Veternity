<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Courier;

class CourierSeeder extends Seeder
{
    /**
     * Daftar 17 ekspedisi domestik RajaOngkir (dari dokumentasi Komerce).
     */
    public function run(): void
    {
        $couriers = [
            ['kode' => 'jne', 'nama' => 'JNE'],
            ['kode' => 'sicepat', 'nama' => 'SiCepat'],
            ['kode' => 'jnt', 'nama' => 'J&T Express'],
            ['kode' => 'pos', 'nama' => 'POS Indonesia'],
            ['kode' => 'tiki', 'nama' => 'TIKI'],
            ['kode' => 'anteraja', 'nama' => 'AnterAja'],
            ['kode' => 'ninja', 'nama' => 'Ninja Xpress'],
            ['kode' => 'lion', 'nama' => 'Lion Parcel'],
            ['kode' => 'ide', 'nama' => 'IDE Express'],
            ['kode' => 'sap', 'nama' => 'SAP Express'],
            ['kode' => 'ncs', 'nama' => 'NCS'],
            ['kode' => 'rex', 'nama' => 'REX'],
            ['kode' => 'rpx', 'nama' => 'RPX'],
            ['kode' => 'sentral', 'nama' => 'Sentral Cargo'],
            ['kode' => 'star', 'nama' => 'Star Cargo'],
            ['kode' => 'wahana', 'nama' => 'Wahana'],
        ];

        foreach ($couriers as $courier) {
            Courier::updateOrCreate(
                ['kode' => $courier['kode']],
                [
                    'nama' => $courier['nama'],
                    'sumber' => 'rajaongkir',
                    'status' => 'Aktif',
                ]
            );
        }

        $this->command->info('Seeder Courier berhasil: ' . count($couriers) . ' ekspedisi RajaOngkir.');
    }
}
