import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/layout/Sidebar";
import api from "../../config/axios";
import { X, Upload, Loader2 } from "lucide-react";

const storageUrl = (path) => (path ? `http://localhost:8000/storage/${path}` : "/images/user.png");

export default function KoperasiProfilPage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [editForm, setEditForm] = useState({});
  const fileInputRef = useRef(null);

  useEffect(() => {
    let active = true;
    api
      .get("/user")
      .then((response) => {
        if (active) setProfile(response.data);
      })
      .catch((error) => {
        console.error("Gagal mengambil profil", error);
        if (active) setProfile(null);
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const handleOpenEdit = () => {
    if (!profile) return;
    setEditForm({
      nama_lengkap: profile.nama_lengkap,
      nik: profile.nik,
      no_hp: profile.no_hp,
      alamat: profile.alamat,
      tanggal_lahir: profile.tanggal_lahir,
      kelamin: profile.kelamin,
      rekening: profile.rekening,
      kode_pos: profile.kode_pos,
    });
    setPreviewImage(storageUrl(profile.foto_profil));
    setIsEditOpen(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditForm((prev) => ({ ...prev, foto: file }));
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const payload = new FormData();
    Object.keys(editForm).forEach((key) => {
      if (editForm[key] !== null && editForm[key] !== "" && key !== "foto") {
        payload.append(key, editForm[key]);
      }
    });
    if (editForm.foto) payload.append("foto_profil", editForm.foto);
    payload.append("_method", "PUT");

    try {
      await api.post("/user", payload, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      const response = await api.get("/user");
      setProfile(response.data);
      setIsEditOpen(false);
    } catch (error) {
      console.error("Gagal update profil:", error);
      alert(error.response?.data?.message || "Gagal memperbarui profil.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = async () => {
    try {
      await api.post("/logout");
    } catch (error) {
      console.error("Gagal logout:", error);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login");
    }
  };

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
            <h2 className="text-[24px] font-semibold text-[#005941]">Profil Koperasi</h2>
            <img 
              src={storageUrl(profile.foto_profil)} 
              alt="avatar" 
              className="w-10 h-10 rounded-full border border-slate-100 object-cover translate-y-[4px]"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/images/user.png";
              }}
            />
          </div>

          {/* Inner Profile Card Container */}
          <div className="bg-white/50 border border-[#029154] shadow-[0_0_4px_rgba(0,0,0,0.25)] rounded-[20px] p-8 relative">
            
            {/* Edit Icon Button (Top Right Inside Card) */}
            <button onClick={handleOpenEdit} className="absolute top-6 right-6 text-[#005941] hover:opacity-80 transition">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>

            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
              {/* Profile Image */}
              <div className="flex-shrink-0">
                <img
                  src={storageUrl(profile.foto_profil)}
                  alt={profile.nama_lengkap}
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
                  {profile.nama_lengkap}
                </h2>

                <div className="space-y-3 text-[16px] text-[#273B4A]">
                  <div className="grid grid-cols-1 sm:grid-cols-12 items-center">
                    <span className="font-semibold sm:col-span-4">Nik :</span>
                    <span className="sm:col-span-8 font-medium">{profile.nik || "Tidak ada NIK"}</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-12 items-center">
                    <span className="font-semibold sm:col-span-4">No Hp :</span>
                    <span className="sm:col-span-8 font-medium">{profile.no_hp}</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-12 items-center">
                    <span className="font-semibold sm:col-span-4">Alamat :</span>
                    <span className="sm:col-span-8 font-medium">{profile.alamat || "-"}</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-12 items-center">
                    <span className="font-semibold sm:col-span-4">Tanggal Lahir :</span>
                    <span className="sm:col-span-8 font-medium">{profile.tanggal_lahir || "-"}</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-12 items-center">
                    <span className="font-semibold sm:col-span-4">Rekening :</span>
                    <span className="sm:col-span-8 font-medium">{profile.rekening || "Tidak ada rekening"}</span>
                  </div>
                </div>

                {/* Logout Button (Bottom Right) */}
                <div className="flex justify-end mt-8">
                  <button onClick={handleLogout} className="flex items-center gap-2 bg-[#005941] hover:bg-[#004230] text-white px-6 py-2.5 rounded-[12px] font-semibold text-[15px] transition shadow-sm">
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

      {/* MODAL EDIT PROFIL */}
      {isEditOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-[700px] rounded-[20px] p-8 shadow-2xl relative my-auto">
            <div className="flex items-center justify-between mb-6 border-b border-[#029154] pb-4">
              <h2 className="text-[22px] font-semibold text-[#005941]">Edit Profil Koperasi</h2>
              <button onClick={() => setIsEditOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 transition">
                <X className="w-6 h-6 text-slate-500" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-6">
              <div className="flex flex-col items-center gap-3">
                <div 
                  className="w-[120px] h-[120px] rounded-full border-2 border-dashed border-[#006638] bg-emerald-50 flex flex-col items-center justify-center overflow-hidden cursor-pointer hover:bg-emerald-100 transition relative"
                  onClick={() => fileInputRef.current.click()}
                >
                  {previewImage ? (
                    <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <><Upload className="w-6 h-6 text-[#006638] mb-1" /><span className="text-[11px] font-semibold text-[#006638] text-center px-2">Upload<br/>Foto Profil</span></>
                  )}
                </div>
                <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[14px] font-bold text-[#273B4A] mb-1.5">Nama Lengkap</label>
                  <input type="text" name="nama_lengkap" value={editForm.nama_lengkap || ""} onChange={handleInputChange} className="w-full border border-gray-300 rounded-[8px] p-2.5 text-[14px] font-medium outline-none focus:border-[#006638]" required />
                </div>
                <div>
                  <label className="block text-[14px] font-bold text-[#273B4A] mb-1.5">NIK</label>
                  <input type="text" name="nik" value={editForm.nik || ""} onChange={handleInputChange} className="w-full border border-gray-300 rounded-[8px] p-2.5 text-[14px] font-medium outline-none focus:border-[#006638]" />
                </div>
                <div>
                  <label className="block text-[14px] font-bold text-[#273B4A] mb-1.5">Nomor HP</label>
                  <input type="text" name="no_hp" value={editForm.no_hp || ""} onChange={handleInputChange} className="w-full border border-gray-300 rounded-[8px] p-2.5 text-[14px] font-medium outline-none focus:border-[#006638]" required />
                </div>
                <div>
                  <label className="block text-[14px] font-bold text-[#273B4A] mb-1.5">Tanggal Lahir</label>
                  <input type="date" name="tanggal_lahir" value={editForm.tanggal_lahir || ""} onChange={handleInputChange} className="w-full border border-gray-300 rounded-[8px] p-2.5 text-[14px] font-medium outline-none focus:border-[#006638]" />
                </div>
                <div>
                  <label className="block text-[14px] font-bold text-[#273B4A] mb-1.5">Jenis Kelamin</label>
                  <select name="kelamin" value={editForm.kelamin || ""} onChange={handleInputChange} className="w-full border border-gray-300 rounded-[8px] p-2.5 text-[14px] font-medium outline-none focus:border-[#006638] bg-white">
                    <option value="Laki-laki">Laki-laki</option>
                    <option value="Perempuan">Perempuan</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[14px] font-bold text-[#273B4A] mb-1.5">Nomor Rekening</label>
                  <input type="text" name="rekening" value={editForm.rekening || ""} onChange={handleInputChange} className="w-full border border-gray-300 rounded-[8px] p-2.5 text-[14px] font-medium outline-none focus:border-[#006638]" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[14px] font-bold text-[#273B4A] mb-1.5">Alamat Lengkap</label>
                  <textarea name="alamat" value={editForm.alamat || ""} onChange={handleInputChange} rows="3" className="w-full border border-gray-300 rounded-[8px] p-2.5 text-[14px] font-medium outline-none focus:border-[#006638] resize-none" />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 mt-6">
                <button type="button" onClick={() => setIsEditOpen(false)} disabled={isSubmitting} className="px-6 py-2 border border-slate-300 text-slate-600 rounded-[8px] font-semibold hover:bg-slate-50 transition disabled:opacity-50">Batal</button>
                <button type="submit" disabled={isSubmitting} className="px-6 py-2 bg-[#006638] text-white rounded-[8px] font-semibold hover:bg-emerald-800 transition shadow-sm disabled:opacity-50 flex items-center gap-2">
                  {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
