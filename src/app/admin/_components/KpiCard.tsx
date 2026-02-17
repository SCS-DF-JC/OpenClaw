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
  accent?: "default" | "green" | "red" | "amber";
}) {
  const accents = {
    default: "text-white",
    green: "text-emerald-400",
    red: "text-red-400",
    amber: "text-amber-400",
  };

  return (
    <div className="rounded-xl bg-gray-800/60 border border-gray-700/50 p-5">
      <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
        {title}
      </p>
      <p className={`mt-2 text-2xl font-bold ${accents[accent]}`}>{value}</p>
      {subtitle && (
        <p className="mt-1 text-xs text-gray-500">{subtitle}</p>
      )}
    </div>
  );
}
