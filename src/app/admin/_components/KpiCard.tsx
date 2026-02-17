"use client";

export default function KpiCard({
  title,
  value,
  subtitle,
  accent = "default",
}: {
  title: string;
  value: string | number;
  subtitle?: string;
  accent?: "default" | "green" | "red" | "amber" | "gold";
}) {
  const accents = {
    default: "text-white",
    green: "text-emerald-400",
    red: "text-red-400",
    amber: "text-amber-400",
    gold: "text-[#d4a843]",
  };

  return (
    <div className="glass rounded-xl p-5 hover:bg-white/[0.05] transition-colors duration-200">
      <p className="text-[11px] font-medium text-[#6b7394] uppercase tracking-wider">
        {title}
      </p>
      <p className={`mt-2 text-2xl font-bold ${accents[accent]}`}>{value}</p>
      {subtitle && (
        <p className="mt-1 text-[11px] text-[#4a5068]">{subtitle}</p>
      )}
    </div>
  );
}
