<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';

use Illuminate\Contracts\Console\Kernel;
$app->make(Kernel::class)->bootstrap();

use App\Models\Offer;
use App\Models\BapanasPrice;

$offers = Offer::all();
foreach ($offers as $o) {
    $bapanas = null;
    if ($o->product) {
        if (!empty($o->product->nama_produk)) {
            $bapanas = BapanasPrice::latestForCategory($o->product->nama_produk);
        }
        if (!$bapanas && $o->product->category) {
            $bapanas = BapanasPrice::latestForCategory($o->product->category->nama_kategori);
        }
    }
    echo "Offer: {$o->kode_penawaran} (Product: " . ($o->product ? $o->product->nama_produk : 'NULL') . ") -> Bapanas: " . ($bapanas ? "{$bapanas->commodity_name}: Rp {$bapanas->price}" : "NULL") . PHP_EOL;
}
