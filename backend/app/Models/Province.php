<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Province extends Model
{
    use HasFactory;

    // Karena id dari RajaOngkir bukan auto increment
    public $incrementing = false;
    protected $keyType = 'integer';

    protected $fillable = ['id', 'nama_provinsi'];

    public function cities()
    {
        return $this->hasMany(City::class);
    }
}
