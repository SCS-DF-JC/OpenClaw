"use client";

const variants: Record<string, string> = {
  // Status
  online: "bg-emerald-500/20 text-emerald-400",
  running: "bg-emerald-500/20 text-emerald-400",
  success: "bg-emerald-500/20 text-emerald-400",
  connected: "bg-emerald-500/20 text-emerald-400",
  // Warnings
  degraded: "bg-amber-500/20 text-amber-400",
  warning: "bg-amber-500/20 text-amber-400",
  pending: "bg-amber-500/20 text-amber-400",
  // Errors
  offline: "bg-red-500/20 text-red-400",
  stopped: "bg-red-500/20 text-red-400",
  failed: "bg-red-500/20 text-red-400",
  error: "bg-red-500/20 text-red-400",
  // Neutral
  unknown: "bg-gray-500/20 text-gray-400",
  info: "bg-blue-500/20 text-blue-400",
  // Categories
  task: "bg-blue-500/20 text-blue-400",
  tool_call: "bg-purple-500/20 text-purple-400",
  system: "bg-gray-500/20 text-gray-400",
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
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${style} ${className}`}
    >
      <span className="inline-block w-1.5 h-1.5 rounded-full bg-current" />
      {label}
    </span>
  );
}
