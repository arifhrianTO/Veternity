<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class UserController extends Controller
{
    /**
     * Update profil pengguna yang sedang login.
     */
    public function update(Request $request)
    {
        $user = $request->user();

        $validator = Validator::make($request->all(), [
            'nama_lengkap' => 'sometimes|string|max:255',
            'no_hp' => 'sometimes|string|max:20|unique:users,no_hp,' . $user->id,
            'nik' => 'nullable|string|max:30',
            'rekening' => 'nullable|string|max:50',
            'tanggal_lahir' => 'nullable|date',
            'kelamin' => 'nullable|string',
            'alamat' => 'nullable|string',
            'provinsi_id' => 'nullable|integer',
            'kota_id' => 'nullable|integer',
            'kode_pos' => 'nullable|string|max:10',
            'koperasi_id' => 'nullable|exists:users,id',
            'foto_profil' => 'nullable|image|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validasi gagal',
                'errors' => $validator->errors()
            ], 422);
        }

        $data = $request->only([
            'nama_lengkap', 'no_hp', 'nik', 'rekening', 'tanggal_lahir',
            'kelamin', 'alamat', 'provinsi_id', 'kota_id', 'kode_pos', 'koperasi_id'
        ]);

        if ($request->hasFile('foto_profil')) {
            if ($user->foto_profil && Storage::disk('public')->exists($user->foto_profil)) {
                Storage::disk('public')->delete($user->foto_profil);
            }
            $data['foto_profil'] = $request->file('foto_profil')->store('profiles', 'public');
        }

        $user->update(array_filter($data, fn ($value) => $value !== null));

        return response()->json([
            'status' => 'success',
            'message' => 'Profil berhasil diperbarui',
            'data' => $user
        ]);
    }

    /**
     * Dapatkan daftar koperasi untuk dropdown pendaftaran/profil petani/nelayan.
     */
    public function getKoperasiList()
    {
        $koperasi = User::where('role', 'koperasi')->get(['id', 'nama_lengkap']);
        return response()->json($koperasi);
    }

    /**
     * Ganti password (opsional, dipakai halaman profil).
     */
    public function changePassword(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'password_lama' => 'required|string',
            'password_baru' => 'required|string|min:8',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validasi gagal',
                'errors' => $validator->errors()
            ], 422);
        }

        $user = $request->user();

        if (! \Illuminate\Support\Facades\Hash::check($request->password_lama, $user->password)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Password lama salah.'
            ], 422);
        }

        $user->password = \Illuminate\Support\Facades\Hash::make($request->password_baru);
        $user->save();

        return response()->json([
            'status' => 'success',
            'message' => 'Password berhasil diganti'
        ]);
    }
}
