import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, CheckCheck, Loader2 } from "lucide-react";
import api from "../../config/axios";

export default function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await api.get("/notifications");
      setNotifications(res.data.data || []);
      setUnreadCount(res.data.unread_count || 0);
    } catch (error) {
      console.error("Gagal memuat notifikasi:", error);
    }
  }, []);

  useEffect(() => {
    Promise.resolve().then(fetchNotifications);
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleOpenItem = async (n) => {
    if (!n.dibaca) {
      try {
        await api.put(`/notifications/${n.id}/read`);
        setUnreadCount((c) => Math.max(0, c - 1));
        setNotifications((prev) =>
          prev.map((x) => (x.id === n.id ? { ...x, dibaca: true } : x))
        );
      } catch (error) {
        console.error("Gagal menandai notifikasi:", error);
      }
    }
    if (n.link) {
      navigate(n.link);
    }
    setIsOpen(false);
  };

  const handleMarkAllRead = async () => {
    setIsLoading(true);
    try {
      await api.put("/notifications/read-all");
      setUnreadCount(0);
      setNotifications((prev) => prev.map((x) => ({ ...x, dibaca: true })));
    } catch (error) {
      console.error("Gagal menandai semua notifikasi:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleString("id-ID", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen((v) => !v)}
        className="relative w-10 h-10 flex items-center justify-center rounded-full bg-white border border-slate-200 hover:bg-slate-50 transition text-[#273B4A]"
        title="Notifikasi"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-12 w-[340px] max-w-[90vw] bg-white rounded-[16px] shadow-[0_8px_30px_rgba(0,0,0,0.18)] border border-slate-200 overflow-hidden z-50">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
            <span className="text-[14px] font-bold text-[#273B4A]">Notifikasi</span>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                disabled={isLoading}
                className="flex items-center gap-1 text-[12px] font-semibold text-[#006638] hover:underline disabled:opacity-50"
              >
                {isLoading ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <CheckCheck className="w-3.5 h-3.5" />
                )}
                Tandai semua dibaca
              </button>
            )}
          </div>

          <div className="max-h-[360px] overflow-y-auto custom-scrollbar">
            {notifications.length === 0 ? (
              <div className="px-4 py-10 text-center text-[13px] text-slate-400 font-medium">
                Belum ada notifikasi.
              </div>
            ) : (
              notifications.map((n) => (
                <button
                  key={n.id}
                  onClick={() => handleOpenItem(n)}
                  className={`w-full text-left px-4 py-3 border-b border-slate-50 last:border-0 hover:bg-emerald-50/40 transition ${
                    n.dibaca ? "" : "bg-[#006638]/5"
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {!n.dibaca && (
                      <span className="mt-1.5 w-2 h-2 rounded-full bg-[#006638] shrink-0" />
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="text-[13px] font-bold text-[#273B4A]">{n.judul}</div>
                      {n.pesan && (
                        <div className="text-[12px] text-slate-500 mt-0.5 line-clamp-2">{n.pesan}</div>
                      )}
                      <div className="text-[11px] text-slate-400 mt-1">{formatTime(n.created_at)}</div>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
