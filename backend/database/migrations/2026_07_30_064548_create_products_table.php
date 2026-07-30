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
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete(); // Petani ID
            $table->string('kategori');
            $table->decimal('stok', 10, 2);
            $table->string('satuan')->default('Kg');
            $table->decimal('harga_harapan', 15, 2);
            $table->date('tanggal_panen');
            $table->integer('masa_layak'); // Dalam hari
            $table->string('gambar')->nullable();
            $table->string('status')->default('Aktif'); // Aktif, Habis, Kadaluarsa
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
