<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = [
        'user_id',
        'kategori',
        'stok',
        'satuan',
        'harga_harapan',
        'tanggal_panen',
        'masa_layak',
        'gambar',
        'status',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
