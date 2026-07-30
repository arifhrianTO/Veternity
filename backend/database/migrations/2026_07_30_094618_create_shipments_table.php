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
        Schema::create('shipments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained()->cascadeOnDelete();
            $table->string('kurir')->nullable(); // cth: jne, tiki, pos, mandiri
            $table->string('layanan')->nullable(); // cth: REG, YES
            $table->string('nomor_resi')->nullable();
            $table->enum('status_pengiriman', ['menunggu_penjemputan', 'dalam_perjalanan', 'terkirim'])->default('menunggu_penjemputan');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('shipments');
    }
};
