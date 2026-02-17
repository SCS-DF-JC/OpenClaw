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

    // Simulate diagnostic run
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
        <h2 className="text-xl font-semibold">System Status</h2>
        <div className="flex items-center gap-3">
          <button
            onClick={runDiagnostics}
            disabled={diagRunning}
            className="px-4 py-2 text-xs rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50 transition"
          >
            {diagRunning ? "Running…" : "Run Diagnostics"}
          </button>
          {diagResult && (
            <button
              onClick={copyReport}
              className="px-4 py-2 text-xs rounded-lg bg-gray-700 text-gray-300 hover:bg-gray-600 transition"
            >
              Copy Report
            </button>
          )}
        </div>
      </div>

      {/* Services Table */}
      {loading ? (
        <SkeletonLoader lines={5} />
      ) : (
        <div className="rounded-xl bg-gray-800/60 border border-gray-700/50 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-500 text-xs border-b border-gray-700/50 bg-gray-900/30">
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
                  className="border-b border-gray-800/50 hover:bg-gray-800/30"
                >
                  <td className="py-3.5 px-5 text-gray-200 font-medium">
                    {svc.name}
                  </td>
                  <td className="py-3.5 px-5">
                    <StatusBadge label={svc.status} />
                  </td>
                  <td className="py-3.5 px-5 text-gray-400 font-mono text-xs">
                    {svc.latencyMs !== undefined ? `${svc.latencyMs}ms` : "—"}
                  </td>
                  <td className="py-3.5 px-5 text-gray-500 text-xs">
                    {new Date(svc.lastCheck).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Diagnostics Output */}
      {diagResult && (
        <div className="rounded-xl bg-gray-800/60 border border-gray-700/50 p-5">
          <h3 className="text-sm font-medium text-gray-300 mb-3">
            Diagnostics Report
          </h3>
          <pre className="bg-gray-900 rounded-lg p-4 text-xs text-emerald-400 font-mono overflow-auto whitespace-pre">
            {diagResult}
          </pre>
        </div>
      )}
    </div>
  );
}
