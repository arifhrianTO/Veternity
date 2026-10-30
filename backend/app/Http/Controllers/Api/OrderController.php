<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\Shipment;
use App\Services\PaymentGateway;
use App\Traits\KoperasiScope;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Midtrans\Notification;

class OrderController extends Controller
{
    use KoperasiScope;

    public function __construct(private PaymentGateway $paymentGateway) {}

    /**
     * Listing order untuk halaman monitoring admin (semua order, semua role).
     */
    public function adminIndex(Request $request)
    {
        $query = Order::with(['items', 'pembeli', 'penjual', 'shipment']);

        if ($search = $request->input('search')) {
            $query->where('kode_pesanan', 'like', "%{$search}%");
        }

        if ($status = $request->input('status')) {
            $query->where('status', $status);
        }

        $orders = $query->orderBy('created_at', 'desc')
            ->paginate($request->input('per_page', 5));

        return response()->json($orders);
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $user = $request->user();

        // Jika yang request adalah Pembeli, tampilkan pesanan yang dia buat
        if ($user->role === 'pembeli') {
            $orders = Order::with(['items.product', 'shipment'])
                ->where('pembeli_id', $user->id)
                ->orderBy('created_at', 'desc')
                ->get();
        }
        // Jika Koperasi, tampilkan pesanan untuk dirinya + anggota binaannya
        elseif ($user->role === 'koperasi') {
            $orders = Order::with(['items', 'pembeli', 'shipment'])
                ->whereIn('petani_id', $this->sellerIds($user))
                ->orderBy('created_at', 'desc')
                ->get();
        }
        // Jika Petani/Nelayan, tampilkan pesanan yang ditujukan ke mereka
        else {
            $orders = Order::with(['items', 'pembeli', 'shipment'])
                ->where('petani_id', $user->id)
                ->orderBy('created_at', 'desc')
                ->get();
        }

        return response()->json($orders);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $user = $request->user();

        $request->validate([
            'products' => 'required|array',
            'fullAddress' => 'required|string',
            'kota_id' => 'required|numeric',
            'paymentMethod' => 'required|string', // Pastikan menerima jenis payment dari frontend
        ]);

        DB::beginTransaction();

        try {
            // Karena satu checkout bisa terdiri dari barang-barang milik beberapa Petani (Penjual),
            // kita harus mengelompokkan pesanan ini per Petani/Penjual (petani_id)
            $groupedProducts = [];

            foreach ($request->products as $item) {
                // Harga & stok WAJIB dari database, bukan dari client (anti-fraud).
                $product = Product::lockForUpdate()->findOrFail($item['product_id']);

                $qty = (float) $item['kuantitas'];
                if ($qty <= 0) {
                    throw ValidationException::withMessages([
                        'products' => 'Jumlah beli tidak valid.',
                    ]);
                }
                if ((float) $product->stok < $qty) {
                    throw ValidationException::withMessages([
                        'products' => "Stok produk '{$product->nama_produk}' tidak mencukupi.",
                    ]);
                }

                // Harga dari kesepakatan (cart) bila ada, selain itu harga harapan milik produk.
                $hargaSatuan = (float) $product->harga_harapan;
                if (! empty($item['cart_id'])) {
                    $cart = Cart::where('id', $item['cart_id'])
                        ->where('user_id', $user->id)
                        ->first();
                    if ($cart && $cart->harga !== null) {
                        $hargaSatuan = (float) $cart->harga;
                    }
                }

                // Kurangi stok & tandai Habis bila sudah nol.
                $product->stok = (float) $product->stok - $qty;
                if ($product->stok <= 0) {
                    $product->stok = 0;
                    $product->status = 'Habis';
                }
                $product->save();

                $petaniId = $product->user_id; // Pemilik barang

                if (! isset($groupedProducts[$petaniId])) {
                    $groupedProducts[$petaniId] = [
                        'items' => [],
                        'total_harga' => 0,
                    ];
                }

                $groupedProducts[$petaniId]['items'][] = [
                    'product_id' => $product->id,
                    'nama_produk' => $product->nama_produk,
                    'jumlah_beli' => $qty,
                    'harga_satuan' => $hargaSatuan,
                ];

                $groupedProducts[$petaniId]['total_harga'] += ($qty * $hargaSatuan);
            }

            $createdOrders = []; // Simpan referensi order yang dibuat untuk Midtrans

            // Buat order untuk masing-masing penjual
            foreach ($groupedProducts as $petaniId => $group) {

                // Ambil detail pengiriman untuk toko (petani) ini dari request (keyed by petani_id)
                $shipping = $request->shippingDetails[$petaniId] ?? null;

                $order = Order::create([
                    'kode_pesanan' => 'TRX-'.strtoupper(Str::random(6)),
                    'pembeli_id' => $user->id,
                    'petani_id' => $petaniId,
                    'total_harga' => $group['total_harga'], // Harga barang saja
                    'status' => 'Menunggu Pembayaran',
                    'tanggal_pesanan' => now(),
                    'alamat_pengiriman' => $request->fullAddress,
                    'kota_id' => $request->kota_id,
                    'provinsi_id' => $request->provinsi_id,
                    'total_berat_gram' => $request->total_berat_gram ?? 0,
                    'ongkos_kirim' => $shipping['ongkos'] ?? 0,
                    'payment_type' => $request->paymentMethod,
                ]);

                // Simpan pilihan kurir & layanan yang dipilih pembeli
                if (! empty($shipping['kurir']) || ! empty($shipping['layanan'])) {
                    Shipment::create([
                        'order_id' => $order->id,
                        'kurir' => $shipping['kurir'] ?? null,
                        'layanan' => $shipping['layanan'] ?? null,
                        'status_pengiriman' => 'menunggu_penjemputan',
                    ]);
                }

                foreach ($group['items'] as $item) {
                    OrderItem::create([
                        'order_id' => $order->id,
                        'product_id' => $item['product_id'],
                        'nama_produk' => $item['nama_produk'],
                        'jumlah_beli' => $item['jumlah_beli'],
                        'harga_satuan' => $item['harga_satuan'],
                        'subtotal' => $item['jumlah_beli'] * $item['harga_satuan'],
                    ]);
                }

                $createdOrders[] = $order;
            }

            // Hapus dari keranjang (Carts)
            foreach ($request->products as $item) {
                if (isset($item['cart_id'])) {
                    Cart::where('id', $item['cart_id'])->where('user_id', $user->id)->delete();
                }
            }

            // --- PROSES MIDTRANS ---
            // Kita gabungkan ID pesanan sebagai order_id untuk midtrans
            // Jika ada banyak pesanan, kita gabungkan kodenya jadi satu string panjang (TRX1-TRX2)
            // Namun sebaiknya kita buat 1 master transaction, atau dalam kasus ini karena mockup,
            // kita ambil kode_pesanan yang pertama saja sebagai referensi transaksi utama untuk Midtrans.
            $primaryOrder = $createdOrders[0];

            // Hitung total seluruh belanjaan dari semua order.
            // Tiap order sudah menyimpan ongkos_kirim-nya sendiri, jadi cukup jumlahkan keduanya.
            $grossAmount = collect($createdOrders)->sum('total_harga')
                + collect($createdOrders)->sum('ongkos_kirim');

            // Tentukan Enabled Payments berdasarkan pilihan frontend
            $enabledPayments = match ($request->paymentMethod) {
                'Transfer Bank' => ['bca_va', 'bni_va', 'bri_va', 'mandiri_va', 'permata_va'],
                'qris' => ['qris', 'gopay', 'shopeepay'],
                'ewallet' => ['gopay', 'shopeepay'],
                'retail' => ['indomaret', 'alfamart'],
                default => [],
            };

            // Item Details untuk Midtrans (harga dari DB, bukan dari client)
            $itemDetails = [];
            foreach ($groupedProducts as $group) {
                foreach ($group['items'] as $item) {
                    $itemDetails[] = [
                        'id' => $item['product_id'],
                        'price' => (int) round($item['harga_satuan']),
                        'quantity' => (int) round($item['jumlah_beli']),
                        'name' => $item['nama_produk'],
                    ];
                }
            }
            // Ongkir per penjual, ditambahkan sebagai item terpisah
            foreach ($createdOrders as $order) {
                if ($order->ongkos_kirim > 0) {
                    $itemDetails[] = [
                        'id' => 'ongkir-'.$order->id,
                        'price' => (int) round($order->ongkos_kirim),
                        'quantity' => 1,
                        'name' => 'Ongkos Kirim',
                    ];
                }
            }

            $params = [
                'transaction_details' => [
                    'order_id' => $primaryOrder->kode_pesanan.'-'.time(), // Tambah timestamp agar unik per request
                    'gross_amount' => $grossAmount,
                ],
                'customer_details' => [
                    'first_name' => $user->nama_lengkap ?? $user->name,
                    'email' => $user->email,
                    'phone' => $user->no_hp ?? '081234567890',
                ],
                'item_details' => $itemDetails,
            ];

            if (! empty($enabledPayments)) {
                $params['enabled_payments'] = $enabledPayments;
            }

            $snapToken = $this->paymentGateway->createSnapToken($params);

            // Simpan token ke database untuk referensi (opsional, update semua orders terkait)
            foreach ($createdOrders as $o) {
                $o->update(['payment_token' => $snapToken]);
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Pesanan berhasil dibuat',
                'snap_token' => $snapToken,
                'order_ids' => collect($createdOrders)->pluck('id')->all(),
            ], 201);

        } catch (ValidationException $e) {
            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => 'Validasi pesanan gagal.',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan saat memproses pesanan: '.$e->getMessage(),
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $order = Order::with(['items.product', 'pembeli', 'petani', 'shipment'])->findOrFail($id);
        $user = request()->user();

        // Pastikan hanya pihak terkait (Penjual / Pembeli / Koperasi binaan) yang bisa lihat
        $isKoperasiManager = $user->role === 'koperasi' && in_array($order->petani_id, $this->binaanIds($user));
        if ($order->petani_id !== $user->id && $order->pembeli_id !== $user->id && ! $isKoperasiManager) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return response()->json($order);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $order = Order::findOrFail($id);
        $user = $request->user();

        // Otoritas: penjual (petani/nelayan), pembeli, atau koperasi (untuk order binaan)
        $isSeller = $order->petani_id === $user->id;
        $isBuyer = $order->pembeli_id === $user->id;
        $isKoperasiManager = $user->role === 'koperasi' && in_array($order->petani_id, $this->binaanIds($user));

        if (! $isSeller && ! $isBuyer && ! $isKoperasiManager) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'status' => 'required|string|in:Menunggu Pembayaran,Diproses,Dikirim,Selesai,Dibatalkan',
            'waybill' => 'nullable|string',
            'kurir' => 'nullable|string',
            'layanan' => 'nullable|string',
        ]);

        $from = $order->status;
        $to = $validated['status'];

        // Validasi transisi status sesuai role (state machine).
        $error = $this->authorizeStatusChange($isSeller || $isKoperasiManager, $isBuyer, $from, $to);
        if ($error !== null) {
            return response()->json(['message' => $error], 422);
        }

        $order->status = $to;
        $order->save();

        // Simpan nomor resi & logistik ke tabel shipments (bukan kolom catatan)
        if ($request->filled('waybill') || $request->filled('kurir') || $request->filled('layanan')) {
            $shipment = $order->shipment ?? new Shipment(['order_id' => $order->id]);
            if ($request->filled('waybill')) {
                $shipment->nomor_resi = $request->waybill;
            }
            if ($request->filled('kurir')) {
                $shipment->kurir = $request->kurir;
            }
            if ($request->filled('layanan')) {
                $shipment->layanan = $request->layanan;
            }
            $shipment->save();
        }

        return response()->json([
            'message' => 'Status pesanan berhasil diperbarui',
            'order' => $order->load(['shipment']),
        ]);
    }

    /**
     * Validasi transisi status berdasarkan peran pelaku.
     *
     * Penjual/koperasi: Menunggu Pembayaran → Diproses → Dikirim → Selesai, serta pembatalan.
     * Pembeli: hanya boleh membatalkan (Dibatalkan).
     * Aturan tambahan: pembayaran hanya boleh "Diproses" setelah dibayar (dari webhook),
     * jadi pembeli tidak boleh memindahkan status ke Diproses/Dikirim/Selesai.
     *
     * @return string|null Pesan error bila transisi tidak diizinkan, null jika boleh.
     */
    private function authorizeStatusChange(bool $isSeller, bool $isBuyer, string $from, string $to): ?string
    {
        if ($from === $to) {
            return null;
        }

        $sellerTransitions = [
            'Menunggu Pembayaran' => ['Diproses', 'Dibatalkan'],
            'Diproses' => ['Dikirim', 'Dibatalkan'],
            'Dikirim' => ['Selesai', 'Dibatalkan'],
            'Selesai' => [],
            'Dibatalkan' => [],
        ];

        $buyerTransitions = [
            'Menunggu Pembayaran' => ['Dibatalkan'],
            'Diproses' => [],
            'Dikirim' => [],
            'Selesai' => [],
            'Dibatalkan' => [],
        ];

        if ($isSeller) {
            if (! in_array($to, $sellerTransitions[$from] ?? [], true)) {
                return "Penjual tidak dapat mengubah status dari {$from} ke {$to}.";
            }

            return null;
        }

        if ($isBuyer) {
            if (! in_array($to, $buyerTransitions[$from] ?? [], true)) {
                return 'Pembeli hanya dapat membatalkan pesanan yang belum diproses.';
            }

            return null;
        }

        return 'Anda tidak berhak mengubah status pesanan ini.';
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        // Pesanan biasanya tidak dihapus
    }

    /**
     * Handle Midtrans Payment Notification (Webhook)
     */
    public function paymentNotification(Request $request)
    {
        $notif = new Notification;

        $transactionStatus = $notif->transaction_status;
        $orderId = $notif->order_id;
        $fraudStatus = $notif->fraud_status;

        // Ekstrak kode_pesanan asli (hilangkan timestamp setelah strip "-")
        // Contoh: TRX-ABCDEF-172233213 -> TRX-ABCDEF
        $parts = explode('-', $orderId);
        if (count($parts) >= 3) {
            $originalKodePesanan = $parts[0].'-'.$parts[1];
        } else {
            $originalKodePesanan = $orderId;
        }

        // Cari semua order yang terkait (karena 1 checkout bisa jadi beberapa order/petani)
        // Kita menggunakan primaryOrder sebagai referensi, artinya mereka punya payment_token yang sama
        $primaryOrder = Order::where('kode_pesanan', $originalKodePesanan)->first();

        if (! $primaryOrder) {
            return response()->json(['message' => 'Order not found'], 404);
        }

        // Cari semua order yang terkait (karena 1 checkout bisa jadi beberapa order/petani).
        // Utamakan lewat payment_token yang sama; jika token kosong (belum sempat tersimpan),
        // fallback ke pencarian berdasarkan kode_pesanan agar tidak men-update order lain.
        $ordersToUpdate = collect();

        if (! empty($primaryOrder->payment_token)) {
            $ordersToUpdate = Order::where('payment_token', $primaryOrder->payment_token)->get();
        }

        if ($ordersToUpdate->isEmpty()) {
            $ordersToUpdate = collect([$primaryOrder]);
        }

        $status = 'Menunggu Pembayaran';

        if ($transactionStatus == 'capture') {
            if ($fraudStatus == 'challenge') {
                $status = 'Menunggu Pembayaran';
            } elseif ($fraudStatus == 'accept') {
                $status = 'Diproses';
            }
        } elseif ($transactionStatus == 'settlement') {
            $status = 'Diproses';
        } elseif ($transactionStatus == 'cancel' ||
          $transactionStatus == 'deny' ||
          $transactionStatus == 'expire') {
            $status = 'Dibatalkan';
        } elseif ($transactionStatus == 'pending') {
            $status = 'Menunggu Pembayaran';
        }

        foreach ($ordersToUpdate as $order) {
            $order->status = $status;
            $order->save();
        }

        return response()->json(['message' => 'Notification handled']);
    }
}
