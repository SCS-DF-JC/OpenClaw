"use client";

import { useEffect, useState } from "react";
import StatusBadge from "../_components/StatusBadge";
import SkeletonLoader from "../_components/SkeletonLoader";
import { useToast } from "../_components/ToastProvider";
import { getServiceStatuses } from "@/lib/api";
import type { ServiceStatus } from "@/lib/types";

export default function StatusPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [services, setServices] = useState<ServiceStatus[]>([]);
  const [diagRunning, setDiagRunning] = useState(false);
  const [diagResult, setDiagResult] = useState<string | null>(null);

  async function fetchStatuses() {
    setLoading(true);
    try {
      const data = await getServiceStatuses();
      setServices(data);
    } catch {
      toast("Failed to fetch service statuses", "error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchStatuses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const runDiagnostics = async () => {
    setDiagRunning(true);
    setDiagResult(null);
    toast("Running diagnostics…", "info");

    await new Promise((r) => setTimeout(r, 2000));
    const data = await getServiceStatuses();
    setServices(data);

    const report = [
      "╔══════════════════════════════════════════╗",
      "║     SCS Command Center — Diagnostics     ║",
      "╚══════════════════════════════════════════╝",
      "",
      `Report generated: ${new Date().toISOString()}`,
      "",
      ...data.map(
        (s) =>
          `  ${s.status === "online" ? "✓" : s.status === "degraded" ? "⚠" : "✗"} ${s.name.padEnd(30)} ${s.status.padEnd(12)} ${s.latencyMs !== undefined ? `${s.latencyMs}ms` : "—"}`
      ),
      "",
      `Overall: ${data.every((s) => s.status === "online") ? "ALL SYSTEMS OPERATIONAL" : "ISSUES DETECTED"}`,
    ].join("\n");

    setDiagResult(report);
    setDiagRunning(false);
    toast("Diagnostics complete", "success");
  };

  const copyReport = () => {
    if (diagResult) {
      navigator.clipboard.writeText(diagResult);
      toast("Copied to clipboard", "success");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">System Status</h2>
        <div className="flex items-center gap-3">
          <button
            onClick={runDiagnostics}
            disabled={diagRunning}
            className="btn-gold px-4 py-2 text-xs rounded-lg disabled:opacity-50"
          >
            {diagRunning ? "Running…" : "Run Diagnostics"}
          </button>
          {diagResult && (
            <button
              onClick={copyReport}
              className="btn-silver px-4 py-2 text-xs rounded-lg"
            >
              Copy Report
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <SkeletonLoader lines={5} />
      ) : (
        <div className="glass rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[#6b7394] text-xs border-b border-white/[0.06] bg-white/[0.02]">
                <th className="text-left py-3 px-5 font-medium">Service</th>
                <th className="text-left py-3 px-5 font-medium">Status</th>
                <th className="text-left py-3 px-5 font-medium">Latency</th>
                <th className="text-left py-3 px-5 font-medium">
                  Last Checked
                </th>
              </tr>
            </thead>
            <tbody>
              {services.map((svc) => (
                <tr
                  key={svc.name}
                  className="table-row-zebra border-b border-white/[0.03]"
                >
                  <td className="py-3.5 px-5 text-[#d1d5db] font-medium">
                    {svc.name}
                  </td>
                  <td className="py-3.5 px-5">
                    <StatusBadge label={svc.status} />
                  </td>
                  <td className="py-3.5 px-5 text-[#8890a4] font-mono text-xs">
                    {svc.latencyMs !== undefined ? `${svc.latencyMs}ms` : "—"}
                  </td>
                  <td className="py-3.5 px-5 text-[#6b7394] text-xs">
                    {new Date(svc.lastCheck).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {diagResult && (
        <div className="glass rounded-xl p-5">
          <h3 className="text-sm font-medium text-[#b8bcc8] mb-3">
            Diagnostics Report
          </h3>
          <pre className="bg-white/[0.02] border border-white/[0.04] rounded-lg p-4 text-xs text-[#d4a843] font-mono overflow-auto whitespace-pre">
            {diagResult}
          </pre>
        </div>
      )}
    </div>
  );
}
