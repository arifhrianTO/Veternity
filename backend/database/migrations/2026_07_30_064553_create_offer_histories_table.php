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
        Schema::create('offer_histories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('offer_id')->constrained()->cascadeOnDelete();
            $table->foreignId('aktor_id')->constrained('users')->cascadeOnDelete(); // Siapa yang ngasih respon (pembeli/petani)
            $table->string('aksi'); // contoh: Mengajukan penawaran, Menunggu respon, Penawaran diterima, Counter offer
            $table->decimal('harga_terkait', 15, 2)->nullable();
            $table->timestamps(); // created_at ini otomatis jadi waktu kejadian
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('offer_histories');
    }
};
