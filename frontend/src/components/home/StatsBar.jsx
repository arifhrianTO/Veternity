import { stats } from "../../data/mockData";

export default function StatsBar() {
  return (
    <section className="relative z-20 max-w-7xl mx-auto px-6 -mt-10 mb-16">
      <div className="rounded-2xl border border-slate-100 shadow-sm bg-white px-6 py-6 flex flex-wrap justify-between gap-6">
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} className="flex items-center gap-3">
              <div className={`w-11 h-11 rounded-full flex items-center justify-center ${s.iconBg}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <div className={`text-xl font-extrabold ${s.valueColor || "text-emerald-700"}`}>{s.value}</div>
                <div className="text-xs text-slate-400 whitespace-nowrap">{s.label}</div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
