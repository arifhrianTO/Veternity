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
use App\Http\Controllers\Api\ShippingController;
use App\Http\Controllers\Api\BapanasPriceController;
use App\Http\Controllers\Api\LogistikController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\CommodityController;
use App\Http\Controllers\Api\CartController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\HomeController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// ... API Routes untuk produk (public)
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/featured', [ProductController::class, 'featured']);
Route::get('/products/{product}', [ProductController::class, 'show']);

Route::get('/bapanas/commodities', [BapanasPriceController::class, 'commodities']);
Route::get('/bapanas/latest-price', [BapanasPriceController::class, 'latestPrice']);

// Kategori & komoditas (publik, untuk dropdown)
Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/categories/{category}/commodities', [CommodityController::class, 'byCategory']);

// Data halaman utama (publik)
Route::get('/home/stats', [HomeController::class, 'stats']);
Route::get('/home/koperasi', [HomeController::class, 'koperasi']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    Route::put('/user', [UserController::class, 'update']);
    Route::get('/koperasi-list', [UserController::class, 'getKoperasiList']);
    Route::post('/user/change-password', [UserController::class, 'changePassword']);

    // Notifikasi (semua role yang login)
    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::put('/notifications/{id}/read', [NotificationController::class, 'markAsRead']);
    Route::put('/notifications/read-all', [NotificationController::class, 'markAllRead']);

    // Dashboard khusus Admin (kelola logistik/kurir, kategori & komoditas)
    Route::middleware('role:admin')->group(function () {
        Route::get('/dashboard/admin', [DashboardController::class, 'admin']);
        Route::get('/logistik', [LogistikController::class, 'index']);
        Route::post('/logistik', [LogistikController::class, 'store']);
        Route::put('/logistik/{id}', [LogistikController::class, 'update']);
        Route::delete('/logistik/{id}', [LogistikController::class, 'destroy']);
        Route::post('/logistik/check-area', [LogistikController::class, 'checkArea']);

        Route::get('/admin/categories', [CategoryController::class, 'adminIndex']);
        Route::post('/admin/categories', [CategoryController::class, 'store']);
        Route::put('/admin/categories/{id}', [CategoryController::class, 'update']);
        Route::delete('/admin/categories/{id}', [CategoryController::class, 'destroy']);

        Route::post('/admin/commodities', [CommodityController::class, 'store']);
        Route::put('/admin/commodities/{id}', [CommodityController::class, 'update']);
        Route::delete('/admin/commodities/{id}', [CommodityController::class, 'destroy']);

        // Kelola pengguna (admin)
        Route::get('/admin/users', [UserController::class, 'adminIndex']);
        Route::post('/admin/users', [UserController::class, 'adminStore']);
        Route::put('/admin/users/{id}', [UserController::class, 'adminUpdate']);
        Route::delete('/admin/users/{id}', [UserController::class, 'adminDestroy']);

        // Monitoring admin (semua produk & order)
        Route::get('/admin/products', [ProductController::class, 'adminIndex']);
        Route::get('/admin/orders', [OrderController::class, 'adminIndex']);
    });

    // Cart Routes (pembeli)
    Route::middleware('role:pembeli')->group(function () {
        Route::apiResource('carts', CartController::class);
    });

    // Dashboard Petani & Petani Binaan
    Route::middleware('role:petani,petani_binaan')->group(function () {
        Route::get('/dashboard/petani', [DashboardController::class, 'petani']);
    });

    // Dashboard Nelayan & Nelayan Binaan
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

    // Routes khusus Koperasi (kelola binaan & produk/order agregasi)
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

    // Routes shared: Orders, Offers (controller handle role filtering internally)
    Route::middleware('role:petani,petani_binaan,nelayan,nelayan_binaan,koperasi,pembeli')->group(function () {
        Route::get('/my-offers', [OfferController::class, 'myOffers']);
        Route::apiResource('orders', OrderController::class);
        Route::apiResource('offers', OfferController::class);
    });
});

// RajaOngkir Shipping Routes (Public - Tidak memerlukan token Sanctum)
Route::get('/shipping/provinces', [ShippingController::class, 'getProvinces']);
Route::get('/shipping/cities/{province_id}', [ShippingController::class, 'getCities']);
Route::post('/shipping/cost', [ShippingController::class, 'checkCost']);
Route::post('/shipping/track', [ShippingController::class, 'trackWaybill']);
Route::get('/shipping/couriers', [ShippingController::class, 'getActiveCouriers']);

// Midtrans Notification Webhook (Public)
Route::post('/payment/notification', [OrderController::class, 'paymentNotification']);
