<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

use Laravel\Sanctum\HasApiTokens;

#[Fillable([
    'role', 'nama_lengkap', 'email', 'no_hp', 'nik', 'rekening', 'tanggal_lahir', 'kelamin', 'alamat', 'password',
    'provinsi_id', 'kota_id', 'kode_pos', 'koperasi_id', 'foto_profil', 'status'
])]
#[Hidden(['password', 'remember_token'])]
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function province()
    {
        return $this->belongsTo(Province::class, 'provinsi_id');
    }

    public function city()
    {
        return $this->belongsTo(City::class, 'kota_id');
    }

    // Untuk Petani/Nelayan yang memiliki Koperasi Binaan
    public function koperasi()
    {
        return $this->belongsTo(User::class, 'koperasi_id');
    }

    // Untuk Koperasi yang memiliki Petani/Nelayan Binaan
    public function binaan()
    {
        return $this->hasMany(User::class, 'koperasi_id');
    }

    public function carts()
    {
        return $this->hasMany(Cart::class);
    }

    public function products()
    {
        return $this->hasMany(Product::class);
    }
}
