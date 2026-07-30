<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id(); // Biasa kita pakai id internal, dan kode_pesanan terpisah
            $table->string('kode_pesanan')->unique(); // contoh: PO-9001
            $table->foreignId('petani_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('pembeli_id')->constrained('users')->cascadeOnDelete();
            $table->decimal('total_harga', 15, 2);
            $table->string('status')->default('Menunggu Pembayaran'); // Menunggu Pembayaran, Diproses, Dikirim, Selesai, Dibatalkan
            $table->timestamp('tanggal_pesanan')->useCurrent();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
