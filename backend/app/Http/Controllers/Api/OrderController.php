<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\Cart;
use App\Models\Shipment;
use App\Traits\KoperasiScope;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use Midtrans\Config;
use Midtrans\Snap;
use Midtrans\Notification;

class OrderController extends Controller
{
    use KoperasiScope;

    public function __construct()
    {
        Config::$serverKey = config('services.midtrans.server_key');
        Config::$isProduction = config('services.midtrans.is_production');
        Config::$isSanitized = config('services.midtrans.is_sanitized');
        Config::$is3ds = config('services.midtrans.is_3ds');
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
                $product = Product::findOrFail($item['product_id']);
                $petaniId = $product->user_id; // Pemilik barang
                
                if (!isset($groupedProducts[$petaniId])) {
                    $groupedProducts[$petaniId] = [
                        'items' => [],
                        'total_harga' => 0
                    ];
                }
                
                $groupedProducts[$petaniId]['items'][] = [
                    'product_id' => $product->id,
                    'nama_produk' => $product->nama_produk,
                    'jumlah_beli' => $item['kuantitas'],
                    'harga_satuan' => $item['harga']
                ];
                
                $groupedProducts[$petaniId]['total_harga'] += ($item['kuantitas'] * $item['harga']);
            }

            $createdOrders = []; // Simpan referensi order yang dibuat untuk Midtrans

            // Buat order untuk masing-masing penjual
            foreach ($groupedProducts as $petaniId => $group) {
                
                // Ambil ongkos kirim untuk toko (petani) ini dari request jika dikirim terpisah
                // (Sementara untuk penyederhanaan, jika ada ongkir kita asumsikan disimpan per order)
                
                $order = Order::create([
                    'kode_pesanan' => 'TRX-' . strtoupper(Str::random(6)),
                    'pembeli_id' => $user->id,
                    'petani_id' => $petaniId,
                    'total_harga' => $group['total_harga'], // Harga barang saja (tambahkan logic ongkir jika diperlukan detail)
                    'status' => 'Diproses',
                    'tanggal_pesanan' => now(),
                    'alamat_pengiriman' => $request->fullAddress,
                    'kota_id' => $request->kota_id,
                    'provinsi_id' => $request->provinsi_id,
                    'payment_type' => $request->paymentMethod,
                ]);

                foreach ($group['items'] as $item) {
                    OrderItem::create([
                        'order_id' => $order->id,
                        'product_id' => $item['product_id'],
                        'nama_produk' => $item['nama_produk'],
                        'jumlah_beli' => $item['jumlah_beli'],
                        'harga_satuan' => $item['harga_satuan'],
                    ]);
                }
                
                $createdOrders[] = $order;
            }

            // Hapus dari keranjang (Carts)
            foreach ($request->products as $item) {
                if(isset($item['cart_id'])) {
                    Cart::where('id', $item['cart_id'])->where('user_id', $user->id)->delete();
                }
            }

            // --- PROSES MIDTRANS ---
            // Kita gabungkan ID pesanan sebagai order_id untuk midtrans 
            // Jika ada banyak pesanan, kita gabungkan kodenya jadi satu string panjang (TRX1-TRX2) 
            // Namun sebaiknya kita buat 1 master transaction, atau dalam kasus ini karena mockup, 
            // kita ambil kode_pesanan yang pertama saja sebagai referensi transaksi utama untuk Midtrans.
            $primaryOrder = $createdOrders[0]; 
            
            // Hitung total seluruh belanjaan dari semua order
            $grossAmount = collect($createdOrders)->sum('total_harga') + $request->ongkos_kirim; 

            // Tentukan Enabled Payments berdasarkan pilihan frontend
            $enabledPayments = [];
            if ($request->paymentMethod === 'qris') {
                $enabledPayments = ['qris', 'gopay', 'shopeepay'];
            } elseif ($request->paymentMethod === 'Transfer Bank') {
                $enabledPayments = ['bca_va', 'bni_va', 'bri_va', 'mandiri_va', 'permata_va'];
            }

            // Item Details untuk Midtrans
            $itemDetails = [];
            foreach ($request->products as $item) {
                $itemDetails[] = [
                    'id' => $item['product_id'],
                    'price' => $item['harga'],
                    'quantity' => $item['kuantitas'],
                    'name' => Product::find($item['product_id'])->nama_produk ?? 'Produk',
                ];
            }
            if ($request->ongkos_kirim > 0) {
                 $itemDetails[] = [
                    'id' => 'ongkir',
                    'price' => $request->ongkos_kirim,
                    'quantity' => 1,
                    'name' => 'Ongkos Kirim',
                ];
            }

            $params = [
                'transaction_details' => [
                    'order_id' => $primaryOrder->kode_pesanan . '-' . time(), // Tambah timestamp agar unik per request
                    'gross_amount' => $grossAmount,
                ],
                'customer_details' => [
                    'first_name' => $user->nama_lengkap ?? $user->name,
                    'email' => $user->email,
                    'phone' => '081234567890', // Harusnya ambil dari profile
                ],
                'item_details' => $itemDetails,
            ];

            if (!empty($enabledPayments)) {
                $params['enabled_payments'] = $enabledPayments;
            }

            $snapToken = Snap::getSnapToken($params);

            // Simpan token ke database untuk referensi (opsional, update semua orders terkait)
            foreach ($createdOrders as $o) {
                $o->update(['payment_token' => $snapToken]);
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Pesanan berhasil dibuat',
                'snap_token' => $snapToken
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan saat memproses pesanan: ' . $e->getMessage()
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

        $order->status = $validated['status'];
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
            'order' => $order->load(['shipment'])
        ]);
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
        $notif = new Notification();
        
        $transactionStatus = $notif->transaction_status;
        $orderId = $notif->order_id;
        $fraudStatus = $notif->fraud_status;

        // Ekstrak kode_pesanan asli (hilangkan timestamp setelah strip "-")
        // Contoh: TRX-ABCDEF-172233213 -> TRX-ABCDEF
        $parts = explode('-', $orderId);
        if (count($parts) >= 3) {
             $originalKodePesanan = $parts[0] . '-' . $parts[1];
        } else {
             $originalKodePesanan = $orderId;
        }

        // Cari semua order yang terkait (karena 1 checkout bisa jadi beberapa order/petani)
        // Kita menggunakan primaryOrder sebagai referensi, artinya mereka punya payment_token yang sama
        $primaryOrder = Order::where('kode_pesanan', $originalKodePesanan)->first();
        
        if (!$primaryOrder) {
             return response()->json(['message' => 'Order not found'], 404);
        }

        $ordersToUpdate = Order::where('payment_token', $primaryOrder->payment_token)->get();

        $status = 'Menunggu Pembayaran';

        if ($transactionStatus == 'capture'){
            if ($fraudStatus == 'challenge'){
                $status = 'Menunggu Pembayaran';
            } else if ($fraudStatus == 'accept'){
                $status = 'Diproses';
            }
        } else if ($transactionStatus == 'settlement'){
            $status = 'Diproses';
        } else if ($transactionStatus == 'cancel' ||
          $transactionStatus == 'deny' ||
          $transactionStatus == 'expire'){
            $status = 'Dibatalkan';
        } else if ($transactionStatus == 'pending'){
            $status = 'Menunggu Pembayaran';
        }

        foreach ($ordersToUpdate as $order) {
            $order->status = $status;
            $order->save();
        }

        return response()->json(['message' => 'Notification handled']);
    }
}
