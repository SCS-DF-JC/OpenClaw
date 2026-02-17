"use client";

import { useState } from "react";
import { useToast } from "../_components/ToastProvider";

export default function SettingsPage() {
  const { toast } = useToast();

  // Agent settings (local state only)
  const [agentName, setAgentName] = useState("OpenClaw-SCS");
  const [workspace, setWorkspace] = useState("/opt/openclaw/workspace");
  const [autoStart, setAutoStart] = useState(true);
  const [safeMode, setSafeMode] = useState(true);

  const handleSave = () => {
    toast("Settings saved (local only)", "success");
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <h2 className="text-xl font-semibold">Settings</h2>

      {/* Agent Settings */}
      <div className="rounded-xl bg-gray-800/60 border border-gray-700/50 p-6 space-y-5">
        <h3 className="text-sm font-medium text-gray-300 uppercase tracking-wider">
          Agent Settings
        </h3>

        <div className="space-y-4">
          {/* Agent Name */}
          <div>
            <label className="block text-xs text-gray-400 mb-1.5">
              Agent Name
            </label>
            <input
              type="text"
              value={agentName}
              onChange={(e) => setAgentName(e.target.value)}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-gray-300 focus:outline-none focus:border-gray-500"
            />
          </div>

          {/* Workspace Directory */}
          <div>
            <label className="block text-xs text-gray-400 mb-1.5">
              Default Workspace Directory
            </label>
            <input
              type="text"
              value={workspace}
              onChange={(e) => setWorkspace(e.target.value)}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-gray-300 font-mono focus:outline-none focus:border-gray-500"
            />
          </div>

          {/* Toggles */}
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-sm text-gray-300">Auto-start on boot</p>
              <p className="text-xs text-gray-500">
                Automatically start the agent when the server boots
              </p>
            </div>
            <button
              onClick={() => setAutoStart((v) => !v)}
              className={`relative w-11 h-6 rounded-full transition-colors ${
                autoStart ? "bg-emerald-600" : "bg-gray-600"
              }`}
            >
              <span
                className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                  autoStart ? "translate-x-5.5 left-0.5" : "left-0.5"
                }`}
                style={{
                  transform: autoStart ? "translateX(22px)" : "translateX(2px)",
                }}
              />
            </button>
          </div>

          <div className="flex items-center justify-between py-2 border-t border-gray-700/50">
            <div>
              <p className="text-sm text-gray-300">Safe Mode</p>
              <p className="text-xs text-gray-500">
                Prevent destructive actions (file deletion, shell commands)
              </p>
            </div>
            <button
              onClick={() => setSafeMode((v) => !v)}
              className={`relative w-11 h-6 rounded-full transition-colors ${
                safeMode ? "bg-emerald-600" : "bg-gray-600"
              }`}
            >
              <span
                className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow"
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
          className="px-4 py-2 text-sm rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition"
        >
          Save Settings
        </button>
      </div>

      {/* Permissions */}
      <div className="rounded-xl bg-gray-800/60 border border-gray-700/50 p-6 space-y-5">
        <h3 className="text-sm font-medium text-gray-300 uppercase tracking-wider">
          Permissions
        </h3>

        <div className="space-y-3">
          <div className="bg-gray-900/50 rounded-lg px-4 py-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-300">Admin Role</p>
                <p className="text-xs text-gray-500">
                  Full access to all features
                </p>
              </div>
              <span className="text-xs bg-emerald-500/20 text-emerald-400 rounded-full px-2.5 py-0.5">
                Active
              </span>
            </div>
          </div>

          <div className="bg-gray-900/50 rounded-lg px-4 py-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-300">Viewer Role</p>
                <p className="text-xs text-gray-500">
                  Read-only access to dashboard and logs
                </p>
              </div>
              <span className="text-xs bg-gray-500/20 text-gray-400 rounded-full px-2.5 py-0.5">
                Planned
              </span>
            </div>
          </div>
        </div>

        {/* Allowed emails */}
        <div>
          <label className="block text-xs text-gray-400 mb-1.5">
            Allowed Emails / Domains
          </label>
          <div className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-sm text-gray-500">
            <p>Placeholder — email/domain allowlist will be configured here</p>
          </div>
        </div>
      </div>
    </div>
  );
}
