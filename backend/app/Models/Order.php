<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $fillable = [
        'kode_pesanan',
        'petani_id',
        'pembeli_id',
        'total_harga',
        'status',
        'tanggal_pesanan'
    ];

    public function petani()
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
}
