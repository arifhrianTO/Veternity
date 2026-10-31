import { useUser } from "../../hooks/useUser";
import { storageUrl } from "../../config/storage";
import NotificationBell from "../common/NotificationBell";

export default function PageHeader({ title, subtitle, simple = false }) {
  const user = useUser();

  return (
    <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#029154]">
      <div className="min-w-0">
        <h1 className="text-[24px] font-semibold text-[#005941] truncate">{title}</h1>
        {subtitle && (
          <p className="text-[14px] text-slate-500 truncate">{subtitle}</p>
        )}
      </div>
      {!simple && (
        <div className="flex items-center gap-3">
          <NotificationBell />
          <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-100 flex-shrink-0">
            <img
              src={storageUrl(user?.foto_profil)}
              alt="avatar"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/images/user.png";
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
