<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BapanasPrice extends Model
{
    protected $fillable = [
        'commodity_name',
        'date',
        'price',
        'province_id',
        'city_id',
    ];

    protected $casts = [
        'date' => 'date',
        'price' => 'decimal:2',
    ];

    public function province()
    {
        return $this->belongsTo(Province::class);
    }

    public function city()
    {
        return $this->belongsTo(City::class);
    }
}