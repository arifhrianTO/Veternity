
export default function TopCategoriesTable() {
  const categories = [
    { name: "Sayuran Segar", total: "1.240 Transaksi", percentage: "85%" },
    { name: "Ikan Laut", total: "980 Transaksi", percentage: "70%" },
    { name: "Buah-buahan", total: "750 Transaksi", percentage: "55%" },
    { name: "Daging & Ayam", total: "430 Transaksi", percentage: "35%" },
  ];

  return (
    <div className="space-y-4">
      {categories.map((cat, idx) => (
        <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-100">
          <div>
            <p className="font-semibold text-slate-800 text-sm">{cat.name}</p>
            <p className="text-xs text-slate-500">{cat.total}</p>
          </div>
          <span className="text-xs font-bold text-[#005941] bg-emerald-100 px-2.5 py-1 rounded-full">
            {cat.percentage}
          </span>
        </div>
      ))}
    </div>
  );
}