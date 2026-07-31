
const variantStyles = {
  emerald: "bg-emerald-100 text-emerald-700 border border-emerald-200",
  blue: "bg-sky-100 text-sky-700 border border-sky-200",
  yellow: "bg-amber-100 text-amber-700 border border-amber-200",
  red: "bg-red-100 text-red-700 border border-red-200",
};

export default function PetaniStatusBadge({ children, variant = "emerald" }) {
  return <span className={`inline-flex items-center rounded px-3 py-1 text-xs font-semibold ${variantStyles[variant] || variantStyles.emerald}`}>{children}</span>;
}
