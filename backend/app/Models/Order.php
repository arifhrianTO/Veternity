<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $fillable = [
        'kode_pesanan',
        'petani_id', // Bisa juga mengacu ke ID Koperasi jika penjualnya Koperasi
        'pembeli_id',
        'total_harga',
        'status',
        'tanggal_pesanan',
        'alamat_pengiriman',
        'provinsi_id',
        'kota_id',
        'total_berat_gram',
        'ongkos_kirim'
    ];

    public function penjual() // Mengganti nama alias relasi agar lebih umum (bisa petani/koperasi)
    {
        return $this->belongsTo(User::class, 'petani_id'); 
    }

    public function pembeli()
    {
        return $this->belongsTo(User::class, 'pembeli_id');
    }

    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }

    public function shipment()
    {
        return $this->hasOne(Shipment::class);
    }
}
