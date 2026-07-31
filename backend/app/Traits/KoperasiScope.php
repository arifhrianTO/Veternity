<?php

namespace App\Traits;

use App\Models\User;

trait KoperasiScope
{
    /**
     * ID penjual yang dikelola oleh user saat ini.
     * Untuk Koperasi: dirinya sendiri + seluruh anggota binaan (koperasi_id = dirinya).
     * Untuk role lain: hanya dirinya sendiri.
     *
     * @return array<int, int>
     */
    protected function sellerIds(User $user): array
    {
        $ids = [$user->id];

        if ($user->role === 'koperasi') {
            $binaanIds = User::where('koperasi_id', $user->id)->pluck('id')->all();
            $ids = array_merge($ids, $binaanIds);
        }

        return array_values(array_unique(array_map('intval', $ids)));
    }

    /**
     * ID seluruh anggota binaan milik koperasi.
     *
     * @return array<int, int>
     */
    protected function binaanIds(User $user): array
    {
        return User::where('koperasi_id', $user->id)->pluck('id')->all();
    }
}
