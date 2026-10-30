<?php

namespace App\Services;

use Midtrans\Config;
use Midtrans\Snap;

class PaymentGateway
{
    public function __construct()
    {
        Config::$serverKey = config('services.midtrans.server_key');
        Config::$isProduction = config('services.midtrans.is_production');
        Config::$isSanitized = config('services.midtrans.is_sanitized');
        Config::$is3ds = config('services.midtrans.is_3ds');
    }

    /**
     * Buat Snap token untuk transaksi.
     *
     * @param  array<string, mixed>  $params
     */
    public function createSnapToken(array $params): string
    {
        return Snap::getSnapToken($params);
    }
}
