import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import vectorShape from "../assets/Vector.png";
import logo from "../assets/logo.png";
import ellipse181 from "../assets/Ellipse_181.png";
import ellipse182 from "../assets/Ellipse_182.png";
import ellipse179 from "../assets/Ellipse_179.png";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:8000/api/login", {
        identifier: emailOrPhone,
        password: password,
      });

      const { data, access_token } = response.data;
      
      // Simpan token & info user ke localStorage
      localStorage.setItem("token", access_token);
      localStorage.setItem("user", JSON.stringify(data));

      // Redirect berdasarkan role
      if (data.role === 'petani' || data.role === 'petani_binaan') {
        navigate("/petani/dashboard");
      } else if (data.role === 'pembeli') {
        navigate("/pembeli/marketplace");
      } else {
        navigate("/"); // fallback
      }

    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setErrorMsg(error.response.data.message);
      } else {
        setErrorMsg("Terjadi kesalahan saat login.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex" style={{ background: "linear-gradient(135deg, #B1E747 0%, #3F7E48 50%, #024D70 100%)" }}>
      {/* Left panel */}
      <div
        className="relative hidden md:flex md:w-[calc(50%+40px)] md:-mr-10 flex-col justify-between overflow-hidden pl-16 pr-[104px] py-16"
        style={{
          background:
            "linear-gradient(135deg, #B1E747 0%, #3F7E48 50%, #024D70 100%)",
        }}
      >
        {/* Decorative shapes */}
        {/* Vector — kanan atas */}
        <img
          src={vectorShape}
          alt=""
          className="pointer-events-none absolute right-10 top-16 w-40 opacity-80 mix-blend-screen"
        />
        {/* Ellipse 181 — kiri bawah (menempel pojok) */}
        <img
          src={ellipse181}
          alt=""
          className="pointer-events-none absolute bottom-0 left-0 w-52 opacity-70 mix-blend-screen"
        />
        {/* Vector — kiri bawah, di samping ellipse */}
        <img
          src={vectorShape}
          alt=""
          className="pointer-events-none absolute bottom-8 left-32 w-36 opacity-80 mix-blend-screen"
        />

        {/* Ellipse 182 — kanan atas (tenggelam) */}
        <img
          src={ellipse182}
          alt=""
          className="pointer-events-none absolute -top-24 -right-24 w-96 opacity-70 mix-blend-screen"
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
            Belum punya akun? Daftar disini
          </p>
          <button
            type="button"
            onClick={() => navigate("/register")}
            className="w-64 rounded-full border-2 border-white py-3 text-lg font-bold text-white transition hover:bg-white hover:text-[#024D70]"
          >
            Daftar
          </button>
        </div>
      </div>

      {/* Right panel */}
      <div className="relative flex w-full md:w-1/2 items-center justify-center overflow-hidden bg-[#F4F4EE] px-6 py-12 sm:px-12 md:rounded-l-[40px] md:z-10">
        {/* Ellipse 179 — kanan bawah */}
        <img
          src={ellipse179}
          alt=""
          className="pointer-events-none absolute bottom-0 right-0 w-80 opacity-90"
        />
        {/* Ellipse 179 — kiri atas */}
        <img
          src={ellipse179}
          alt=""
          className="pointer-events-none absolute -top-16 -left-16 w-80 opacity-90 rotate-180"
        />
        <form onSubmit={handleSubmit} className="relative z-10 w-full max-w-md">
          <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-[#273B4A] to-[#029154] bg-clip-text text-transparent">
            Selamat Datang!
          </h1>
          <p className="mt-2 text-[#5C8A73] text-center">
            Silahkan Masuk ke akun anda
          </p>

          <div className="mt-10">
            <label
              htmlFor="emailOrPhone"
              className="mb-2 block text-sm font-medium text-[#0B3D2E]"
            >
              Email atau Nomor HP :
            </label>
            <input
              id="emailOrPhone"
              type="text"
              value={emailOrPhone}
              onChange={(e) => setEmailOrPhone(e.target.value)}
              placeholder="Masukkan email atau nomor hp anda"
              className="w-full rounded-full border border-[#BFD9CC] bg-[#EAF6F1] px-4 py-3 text-sm text-[#0B3D2E] placeholder:text-[#7FA893] outline-none focus:border-[#1F6B3C] focus:ring-2 focus:ring-[#1F6B3C]/20"
            />
          </div>

          <div className="mt-6">
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-[#0B3D2E]"
            >
              Password :
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan password anda"
                className="w-full rounded-full border border-[#BFD9CC] bg-[#EAF6F1] px-4 py-3 pr-11 text-sm text-[#0B3D2E] placeholder:text-[#7FA893] outline-none focus:border-[#1F6B3C] focus:ring-2 focus:ring-[#1F6B3C]/20"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#1F6B3C]"
                aria-label={
                  showPassword ? "Sembunyikan password" : "Tampilkan password"
                }
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <Link
                to="/"
                className="inline-flex items-center gap-1 text-sm text-[#5C8A73] hover:text-[#0B3D2E] transition-colors"
              >
                &larr; Kembali ke Beranda
              </Link>
              <button
                type="button"
                className="text-sm text-[#0B3D2E] hover:underline"
              >
                Lupa password?
              </button>
            </div>
            
            {errorMsg && (
              <div className="mt-4 text-red-500 text-sm text-center font-semibold bg-red-50 p-2 rounded">
                {errorMsg}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || !emailOrPhone || !password}
            className={`mt-8 w-full rounded-full py-4 text-lg font-bold text-white shadow-md transition ${loading || !emailOrPhone || !password ? 'opacity-70 cursor-not-allowed' : 'hover:opacity-90'}`}
            style={{
              background:
                "linear-gradient(90deg, #024D70 0%, #3F7E48 50%, #B1E747 100%)",
            }}
          >
            {loading ? 'Memproses...' : 'Masuk'}
          </button>
        </form>
      </div>
    </div>
  );
}
