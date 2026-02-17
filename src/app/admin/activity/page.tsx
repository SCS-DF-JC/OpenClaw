"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import StatusBadge from "../_components/StatusBadge";
import EmptyState from "../_components/EmptyState";
import SkeletonLoader from "../_components/SkeletonLoader";
import { useToast } from "../_components/ToastProvider";
import { getActivityFeed, getStatus } from "@/lib/api";
import type { ActivityEvent } from "@/lib/types";

type FilterCat = "all" | "task" | "tool_call" | "error" | "system";

export default function ActivityPage() {
  const { toast } = useToast();
  const [events, setEvents] = useState<ActivityEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterCat>("all");
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [interval, setIntervalMs] = useState(10_000);
  const [paused, setPaused] = useState(false);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [backendDown, setBackendDown] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchFeed = useCallback(async () => {
    try {
      const [feed, health] = await Promise.all([
        getActivityFeed(),
        getStatus(),
      ]);
      setEvents(feed);
      setBackendDown(!health.ok);
    } catch {
      setBackendDown(true);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchFeed();
  }, [fetchFeed]);

  // Auto-refresh
  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (autoRefresh && !paused) {
      timerRef.current = setInterval(fetchFeed, interval);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [autoRefresh, paused, interval, fetchFeed]);

  const toggle = (id: string) =>
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const copyPayload = (ev: ActivityEvent) => {
    navigator.clipboard.writeText(JSON.stringify(ev, null, 2));
    toast("Copied to clipboard", "success");
  };

  const filtered = events.filter(
    (e) => filter === "all" || e.category === filter
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <h2 className="text-xl font-semibold">Activity Monitor</h2>
        <SkeletonLoader lines={8} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Activity Monitor</h2>
        <div className="flex items-center gap-3">
          {/* Auto-refresh toggle */}
          <label className="flex items-center gap-2 text-xs text-gray-400 cursor-pointer">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              className="accent-emerald-500"
            />
            Auto-refresh
          </label>

          {/* Interval */}
          {autoRefresh && (
            <select
              value={interval}
              onChange={(e) => setIntervalMs(Number(e.target.value))}
              className="bg-gray-900 border border-gray-700 rounded-lg px-2 py-1 text-xs text-gray-300 focus:outline-none"
            >
              <option value={5000}>5s</option>
              <option value={10000}>10s</option>
              <option value={30000}>30s</option>
            </select>
          )}

          {/* Pause */}
          <button
            onClick={() => setPaused((p) => !p)}
            className={`px-3 py-1.5 text-xs rounded-lg transition ${
              paused
                ? "bg-amber-600/20 text-amber-400"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            {paused ? "▶ Resume" : "⏸ Pause"}
          </button>

          {/* Filter */}
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as FilterCat)}
            className="bg-gray-900 border border-gray-700 rounded-lg px-2 py-1 text-xs text-gray-300 focus:outline-none"
          >
            <option value="all">All</option>
            <option value="task">Tasks</option>
            <option value="tool_call">Tool Calls</option>
            <option value="error">Errors</option>
            <option value="system">System</option>
          </select>

          <button
            onClick={() => setFilter("all")}
            className="px-3 py-1.5 text-xs rounded-lg bg-gray-700 text-gray-300 hover:bg-gray-600 transition"
          >
            Clear filters
          </button>
        </div>
      </div>

      {/* Disconnected banner */}
      {backendDown && (
        <div className="rounded-lg bg-red-500/10 border border-red-500/30 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-red-400" />
            <span className="text-sm text-red-300">
              Backend disconnected — showing last cached feed
            </span>
          </div>
          <button
            onClick={fetchFeed}
            className="text-xs text-red-400 hover:text-red-300 underline"
          >
            Retry
          </button>
        </div>
      )}

      {/* Timeline */}
      {filtered.length === 0 ? (
        <EmptyState
          icon="⚡"
          title="No activity yet"
          description="Activity events will appear here once the agent starts processing."
        />
      ) : (
        <div className="space-y-2">
          {filtered.map((ev) => {
            const open = expanded.has(ev.id);
            return (
              <div
                key={ev.id}
                className="rounded-xl bg-gray-800/60 border border-gray-700/50 overflow-hidden"
              >
                <button
                  onClick={() => toggle(ev.id)}
                  className="w-full flex items-center gap-4 px-5 py-3.5 text-left hover:bg-gray-800/40 transition"
                >
                  <span className="text-xs text-gray-500 whitespace-nowrap w-20">
                    {new Date(ev.timestamp).toLocaleTimeString()}
                  </span>
                  <StatusBadge label={ev.category} />
                  <StatusBadge label={ev.severity} />
                  <span className="flex-1 text-sm text-gray-200 truncate">
                    {ev.title}
                  </span>
                  {ev.duration && (
                    <span className="text-xs text-gray-500">{ev.duration}</span>
                  )}
                  <StatusBadge label={ev.status} />
                  <span className="text-xs text-gray-600">
                    {open ? "▲" : "▼"}
                  </span>
                </button>

                {open && (
                  <div className="px-5 pb-4 border-t border-gray-700/30">
                    <p className="text-sm text-gray-400 mt-3">{ev.summary}</p>
                    {ev.details && (
                      <pre className="mt-2 text-xs text-gray-500 bg-gray-900 rounded p-3 overflow-auto">
                        {ev.details}
                      </pre>
                    )}
                    <button
                      onClick={() => copyPayload(ev)}
                      className="mt-3 text-xs text-gray-400 hover:text-white underline"
                    >
                      Copy JSON
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
