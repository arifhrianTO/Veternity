import React, { useState } from "react";
import PetaniSidebar from "../../components/petani/PetaniSidebar";

const mockProducts = [
	{ id: 1, name: "Beras Premium", img: "/images/beras.png", stock: "50 Kg", price: "Rp 14.000 / kg", harvestDate: "01-01-25", shelfLife: "7 Hari", status: "Aktif" },
	{ id: 2, name: "Beras Premium", img: "/images/beras.png", stock: "50 Kg", price: "Rp 14.000 / kg", harvestDate: "01-01-25", shelfLife: "7 Hari", status: "Aktif" },
	{ id: 3, name: "Beras Premium", img: "/images/beras.png", stock: "50 Kg", price: "Rp 14.000 / kg", harvestDate: "01-01-25", shelfLife: "7 Hari", status: "Aktif" },
	{ id: 4, name: "Beras Premium", img: "/images/beras.png", stock: "50 Kg", price: "Rp 14.000 / kg", harvestDate: "01-01-25", shelfLife: "7 Hari", status: "Aktif" },
	{ id: 5, name: "Beras Premium", img: "/images/beras.png", stock: "50 Kg", price: "Rp 14.000 / kg", harvestDate: "01-01-25", shelfLife: "7 Hari", status: "Aktif" },
	{ id: 6, name: "Beras Premium", img: "/images/beras.png", stock: "50 Kg", price: "Rp 14.000 / kg", harvestDate: "01-01-25", shelfLife: "7 Hari", status: "Aktif" },
	{ id: 7, name: "Beras Premium", img: "/images/beras.png", stock: "50 Kg", price: "Rp 14.000 / kg", harvestDate: "01-01-25", shelfLife: "7 Hari", status: "Aktif" },
	{ id: 8, name: "Beras Premium", img: "/images/beras.png", stock: "50 Kg", price: "Rp 14.000 / kg", harvestDate: "01-01-25", shelfLife: "7 Hari", status: "Aktif" },
];

export default function ProdukPage() {
	const [page, setPage] = useState(1);
	const itemsPerPage = 4;
	const totalPages = Math.ceil(mockProducts.length / itemsPerPage);
	const startIndex = (page - 1) * itemsPerPage;
	const currentProducts = mockProducts.slice(startIndex, startIndex + itemsPerPage);

	return (
		<div className="min-h-screen bg-[#F3F8F6] font-sans text-slate-900">
			<div className="flex max-w-[1360px] mx-auto py-8 gap-6 px-4">
				<PetaniSidebar />

				<div className="flex-1">
					<div className="bg-white border border-slate-200 rounded-2xl p-6">
						<div className="flex items-start justify-between mb-4">
							<div>
								<h3 className="text-lg font-semibold">Produk saya</h3>
								<div className="text-sm text-slate-500">Kelola produk hasil panen anda</div>
							</div>
							<button className="bg-emerald-700 text-white px-4 py-2 rounded-lg font-semibold">Tambah +</button>
						</div>

				<div className="overflow-x-auto">
					<table className="w-full text-sm">
						<thead>
							<tr className="text-slate-500 text-left border-b">
								<th className="py-3">Produk</th>
								<th className="py-3">Stok</th>
								<th className="py-3">Harga Harapan</th>
								<th className="py-3">Tanggal Panen</th>
								<th className="py-3">Masa Layak</th>
								<th className="py-3">Status</th>
								<th className="py-3">Aksi</th>
							</tr>
						</thead>
						<tbody className="divide-y">
							{currentProducts.map((p) => (
								<tr key={p.id} className="align-top">
									<td className="py-4">
										<div className="flex items-center gap-3">
											<img src={p.img} alt={p.name} className="w-20 h-14 object-cover rounded" />
											<div>
												<div className="font-semibold">{p.name}</div>
											</div>
										</div>
									</td>
									<td className="py-4">{p.stock}</td>
									<td className="py-4">{p.price}</td>
									<td className="py-4">{p.harvestDate}</td>
									<td className="py-4">{p.shelfLife}</td>
									<td className="py-4">
										<span className="inline-block text-xs px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 font-semibold">{p.status}</span>
									</td>
									<td className="py-4">
										<div className="flex items-center gap-2">
											<button className="px-2 py-1 rounded bg-sky-50 text-sky-600 border border-sky-200">✏️</button>
											<button className="px-2 py-1 rounded bg-rose-50 text-rose-600 border border-rose-200">🗑️</button>
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>

				<div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between text-sm text-slate-500">
					<div>Menampilkan {startIndex + 1}-{Math.min(startIndex + itemsPerPage, mockProducts.length)} dari {mockProducts.length} produk</div>
					<div className="inline-flex items-center gap-2">
						<button
							onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
							disabled={page === 1}
							className="rounded-lg border border-slate-200 px-3 py-1 text-slate-600 disabled:cursor-not-allowed disabled:opacity-50"
						>
							&lsaquo;
						</button>
						{Array.from({ length: totalPages }, (_, index) => (
							<button
								key={index}
								onClick={() => setPage(index + 1)}
								className={`h-9 w-9 rounded-lg border px-3 py-1 font-semibold ${page === index + 1 ? 'bg-emerald-700 text-white border-emerald-700' : 'border-slate-200 text-slate-700 hover:bg-slate-50'}`}
							>
								{index + 1}
							</button>
						))}
						<button
							onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
							disabled={page === totalPages}
							className="rounded-lg border border-slate-200 px-3 py-1 text-slate-600 disabled:cursor-not-allowed disabled:opacity-50"
						>
							&rsaquo;
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
	);
}
