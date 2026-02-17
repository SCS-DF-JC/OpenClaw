/* ───────────────────────────────────────────────────────────────
   SCS Command Center – API Layer
   All functions try real endpoints first, fall back to mock data.
   ─────────────────────────────────────────────────────────────── */

import type {
  HealthStatus,
  DashboardStats,
  ActivityEvent,
  FileNode,
  FileContent,
  LogEntry,
  LogFilters,
  ServiceStatus,
  RulebookBundle,
} from "./types";

/* ── Helpers ─────────────────────────────────────────────────── */

async function safeFetch<T>(url: string, fallback: T): Promise<T> {
  try {
    const start = performance.now();
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    data._latencyMs = Math.round(performance.now() - start);
    return data as T;
  } catch {
    return fallback;
  }
}

const iso = (offset = 0) => new Date(Date.now() - offset).toISOString();

/* ── Health ───────────────────────────────────────────────────── */

export async function getStatus(): Promise<HealthStatus> {
  return safeFetch<HealthStatus>("/api/openclaw/health", {
    ok: false,
    status: "unreachable",
    ts: iso(),
  });
}

/* ── Dashboard Stats ─────────────────────────────────────────── */

export async function getDashboardStats(): Promise<DashboardStats> {
  // Future: fetch from /api/openclaw/stats
  return {
    agentStatus: "unknown",
    lastActivity: iso(300_000),
    tasksToday: 0,
    errorsToday: 0,
    queueDepth: 0,
  };
}

/* ── Activity Feed ───────────────────────────────────────────── */

const mockActivity: ActivityEvent[] = [
  {
    id: "a1",
    timestamp: iso(60_000),
    category: "system",
    severity: "info",
    title: "Agent started",
    summary: "OpenClaw agent process initialised on OVH host",
    duration: "0.8s",
    status: "success",
  },
  {
    id: "a2",
    timestamp: iso(180_000),
    category: "task",
    severity: "info",
    title: "Document indexed",
    summary: "Processed SCS-policy-v2.md through rulebook pipeline",
    duration: "2.3s",
    status: "success",
  },
  {
    id: "a3",
    timestamp: iso(240_000),
    category: "tool_call",
    severity: "warning",
    title: "Slow API response",
    summary: "External API call took longer than threshold (5.2s)",
    duration: "5.2s",
    status: "success",
  },
  {
    id: "a4",
    timestamp: iso(420_000),
    category: "error",
    severity: "error",
    title: "Connection timeout",
    summary: "Failed to reach upstream service after 3 retries",
    duration: "15.0s",
    status: "failed",
    details: "Error: ETIMEDOUT\n  at TCPConnectWrap.afterConnect",
  },
  {
    id: "a5",
    timestamp: iso(600_000),
    category: "task",
    severity: "info",
    title: "Rules bundle activated",
    summary: 'Set "SCS Core Rules v1" as active rulebook bundle',
    duration: "0.4s",
    status: "success",
  },
  {
    id: "a6",
    timestamp: iso(900_000),
    category: "system",
    severity: "info",
    title: "Health check passed",
    summary: "All services reporting healthy",
    duration: "0.1s",
    status: "success",
  },
];

export async function getActivityFeed(): Promise<ActivityEvent[]> {
  // Future: fetch from /api/openclaw/activity
  return mockActivity;
}

/* ── Files (Rules & Docs) ────────────────────────────────────── */

const mockFileTree: FileNode[] = [
  {
    name: "Rules",
    path: "/rules",
    type: "folder",
    children: [
      { name: "core-rules.md", path: "/rules/core-rules.md", type: "file", lastModified: iso(3_600_000), size: 2400 },
      { name: "safety-policy.md", path: "/rules/safety-policy.md", type: "file", lastModified: iso(7_200_000), size: 1800 },
      { name: "tool-permissions.md", path: "/rules/tool-permissions.md", type: "file", lastModified: iso(86_400_000), size: 950 },
    ],
  },
  {
    name: "Docs",
    path: "/docs",
    type: "folder",
    children: [
      { name: "getting-started.md", path: "/docs/getting-started.md", type: "file", lastModified: iso(172_800_000), size: 3200 },
      { name: "api-reference.md", path: "/docs/api-reference.md", type: "file", lastModified: iso(259_200_000), size: 5100 },
    ],
  },
  {
    name: "Prompts",
    path: "/prompts",
    type: "folder",
    children: [
      { name: "system-prompt.md", path: "/prompts/system-prompt.md", type: "file", lastModified: iso(43_200_000), size: 1600 },
    ],
  },
  {
    name: "Policies",
    path: "/policies",
    type: "folder",
    children: [
      { name: "data-retention.md", path: "/policies/data-retention.md", type: "file", lastModified: iso(604_800_000), size: 2100 },
    ],
  },
];

export async function listFiles(): Promise<FileNode[]> {
  return mockFileTree;
}

