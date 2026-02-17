"use client";

import { useState } from "react";
import { useToast } from "../_components/ToastProvider";

export default function SettingsPage() {
  const { toast } = useToast();

  const [agentName, setAgentName] = useState("OpenClaw-SCS");
  const [workspace, setWorkspace] = useState("/opt/openclaw/workspace");
  const [autoStart, setAutoStart] = useState(true);
  const [safeMode, setSafeMode] = useState(true);

  const handleSave = () => {
    toast("Settings saved (local only)", "success");
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <h2 className="text-xl font-semibold text-white">Settings</h2>

      {/* Agent Settings */}
      <div className="glass rounded-xl p-6 space-y-5">
        <h3 className="text-[11px] font-medium text-[#6b7394] uppercase tracking-wider">
          Agent Settings
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-xs text-[#8890a4] mb-1.5">
              Agent Name
            </label>
            <input
              type="text"
              value={agentName}
              onChange={(e) => setAgentName(e.target.value)}
              className="w-full glass-input rounded-lg px-4 py-2.5 text-sm text-[#d1d5db]"
            />
          </div>

          <div>
            <label className="block text-xs text-[#8890a4] mb-1.5">
              Default Workspace Directory
            </label>
            <input
              type="text"
              value={workspace}
              onChange={(e) => setWorkspace(e.target.value)}
              className="w-full glass-input rounded-lg px-4 py-2.5 text-sm text-[#d1d5db] font-mono"
            />
          </div>

          {/* Auto-start toggle */}
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="text-sm text-[#d1d5db]">Auto-start on boot</p>
              <p className="text-xs text-[#6b7394]">
                Automatically start the agent when the server boots
              </p>
            </div>
            <button
              onClick={() => setAutoStart((v) => !v)}
              className={`relative w-11 h-6 rounded-full transition-colors ${
                autoStart ? "bg-[#d4a843]" : "bg-white/[0.1]"
              }`}
            >
              <span
                className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-md"
                style={{
                  transform: autoStart ? "translateX(22px)" : "translateX(2px)",
                  transition: "transform 0.2s",
                }}
              />
            </button>
          </div>

          {/* Safe mode toggle */}
          <div className="flex items-center justify-between py-3 border-t border-white/[0.06]">
            <div>
              <p className="text-sm text-[#d1d5db]">Safe Mode</p>
              <p className="text-xs text-[#6b7394]">
                Prevent destructive actions (file deletion, shell commands)
              </p>
            </div>
            <button
              onClick={() => setSafeMode((v) => !v)}
              className={`relative w-11 h-6 rounded-full transition-colors ${
                safeMode ? "bg-[#d4a843]" : "bg-white/[0.1]"
              }`}
            >
              <span
                className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-md"
                style={{
                  transform: safeMode ? "translateX(22px)" : "translateX(2px)",
                  transition: "transform 0.2s",
                }}
              />
            </button>
          </div>
        </div>

        <button
          onClick={handleSave}
          className="btn-gold px-4 py-2 text-sm rounded-lg"
        >
          Save Settings
        </button>
      </div>

      {/* Permissions */}
      <div className="glass rounded-xl p-6 space-y-5">
        <h3 className="text-[11px] font-medium text-[#6b7394] uppercase tracking-wider">
          Permissions
        </h3>

        <div className="space-y-3">
          <div className="bg-white/[0.02] rounded-lg px-4 py-3 border border-white/[0.04]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#d1d5db]">Admin Role</p>
                <p className="text-xs text-[#6b7394]">
                  Full access to all features
                </p>
              </div>
              <span className="text-[11px] bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 rounded-full px-2.5 py-0.5 font-medium">
                Active
              </span>
            </div>
          </div>

          <div className="bg-white/[0.02] rounded-lg px-4 py-3 border border-white/[0.04]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#d1d5db]">Viewer Role</p>
                <p className="text-xs text-[#6b7394]">
                  Read-only access to dashboard and logs
                </p>
              </div>
              <span className="text-[11px] bg-white/[0.06] text-[#6b7394] border border-white/[0.08] rounded-full px-2.5 py-0.5 font-medium">
                Planned
              </span>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs text-[#8890a4] mb-1.5">
            Allowed Emails / Domains
          </label>
          <div className="bg-white/[0.02] border border-white/[0.04] rounded-lg px-4 py-3 text-sm text-[#4a5068]">
            <p>Placeholder — email/domain allowlist will be configured here</p>
          </div>
        </div>
      </div>
    </div>
  );
}
