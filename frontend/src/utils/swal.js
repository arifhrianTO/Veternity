import Swal from "sweetalert2";

/**
 * Hapus overlay Midtrans Snap yang mungkin masih tertinggal di DOM,
 * agar SweetAlert tidak tertutup olehnya.
 */
export function cleanupSnapOverlay() {
  document.getElementById("snap-midtrans")?.remove();
  document.querySelector(".snap-midtrans")?.remove();
}

const base = {
  confirmButtonColor: "#006638",
  cancelButtonColor: "#64748b",
  confirmButtonText: "OK",
  customClass: {
    popup: "font-['Montserrat']",
    confirmButton: "swal-confirm-btn",
  },
};

export function swalSuccess(title, text = "") {
  return Swal.fire({ ...base, icon: "success", title, text });
}

export function swalError(title, text = "") {
  return Swal.fire({ ...base, icon: "error", title, text });
}

export function swalWarning(title, text = "") {
  return Swal.fire({ ...base, icon: "warning", title, text });
}

export function swalInfo(title, text = "") {
  return Swal.fire({ ...base, icon: "info", title, text });
}
