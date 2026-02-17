"use client";

import { useEffect, useState } from "react";
import KpiCard from "./_components/KpiCard";
import StatusBadge from "./_components/StatusBadge";
import SkeletonLoader from "./_components/SkeletonLoader";
import { useToast } from "./_components/ToastProvider";
import {
  getStatus,
  getDashboardStats,
  getActivityFeed,
} from "@/lib/api";
import type {
  HealthStatus,
  DashboardStats,
  ActivityEvent,
} from "@/lib/types";

type Filter = "all" | "error" | "task" | "system";

export default function DashboardPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activity, setActivity] = useState<ActivityEvent[]>([]);
  const [filter, setFilter] = useState<Filter>("all");
  const [search, setSearch] = useState("");

  async function fetchAll() {
    setLoading(true);
    try {
      const [h, s, a] = await Promise.all([
        getStatus(),
        getDashboardStats(),
        getActivityFeed(),
      ]);
      setHealth(h);
      setStats(s);
      setActivity(a);
    } catch {
      toast("Failed to load dashboard data", "error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = activity.filter((e) => {
    if (filter !== "all" && e.category !== filter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        e.title.toLowerCase().includes(q) ||
        e.summary.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const fmt = (iso: string | null) => {
    if (!iso) return "—";
    return new Date(iso).toLocaleString();
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h2 className="text-xl font-semibold">Dashboard</h2>
        <div className="grid grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="rounded-xl bg-gray-800/60 border border-gray-700/50 p-5">
              <SkeletonLoader lines={2} />
            </div>
          ))}
        </div>
        <SkeletonLoader lines={6} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Dashboard</h2>

      {/* KPI Row */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <KpiCard
          title="Agent Status"
          value={stats?.agentStatus ?? "unknown"}
          accent={
            stats?.agentStatus === "running"
              ? "green"
              : stats?.agentStatus === "stopped"
              ? "red"
              : "amber"
          }
        />
        <KpiCard
          title="Last Activity"
          value={stats?.lastActivity ? new Date(stats.lastActivity).toLocaleTimeString() : "—"}
          subtitle={stats?.lastActivity ? new Date(stats.lastActivity).toLocaleDateString() : undefined}
        />
        <KpiCard title="Tasks Today" value={stats?.tasksToday ?? 0} />
        <KpiCard
          title="Errors Today"
          value={stats?.errorsToday ?? 0}
          accent={stats?.errorsToday && stats.errorsToday > 0 ? "red" : "default"}
        />
        <KpiCard title="Queue Depth" value={stats?.queueDepth ?? 0} />
      </div>

      {/* Health Panel */}
      <div className="rounded-xl bg-gray-800/60 border border-gray-700/50 p-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-gray-300">
              Backend Health
            </h3>
            <div className="flex items-center gap-3 mt-2">
              <StatusBadge label={health?.ok ? "online" : "offline"} />
              <span className="text-xs text-gray-500">
                Last heartbeat: {fmt(health?.ts ?? null)}
              </span>
              {health?.latencyMs !== undefined && (
                <span className="text-xs text-gray-500">
                  Latency: {health.latencyMs}ms
                </span>
              )}
            </div>
          </div>
          <button
            onClick={() => {
              toast("Retrying connection…", "info");
              fetchAll();
            }}
            className="px-3 py-1.5 text-xs rounded-lg bg-gray-700 text-gray-300 hover:bg-gray-600 transition"
          >
            Retry connection
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="rounded-xl bg-gray-800/60 border border-gray-700/50 p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-gray-300">
            Recent Activity
          </h3>
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Search…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-1.5 text-xs text-gray-300 placeholder-gray-500 w-48 focus:outline-none focus:border-gray-500"
            />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as Filter)}
              className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-1.5 text-xs text-gray-300 focus:outline-none focus:border-gray-500"
            >
              <option value="all">All</option>
              <option value="error">Errors</option>
              <option value="task">Tasks</option>
              <option value="system">System</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-gray-500 border-b border-gray-700/50">
                <th className="text-left py-2 px-3 font-medium">Time</th>
                <th className="text-left py-2 px-3 font-medium">Type</th>
                <th className="text-left py-2 px-3 font-medium">Summary</th>
                <th className="text-left py-2 px-3 font-medium">Duration</th>
                <th className="text-left py-2 px-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-gray-500">
                    No activity found
                  </td>
                </tr>
              ) : (
                filtered.map((ev) => (
                  <tr
                    key={ev.id}
                    className="border-b border-gray-800/50 hover:bg-gray-800/30"
                  >
                    <td className="py-2.5 px-3 text-gray-400 whitespace-nowrap">
                      {new Date(ev.timestamp).toLocaleTimeString()}
                    </td>
                    <td className="py-2.5 px-3">
                      <StatusBadge label={ev.category} />
                    </td>
                    <td className="py-2.5 px-3 text-gray-300 max-w-sm truncate">
                      {ev.summary}
                    </td>
                    <td className="py-2.5 px-3 text-gray-400">
                      {ev.duration ?? "—"}
                    </td>
                    <td className="py-2.5 px-3">
                      <StatusBadge label={ev.status} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
