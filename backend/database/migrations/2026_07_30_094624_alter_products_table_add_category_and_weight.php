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
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn('kategori'); // Hapus kolom kategori yang lama (string)
            $table->foreignId('category_id')->nullable()->after('user_id')->constrained()->nullOnDelete();
            
            $table->integer('berat_gram')->default(1000)->after('satuan'); // Untuk RajaOngkir, default 1kg
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropForeign(['category_id']);
            $table->dropColumn(['category_id', 'berat_gram']);
            $table->string('kategori')->nullable(); // Kembalikan kolom kategori lama jika di-rollback
        });
    }
};
