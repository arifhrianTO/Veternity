import MitraStatusBadge from "./MitraStatusBadge";

export default function MitraOrders({ orders = [] }) {
  return (
    <div className="bg-white/50 border border-[#029154] shadow-[0_0_4px_rgba(0,0,0,0.25)] rounded-[20px] p-6 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-[#005941]">Pesanan Terbaru</h3>
          <button className="text-sm text-[#006638] font-semibold hover:underline">Lihat semua+</button>
        </div>

        <div className="space-y-3">
          <div className="hidden md:grid grid-cols-4 gap-4 text-[#273B4A] font-bold text-sm mb-2 px-2">
            <div>No pesanan</div>
            <div>Produk</div>
            <div>Jumlah</div>
            <div className="text-right">Status</div>
          </div>

          {orders.map((o) => (
            <div key={o.id} className="grid grid-cols-4 gap-4 items-center p-3 rounded-xl bg-white border border-slate-100 shadow-sm text-sm">
              <div className="font-bold text-[#273B4A]">{o.id}</div>
              <div className="flex items-center gap-3">
                <img src={`/images/${(o.product||'beras').toLowerCase().split(' ')[0]}.png`} alt="prod" className="w-10 h-8 object-cover rounded" />
                <div className="font-medium text-[#273B4A]">{o.product}</div>
              </div>
              <div className="font-medium text-[#273B4A]">{o.quantity}</div>
              <div className="flex justify-end">
                <MitraStatusBadge variant={o.statusVariant || 'emerald'}>{o.status}</MitraStatusBadge>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <button className="w-full rounded-[10px] border border-[#006638] bg-white text-[#006638] py-2.5 font-semibold hover:bg-[#006638] hover:text-white transition">
          Lihat semua Pesanan
        </button>
      </div>
    </div>
  );
}