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
        Schema::create('cities', function (Blueprint $table) {
            $table->unsignedInteger('id')->primary(); // Pakai ID dari RajaOngkir
            $table->unsignedInteger('province_id'); // Tidak perlu relasi ke table di migrasi untuk foreign key jika ID bukan BigInt, cukup index agar cepat
            $table->string('tipe'); // Kabupaten / Kota
            $table->string('nama_kota');
            $table->string('kode_pos')->nullable();
            
            $table->foreign('province_id')->references('id')->on('provinces')->cascadeOnDelete();
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cities');
    }
};
