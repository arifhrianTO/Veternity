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
        Schema::table('orders', function (Blueprint $table) {
            $table->text('alamat_pengiriman')->nullable()->after('status');
            $table->unsignedInteger('provinsi_id')->nullable()->after('alamat_pengiriman');
            $table->unsignedInteger('kota_id')->nullable()->after('provinsi_id');
            $table->integer('total_berat_gram')->default(0)->after('kota_id');
            $table->decimal('ongkos_kirim', 15, 2)->default(0)->after('total_berat_gram');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn([
                'alamat_pengiriman', 
                'provinsi_id', 
                'kota_id', 
                'total_berat_gram', 
                'ongkos_kirim'
            ]);
        });
    }
};
