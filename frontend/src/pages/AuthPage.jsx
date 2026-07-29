import { useState, useEffect } from "react";
import { Eye, EyeOff, ArrowLeft, ArrowRight, Sprout, Anchor, ShoppingCart } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import vectorShape from "../assets/Vector.png";
import logo from "../assets/logo.png";
import ellipse181 from "../assets/Ellipse_181.png";
import ellipse182 from "../assets/Ellipse_182.png";
import ellipse179 from "../assets/Ellipse_179.png";

export default function AuthPage() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // State for mode (Login vs Register)
  const [isRegister, setIsRegister] = useState(false);

  // Sync pathname with state
  useEffect(() => {
    if (location.pathname === "/register") {
      setIsRegister(true);
    } else {
      setIsRegister(false);
    }
  }, [location.pathname]);

  // Login States
  const [loginEmailOrPhone, setLoginEmailOrPhone] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Register States
  const [step, setStep] = useState(1);
  const [role, setRole] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [gender, setGender] = useState("");
  const [address, setAddress] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Submit Handlers
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    console.log("Login:", { loginEmailOrPhone, loginPassword });
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    if (registerPassword !== confirmPassword) {
      alert("Password dan konfirmasi password tidak cocok!");
      return;
    }
    console.log("Register:", {
      role,
      fullName,
      phone,
      birthDate,
      gender,
      address,
      email: registerEmail,
      password: registerPassword,
    });
  };

  return (
    <div className="min-h-screen md:h-screen w-full flex overflow-hidden relative bg-[#F4F4EE]">
      {/* ========================================================
          DESKTOP ONLY: SLIDING GRADIENT PANEL WITH DYNAMIC ROUNDED CORNERS
          ======================================================== */}
      <div
        className={`absolute top-0 bottom-0 h-full hidden md:flex md:w-[calc(50%+40px)] z-30 transition-all duration-700 ease-in-out overflow-hidden
          ${isRegister ? "md:rounded-l-[40px] md:rounded-r-none" : "md:rounded-r-[40px] md:rounded-l-none"}
        `}
        style={{
          left: isRegister ? "calc(50% - 40px)" : "0px",
        }}
      >
        {/* Layer 1: Login Gradient (visible in Login mode) */}
        <div
          className="absolute inset-0 flex flex-col justify-between px-16 py-16 transition-opacity duration-700 ease-in-out text-center"
          style={{
            background: "linear-gradient(135deg, #B1E747 0%, #3F7E48 50%, #024D70 100%)",
            opacity: isRegister ? 0 : 1,
            pointerEvents: isRegister ? "none" : "auto",
            paddingRight: "104px", // Placed on the left, add padding right for optical centering
            paddingLeft: "64px",
          }}
        >
          {/* Decorative shapes */}
          <img
            src={vectorShape}
            alt=""
            className="pointer-events-none absolute right-10 top-16 w-40 opacity-80 mix-blend-screen"
          />
          <img
            src={ellipse181}
            alt=""
            className="pointer-events-none absolute bottom-0 left-0 w-52 opacity-70 mix-blend-screen"
          />
          <img
            src={vectorShape}
            alt=""
            className="pointer-events-none absolute bottom-8 left-32 w-36 opacity-80 mix-blend-screen"
          />
          <img
            src={ellipse182}
            alt=""
            className="pointer-events-none absolute -top-24 -right-24 w-96 opacity-70 mix-blend-screen"
          />

          <div className="relative z-10 flex flex-1 flex-col items-center justify-center text-center">
            <img src={logo} alt="TaniNelayan" className="mb-2 h-40 w-40 object-contain" />
            <h1 className="text-4xl font-bold text-white tracking-tight">TaniNelayan</h1>
            <p className="mt-4 max-w-xs text-sm text-white/85">
              Membangun Masa Depan Pertanian dan Perikanan Indonesia
            </p>
          </div>

          <div className="relative z-10 flex flex-col items-center gap-4 pb-4">
            <p className="text-sm text-white/90">Belum punya akun? Daftar disini</p>
            <button
              type="button"
              onClick={() => navigate("/register")}
              className="w-64 rounded-full border-2 border-white py-3 text-lg font-bold text-white transition hover:bg-white hover:text-[#024D70]"
            >
              Daftar
            </button>
          </div>
        </div>

        {/* Layer 2: Register Gradient (visible in Register mode) */}
        <div
          className="absolute inset-0 flex flex-col justify-between px-16 py-16 transition-opacity duration-700 ease-in-out text-center"
          style={{
            background: "linear-gradient(225deg, #B1E747 0%, #3F7E48 50%, #024D70 100%)",
            opacity: isRegister ? 1 : 0,
            pointerEvents: isRegister ? "auto" : "none",
            paddingLeft: "104px", // Placed on the right, add padding left for optical centering
            paddingRight: "64px",
          }}
        >
          {/* Decorative shapes mirrored */}
          <img
            src={vectorShape}
            alt=""
            className="pointer-events-none absolute left-10 top-16 w-40 opacity-80 mix-blend-screen -scale-x-100"
          />
          <img
            src={ellipse181}
            alt=""
            className="pointer-events-none absolute bottom-0 right-0 w-52 opacity-70 mix-blend-screen -scale-x-100"
          />
          <img
            src={vectorShape}
            alt=""
            className="pointer-events-none absolute bottom-8 right-32 w-36 opacity-80 mix-blend-screen -scale-x-100"
          />
          <img
            src={ellipse182}
            alt=""
            className="pointer-events-none absolute -top-24 -left-24 w-96 opacity-70 mix-blend-screen -scale-x-100"
          />

          <div className="relative z-10 flex flex-1 flex-col items-center justify-center text-center">
            <img src={logo} alt="TaniNelayan" className="mb-2 h-40 w-40 object-contain" />
            <h1 className="text-4xl font-bold text-white tracking-tight">TaniNelayan</h1>
            <p className="mt-4 max-w-xs text-sm text-white/85">
              Membangun Masa Depan Pertanian dan Perikanan Indonesia
            </p>
          </div>

          <div className="relative z-10 flex flex-col items-center gap-4 pb-4">
            <p className="text-sm text-white/90">Sudah punya akun? Masuk disini</p>
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="w-64 rounded-full border-2 border-white py-3 text-lg font-bold text-white transition hover:bg-white hover:text-[#024D70]"
            >
              Masuk
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================
          LEFT PANEL: REGISTER FORM (Always on the left on desktop)
          ======================================================== */}
      <div
        className={`w-full md:w-1/2 h-full flex flex-col items-center justify-center bg-[#F4F4EE] px-6 py-6 sm:px-12 relative transition-opacity duration-500 z-10
          ${isRegister ? "opacity-100 pointer-events-auto" : "max-md:hidden md:opacity-0 md:pointer-events-none"}
        `}
      >
        {/* Background Ellipses for Form (Only active on Register) */}
        <img
          src={ellipse179}
          alt=""
          className="pointer-events-none absolute bottom-0 left-0 w-80 opacity-90 -scale-x-100"
        />
        <img
          src={ellipse179}
          alt=""
          className="pointer-events-none absolute -top-16 -right-16 w-80 opacity-90 rotate-180 -scale-x-100"
        />

        <div className="w-full max-w-md z-10 py-2">
          <form onSubmit={handleRegisterSubmit} className="w-full">
            <h1 className="text-2xl font-bold text-center bg-gradient-to-r from-[#273B4A] to-[#029154] bg-clip-text text-transparent">
              Buat Akun Baru
            </h1>
            <p className="mt-1 mb-4 text-[#5C8A73] text-sm text-center">
              Daftar untuk mulai menggunakan TaniNelayan
            </p>

            {/* Stepper */}
            <div className="mb-5 flex items-center justify-between w-full max-w-sm mx-auto relative px-4">
              <div className="absolute top-1/2 left-0 right-0 h-1 bg-[#E2E8F0] -translate-y-1/2 z-0 mx-8"></div>
              <div 
                className="absolute top-1/2 left-0 h-1 bg-[#029154] -translate-y-1/2 transition-all duration-300 z-0 mx-8"
                style={{ width: step === 1 ? "0%" : step === 2 ? "50%" : "100%" }}
              ></div>

              {/* Step 1 */}
              <div className="flex flex-col items-center z-10 relative">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 ${
                  step >= 1 ? "bg-[#029154] text-white ring-4 ring-[#029154]/20" : "bg-white text-slate-400 border-2 border-slate-200"
                }`}>
                  1
                </div>
                <span className={`text-[10px] font-semibold mt-1 transition-colors duration-300 ${step >= 1 ? "text-[#0B3D2E]" : "text-slate-400"}`}>Peran</span>
              </div>

              {/* Step 2 */}
              <div className="flex flex-col items-center z-10 relative">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 ${
                  step >= 2 ? "bg-[#029154] text-white ring-4 ring-[#029154]/20" : "bg-white text-slate-400 border-2 border-slate-200"
                }`}>
                  2
                </div>
                <span className={`text-[10px] font-semibold mt-1 transition-colors duration-300 ${step >= 2 ? "text-[#0B3D2E]" : "text-slate-400"}`}>Data Pribadi</span>
              </div>

              {/* Step 3 */}
              <div className="flex flex-col items-center z-10 relative">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 ${
                  step >= 3 ? "bg-[#029154] text-white ring-4 ring-[#029154]/20" : "bg-white text-slate-400 border-2 border-slate-200"
                }`}>
                  3
                </div>
                <span className={`text-[10px] font-semibold mt-1 transition-colors duration-300 ${step >= 3 ? "text-[#0B3D2E]" : "text-slate-400"}`}>Data Akun</span>
              </div>
            </div>

            {/* STEP 1: PILIH ROLE */}
            {step === 1 && (
              <div>
                <span className="block text-xs font-semibold text-[#0B3D2E] mb-2">
                  Pilih Peran Anda :
                </span>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setRole("petani")}
                    className={`p-3 rounded-xl border text-left flex flex-col justify-between transition duration-200 ${
                      role === "petani"
                        ? "border-[#029154] bg-[#EAF6F1] ring-2 ring-[#029154]/20"
                        : "border-[#BFD9CC] bg-[#EAF6F1]/30 hover:bg-[#EAF6F1]/50"
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className={`p-1.5 rounded-lg ${role === "petani" ? "bg-[#029154] text-white" : "bg-[#BFD9CC]/50 text-[#0B3D2E]"}`}>
                        <Sprout size={18} />
                      </div>
                      {role === "petani" && <div className="w-3.5 h-3.5 rounded-full bg-[#029154] flex items-center justify-center"><div className="w-1.5 h-1.5 rounded-full bg-white"></div></div>}
                    </div>
                    <div className="mt-2">
                      <h3 className="font-bold text-[#0B3D2E] text-sm">Petani</h3>
                      <p className="text-[10px] text-[#5C8A73]">Umum / Mandiri</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole("nelayan")}
                    className={`p-3 rounded-xl border text-left flex flex-col justify-between transition duration-200 ${
                      role === "nelayan"
                        ? "border-[#029154] bg-[#EAF6F1] ring-2 ring-[#029154]/20"
                        : "border-[#BFD9CC] bg-[#EAF6F1]/30 hover:bg-[#EAF6F1]/50"
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className={`p-1.5 rounded-lg ${role === "nelayan" ? "bg-[#029154] text-white" : "bg-[#BFD9CC]/50 text-[#0B3D2E]"}`}>
                        <Anchor size={18} />
                      </div>
                      {role === "nelayan" && <div className="w-3.5 h-3.5 rounded-full bg-[#029154] flex items-center justify-center"><div className="w-1.5 h-1.5 rounded-full bg-white"></div></div>}
                    </div>
                    <div className="mt-2">
                      <h3 className="font-bold text-[#0B3D2E] text-sm">Nelayan</h3>
                      <p className="text-[10px] text-[#5C8A73]">Umum / Mandiri</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole("petani_binaan")}
                    className={`p-3 rounded-xl border text-left flex flex-col justify-between transition duration-200 ${
                      role === "petani_binaan"
                        ? "border-[#029154] bg-[#EAF6F1] ring-2 ring-[#029154]/20"
                        : "border-[#BFD9CC] bg-[#EAF6F1]/30 hover:bg-[#EAF6F1]/50"
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className={`p-1.5 rounded-lg ${role === "petani_binaan" ? "bg-[#029154] text-white" : "bg-[#BFD9CC]/50 text-[#0B3D2E]"}`}>
                        <Sprout size={18} />
                      </div>
                      <span className="text-[8px] font-bold uppercase tracking-wider bg-[#ABE147] text-[#0B3D2E] px-1.5 py-0.5 rounded-full">Binaan</span>
                    </div>
                    <div className="mt-2">
                      <h3 className="font-bold text-[#0B3D2E] text-sm">Petani Binaan</h3>
                      <p className="text-[10px] text-[#5C8A73]">Mitra Koperasi</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole("nelayan_binaan")}
                    className={`p-3 rounded-xl border text-left flex flex-col justify-between transition duration-200 ${
                      role === "nelayan_binaan"
                        ? "border-[#029154] bg-[#EAF6F1] ring-2 ring-[#029154]/20"
                        : "border-[#BFD9CC] bg-[#EAF6F1]/30 hover:bg-[#EAF6F1]/50"
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className={`p-1.5 rounded-lg ${role === "nelayan_binaan" ? "bg-[#029154] text-white" : "bg-[#BFD9CC]/50 text-[#0B3D2E]"}`}>
                        <Anchor size={18} />
                      </div>
                      <span className="text-[8px] font-bold uppercase tracking-wider bg-[#ABE147] text-[#0B3D2E] px-1.5 py-0.5 rounded-full">Binaan</span>
                    </div>
                    <div className="mt-2">
                      <h3 className="font-bold text-[#0B3D2E] text-sm">Nelayan Binaan</h3>
                      <p className="text-[10px] text-[#5C8A73]">Mitra Koperasi</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole("pembeli")}
                    className={`col-span-2 p-3 rounded-xl border text-left flex items-center justify-between transition duration-200 ${
                      role === "pembeli"
                        ? "border-[#029154] bg-[#EAF6F1] ring-2 ring-[#029154]/20"
                        : "border-[#BFD9CC] bg-[#EAF6F1]/30 hover:bg-[#EAF6F1]/50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${role === "pembeli" ? "bg-[#029154] text-white" : "bg-[#BFD9CC]/50 text-[#0B3D2E]"}`}>
                        <ShoppingCart size={18} />
                      </div>
                      <div>
                        <h3 className="font-bold text-[#0B3D2E] text-sm">Pembeli</h3>
                        <p className="text-[10px] text-[#5C8A73]">Konsumen / Pembeli Produk</p>
                      </div>
                    </div>
                    {role === "pembeli" && <div className="w-3.5 h-3.5 rounded-full bg-[#029154] flex items-center justify-center"><div className="w-1.5 h-1.5 rounded-full bg-white"></div></div>}
                  </button>
                </div>

                <div className="mt-5 flex flex-col gap-4">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    disabled={!role}
                    className={`w-full rounded-full py-2.5 text-base font-bold text-white shadow-md transition flex items-center justify-center gap-2 ${
                      role ? "hover:opacity-90 cursor-pointer" : "opacity-50 cursor-not-allowed"
                    }`}
                    style={{
                      background: role
                        ? "linear-gradient(90deg, #B1E747 0%, #3F7E48 50%, #024D70 100%)"
                        : "#BFD9CC",
                    }}
                  >
                    Selanjutnya <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: ISI DATA PRIBADI */}
            {step === 2 && (
              <div>
                <div className="space-y-2.5">
                  <div>
                    <label htmlFor="fullName" className="mb-1 block text-xs font-semibold text-[#0B3D2E]">
                      Nama Lengkap :
                    </label>
                    <input
                      id="fullName"
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Masukkan nama lengkap anda"
                      className="w-full rounded-full border border-[#BFD9CC] bg-[#EAF6F1] px-4 py-2 text-xs text-[#0B3D2E] placeholder:text-[#7FA893] outline-none focus:border-[#1F6B3C] focus:ring-2 focus:ring-[#1F6B3C]/20"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="mb-1 block text-xs font-semibold text-[#0B3D2E]">
                      Nomor HP :
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Masukkan nomor hp anda"
                      className="w-full rounded-full border border-[#BFD9CC] bg-[#EAF6F1] px-4 py-2 text-xs text-[#0B3D2E] placeholder:text-[#7FA893] outline-none focus:border-[#1F6B3C] focus:ring-2 focus:ring-[#1F6B3C]/20"
                    />
                  </div>

                  <div>
                    <label htmlFor="birthDate" className="mb-1 block text-xs font-semibold text-[#0B3D2E]">
                      Tanggal Lahir :
                    </label>
                    <input
                      id="birthDate"
                      type="date"
                      required
                      value={birthDate}
                      onChange={(e) => setBirthDate(e.target.value)}
                      className="w-full rounded-full border border-[#BFD9CC] bg-[#EAF6F1] px-4 py-2 text-xs text-[#0B3D2E] placeholder:text-[#7FA893] outline-none focus:border-[#1F6B3C] focus:ring-2 focus:ring-[#1F6B3C]/20"
                    />
                  </div>

                  <div>
                    <span className="mb-1 block text-xs font-semibold text-[#0B3D2E]">
                      Jenis Kelamin :
                    </span>
                    <div className="flex gap-6 mt-1">
                      <label className="flex items-center gap-1.5 cursor-pointer text-xs text-[#0B3D2E]">
                        <input
                          type="radio"
                          name="gender"
                          value="Laki-laki"
                          checked={gender === "Laki-laki"}
                          onChange={(e) => setGender(e.target.value)}
                          className="w-3.5 h-3.5 text-[#1F6B3C] border-[#BFD9CC] focus:ring-[#1F6B3C]/20"
                        />
                        Laki-laki
                      </label>
                      <label className="flex items-center gap-1.5 cursor-pointer text-xs text-[#0B3D2E]">
                        <input
                          type="radio"
                          name="gender"
                          value="Perempuan"
                          checked={gender === "Perempuan"}
                          onChange={(e) => setGender(e.target.value)}
                          className="w-3.5 h-3.5 text-[#1F6B3C] border-[#BFD9CC] focus:ring-[#1F6B3C]/20"
                        />
                        Perempuan
                      </label>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="address" className="mb-1 block text-xs font-semibold text-[#0B3D2E]">
                      Alamat Lengkap :
                    </label>
                    <textarea
                      id="address"
                      required
                      rows={2}
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Masukkan alamat lengkap anda"
                      className="w-full rounded-xl border border-[#BFD9CC] bg-[#EAF6F1] px-4 py-2 text-xs text-[#0B3D2E] placeholder:text-[#7FA893] outline-none focus:border-[#1F6B3C] focus:ring-2 focus:ring-[#1F6B3C]/20 resize-none"
                    />
                  </div>
                </div>

                <div className="mt-5 flex gap-4">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex-1 rounded-full border border-[#BFD9CC] py-2 text-base font-bold text-[#0B3D2E] hover:bg-[#EAF6F1] transition flex items-center justify-center gap-2"
                  >
                    <ArrowLeft size={18} /> Kembali
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (fullName && phone && birthDate && gender && address) {
                        setStep(3);
                      } else {
                        alert("Silakan isi semua data pribadi terlebih dahulu.");
                      }
                    }}
                    className="flex-1 rounded-full py-2 text-base font-bold text-white shadow-md hover:opacity-90 transition flex items-center justify-center gap-2"
                    style={{
                      background: "linear-gradient(90deg, #B1E747 0%, #3F7E48 50%, #024D70 100%)",
                    }}
                  >
                    Selanjutnya <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: DATA AKUN */}
            {step === 3 && (
              <div>
                <div className="space-y-3">
                  <div>
                    <label htmlFor="registerEmail" className="mb-1 block text-xs font-semibold text-[#0B3D2E]">
                      Email :
                    </label>
                    <input
                      id="registerEmail"
                      type="email"
                      required
                      value={registerEmail}
                      onChange={(e) => setRegisterEmail(e.target.value)}
                      placeholder="Masukkan email anda"
                      className="w-full rounded-full border border-[#BFD9CC] bg-[#EAF6F1] px-4 py-2.5 text-xs text-[#0B3D2E] placeholder:text-[#7FA893] outline-none focus:border-[#1F6B3C] focus:ring-2 focus:ring-[#1F6B3C]/20"
                    />
                  </div>

                  <div>
                    <label htmlFor="registerPassword" className="mb-1 block text-xs font-semibold text-[#0B3D2E]">
                      Password :
                    </label>
                    <div className="relative">
                      <input
                        id="registerPassword"
                        type={showRegisterPassword ? "text" : "password"}
                        required
                        value={registerPassword}
                        onChange={(e) => setRegisterPassword(e.target.value)}
                        placeholder="Masukkan password anda"
                        className="w-full rounded-full border border-[#BFD9CC] bg-[#EAF6F1] px-4 py-2.5 pr-11 text-xs text-[#0B3D2E] placeholder:text-[#7FA893] outline-none focus:border-[#1F6B3C] focus:ring-2 focus:ring-[#1F6B3C]/20"
                      />
                      <button
                        type="button"
                        onClick={() => setShowRegisterPassword((v) => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#1F6B3C]"
                      >
                        {showRegisterPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="mb-1 block text-xs font-semibold text-[#0B3D2E]">
                      Konfirmasi Password :
                    </label>
                    <div className="relative">
                      <input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Masukkan ulang password anda"
                        className="w-full rounded-full border border-[#BFD9CC] bg-[#EAF6F1] px-4 py-2.5 pr-11 text-xs text-[#0B3D2E] placeholder:text-[#7FA893] outline-none focus:border-[#1F6B3C] focus:ring-2 focus:ring-[#1F6B3C]/20"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword((v) => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#1F6B3C]"
                      >
                        {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mt-5 flex gap-4">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="flex-1 rounded-full border border-[#BFD9CC] py-2.5 text-base font-bold text-[#0B3D2E] hover:bg-[#EAF6F1] transition flex items-center justify-center gap-2"
                  >
                    <ArrowLeft size={18} /> Kembali
                  </button>
                  <button
                    type="submit"
                    className="flex-1 rounded-full py-2.5 text-base font-bold text-white shadow-md hover:opacity-90 transition flex items-center justify-center gap-2"
                    style={{
                      background: "linear-gradient(90deg, #B1E747 0%, #3F7E48 50%, #024D70 100%)",
                    }}
                  >
                    Daftar
                  </button>
                </div>
              </div>
            )}

            {/* Mobile-Only Helper to Switch Mode */}
            <div className="mt-4 text-center md:hidden">
              <p className="text-xs text-[#5C8A73]">
                Sudah punya akun?{" "}
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="font-bold text-[#0B3D2E] hover:underline"
                >
                  Masuk di sini
                </button>
              </p>
            </div>

            <div className="mt-4 text-center">
              <Link
                to="/"
                className="inline-flex items-center gap-1 text-xs text-[#5C8A73] hover:text-[#0B3D2E] transition-colors"
              >
                &larr; Kembali ke Beranda
              </Link>
            </div>
          </form>
        </div>
      </div>

      {/* ========================================================
          RIGHT PANEL: LOGIN FORM (Always on the right on desktop)
          ======================================================== */}
      <div
        className={`w-full md:w-1/2 h-full flex flex-col items-center justify-center bg-[#F4F4EE] px-6 py-6 sm:px-12 relative transition-opacity duration-500 z-10
          ${!isRegister ? "opacity-100 pointer-events-auto" : "max-md:hidden md:opacity-0 md:pointer-events-none"}
        `}
      >
        {/* Background Ellipses for Form (Only active on Login) */}
        <img
          src={ellipse179}
          alt=""
          className="pointer-events-none absolute bottom-0 right-0 w-80 opacity-90"
        />
        <img
          src={ellipse179}
          alt=""
          className="pointer-events-none absolute -top-16 -left-16 w-80 opacity-90 rotate-180"
        />

        <div className="w-full max-w-md z-10 py-6">
          <form onSubmit={handleLoginSubmit} className="w-full">
            <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-[#273B4A] to-[#029154] bg-clip-text text-transparent">
              Selamat Datang!
            </h1>
            <p className="mt-2 text-[#5C8A73] text-center text-sm">
              Silahkan Masuk ke akun anda
            </p>

            <div className="mt-8">
              <label htmlFor="loginEmailOrPhone" className="mb-2 block text-sm font-medium text-[#0B3D2E]">
                Email atau Nomor HP :
              </label>
              <input
                id="loginEmailOrPhone"
                type="text"
                required
                value={loginEmailOrPhone}
                onChange={(e) => setLoginEmailOrPhone(e.target.value)}
                placeholder="Masukkan email atau nomor hp anda"
                className="w-full rounded-full border border-[#BFD9CC] bg-[#EAF6F1] px-4 py-3 text-sm text-[#0B3D2E] placeholder:text-[#7FA893] outline-none focus:border-[#1F6B3C] focus:ring-2 focus:ring-[#1F6B3C]/20"
              />
            </div>

            <div className="mt-6">
              <label htmlFor="loginPassword" className="mb-2 block text-sm font-medium text-[#0B3D2E]">
                Password :
              </label>
              <div className="relative">
                <input
                  id="loginPassword"
                  type={showLoginPassword ? "text" : "password"}
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Masukkan password anda"
                  className="w-full rounded-full border border-[#BFD9CC] bg-[#EAF6F1] px-4 py-3 pr-11 text-sm text-[#0B3D2E] placeholder:text-[#7FA893] outline-none focus:border-[#1F6B3C] focus:ring-2 focus:ring-[#1F6B3C]/20"
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#1F6B3C]"
                >
                  {showLoginPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <Link
                  to="/"
                  className="inline-flex items-center gap-1 text-sm text-[#5C8A73] hover:text-[#0B3D2E] transition-colors"
                >
                  &larr; Kembali ke Beranda
                </Link>
                <button type="button" className="text-sm text-[#0B3D2E] hover:underline">
                  Lupa password?
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="mt-8 w-full rounded-full py-4 text-lg font-bold text-white shadow-md transition hover:opacity-90"
              style={{
                background: "linear-gradient(90deg, #024D70 0%, #3F7E48 50%, #B1E747 100%)",
              }}
            >
              Masuk
            </button>

            {/* Mobile-Only Helper to Switch Mode */}
            <div className="mt-6 text-center md:hidden">
              <p className="text-sm text-[#5C8A73]">
                Belum punya akun?{" "}
                <button
                  type="button"
                  onClick={() => navigate("/register")}
                  className="font-bold text-[#0B3D2E] hover:underline"
                >
                  Daftar di sini
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
