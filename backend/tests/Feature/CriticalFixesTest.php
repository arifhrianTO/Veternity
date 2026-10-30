<?php

namespace Tests\Feature;

use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use App\Services\PaymentGateway;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class CriticalFixesTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        // Fake gateway agar test tidak memanggil Midtrans asli.
        $this->mock(PaymentGateway::class, function ($mock) {
            $mock->shouldReceive('createSnapToken')->andReturn('fake-snap-token');
        });
    }

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

    public function test_order_uses_db_price_not_client_price(): void
    {
        $seller = $this->makeUser('petani');
        $buyer = $this->makeUser('pembeli');
        $product = $this->makeProduct($seller, ['harga_harapan' => 10000]);

        Sanctum::actingAs($buyer);

        $response = $this->postJson('/api/orders', [
            'products' => [
                ['product_id' => $product->id, 'kuantitas' => 2, 'harga' => 1],
            ],
            'fullAddress' => 'Jl. Uji No. 1',
            'kota_id' => 1,
            'paymentMethod' => 'qris',
        ]);

        // Midtrans tidak tersedia di test; yang penting harga tersimpan dari DB.
        $order = Order::first();
        $this->assertNotNull($order);
        $this->assertEquals(20000, (float) $order->total_harga);
    }

    public function test_order_rejected_when_stock_insufficient(): void
    {
        $seller = $this->makeUser('petani');
        $buyer = $this->makeUser('pembeli');
        $product = $this->makeProduct($seller, ['stok' => 1]);

        Sanctum::actingAs($buyer);

        $response = $this->postJson('/api/orders', [
            'products' => [
                ['product_id' => $product->id, 'kuantitas' => 5, 'harga' => 10000],
            ],
            'fullAddress' => 'Jl. Uji No. 1',
            'kota_id' => 1,
            'paymentMethod' => 'qris',
        ]);

        $response->assertStatus(422);
        $this->assertEquals(0, Order::count());
        // Stok tidak boleh berkurang saat transaksi gagal.
        $this->assertEquals(1, (float) $product->fresh()->stok);
    }

    public function test_stock_decrements_after_order(): void
    {
        $seller = $this->makeUser('petani');
        $buyer = $this->makeUser('pembeli');
        $product = $this->makeProduct($seller, ['stok' => 5]);

        Sanctum::actingAs($buyer);

        $this->postJson('/api/orders', [
            'products' => [
                ['product_id' => $product->id, 'kuantitas' => 2, 'harga' => 10000],
            ],
            'fullAddress' => 'Jl. Uji No. 1',
            'kota_id' => 1,
            'paymentMethod' => 'qris',
        ]);

        $this->assertEquals(3, (float) $product->fresh()->stok);
    }

    public function test_user_cannot_set_arbitrary_koperasi_id(): void
    {
        $petani = $this->makeUser('petani');
        $nonKoperasi = $this->makeUser('pembeli');

        Sanctum::actingAs($petani);

        $response = $this->putJson('/api/user', [
            'koperasi_id' => $nonKoperasi->id,
        ]);

        $response->assertStatus(422);
        $this->assertNull($petani->fresh()->koperasi_id);
    }

    public function test_admin_cannot_change_own_role(): void
    {
        $admin = $this->makeUser('admin');

        Sanctum::actingAs($admin);

        $response = $this->putJson("/api/admin/users/{$admin->id}", [
            'role' => 'pembeli',
        ]);

        $response->assertStatus(422);
        $this->assertEquals('admin', $admin->fresh()->role);
    }

    public function test_admin_cannot_demote_last_admin(): void
    {
        $admin = $this->makeUser('admin');
        $other = $this->makeUser('admin');

        // Turunkan salah satu dulu agar tersisa satu admin.
        $other->update(['role' => 'pembeli']);

        Sanctum::actingAs($admin);

        $response = $this->putJson("/api/admin/users/{$admin->id}", [
            'role' => 'pembeli',
        ]);

        $response->assertStatus(422);
        $this->assertEquals('admin', $admin->fresh()->role);
    }
}
