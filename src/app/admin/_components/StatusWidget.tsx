"use client";

import { useState } from "react";

interface HealthResponse {
  ok: boolean;
  status: string;
  ts: string;
}

export default function StatusWidget() {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function checkStatus() {
    setLoading(true);
    setError(null);
    setHealth(null);

    try {
      const res = await fetch("/api/openclaw/health");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: HealthResponse = await res.json();
      setHealth(data);
    } catch (err: any) {
      setError(err.message ?? "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-6 rounded-xl border p-6 space-y-3">
      <h2 className="text-lg font-semibold">OpenClaw Status</h2>

      <button
        onClick={checkStatus}
        disabled={loading}
        className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50 transition"
      >
        {loading ? "Checking…" : "Check OpenClaw Status"}
      </button>

      {health && (
        <div className="rounded-lg bg-gray-100 p-4 text-sm space-y-2">
          <p className="text-base font-medium">
            OpenClaw status:{" "}
            <span
              className={
                health.ok
                  ? "text-green-600 font-bold"
                  : "text-red-600 font-bold"
              }
            >
              {health.ok ? "ONLINE" : "OFFLINE"}
            </span>
          </p>
          <p>
            <b>Container:</b> {health.status}
          </p>
          <p>
            <b>Checked at:</b> {health.ts}
          </p>
        </div>
      )}

      {error && (
        <p className="text-sm text-red-600">
          <b>Error:</b> {error}
        </p>
      )}
    </div>
  );
}
