"use client";

import { useEffect, useState } from "react";
import { UserButton } from "@clerk/nextjs";
import type { ConnectionStatus, UserInfo } from "@/lib/types";

export default function TopBar({ userInfo }: { userInfo: UserInfo }) {
  const [conn, setConn] = useState<ConnectionStatus>("offline");

  useEffect(() => {
    let mounted = true;

    async function check() {
      try {
        const res = await fetch("/api/openclaw/health", { cache: "no-store" });
        if (!mounted) return;
        if (res.ok) {
          const data = await res.json();
          setConn(data.ok ? "connected" : "degraded");
        } else {
          setConn("degraded");
        }
      } catch {
        if (mounted) setConn("offline");
      }
    }

    check();
    const interval = setInterval(check, 30_000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  const connStyles: Record<ConnectionStatus, { dot: string; label: string }> = {
    connected: { dot: "bg-emerald-400", label: "Connected" },
    degraded: { dot: "bg-amber-400", label: "Degraded" },
    offline: { dot: "bg-red-400", label: "Offline" },
  };

  const c = connStyles[conn];

  return (
    <header className="h-14 bg-gray-900/80 backdrop-blur-sm border-b border-gray-800 flex items-center justify-between px-6 sticky top-0 z-20">
      {/* Left */}
      <div className="flex items-center gap-4">
        <span className="text-xs font-medium text-gray-500 bg-gray-800 rounded px-2.5 py-1">
          OVH / Production
        </span>
        <div className="flex items-center gap-2">
          <span className={`inline-block w-2 h-2 rounded-full ${c.dot}`} />
          <span className="text-xs text-gray-400">{c.label}</span>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-xs text-gray-300">{userInfo.email}</p>
          <p className="text-[10px] text-gray-500">
            Role: <span className="text-emerald-400">{userInfo.role}</span>
          </p>
        </div>
        <UserButton
          appearance={{
            elements: {
              avatarBox: "w-8 h-8",
            },
          }}
        />
      </div>
    </header>
  );
}
