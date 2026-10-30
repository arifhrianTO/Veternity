<?php

namespace Tests\Feature;

use App\Models\Offer;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class BusinessRulesTest extends TestCase
{
    use RefreshDatabase;

    private function makeUser(string $role = 'pembeli'): User
    {
        return User::factory()->create(['role' => $role]);
    }

    private function makeProduct(User $seller, array $overrides = []): Product
    {
        return Product::create(array_merge([
            'user_id' => $seller->id,
            'nama_produk' => 'Beras Uji',
            'stok' => 10,
            'satuan' => 'Kg',
            'harga_harapan' => 10000,
            'tanggal_panen' => now()->toDateString(),
            'masa_layak' => 30,
            'status' => 'Aktif',
        ], $overrides));
    }

    private function makeOrder(User $buyer, User $seller): Order
    {
        return Order::create([
            'kode_pesanan' => 'TRX-TEST01',
            'pembeli_id' => $buyer->id,
            'petani_id' => $seller->id,
            'total_harga' => 10000,
            'status' => 'Menunggu Pembayaran',
            'tanggal_pesanan' => now(),
        ]);
    }

    public function test_buyer_cannot_move_order_to_shipped(): void
    {
        $seller = $this->makeUser('petani');
        $buyer = $this->makeUser('pembeli');
        $order = $this->makeOrder($buyer, $seller);

        Sanctum::actingAs($buyer);

        $this->putJson("/api/orders/{$order->id}", ['status' => 'Dikirim'])
            ->assertStatus(422);

        $this->assertEquals('Menunggu Pembayaran', $order->fresh()->status);
    }

    public function test_seller_can_progress_order_status(): void
    {
        $seller = $this->makeUser('petani');
        $buyer = $this->makeUser('pembeli');
        $order = $this->makeOrder($buyer, $seller);

        Sanctum::actingAs($seller);

        $this->putJson("/api/orders/{$order->id}", ['status' => 'Diproses'])
            ->assertOk();

        $this->assertEquals('Diproses', $order->fresh()->status);
    }

    public function test_product_destroy_is_soft_delete(): void
    {
        $seller = $this->makeUser('petani');
        $product = $this->makeProduct($seller);

        Sanctum::actingAs($seller);

        $this->deleteJson("/api/products/{$product->id}")->assertOk();

        $this->assertSoftDeleted('products', ['id' => $product->id]);
    }

    public function test_accepting_offer_rejects_other_pending_offers(): void
    {
        $seller = $this->makeUser('petani');
        $buyerA = $this->makeUser('pembeli');
        $buyerB = $this->makeUser('pembeli');
        $product = $this->makeProduct($seller, ['stok' => 10]);

        $offerA = Offer::create([
            'kode_penawaran' => 'PNW-A',
            'product_id' => $product->id,
            'pembeli_id' => $buyerA->id,
            'petani_id' => $seller->id,
            'jumlah_diminta' => 2,
            'harga_tawaran' => 9000,
            'status' => 'Menunggu',
        ]);

        $offerB = Offer::create([
            'kode_penawaran' => 'PNW-B',
            'product_id' => $product->id,
            'pembeli_id' => $buyerB->id,
            'petani_id' => $seller->id,
            'jumlah_diminta' => 2,
            'harga_tawaran' => 8500,
            'status' => 'Menunggu',
        ]);

        Sanctum::actingAs($seller);

        $this->putJson("/api/offers/{$offerA->id}", [
            'status' => 'Diterima',
            'aksi_label' => 'Diterima penjual',
        ])->assertOk();

        $this->assertEquals('Diterima', $offerA->fresh()->status);
        $this->assertEquals('Ditolak', $offerB->fresh()->status);
    }
}
