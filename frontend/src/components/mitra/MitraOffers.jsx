import MitraStatusBadge from "./MitraStatusBadge";

export default function MitraOffers({ offers = [] }) {
  return (
    <div className="bg-white/50 border border-[#029154] shadow-[0_0_4px_rgba(0,0,0,0.25)] rounded-[20px] p-6 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-[#005941]">Penawaran Terbaru</h3>
          <button className="text-sm text-[#006638] font-semibold hover:underline">Lihat semua+</button>
        </div>

        <div className="space-y-3">
          {offers.map((o) => (
            <div key={o.id} className="flex items-center gap-4 p-3 rounded-xl bg-white border border-slate-100 shadow-sm">
              <img src={`/images/${(o.product||'beras').toLowerCase().split(' ')[0]}.png`} alt="prod" className="w-16 h-12 object-cover rounded-lg" />
              <div className="flex-1">
                <div className="font-bold text-[#273B4A]">{o.buyer}</div>
                <div className="text-sm text-slate-500">{o.product} • {o.quantity}</div>
              </div>
              <div className="text-right">
                <div className="text-xs text-slate-400">{o.date}</div>
                <div className="mt-0.5 font-bold text-[#273B4A]">{o.offerPrice || o.price}</div>
              </div>
              <div className="pl-2">
                <MitraStatusBadge variant={o.statusVariant || 'emerald'}>{o.status}</MitraStatusBadge>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <button className="w-full rounded-[10px] border border-[#006638] bg-white text-[#006638] py-2.5 font-semibold hover:bg-[#006638] hover:text-white transition">
          Lihat semua Penawaran
        </button>
      </div>
    </div>
  );
}