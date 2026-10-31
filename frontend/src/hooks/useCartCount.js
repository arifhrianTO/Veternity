import { useCallback, useEffect, useState } from "react";
import api from "../config/axios";

/**
 * Hitung jumlah item di keranjang untuk badge pada navbar pembeli.
 * Aman dipanggil di halaman mana pun; kegagalan API tidak mengganggu UI.
 */
export function useCartCount() {
  const [count, setCount] = useState(0);

  const refresh = useCallback(async () => {
    try {
      const res = await api.get("/carts");
      const items = Array.isArray(res.data) ? res.data : res.data?.data || [];
      const total = items.reduce(
        (acc, item) => acc + Number(item.kuantitas || 0),
        0
      );
      setCount(total);
    } catch {
      setCount(0);
    }
  }, []);

  useEffect(() => {
    Promise.resolve().then(refresh);
  }, [refresh]);

  useEffect(() => {
    const handler = () => refresh();
    window.addEventListener("cart:updated", handler);
    return () => window.removeEventListener("cart:updated", handler);
  }, [refresh]);

  return { count, refresh };
}