const mockFileContents: Record<string, string> = {
  "/rules/core-rules.md":
    "# Core Rules\n\n## Rule 1: Safety First\nAlways prioritise safety in all operations.\n\n## Rule 2: Data Privacy\nNever expose sensitive user data in logs or outputs.\n\n## Rule 3: Confirmation\nRequire explicit confirmation before destructive actions.\n",
  "/rules/safety-policy.md":
    "# Safety Policy\n\nOpenClaw operates under strict safety guidelines:\n\n- No file deletion without confirmation\n- No network requests to untrusted domains\n- Rate limiting on all external API calls\n",
  "/rules/tool-permissions.md":
    "# Tool Permissions\n\n| Tool | Permission | Notes |\n|------|-----------|-------|\n| file_read | allowed | All files |\n| file_write | restricted | Workspace only |\n| shell_exec | restricted | Allowlist only |\n",
  "/docs/getting-started.md":
    "# Getting Started\n\nWelcome to OpenClaw. This guide covers initial setup and configuration.\n\n## Prerequisites\n- Node.js 18+\n- Docker\n- Access to OVH server\n",
  "/docs/api-reference.md":
    "# API Reference\n\n## GET /health\nReturns agent health status.\n\n## GET /activity\nReturns recent activity feed.\n\n## POST /rules\nUpdate agent rules.\n",
  "/prompts/system-prompt.md":
    "# System Prompt\n\nYou are OpenClaw, an AI agent managed by SCS.\nFollow all rules in the active rulebook bundle.\nReport errors immediately.\n",
  "/policies/data-retention.md":
    "# Data Retention Policy\n\n- Logs retained for 30 days\n- Activity feed retained for 7 days\n- File versions retained for 90 days\n",
};

export async function readFile(path: string): Promise<FileContent> {
  return {
    path,
    content: mockFileContents[path] ?? `# ${path}\n\nFile content unavailable.`,
    lastModified: iso(3_600_000),
  };
}

export async function saveFile(
  _path: string,
  _content: string,
  _notes?: string
): Promise<{ success: boolean }> {
  // Future: POST to /api/openclaw/files
  return { success: true };
}

export async function uploadFile(
  _folder: string,
  _file: File
): Promise<{ success: boolean }> {
  // Future: POST to /api/openclaw/upload
  return { success: true };
}

/* ── Logs ────────────────────────────────────────────────────── */

const mockLogs: LogEntry[] = [
  { id: "l1", timestamp: iso(30_000), level: "info", source: "agent", message: "Agent heartbeat OK" },
  { id: "l2", timestamp: iso(60_000), level: "info", source: "api", message: "Health endpoint responded in 45ms" },
  { id: "l3", timestamp: iso(120_000), level: "warning", source: "agent", message: "Memory usage at 78%", details: "RSS: 312MB, Heap: 256MB" },
  { id: "l4", timestamp: iso(300_000), level: "error", source: "task-runner", message: "Task execution failed: timeout after 30s", details: "Task ID: t-4829\nTimeout: 30000ms", stackTrace: "Error: Task timeout\n  at TaskRunner.execute (task-runner.js:142)\n  at async Agent.run (agent.js:89)" },
  { id: "l5", timestamp: iso(600_000), level: "info", source: "system", message: "Configuration reloaded" },
  { id: "l6", timestamp: iso(900_000), level: "info", source: "agent", message: "Rules bundle v1 activated" },
  { id: "l7", timestamp: iso(1_200_000), level: "warning", source: "api", message: "Rate limit approaching: 85/100 requests" },
  { id: "l8", timestamp: iso(1_800_000), level: "info", source: "system", message: "Scheduled backup completed", details: "Backup size: 24MB, Duration: 3.2s" },
  { id: "l9", timestamp: iso(2_400_000), level: "error", source: "network", message: "DNS resolution failed for upstream.example.com", stackTrace: "Error: getaddrinfo ENOTFOUND upstream.example.com\n  at GetAddrInfoReqWrap.onlookup" },
  { id: "l10", timestamp: iso(3_600_000), level: "info", source: "agent", message: "Agent started successfully" },
];

export async function listLogs(filters?: LogFilters): Promise<LogEntry[]> {
  let logs = [...mockLogs];
  if (filters?.level) logs = logs.filter((l) => l.level === filters.level);
  if (filters?.search) {
    const q = filters.search.toLowerCase();
    logs = logs.filter(
      (l) =>
        l.message.toLowerCase().includes(q) ||
        l.source.toLowerCase().includes(q)
    );
  }
  return logs;
}

/* ── Service Statuses ────────────────────────────────────────── */

export async function getServiceStatuses(): Promise<ServiceStatus[]> {
  const health = await getStatus();
  return [
    {
      name: "Frontend (Next.js)",
      status: "online",
      latencyMs: 12,
      lastCheck: iso(),
    },
    {
      name: "Backend (OpenClaw Agent)",
      status: health.ok ? "online" : "offline",
      latencyMs: health.ok ? (health as any)._latencyMs ?? 45 : undefined,
      lastCheck: health.ts,
    },
    {
      name: "Task Queue",
      status: "unknown",
      lastCheck: iso(),
    },
    {
      name: "File Storage",
      status: "unknown",
      lastCheck: iso(),
    },
  ];
}

/* ── Bundles ─────────────────────────────────────────────────── */

const mockBundles: RulebookBundle[] = [
  {
    id: "b1",
    name: "SCS Core Rules v1",
    files: ["/rules/core-rules.md", "/rules/safety-policy.md", "/rules/tool-permissions.md"],
    active: true,
    createdAt: iso(604_800_000),
  },
  {
    id: "b2",
    name: "Minimal Ruleset",
    files: ["/rules/core-rules.md"],
    active: false,
    createdAt: iso(1_209_600_000),
  },
];

export async function listBundles(): Promise<RulebookBundle[]> {
  return mockBundles;
}
