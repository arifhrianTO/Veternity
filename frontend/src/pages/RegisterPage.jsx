import { useState } from "react";
import { Eye, EyeOff, ArrowLeft, ArrowRight, Sprout, Anchor, ShoppingCart } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import vectorShape from "../assets/Vector.png";
import logo from "../assets/logo.png";
import ellipse181 from "../assets/Ellipse_181.png";
import ellipse182 from "../assets/Ellipse_182.png";
import ellipse179 from "../assets/Ellipse_179.png";

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [role, setRole] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [gender, setGender] = useState("");
  const [address, setAddress] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    if (password !== confirmPassword) {
      setErrorMsg("Password dan konfirmasi password tidak cocok!");
      return;
    }
    
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:8000/api/register", {
        role: role,
        nama_lengkap: fullName,
        email: email,
        no_hp: phone,
        tanggal_lahir: birthDate,
        kelamin: gender,
        alamat: address,
        password: password,
      });
      
      alert("Registrasi berhasil! Silahkan masuk.");
      navigate("/login");
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setErrorMsg(error.response.data.message + (error.response.data.errors ? " - " + JSON.stringify(error.response.data.errors) : ""));
      } else {
        setErrorMsg("Terjadi kesalahan saat registrasi.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen md:h-screen w-full flex md:overflow-hidden" style={{ background: "linear-gradient(225deg, #B1E747 0%, #3F7E48 50%, #024D70 100%)" }}>
      {/* Left panel — Form */}
      <div className="relative flex w-full md:w-1/2 min-h-screen md:h-screen flex-col items-center justify-center md:overflow-hidden overflow-y-auto bg-[#F4F4EE] px-6 py-6 sm:px-12 md:rounded-r-[40px] md:z-10 custom-scrollbar">
        <style>{`
          .custom-scrollbar::-webkit-scrollbar {
            display: none;
          }
          .custom-scrollbar {
            -ms-overflow-style: none;  /* IE and Edge */
            scrollbar-width: none;  /* Firefox */
          }
        `}</style>

        {/* Ellipse 179 — kiri bawah */}
        <img
          src={ellipse179}
          alt=""
          className="pointer-events-none absolute bottom-0 left-0 w-80 opacity-90 -scale-x-100"
        />
        {/* Ellipse 179 — kanan atas */}
        <img
          src={ellipse179}
          alt=""
          className="pointer-events-none absolute -top-16 -right-16 w-80 opacity-90 rotate-180 -scale-x-100"
        />

        <div className="w-full max-w-md z-10 py-2">
          <form onSubmit={handleSubmit} className="w-full">
            <h1 className="text-2xl font-bold text-center bg-gradient-to-r from-[#273B4A] to-[#029154] bg-clip-text text-transparent">
              Buat Akun Baru
            </h1>
            <p className="mt-1 mb-4 text-[#5C8A73] text-sm text-center">
              Daftar untuk mulai menggunakan TaniNelayan
            </p>

            {/* Stepper */}
            <div className="mb-5 flex items-center justify-between w-full max-w-sm mx-auto relative px-4">
              {/* Connecting Line background */}
              <div className="absolute top-1/2 left-0 right-0 h-1 bg-[#E2E8F0] -translate-y-1/2 z-0 mx-8"></div>
              {/* Progress Line */}
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
                <span className={`text-[10px] font-semibold mt-1 transition-colors duration-300 ${step >= 1 ? "text-[#0B3D2E]" : "text-slate-400"}`}>Role</span>
              </div>

              {/* Step 2 */}
              <div className="flex flex-col items-center z-10 relative">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 ${
                  step >= 2 ? "bg-[#029154] text-white ring-4 ring-[#029154]/20" : "bg-white text-slate-400 border-2 border-slate-200"
                }`}>
                  2
                </div>
                <span className={`text-[10px] font-semibold mt-1 transition-colors duration-300 ${step >= 2 ? "text-[#0B3D2E]" : "text-slate-400"}`}>Pribadi</span>
              </div>

              {/* Step 3 */}
              <div className="flex flex-col items-center z-10 relative">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 ${
                  step >= 3 ? "bg-[#029154] text-white ring-4 ring-[#029154]/20" : "bg-white text-slate-400 border-2 border-slate-200"
                }`}>
                  3
                </div>
                <span className={`text-[10px] font-semibold mt-1 transition-colors duration-300 ${step >= 3 ? "text-[#0B3D2E]" : "text-slate-400"}`}>Akun</span>
              </div>
            </div>

            {/* STEP 1: PILIH ROLE */}
            {step === 1 && (
              <div>
                <span className="block text-xs font-semibold text-[#0B3D2E] mb-2">
                  Pilih Peran/Role Anda :
                </span>
                <div className="grid grid-cols-2 gap-2.5">
                  {/* Card Petani */}
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

                  {/* Card Nelayan */}
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

                  {/* Card Petani Binaan */}
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

                  {/* Card Nelayan Binaan */}
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

                  {/* Card Pembeli */}
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
                  {/* Nama Lengkap */}
                  <div>
                    <label htmlFor="fullName" className="mb-1 block text-xs font-semibold text-[#0B3D2E]">
                      Nama Lengkap :
                    </label>
                    <input
                      id="fullName"
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Masukkan nama lengkap anda"
                      className="w-full rounded-full border border-[#BFD9CC] bg-[#EAF6F1] px-4 py-2 text-xs text-[#0B3D2E] placeholder:text-[#7FA893] outline-none focus:border-[#1F6B3C] focus:ring-2 focus:ring-[#1F6B3C]/20"
                    />
                  </div>

                  {/* Nomor HP */}
                  <div>
                    <label htmlFor="phone" className="mb-1 block text-xs font-semibold text-[#0B3D2E]">
                      Nomor HP :
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Masukkan nomor hp anda"
                      className="w-full rounded-full border border-[#BFD9CC] bg-[#EAF6F1] px-4 py-2 text-xs text-[#0B3D2E] placeholder:text-[#7FA893] outline-none focus:border-[#1F6B3C] focus:ring-2 focus:ring-[#1F6B3C]/20"
                    />
                  </div>

                  {/* Tanggal Lahir */}
                  <div>
                    <label htmlFor="birthDate" className="mb-1 block text-xs font-semibold text-[#0B3D2E]">
                      Tanggal Lahir :
                    </label>
                    <input
                      id="birthDate"
                      type="date"
                      value={birthDate}
                      onChange={(e) => setBirthDate(e.target.value)}
                      className="w-full rounded-full border border-[#BFD9CC] bg-[#EAF6F1] px-4 py-2 text-xs text-[#0B3D2E] placeholder:text-[#7FA893] outline-none focus:border-[#1F6B3C] focus:ring-2 focus:ring-[#1F6B3C]/20"
                    />
                  </div>

                  {/* Jenis Kelamin */}
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

                  {/* Alamat Lengkap */}
                  <div>
                    <label htmlFor="address" className="mb-1 block text-xs font-semibold text-[#0B3D2E]">
                      Alamat Lengkap :
                    </label>
                    <textarea
                      id="address"
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
                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="mb-1 block text-xs font-semibold text-[#0B3D2E]">
                      Email :
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Masukkan email anda"
                      className="w-full rounded-full border border-[#BFD9CC] bg-[#EAF6F1] px-4 py-2.5 text-xs text-[#0B3D2E] placeholder:text-[#7FA893] outline-none focus:border-[#1F6B3C] focus:ring-2 focus:ring-[#1F6B3C]/20"
                    />
                  </div>

                  {/* Password */}
                  <div>
                    <label htmlFor="password" className="mb-1 block text-xs font-semibold text-[#0B3D2E]">
                      Password :
                    </label>
                    <div className="relative">
                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Masukkan password anda"
                        className="w-full rounded-full border border-[#BFD9CC] bg-[#EAF6F1] px-4 py-2.5 pr-11 text-xs text-[#0B3D2E] placeholder:text-[#7FA893] outline-none focus:border-[#1F6B3C] focus:ring-2 focus:ring-[#1F6B3C]/20"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#1F6B3C]"
                        aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  {/* Konfirmasi Password */}
                  <div>
                    <label htmlFor="confirmPassword" className="mb-1 block text-xs font-semibold text-[#0B3D2E]">
                      Konfirmasi Password :
                    </label>
                    <div className="relative">
                      <input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Masukkan ulang password anda"
                        className="w-full rounded-full border border-[#BFD9CC] bg-[#EAF6F1] px-4 py-2.5 pr-11 text-xs text-[#0B3D2E] placeholder:text-[#7FA893] outline-none focus:border-[#1F6B3C] focus:ring-2 focus:ring-[#1F6B3C]/20"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword((v) => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#1F6B3C]"
                        aria-label={showConfirmPassword ? "Sembunyikan password" : "Tampilkan password"}
                      >
                        {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                </div>

                {errorMsg && (
                  <div className="mt-3 text-red-500 text-xs text-center font-semibold bg-red-50 p-2 rounded">
                    {errorMsg}
                  </div>
                )}

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
                    disabled={loading || !email || !password || !confirmPassword}
                    className={`flex-1 rounded-full py-2.5 text-base font-bold text-white shadow-md transition flex items-center justify-center gap-2 ${loading || !email || !password || !confirmPassword ? 'opacity-70 cursor-not-allowed' : 'hover:opacity-90'}`}
                    style={{
                      background: "linear-gradient(90deg, #B1E747 0%, #3F7E48 50%, #024D70 100%)",
                    }}
                  >
                    {loading ? 'Memproses...' : 'Daftar'}
                  </button>
                </div>
              </div>
            )}

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

      {/* Right panel — Gradient + Logo */}
      <div
        className="relative hidden md:flex md:w-[calc(50%+40px)] md:h-screen md:-ml-10 flex-col justify-between overflow-hidden pl-[104px] pr-16 py-16"
        style={{
          background:
            "linear-gradient(225deg, #B1E747 0%, #3F7E48 50%, #024D70 100%)",
        }}
      >
        {/* Decorative shapes */}
        {/* Vector — kiri atas */}
        <img
          src={vectorShape}
          alt=""
          className="pointer-events-none absolute left-10 top-16 w-40 opacity-80 mix-blend-screen -scale-x-100"
        />
        {/* Ellipse 181 — kanan bawah (menempel pojok) */}
        <img
          src={ellipse181}
          alt=""
          className="pointer-events-none absolute bottom-0 right-0 w-52 opacity-70 mix-blend-screen -scale-x-100"
        />
        {/* Vector — kanan bawah, di samping ellipse */}
        <img
          src={vectorShape}
          alt=""
          className="pointer-events-none absolute bottom-8 right-32 w-36 opacity-80 mix-blend-screen -scale-x-100"
        />

        {/* Ellipse 182 — kiri atas (tenggelam) */}
        <img
          src={ellipse182}
          alt=""
          className="pointer-events-none absolute -top-24 -left-24 w-96 opacity-70 mix-blend-screen -scale-x-100"
        />

        <div className="relative z-10 flex flex-1 flex-col items-center justify-center text-center">
          <img src={logo} alt="TaniNelayan" className="mb-2 h-40 w-40 object-contain" />
          <h1 className="text-4xl font-bold text-white tracking-tight">
            TaniNelayan
          </h1>
          <p className="mt-4 max-w-xs text-sm text-white/85">
            Membangun Masa Depan Pertanian dan Perikanan Indonesia
          </p>
        </div>

        <div className="relative z-10 flex flex-col items-center gap-4 pb-4">
          <p className="text-sm text-white/90">
            Sudah punya akun? Masuk disini
          </p>
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
  );
}
