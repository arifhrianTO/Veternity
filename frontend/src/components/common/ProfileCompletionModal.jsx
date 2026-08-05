import { useState, useEffect, useRef } from "react";
import { Loader2, Camera, AlertCircle } from "lucide-react";
import api from "../../config/axios";
import { REQUIRED_FIELDS_BY_ROLE } from "../layout/DashboardGuard";

export default function ProfileCompletionModal({ user, onComplete }) {
  const requiredFields = REQUIRED_FIELDS_BY_ROLE[user?.role] || [];

  // Helper: cek apakah field wajib untuk role ini DAN belum diisi
  const isFieldRequired = (fieldName) => requiredFields.includes(fieldName);
  const isFieldMissing = (fieldName) => {
    return user[fieldName] === null || user[fieldName] === "" || user[fieldName] === undefined;
  };
  const shouldShow = (fieldName) => isFieldRequired(fieldName) && isFieldMissing(fieldName);

  // Determine which fields need to be filled
  const showFoto = shouldShow("foto_profil");
  const showNik = shouldShow("nik");
  const showRekening = shouldShow("rekening");
  const showProvinsi = shouldShow("provinsi_id");
  const showKota = shouldShow("kota_id");
  const showKodePos = shouldShow("kode_pos");
  const showKoperasi = shouldShow("koperasi_id");

  // Form States
  const [nik, setNik] = useState("");
  const [rekening, setRekening] = useState("");
  const [provinsiId, setProvinsiId] = useState(user?.provinsi_id || "");
  const [kotaId, setKotaId] = useState(user?.kota_id || "");
  const [kodePos, setKodePos] = useState("");
  const [koperasiId, setKoperasiId] = useState("");

  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);
  const [koperasiList, setKoperasiList] = useState([]);

  // File Upload State
  const [fotoFile, setFotoFile] = useState(null);
  const [fotoPreview, setFotoPreview] = useState("");
  const fileInputRef = useRef(null);

  // Status States
  const [isLoadingProvinces, setIsLoadingProvinces] = useState(false);
  const [isLoadingCities, setIsLoadingCities] = useState(false);
  const [isLoadingKoperasi, setIsLoadingKoperasi] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Fetch Provinces and Koperasi List (if applicable)
  useEffect(() => {
    const fetchInitialData = async () => {
      // Fetch Provinces if we need to show Provinsi or Kota
      if (showProvinsi || showKota) {
        setIsLoadingProvinces(true);
        try {
          const res = await api.get("/shipping/provinces");
          if (res.data && res.data.data) {
            setProvinces(res.data.data);
          }
        } catch (err) {
          console.error("Gagal mengambil data provinsi", err);
        } finally {
          setIsLoadingProvinces(false);
        }
      }

      // Fetch Koperasi list if we need to show cooperative selection
      if (showKoperasi) {
        setIsLoadingKoperasi(true);
        try {
          const res = await api.get("/koperasi-list");
          setKoperasiList(res.data || []);
        } catch (err) {
          console.error("Gagal mengambil data koperasi", err);
        } finally {
          setIsLoadingKoperasi(false);
        }
      }
    };

    fetchInitialData();
  }, [showProvinsi, showKota, showKoperasi]);

  // Fetch Cities when Province changes
  useEffect(() => {
    const selectedProvId = provinsiId || user?.provinsi_id;
    if (!selectedProvId) {
      setCities([]);
      return;
    }

    const fetchCities = async () => {
      setIsLoadingCities(true);
      try {
        const res = await api.get(`/shipping/cities/${selectedProvId}`);
        if (res.data && res.data.data) {
          setCities(res.data.data);
        }
      } catch (err) {
        console.error("Gagal mengambil data kota", err);
      } finally {
        setIsLoadingCities(false);
      }
    };

    fetchCities();
  }, [provinsiId, user?.provinsi_id]);

  // Handle Photo Change
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setErrorMsg("Ukuran file foto maksimal adalah 2MB!");
        return;
      }
      setFotoFile(file);
      setFotoPreview(URL.createObjectURL(file));
    }
  };

  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    const data = new FormData();
    // Laravel PUT workaround for multipart form data
    data.append("_method", "PUT");

    // Front-end validations & payload population
    if (showFoto) {
      if (!fotoFile) {
        setErrorMsg("Silakan unggah foto profil Anda!");
        return;
      }
      data.append("foto_profil", fotoFile);
    }
    if (showNik) {
      if (!nik || nik.length < 10) {
        setErrorMsg("NIK harus valid!");
        return;
      }
      data.append("nik", nik);
    }
    if (showRekening) {
      if (!rekening) {
        setErrorMsg("Nomor rekening harus diisi!");
        return;
      }
      data.append("rekening", rekening);
    }
    if (showProvinsi) {
      if (!provinsiId) {
        setErrorMsg("Silakan pilih provinsi Anda!");
        return;
      }
      data.append("provinsi_id", provinsiId);
    }
    if (showKota) {
      if (!kotaId) {
        setErrorMsg("Silakan pilih kota/kabupaten Anda!");
        return;
      }
      data.append("kota_id", kotaId);
    }
    if (showKodePos) {
      if (!kodePos) {
        setErrorMsg("Kode pos harus diisi!");
        return;
      }
      data.append("kode_pos", kodePos);
    }
    if (showKoperasi) {
      if (!koperasiId) {
        setErrorMsg("Silakan pilih koperasi binaan Anda!");
        return;
      }
      data.append("koperasi_id", koperasiId);
    }

    setIsSubmitting(true);
    try {
      const response = await api.post("/user", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.status === "success") {
        // Save the updated user object to localstorage
        localStorage.setItem("user", JSON.stringify(response.data.data));
        onComplete(response.data.data);
      } else {
        setErrorMsg(response.data.message || "Gagal memperbarui profil.");
      }
    } catch (err) {
      console.error("Gagal submit profil", err);
      if (err.response && err.response.data && err.response.data.message) {
        setErrorMsg(err.response.data.message);
      } else {
        setErrorMsg("Terjadi kesalahan koneksi ke server.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-[#0a1628]/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#F8F7F4] border border-[rgba(0,154,38,0.19)] rounded-[20px] shadow-[0_10px_30px_rgba(0,0,0,0.15)] w-full max-w-xl p-8 font-['Montserrat'] text-slate-800 overflow-y-auto max-h-[90vh] custom-scrollbar flex flex-col gap-5">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[#005941] tracking-tight">Lengkapi Profil Anda</h2>
          <p className="text-sm text-slate-500 mt-1.5 leading-relaxed">
            Sebelum dapat menggunakan layanan TaniNelayan, silakan lengkapi informasi profil wajib Anda terlebih dahulu.
          </p>
        </div>

        {errorMsg && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Avatar upload section */}
          {showFoto && (
            <div className="flex flex-col items-center gap-2 mb-2">
              <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                <div className="w-24 h-24 rounded-full bg-slate-100 border-2 border-dashed border-[#BFD9CC] flex items-center justify-center overflow-hidden hover:border-[#006638] transition-colors">
                  {fotoPreview ? (
                    <img src={fotoPreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <Camera className="w-8 h-8 text-slate-400 group-hover:text-[#006638] transition-colors" />
                  )}
                </div>
                <div className="absolute bottom-0 right-0 bg-[#006638] text-white p-1.5 rounded-full shadow-md hover:bg-[#004230] transition-colors">
                  <Camera className="w-4 h-4" />
                </div>
              </div>
              <span className="text-xs text-slate-400">Pilih Foto Profil (Maks. 2MB)</span>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handlePhotoChange}
                accept="image/*"
                className="hidden"
              />
            </div>
          )}

          {/* NIK & Rekening inputs */}
          {(showNik || showRekening) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {showNik && (
                <div className="flex flex-col gap-1">
                  <label className="text-[13px] font-bold text-[#0B3D2E]">NIK (No. KTP)</label>
                  <input
                    type="text"
                    placeholder="Masukkan 16 digit NIK"
                    value={nik}
                    onChange={(e) => setNik(e.target.value.replace(/\D/g, "").slice(0, 16))}
                    className="h-[42px] px-3.5 bg-white border border-[#BFD9CC] rounded-lg text-sm text-[#0B3D2E] focus:outline-none focus:ring-1 focus:ring-[#1F6B3C] focus:border-[#1F6B3C] font-semibold"
                    required
                  />
                </div>
              )}

              {showRekening && (
                <div className="flex flex-col gap-1">
                  <label className="text-[13px] font-bold text-[#0B3D2E]">No. Rekening</label>
                  <input
                    type="text"
                    placeholder="Nomor rekening bank"
                    value={rekening}
                    onChange={(e) => setRekening(e.target.value.replace(/\D/g, ""))}
                    className="h-[42px] px-3.5 bg-white border border-[#BFD9CC] rounded-lg text-sm text-[#0B3D2E] focus:outline-none focus:ring-1 focus:ring-[#1F6B3C] focus:border-[#1F6B3C] font-semibold"
                    required
                  />
                </div>
              )}
            </div>
          )}

          {/* Provinsi & Kota inputs */}
          {(showProvinsi || showKota) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {showProvinsi && (
                <div className="flex flex-col gap-1">
                  <label className="text-[13px] font-bold text-[#0B3D2E]">Provinsi</label>
                  <div className="relative">
                    <select
                      value={provinsiId}
                      onChange={(e) => setProvinsiId(e.target.value)}
                      disabled={isLoadingProvinces}
                      className="w-full h-[42px] px-3 bg-white border border-[#BFD9CC] rounded-lg text-sm text-[#0B3D2E] focus:outline-none focus:ring-1 focus:ring-[#1F6B3C] focus:border-[#1F6B3C] font-semibold cursor-pointer disabled:bg-slate-50"
                      required
                    >
                      <option value="">Pilih Provinsi</option>
                      {provinces.map((prov) => (
                        <option key={prov.id} value={prov.id}>
                          {prov.name}
                        </option>
                      ))}
                    </select>
                    {isLoadingProvinces && (
                      <Loader2 className="w-4 h-4 animate-spin text-[#006638] absolute right-3 top-3.5" />
                    )}
                  </div>
                </div>
              )}

              {showKota && (
                <div className="flex flex-col gap-1">
                  <label className="text-[13px] font-bold text-[#0B3D2E]">Kota / Kabupaten</label>
                  <div className="relative">
                    <select
                      value={kotaId}
                      onChange={(e) => setKotaId(e.target.value)}
                      disabled={(!provinsiId && !user?.provinsi_id) || isLoadingCities}
                      className="w-full h-[42px] px-3 bg-white border border-[#BFD9CC] rounded-lg text-sm text-[#0B3D2E] focus:outline-none focus:ring-1 focus:ring-[#1F6B3C] focus:border-[#1F6B3C] font-semibold cursor-pointer disabled:bg-slate-50 disabled:cursor-not-allowed"
                      required
                    >
                      <option value="">Pilih Kota</option>
                      {cities.map((city) => (
                        <option key={city.id} value={city.id}>
                          {city.name}
                        </option>
                      ))}
                    </select>
                    {isLoadingCities && (
                      <Loader2 className="w-4 h-4 animate-spin text-[#006638] absolute right-3 top-3.5" />
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Kode Pos & Koperasi inputs */}
          {(showKodePos || showKoperasi) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {showKodePos && (
                <div className="flex flex-col gap-1">
                  <label className="text-[13px] font-bold text-[#0B3D2E]">Kode Pos</label>
                  <input
                    type="text"
                    placeholder="Masukkan kode pos"
                    value={kodePos}
                    onChange={(e) => setKodePos(e.target.value.replace(/\D/g, "").slice(0, 5))}
                    className="h-[42px] px-3.5 bg-white border border-[#BFD9CC] rounded-lg text-sm text-[#0B3D2E] focus:outline-none focus:ring-1 focus:ring-[#1F6B3C] focus:border-[#1F6B3C] font-semibold"
                    required
                  />
                </div>
              )}

              {showKoperasi && (
                <div className="flex flex-col gap-1">
                  <label className="text-[13px] font-bold text-[#0B3D2E]">Koperasi Binaan</label>
                  <div className="relative">
                    <select
                      value={koperasiId}
                      onChange={(e) => setKoperasiId(e.target.value)}
                      disabled={isLoadingKoperasi}
                      className="w-full h-[42px] px-3 bg-white border border-[#BFD9CC] rounded-lg text-sm text-[#0B3D2E] focus:outline-none focus:ring-1 focus:ring-[#1F6B3C] focus:border-[#1F6B3C] font-semibold cursor-pointer disabled:bg-slate-50"
                      required
                    >
                      <option value="">Pilih Koperasi</option>
                      {koperasiList.map((kop) => (
                        <option key={kop.id} value={kop.id}>
                          {kop.nama_lengkap}
                        </option>
                      ))}
                    </select>
                    {isLoadingKoperasi && (
                      <Loader2 className="w-4 h-4 animate-spin text-[#006638] absolute right-3 top-3.5" />
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-[48px] bg-[#006638] hover:bg-[#00522c] disabled:bg-[#006638]/50 text-white rounded-lg text-[16px] font-bold transition flex items-center justify-center gap-2 mt-2 shadow-sm cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Menyimpan Profil...</span>
              </>
            ) : (
              <span>Simpan Profil & Lanjutkan</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
