<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OfferHistory extends Model
{
    protected $fillable = [
        'offer_id',
        'aktor_id',
        'aksi',
        'harga_terkait',
    ];

    public function offer(): BelongsTo
    {
        return $this->belongsTo(Offer::class);
    }

    public function aktor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'aktor_id');
    }
}
