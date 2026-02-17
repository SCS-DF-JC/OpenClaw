/* ───────────────────────────────────────────────────────────────
   SCS Command Center – Shared Types
   ─────────────────────────────────────────────────────────────── */

export type ConnectionStatus = "connected" | "degraded" | "offline";

export interface UserInfo {
  email: string;
  userId: string;
  role: string;
}

/* ── Health / Status ─────────────────────────────────────────── */

export interface HealthStatus {
  ok: boolean;
  status: string;
  ts: string;
  latencyMs?: number;
}

export interface ServiceStatus {
  name: string;
  status: "online" | "degraded" | "offline" | "unknown";
  latencyMs?: number;
  lastCheck: string;
}

/* ── Dashboard ───────────────────────────────────────────────── */

export interface DashboardStats {
  agentStatus: "running" | "stopped" | "unknown";
  lastActivity: string | null;
  tasksToday: number;
  errorsToday: number;
  queueDepth: number;
}

/* ── Activity ────────────────────────────────────────────────── */

export type ActivityCategory = "task" | "tool_call" | "error" | "system";
export type Severity = "info" | "warning" | "error";
export type ActivityStatus = "success" | "failed" | "running" | "pending";

export interface ActivityEvent {
  id: string;
  timestamp: string;
  category: ActivityCategory;
  severity: Severity;
  title: string;
  summary: string;
  duration?: string;
  status: ActivityStatus;
  details?: string;
  payload?: Record<string, unknown>;
}

/* ── Rules & Docs ────────────────────────────────────────────── */

export interface FileNode {
  name: string;
  path: string;
  type: "file" | "folder";
  children?: FileNode[];
  lastModified?: string;
  size?: number;
}

export interface FileContent {
  path: string;
  content: string;
  lastModified: string;
}

export interface RulebookBundle {
  id: string;
  name: string;
  files: string[];
  active: boolean;
  createdAt: string;
}

/* ── Logs ────────────────────────────────────────────────────── */

export type LogLevel = "info" | "warning" | "error";

export interface LogEntry {
  id: string;
  timestamp: string;
  level: LogLevel;
  source: string;
  message: string;
  details?: string;
  stackTrace?: string;
}

export interface LogFilters {
  level?: LogLevel;
  search?: string;
  from?: string;
  to?: string;
}
