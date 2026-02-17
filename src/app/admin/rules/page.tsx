"use client";

import { useCallback, useEffect, useState } from "react";
import StatusBadge from "../_components/StatusBadge";
import ConfirmModal from "../_components/ConfirmModal";
import EmptyState from "../_components/EmptyState";
import SkeletonLoader from "../_components/SkeletonLoader";
import { useToast } from "../_components/ToastProvider";
import {
  listFiles,
  readFile,
  saveFile,
  listBundles,
} from "@/lib/api";
import type { FileNode, FileContent, RulebookBundle } from "@/lib/types";

export default function RulesPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [tree, setTree] = useState<FileNode[]>([]);
  const [bundles, setBundles] = useState<RulebookBundle[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [file, setFile] = useState<FileContent | null>(null);
  const [editing, setEditing] = useState(false);
  const [editContent, setEditContent] = useState("");
  const [versionNotes, setVersionNotes] = useState("");
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const [deleteTarget, setDeleteTarget] = useState<{ path: string; name: string } | null>(null);
  const [dragOver, setDragOver] = useState<string | null>(null);

  const fetchTree = useCallback(async () => {
    try {
      const [files, bndl] = await Promise.all([listFiles(), listBundles()]);
      setTree(files);
      setBundles(bndl);
      // Expand all folders by default
      const folders = new Set<string>();
      const walk = (nodes: FileNode[]) =>
        nodes.forEach((n) => {
          if (n.type === "folder") {
            folders.add(n.path);
            if (n.children) walk(n.children);
          }
        });
      walk(files);
      setExpandedFolders(folders);
    } catch {
      toast("Failed to load file tree", "error");
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchTree();
  }, [fetchTree]);

  const selectFile = async (path: string) => {
    setSelected(path);
    setEditing(false);
    try {
      const f = await readFile(path);
      setFile(f);
      setEditContent(f.content);
    } catch {
      toast("Failed to read file", "error");
    }
  };

  const handleSave = async () => {
    if (!file) return;
    const result = await saveFile(file.path, editContent, versionNotes);
    if (result.success) {
      toast("File saved", "success");
      setFile({ ...file, content: editContent });
      setEditing(false);
      setVersionNotes("");
    } else {
      toast("Failed to save file", "error");
    }
  };

  const handleDownload = () => {
    if (!file) return;
    const blob = new Blob([file.content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = file.path.split("/").pop() ?? "file.txt";
    a.click();
    URL.revokeObjectURL(url);
    toast("Downloaded", "success");
  };

  const toggleFolder = (path: string) => {
    setExpandedFolders((prev) => {
      const next = new Set(prev);
      next.has(path) ? next.delete(path) : next.add(path);
      return next;
    });
  };

  const handleDrop = (e: React.DragEvent, folderPath: string) => {
    e.preventDefault();
    setDragOver(null);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      toast(`Upload to ${folderPath}: ${files[0].name} (stub)`, "info");
    }
  };

  /* ── Tree Renderer ─────────────────────────────────────────── */
  const renderNode = (node: FileNode, depth = 0): React.ReactNode => {
    const isFolder = node.type === "folder";
    const isOpen = expandedFolders.has(node.path);
    const isSelected = selected === node.path;
    const isDragTarget = dragOver === node.path;
    const childCount = node.children?.length ?? 0;

    return (
      <div key={node.path}>
        <button
          onClick={() => (isFolder ? toggleFolder(node.path) : selectFile(node.path))}
          onDragOver={(e) => {
            if (isFolder) {
              e.preventDefault();
              setDragOver(node.path);
            }
          }}
          onDragLeave={() => setDragOver(null)}
          onDrop={(e) => isFolder && handleDrop(e, node.path)}
          className={`w-full flex items-center gap-2 px-3 py-1.5 text-xs rounded-lg transition text-left ${
            isSelected
              ? "bg-gray-700 text-white"
              : "text-gray-400 hover:text-gray-200 hover:bg-gray-800/50"
          } ${isDragTarget ? "ring-1 ring-emerald-500" : ""}`}
          style={{ paddingLeft: `${12 + depth * 16}px` }}
        >
          <span className="text-gray-500">
            {isFolder ? (isOpen ? "📂" : "📁") : "📄"}
          </span>
          <span className="flex-1 truncate">{node.name}</span>
          {isFolder && (
            <span className="text-[10px] text-gray-600">{childCount}</span>
          )}
        </button>
        {isFolder && isOpen && node.children?.map((c) => renderNode(c, depth + 1))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h2 className="text-xl font-semibold">Rules &amp; Docs</h2>
        <SkeletonLoader lines={10} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Rules &amp; Docs</h2>

      <div className="grid grid-cols-12 gap-4" style={{ minHeight: "calc(100vh - 200px)" }}>
        {/* Folder Tree */}
        <div className="col-span-4 xl:col-span-3 rounded-xl bg-gray-800/60 border border-gray-700/50 p-4 overflow-y-auto">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wider">
              Files
            </h3>
          </div>
          <div className="space-y-0.5">
            {tree.map((node) => renderNode(node))}
          </div>
        </div>

        {/* File Viewer */}
        <div className="col-span-8 xl:col-span-9 rounded-xl bg-gray-800/60 border border-gray-700/50 p-5 flex flex-col">
          {!file ? (
            <EmptyState
              icon="📄"
              title="Select a file"
              description="Choose a file from the tree on the left to view or edit it."
            />
          ) : (
            <>
              {/* File header */}
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-700/50">
                <div>
                  <h3 className="text-sm font-medium text-gray-200">
                    {file.path.split("/").pop()}
                  </h3>
                  <p className="text-[10px] text-gray-500 mt-0.5">
                    {file.path} · Modified {new Date(file.lastModified).toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {!editing ? (
                    <>
                      <button
                        onClick={() => setEditing(true)}
                        className="px-3 py-1.5 text-xs rounded-lg bg-gray-700 text-gray-300 hover:bg-gray-600 transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={handleDownload}
                        className="px-3 py-1.5 text-xs rounded-lg bg-gray-700 text-gray-300 hover:bg-gray-600 transition"
                      >
                        Download
                      </button>
                      <button
                        onClick={() => toast("Published to agent (stub)", "success")}
                        className="px-3 py-1.5 text-xs rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition"
                      >
                        Publish to agent
                      </button>
                    </>
                  ) : (
                    <>
                      <input
                        type="text"
                        value={versionNotes}
                        onChange={(e) => setVersionNotes(e.target.value)}
                        placeholder="What changed?"
                        className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-1.5 text-xs text-gray-300 placeholder-gray-500 w-48 focus:outline-none focus:border-gray-500"
                      />
                      <button
                        onClick={handleSave}
                        className="px-3 py-1.5 text-xs rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => {
                          setEditing(false);
                          setEditContent(file.content);
                        }}
                        className="px-3 py-1.5 text-xs rounded-lg bg-gray-700 text-gray-300 hover:bg-gray-600 transition"
                      >
                        Cancel
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Content */}
              {editing ? (
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="flex-1 bg-gray-900 border border-gray-700 rounded-lg p-4 text-sm text-gray-300 font-mono resize-none focus:outline-none focus:border-gray-500"
                />
              ) : (
                <div className="flex-1 bg-gray-900/50 rounded-lg p-4 overflow-auto">
                  <pre className="text-sm text-gray-300 whitespace-pre-wrap font-mono">
                    {file.content}
                  </pre>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Rulebook Bundles */}
      <div className="rounded-xl bg-gray-800/60 border border-gray-700/50 p-5">
        <h3 className="text-sm font-medium text-gray-300 mb-4">
          Rulebook Bundles
        </h3>
        {bundles.length === 0 ? (
          <EmptyState
            icon="📦"
            title="No bundles"
            description="Create a bundle to group rules together."
          />
        ) : (
          <div className="space-y-3">
            {bundles.map((b) => (
              <div
                key={b.id}
                className="flex items-center justify-between bg-gray-900/50 rounded-lg px-4 py-3"
              >
                <div>
                  <p className="text-sm text-gray-200">
                    {b.name}
                    {b.active && (
                      <StatusBadge label="Active" className="ml-2" />
                    )}
                  </p>
                  <p className="text-[10px] text-gray-500 mt-0.5">
                    {b.files.length} file{b.files.length !== 1 ? "s" : ""} ·
                    Created {new Date(b.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => toast(`Set "${b.name}" as active (stub)`, "success")}
                  disabled={b.active}
                  className={`px-3 py-1.5 text-xs rounded-lg transition ${
                    b.active
                      ? "bg-gray-700/50 text-gray-600 cursor-not-allowed"
                      : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  }`}
                >
                  {b.active ? "Active" : "Set as Active"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete confirmation */}
      <ConfirmModal
        open={!!deleteTarget}
        title="Delete item"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={() => {
          toast(`Deleted ${deleteTarget?.name} (stub)`, "success");
          setDeleteTarget(null);
        }}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
