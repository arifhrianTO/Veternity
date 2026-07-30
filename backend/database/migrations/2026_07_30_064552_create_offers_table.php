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
        Schema::create('offers', function (Blueprint $table) {
            $table->id();
            $table->string('kode_penawaran')->unique(); // contoh: PNW-001
            $table->foreignId('product_id')->constrained()->cascadeOnDelete();
            $table->foreignId('pembeli_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('petani_id')->constrained('users')->cascadeOnDelete();
            $table->decimal('jumlah_diminta', 10, 2);
            $table->decimal('harga_tawaran', 15, 2);
            $table->text('pesan_pembeli')->nullable();
            $table->string('status')->default('Menunggu'); // Menunggu, Diterima, Ditolak, Counter
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('offers');
    }
};
