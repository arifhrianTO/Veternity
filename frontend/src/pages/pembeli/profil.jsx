import Sidebar from "../../components/layout/Sidebar";

export default function ProfilPembeliPage() {
  const profile = {
    name: "PT Sejahtera",
    phone: "08098765432",
    address: "poltek",
    account: "73829292938399",
    role: "Pembeli",
    image: "/images/ikan1.png",
  };

  return (
    <div className="min-h-screen bg-white font-[Montserrat] text-slate-900">
      <div className="flex w-full min-h-screen p-4 pl-[304px]">
        {/* Sidebar */}
        <Sidebar />

        {/* Outer Container Wrapper */}
        <div className="flex-1 bg-[rgba(222,236,225,0.19)] border border-[rgba(0,154,38,0.19)] rounded-[16px] p-6 relative">
          {/* Top Header - reduced from 24px to 18px */}
          <div className="flex items-end justify-between border-b border-[#029154] pb-2 mb-6">
            <h2 className="text-[18px] font-semibold text-[#005941]">Profil</h2>
            <img
              src={profile.image}
              alt="avatar"
              className="w-8 h-8 rounded-full border border-slate-100 object-cover"
            />
          </div>

          {/* Inner Profile Card Container - reduced padding */}
          <div className="bg-white/50 border border-[#029154] shadow-[0_0_4px_rgba(0,0,0,0.25)] rounded-[16px] p-6 relative">
            {/* Edit Icon Button (Top Right Inside Card) - reduced from 24px to 18px */}
            <button className="absolute top-4 right-4 text-[#005941] hover:opacity-80 transition">
              <svg
                className="w-[18px] h-[18px]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </button>

            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              {/* Profile Image - reduced from 176px (w-44) to 112px (w-28) */}
              <div className="flex-shrink-0">
                <img
                  src={profile.image}
                  alt={profile.name}
                  className="w-28 h-28 rounded-full object-cover border-2 border-emerald-100"
                />
              </div>

              {/* Profile Info Details */}
              <div className="flex-1 w-full relative pt-1">
                <h2 className="text-[20px] font-bold text-[#005941] mb-4">
                  {profile.name}
                </h2>

                <div className="space-y-2 text-[13px] text-[#273B4A]">
                  <div className="grid grid-cols-1 sm:grid-cols-12 items-center">
                    <span className="font-semibold sm:col-span-4">No Hp :</span>
                    <span className="sm:col-span-8 font-medium">
                      {profile.phone}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-12 items-center">
                    <span className="font-semibold sm:col-span-4">
                      Alamat :
                    </span>
                    <span className="sm:col-span-8 font-medium">
                      {profile.address}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-12 items-center">
                    <span className="font-semibold sm:col-span-4">
                      Rekening :
                    </span>
                    <span className="sm:col-span-8 font-medium">
                      {profile.account}
                    </span>
                  </div>
                </div>

                {/* Logout Button (Bottom Right) - reduced padding/font */}
                <div className="flex justify-end mt-6">
                  <button className="flex items-center gap-2 bg-[#005941] hover:bg-[#004230] text-white px-4 py-2 rounded-[8px] font-semibold text-[13px] transition shadow-sm">
                    <span>Keluar</span>
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
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
