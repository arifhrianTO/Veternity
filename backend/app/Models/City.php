<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class City extends Model
{
    use HasFactory;

    // Karena id dari RajaOngkir bukan auto increment
    public $incrementing = false;
    protected $keyType = 'integer';

    protected $fillable = ['id', 'province_id', 'tipe', 'nama_kota', 'kode_pos'];

    public function province()
    {
        return $this->belongsTo(Province::class);
    }
}
