"use client";

import { useEffect, useState } from "react";
import StatusBadge from "../_components/StatusBadge";
import EmptyState from "../_components/EmptyState";
import SkeletonLoader from "../_components/SkeletonLoader";
import { useToast } from "../_components/ToastProvider";
import { listLogs } from "@/lib/api";
import type { LogEntry, LogLevel } from "@/lib/types";

export default function LogsPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [level, setLevel] = useState<LogLevel | "">("");
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  async function fetchLogs() {
    setLoading(true);
    try {
      const data = await listLogs({
        level: level || undefined,
        search: search || undefined,
      });
      setLogs(data);
    } catch {
      toast("Failed to load logs", "error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchLogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [level]);

  useEffect(() => {
    const debounce = setTimeout(fetchLogs, 300);
    return () => clearTimeout(debounce);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const toggle = (id: string) =>
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const exportLogs = (format: "json" | "csv") => {
    let content: string;
    let mime: string;
    let ext: string;

    if (format === "json") {
      content = JSON.stringify(logs, null, 2);
      mime = "application/json";
      ext = "json";
    } else {
      const header = "timestamp,level,source,message\n";
      const rows = logs
        .map(
          (l) =>
            `"${l.timestamp}","${l.level}","${l.source}","${l.message.replace(/"/g, '""')}"`
        )
        .join("\n");
      content = header + rows;
      mime = "text/csv";
      ext = "csv";
    }

    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `openclaw-logs.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
    toast(`Exported as ${ext.toUpperCase()}`, "success");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Logs</h2>
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Search logs…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-1.5 text-xs text-gray-300 placeholder-gray-500 w-56 focus:outline-none focus:border-gray-500"
          />
          <select
            value={level}
            onChange={(e) => setLevel(e.target.value as LogLevel | "")}
            className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-1.5 text-xs text-gray-300 focus:outline-none"
          >
            <option value="">All levels</option>
            <option value="info">Info</option>
            <option value="warning">Warning</option>
            <option value="error">Error</option>
          </select>
          <div className="flex gap-1">
            <button
              onClick={() => exportLogs("json")}
              className="px-3 py-1.5 text-xs rounded-lg bg-gray-700 text-gray-300 hover:bg-gray-600 transition"
            >
              Export JSON
            </button>
            <button
              onClick={() => exportLogs("csv")}
              className="px-3 py-1.5 text-xs rounded-lg bg-gray-700 text-gray-300 hover:bg-gray-600 transition"
            >
              Export CSV
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <SkeletonLoader lines={8} />
      ) : logs.length === 0 ? (
        <EmptyState
          icon="📋"
          title="No logs found"
          description="Try adjusting your filters or search query."
        />
      ) : (
        <div className="rounded-xl bg-gray-800/60 border border-gray-700/50 overflow-hidden">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-gray-500 border-b border-gray-700/50 bg-gray-900/30">
                <th className="text-left py-2.5 px-4 font-medium w-44">
                  Timestamp
                </th>
                <th className="text-left py-2.5 px-4 font-medium w-20">
                  Level
                </th>
                <th className="text-left py-2.5 px-4 font-medium w-28">
                  Source
                </th>
                <th className="text-left py-2.5 px-4 font-medium">
                  Message
                </th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => {
                const open = expanded.has(log.id);
                return (
                  <tr key={log.id} className="group">
                    <td colSpan={4} className="p-0">
                      <button
                        onClick={() =>
                          (log.details || log.stackTrace) && toggle(log.id)
                        }
                        className={`w-full text-left flex items-center gap-0 hover:bg-gray-800/40 transition ${
                          log.details || log.stackTrace
                            ? "cursor-pointer"
                            : "cursor-default"
                        }`}
                      >
                        <span className="py-2.5 px-4 text-gray-400 whitespace-nowrap w-44">
                          {new Date(log.timestamp).toLocaleString()}
                        </span>
                        <span className="py-2.5 px-4 w-20">
                          <StatusBadge label={log.level} />
                        </span>
                        <span className="py-2.5 px-4 text-gray-500 w-28">
                          {log.source}
                        </span>
                        <span className="py-2.5 px-4 text-gray-300 flex-1 truncate">
                          {log.message}
                          {(log.details || log.stackTrace) && (
                            <span className="text-gray-600 ml-2">
                              {open ? "▲" : "▼"}
                            </span>
                          )}
                        </span>
                      </button>

                      {open && (
                        <div className="px-4 pb-3 bg-gray-900/30">
                          {log.details && (
                            <div className="mb-2">
                              <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">
                                Details
                              </p>
                              <pre className="text-xs text-gray-400 bg-gray-900 rounded p-3 overflow-auto">
                                {log.details}
                              </pre>
                            </div>
                          )}
                          {log.stackTrace && (
                            <div>
                              <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">
                                Stack Trace
                              </p>
                              <pre className="text-xs text-red-400/80 bg-gray-900 rounded p-3 overflow-auto">
                                {log.stackTrace}
                              </pre>
                            </div>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
