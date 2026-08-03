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
        Schema::create('bapanas_prices', function (Blueprint $table) {
            $table->id();
            $table->string('commodity_name');
            $table->date('date');
            $table->decimal('price', 15, 2);
            
            // Menggunakan foreignIdId agar otomatis bernilai BIGINT UNSIGNED
            $table->foreignId('province_id')->nullable()->constrained('provinces')->nullOnDelete();
            $table->foreignId('city_id')->nullable()->constrained('cities')->nullOnDelete();
            
            $table->timestamps();
            
            // Untuk memastikan tidak ada duplikat data komoditas yang sama di tanggal dan wilayah yang sama
            $table->unique(['commodity_name', 'date', 'province_id', 'city_id'], 'bapanas_unique_price');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bapanas_prices');
    }
};