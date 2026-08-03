<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\OfferController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\KoperasiController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\API\ShippingController;
use App\Http\Controllers\Api\BapanasPriceController;

use App\Http\Controllers\Api\CartController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// ... API Routes untuk produk (public)
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{product}', [ProductController::class, 'show']);

Route::get('/bapanas/commodities', [BapanasPriceController::class, 'commodities']);
Route::get('/bapanas/latest-price', [BapanasPriceController::class, 'latestPrice']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    Route::put('/user', [UserController::class, 'update']);
    Route::get('/koperasi-list', [UserController::class, 'getKoperasiList']);
    Route::post('/user/change-password', [UserController::class, 'changePassword']);

    // Cart Routes (pembeli)
    Route::middleware('role:pembeli')->group(function () {
        Route::apiResource('carts', CartController::class);
    });

    // Routes untuk Petani & Petani Binaan (dashboard)
    Route::middleware('role:petani,petani_binaan')->group(function () {
        Route::get('/dashboard/petani', [DashboardController::class, 'petani']);
    });

    // Routes untuk Nelayan & Nelayan Binaan (dashboard)
    Route::middleware('role:nelayan,nelayan_binaan')->group(function () {
        Route::get('/dashboard/nelayan', [DashboardController::class, 'nelayan']);
    });

    // CRUD product — semua penjual (petani, nelayan, koperasi)
    Route::middleware('role:petani,petani_binaan,nelayan,nelayan_binaan,koperasi')->group(function () {
        Route::get('/my-products', [ProductController::class, 'myProducts']);
        Route::post('/products', [ProductController::class, 'store']);
        Route::put('/products/{product}', [ProductController::class, 'update']);
        Route::delete('/products/{product}', [ProductController::class, 'destroy']);
    });

    // Routes shared: Orders, Offers (controller handle role filtering internally)
    Route::middleware('role:petani,petani_binaan,nelayan,nelayan_binaan,koperasi,pembeli')->group(function () {
        Route::get('/my-offers', [OfferController::class, 'myOffers']);
        Route::apiResource('orders', OrderController::class);
        Route::apiResource('offers', OfferController::class);
    });

    // Routes khusus Admin
    Route::middleware('role:admin')->group(function () {
        Route::get('/dashboard/admin', [DashboardController::class, 'admin']);
    });

    // Routes khusus Koperasi
    Route::middleware('role:koperasi')->group(function () {
        Route::get('/dashboard/koperasi', [DashboardController::class, 'koperasi']);
        Route::get('/koperasi/binaan', [KoperasiController::class, 'binaanIndex']);
        Route::post('/koperasi/binaan', [KoperasiController::class, 'binaanStore']);
        Route::get('/koperasi/binaan/{id}', [KoperasiController::class, 'binaanShow']);
        Route::put('/koperasi/binaan/{id}', [KoperasiController::class, 'binaanUpdate']);
        Route::delete('/koperasi/binaan/{id}', [KoperasiController::class, 'binaanDestroy']);
        Route::get('/koperasi/produk', [KoperasiController::class, 'produkIndex']);
        Route::get('/koperasi/orders', [KoperasiController::class, 'orderIndex']);
    });
});

// RajaOngkir Shipping Routes (Public - Tidak memerlukan token Sanctum)
Route::get('/shipping/provinces', [ShippingController::class, 'getProvinces']);
Route::get('/shipping/cities/{province_id}', [ShippingController::class, 'getCities']);
Route::post('/shipping/cost', [ShippingController::class, 'checkCost']);
Route::post('/shipping/track', [ShippingController::class, 'trackWaybill']);

// Midtrans Notification Webhook (Public)
Route::post('/payment/notification', [OrderController::class, 'paymentNotification']);

