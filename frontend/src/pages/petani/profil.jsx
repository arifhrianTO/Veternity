import React from "react";
import PetaniSidebar from "../../components/petani/PetaniSidebar";

export default function ProfilPage() {
  const profile = {
    name: "Budi Santoso",
    nid: "0987654321234567",
    phone: "08098765432",
    address: "Poltek",
    birthDate: "17-08-45",
    account: "73829292938399",
    role: "Petani",
    image: "/images/ikan1.png",
  };

  return (
    <div className="min-h-screen bg-[#EFFBF4] font-sans text-slate-900">
      <div className="flex max-w-[1360px] mx-auto py-8 gap-6 px-4">
        <PetaniSidebar />

        <div className="flex-1">
          <div className="border border-emerald-200 rounded-[32px] bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-6">
              <div>
                <h3 className="text-xl font-semibold text-emerald-700">Profil</h3>
                <div className="text-sm text-slate-500">Informasi akun petani Anda</div>
              </div>
              <button className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200">
                <img src="/images/write.png" alt="Edit" className="h-4 w-4" />
               
              </button>
            </div>

        <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-1 items-center gap-6">
            <img src={profile.image} alt={profile.name} className="h-40 w-40 rounded-full object-cover" />

            <div className="space-y-3 flex-1">
              <h2 className="text-3xl font-bold text-emerald-700">{profile.name}</h2>
              <div className="grid gap-3 text-sm text-slate-600 w-full">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center">
                  <span className="font-semibold text-slate-900 min-w-[120px]">Nik :</span>
                  <span>{profile.nid}</span>
                </div>
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center">
                  <span className="font-semibold text-slate-900 min-w-[120px]">No Hp :</span>
                  <span>{profile.phone}</span>
                </div>
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center">
                  <span className="font-semibold text-slate-900 min-w-[120px]">Alamat :</span>
                  <span>{profile.address}</span>
                </div>
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center">
                  <span className="font-semibold text-slate-900 min-w-[120px]">Tanggal Lahir :</span>
                  <span>{profile.birthDate}</span>
                </div>
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center">
                  <span className="font-semibold text-slate-900 min-w-[120px]">Rekening :</span>
                  <span>{profile.account}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end xl:justify-center">
            <button className="rounded-full bg-emerald-700 px-8 py-3 text-sm font-semibold text-white shadow-sm hover:bg-emerald-800">
              Keluar
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
  );
}
