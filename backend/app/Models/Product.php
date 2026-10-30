<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Product extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'user_id',
        'nama_produk',
        'komoditas_acuan',
        'category_id',
        'commodity_id',
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

    public function commodity()
    {
        return $this->belongsTo(Commodity::class);
    }
}
