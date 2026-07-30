<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Offer extends Model
{
    protected $fillable = [
        'kode_penawaran',
        'product_id',
        'pembeli_id',
        'petani_id',
        'jumlah_diminta',
        'harga_tawaran',
        'pesan_pembeli',
        'status'
    ];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function pembeli()
    {
        return $this->belongsTo(User::class, 'pembeli_id');
    }

    public function petani()
    {
        return $this->belongsTo(User::class, 'petani_id');
    }

    public function histories()
    {
        return $this->hasMany(OfferHistory::class);
    }
}
