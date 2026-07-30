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
        Schema::table('users', function (Blueprint $table) {
            $table->unsignedInteger('provinsi_id')->nullable()->after('alamat');
            $table->unsignedInteger('kota_id')->nullable()->after('provinsi_id');
            $table->string('kode_pos')->nullable()->after('kota_id');
            
            // Relasi ke tabel dirinya sendiri untuk Petani Binaan
            $table->foreignId('koperasi_id')->nullable()->after('role')->constrained('users')->nullOnDelete();
            
            $table->string('foto_profil')->nullable()->after('kode_pos');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['koperasi_id']);
            $table->dropColumn(['provinsi_id', 'kota_id', 'kode_pos', 'koperasi_id', 'foto_profil']);
        });
    }
};
