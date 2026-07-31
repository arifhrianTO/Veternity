<?php

namespace App\Console\Commands;

use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;

use Illuminate\Support\Facades\Http;
use App\Models\BapanasPrice;
use Illuminate\Support\Facades\Log;

#[Signature('bapanas:sync')]
#[Description('Sync price data from Bapanas API')]
class SyncBapanasPrice extends Command
{
    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Starting Bapanas Price Sync (Open Data Version)...');

        // Menggunakan URL JSON dari Open Data Bapanas
        $apiUrl = env('BAPANAS_API_URL', 'https://data.badanpangan.go.id/download/document/dataset/290/1777262464.json/json/json'); 

        try {
            $this->info("Fetching data from: {$apiUrl}");
            // Timeout dinaikkan jadi 120 detik + retry 3 kali dengan jeda 2 detik
            $response = Http::timeout(120)->retry(3, 2000)->get($apiUrl);   

            if ($response->successful()) {
                $dataObj = $response->json() ?? []; 
                
                if (empty($dataObj)) {
                    $this->warn('No data found from the API response.');
                    return;
                }

                $bar = $this->output->createProgressBar(count($dataObj) - 1);
                $bar->start();

                foreach ($dataObj as $key => $item) {
                    // Skip header row (index 0 usually contains the column names like "Komoditas", "Tahun")
                    if ($key == 0 || $item['0'] === 'Komoditas') continue;

                    $commodity = trim($item['0'] ?? 'Unknown');
                    $year = trim($item['1'] ?? '');
                    $monthStr = trim($item['2'] ?? '');
                    
                    // Parse Harga "Rp12,319" -> 12319.00
                    $rawPrice = $item['3'] ?? '0';
                    $rawPrice = str_replace(['Rp', ',', ' ', '-'], '', $rawPrice);
                    $price = is_numeric($rawPrice) ? (float) $rawPrice : 0;

                    // Parse Month String to Number
                    $months = ['Januari' => 1, 'Februari' => 2, 'Maret' => 3, 'April' => 4, 'Mei' => 5, 'Juni' => 6, 
                               'Juli' => 7, 'Agustus' => 8, 'September' => 9, 'Oktober' => 10, 'November' => 11, 'Desember' => 12];
                    $monthNum = $months[$monthStr] ?? 1;
                    
                    // Format Date to YYYY-MM-01
                    $dateStr = sprintf('%04d-%02d-01', (int)$year, $monthNum);

                    BapanasPrice::updateOrCreate(
                        [
                            'commodity_name' => $commodity,
                            'date' => $dateStr,
                            'province_id' => null, // Data ini level Nasional
                            'city_id' => null,     // Data ini level Nasional
                        ],
                        [
                            'price' => $price,
                        ]
                    );

                    $bar->advance();
                }

                $bar->finish();
                $this->newLine();
                $this->info('Successfully synchronized Bapanas Price data from Open Data!');
                Log::info('Bapanas Price sync completed.');

            } else {
                $this->error('Failed to fetch data from Bapanas API. Status: ' . $response->status());
                Log::error('Bapanas Price sync failed.', ['status' => $response->status()]);
            }

        } catch (\Exception $e) {
            $this->error('An error occurred during sync: ' . $e->getMessage());
            Log::error('Bapanas Price sync error: ' . $e->getMessage());
        }
    }
}
