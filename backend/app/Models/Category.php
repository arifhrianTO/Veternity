<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasFactory;

    protected $fillable = ['nama_kategori', 'tipe', 'gambar'];

    public function products()
    {
        return $this->hasMany(Product::class);
    }

    public function commodities()
    {
        return $this->hasMany(Commodity::class)->orderBy('nama_komoditas');
    }
}
