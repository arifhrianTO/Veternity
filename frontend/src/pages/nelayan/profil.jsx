import React, { useState, useEffect } from "react";
import Sidebar from "../../components/layout/Sidebar";
import api from "../../config/axios";
import { Loader2 } from "lucide-react";

export default function ProfilPage() {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const testToken = localStorage.getItem("token") || "11|bRDttRF4eF1WuflHocapjNqoF26hfU4a2AusID1E7a2abeb3";
        localStorage.setItem("token", testToken);

        const response = await api.get('/user');
        const data = response.data;
        setProfile({
          name: data.nama_lengkap,
          nid: data.nik || "Tidak ada NIK",
          phone: data.no_hp,
          address: data.alamat,
          birthDate: data.tanggal_lahir,
          account: data.rekening || "Tidak ada rekening",
          role: data.role,
          image: data.foto_profil ? `http://localhost:8000/storage/${data.foto_profil}` : "/images/user.png",
        });
      } catch (error) {
        console.error("Gagal mengambil profil", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#006638]" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center text-slate-500">
        Gagal memuat profil.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-[Montserrat] text-slate-900">
      <div className="flex w-full min-h-screen p-4 pl-[304px]">
        <Sidebar />

        {/* Outer Container Wrapper */}
        <div className="flex-1 bg-[rgba(222,236,225,0.19)] border border-[rgba(0,154,38,0.19)] rounded-[20px] p-8 relative">
          
          {/* Top Header */}
          <div className="flex items-end justify-between border-b border-[#029154] pb-2 mb-8">
            <h2 className="text-[24px] font-semibold text-[#005941]">Profil</h2>
            <img 
              src={profile.image} 
              alt="avatar" 
              className="w-10 h-10 rounded-full border border-slate-100 object-cover translate-y-[4px]" 
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
                  className="w-32 h-32 rounded-full object-cover border-2 border-emerald-100"
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
