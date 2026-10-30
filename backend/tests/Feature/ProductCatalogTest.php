<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProductCatalogTest extends TestCase
{
    use RefreshDatabase;

    private function makeProduct(User $seller, array $overrides = []): Product
    {
        return Product::create(array_merge([
            'user_id' => $seller->id,
            'nama_produk' => 'Produk Uji',
            'stok' => 10,
            'satuan' => 'Kg',
            'harga_harapan' => 10000,
            'tanggal_panen' => now()->toDateString(),
            'masa_layak' => 30,
            'status' => 'Aktif',
        ], $overrides));
    }

    public function test_public_catalog_excludes_inactive_products(): void
    {
        $seller = User::factory()->create(['role' => 'petani']);
        $this->makeProduct($seller, ['status' => 'Aktif']);
        $this->makeProduct($seller, ['status' => 'Habis']);

        $this->getJson('/api/products')
            ->assertOk()
            ->assertJsonCount(1);
    }

    public function test_public_catalog_supports_pagination(): void
    {
        $seller = User::factory()->create(['role' => 'petani']);
        foreach (range(1, 5) as $i) {
            $this->makeProduct($seller, ['nama_produk' => "Produk {$i}"]);
        }

        $response = $this->getJson('/api/products?paginate=1&per_page=2');

        $response->assertOk()
            ->assertJsonPath('per_page', 2)
            ->assertJsonPath('total', 5)
            ->assertJsonCount(2, 'data');
    }

    public function test_public_catalog_filters_by_category(): void
    {
        $seller = User::factory()->create(['role' => 'petani']);
        $catA = Category::create(['nama_kategori' => 'Sayur Uji', 'tipe' => 'pertanian']);
        $catB = Category::create(['nama_kategori' => 'Buah Uji', 'tipe' => 'pertanian']);

        $this->makeProduct($seller, ['category_id' => $catA->id]);
        $this->makeProduct($seller, ['category_id' => $catB->id]);

        $this->getJson("/api/products?category_id={$catA->id}")
            ->assertOk()
            ->assertJsonCount(1);
    }
}
