<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = [
        'user_id',
        'nama_produk',
        'category_id',
        'stok',
        'satuan',
        'berat_gram',
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

    public function category()
    {
        return $this->belongsTo(Category::class);
    }
}
