"use client";

const variants: Record<string, string> = {
  // Success / online
  online: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20",
  running: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20",
  success: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20",
  connected: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20",
  active: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20",
  // Warning
  degraded: "bg-amber-500/15 text-amber-400 border border-amber-500/20",
  warning: "bg-amber-500/15 text-amber-400 border border-amber-500/20",
  pending: "bg-amber-500/15 text-amber-400 border border-amber-500/20",
  // Error / offline
  offline: "bg-red-500/15 text-red-400 border border-red-500/20",
  stopped: "bg-red-500/15 text-red-400 border border-red-500/20",
  failed: "bg-red-500/15 text-red-400 border border-red-500/20",
  error: "bg-red-500/15 text-red-400 border border-red-500/20",
  // Neutral
  unknown: "bg-white/[0.06] text-[#8890a4] border border-white/[0.08]",
  info: "bg-blue-500/15 text-blue-400 border border-blue-500/20",
  // Categories
  task: "bg-blue-500/15 text-blue-400 border border-blue-500/20",
  tool_call: "bg-purple-500/15 text-purple-400 border border-purple-500/20",
  system: "bg-white/[0.06] text-[#b8bcc8] border border-white/[0.08]",
};

export default function StatusBadge({
  label,
  className = "",
}: {
  label: string;
  className?: string;
}) {
  const style = variants[label.toLowerCase()] ?? variants.unknown;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium ${style} ${className}`}
    >
      <span className="inline-block w-1.5 h-1.5 rounded-full bg-current" />
      {label}
    </span>
  );
}
