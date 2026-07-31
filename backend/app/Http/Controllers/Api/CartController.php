<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Cart;

class CartController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $carts = Cart::with(['product.user'])->where('user_id', $request->user()->id)->get();
        return response()->json($carts);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'kuantitas' => 'required|numeric|min:1'
        ]);

        // Cek jika produk sudah ada di keranjang user
        $cart = Cart::where('user_id', $request->user()->id)
                    ->where('product_id', $request->product_id)
                    ->first();

        if ($cart) {
            $cart->kuantitas += $request->kuantitas;
            $cart->save();
        } else {
            $cart = Cart::create([
                'user_id' => $request->user()->id,
                'product_id' => $request->product_id,
                'kuantitas' => $request->kuantitas
            ]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Produk berhasil ditambahkan ke keranjang',
            'data' => $cart->load('product')
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $cart = Cart::findOrFail($id);

        if ($cart->user_id !== $request->user()->id) {
             return response()->json(['success' => false, 'message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'kuantitas' => 'required|numeric|min:1'
        ]);

        $cart->kuantitas = $request->kuantitas;
        $cart->save();

        return response()->json([
            'success' => true,
            'data' => $cart
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, string $id)
    {
        $cart = Cart::findOrFail($id);

        if ($cart->user_id !== $request->user()->id) {
             return response()->json(['success' => false, 'message' => 'Unauthorized'], 403);
        }

        $cart->delete();

        return response()->json([
            'success' => true,
            'message' => 'Produk dihapus dari keranjang'
        ]);
    }
}
