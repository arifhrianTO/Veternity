import React from "react";
import Sidebar from "../../components/layout/Sidebar";

export default function KoperasiProfilPage() {
  const profile = {
    name: "Koperasi TaniNelayan Sejahtera",
    nid: "0123456789012345",
    phone: "081234567890",
    address: "Kawasan Industri Batam Center, Batam",
    birthDate: "20-05-2010",
    account: "88293920192839",
    role: "Koperasi",
    image: "/images/ikan1.png",
  };

  return (
    <div className="min-h-screen bg-white font-[Montserrat] text-slate-900">
      <div className="flex w-full min-h-screen p-4 pl-[304px]">
        {/* Sidebar Koperasi */}
        <Sidebar />

        {/* Outer Container Wrapper */}
        <div className="flex-1 bg-[rgba(222,236,225,0.19)] border border-[rgba(0,154,38,0.19)] rounded-[20px] p-8 relative">
          
          {/* Top Header */}
          <div className="flex items-center justify-between border-b border-[#029154] pb-6 mb-8">
            <h2 className="text-[24px] font-semibold text-[#005941]">Profil Koperasi</h2>
            <img 
              src={profile.image} 
              alt="avatar" 
              className="w-10 h-10 rounded-full border border-slate-100 object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/images/user.png";
              }}
            />
          </div>

          {/* Inner Profile Card Container */}
          <div className="bg-white/50 border border-[#029154] shadow-[0_0_4px_rgba(0,0,0,0.25)] rounded-[20px] p-8 relative">
            
            {/* Edit Icon Button (Top Right Inside Card) */}
            <button className="absolute top-6 right-6 text-[#005941] hover:opacity-80 transition">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>

            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
              {/* Profile Image */}
              <div className="flex-shrink-0">
                <img
                  src={profile.image}
                  alt={profile.name}
                  className="w-44 h-44 rounded-full object-cover border-2 border-emerald-100"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/images/user.png";
                  }}
                />
              </div>

              {/* Profile Info Details */}
              <div className="flex-1 w-full relative pt-2">
                <h2 className="text-[28px] font-bold text-[#005941] mb-6">
                  {profile.name}
                </h2>

                <div className="space-y-3 text-[16px] text-[#273B4A]">
                  <div className="grid grid-cols-1 sm:grid-cols-12 items-center">
                    <span className="font-semibold sm:col-span-4">Nik :</span>
                    <span className="sm:col-span-8 font-medium">{profile.nid}</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-12 items-center">
                    <span className="font-semibold sm:col-span-4">No Hp :</span>
                    <span className="sm:col-span-8 font-medium">{profile.phone}</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-12 items-center">
                    <span className="font-semibold sm:col-span-4">Alamat :</span>
                    <span className="sm:col-span-8 font-medium">{profile.address}</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-12 items-center">
                    <span className="font-semibold sm:col-span-4">Tanggal Lahir :</span>
                    <span className="sm:col-span-8 font-medium">{profile.birthDate}</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-12 items-center">
                    <span className="font-semibold sm:col-span-4">Rekening :</span>
                    <span className="sm:col-span-8 font-medium">{profile.account}</span>
                  </div>
                </div>

                {/* Logout Button (Bottom Right) */}
                <div className="flex justify-end mt-8">
                  <button className="flex items-center gap-2 bg-[#005941] hover:bg-[#004230] text-white px-6 py-2.5 rounded-[12px] font-semibold text-[15px] transition shadow-sm">
                    <span>Keluar</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                  </button>
                </div>

              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
