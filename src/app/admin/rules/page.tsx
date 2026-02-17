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
          className={`w-full flex items-center gap-2 px-3 py-1.5 text-xs rounded-lg transition-all text-left ${
            isSelected
              ? "bg-white/[0.08] text-[#d4a843]"
              : "text-[#8890a4] hover:text-[#d1d5db] hover:bg-white/[0.04]"
          } ${isDragTarget ? "ring-1 ring-[#d4a843]/50" : ""}`}
          style={{ paddingLeft: `${12 + depth * 16}px` }}
        >
          <span className="text-[#6b7394]">
            {isFolder ? (isOpen ? "📂" : "📁") : "📄"}
          </span>
          <span className="flex-1 truncate">{node.name}</span>
          {isFolder && (
            <span className="text-[10px] text-[#4a5068]">{childCount}</span>
          )}
        </button>
        {isFolder && isOpen && node.children?.map((c) => renderNode(c, depth + 1))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-white">Rules &amp; Docs</h2>
        <SkeletonLoader lines={10} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-white">Rules &amp; Docs</h2>

      <div className="grid grid-cols-12 gap-4" style={{ minHeight: "calc(100vh - 200px)" }}>
        {/* Folder Tree */}
        <div className="col-span-4 xl:col-span-3 glass rounded-xl p-4 overflow-y-auto">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[11px] font-medium text-[#6b7394] uppercase tracking-wider">
              Files
            </h3>
          </div>
          <div className="space-y-0.5">
            {tree.map((node) => renderNode(node))}
          </div>
        </div>

        {/* File Viewer */}
        <div className="col-span-8 xl:col-span-9 glass rounded-xl p-5 flex flex-col">
          {!file ? (
            <EmptyState
              icon="📄"
              title="Select a file"
              description="Choose a file from the tree on the left to view or edit it."
            />
          ) : (
            <>
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/[0.06]">
                <div>
                  <h3 className="text-sm font-medium text-[#d1d5db]">
                    {file.path.split("/").pop()}
                  </h3>
                  <p className="text-[10px] text-[#4a5068] mt-0.5">
                    {file.path} · Modified {new Date(file.lastModified).toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {!editing ? (
                    <>
                      <button
                        onClick={() => setEditing(true)}
                        className="btn-silver px-3 py-1.5 text-xs rounded-lg"
                      >
                        Edit
                      </button>
                      <button
                        onClick={handleDownload}
                        className="btn-silver px-3 py-1.5 text-xs rounded-lg"
                      >
                        Download
                      </button>
                      <button
                        onClick={() => toast("Published to agent (stub)", "success")}
                        className="btn-gold px-3 py-1.5 text-xs rounded-lg"
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
                        className="glass-input rounded-lg px-3 py-1.5 text-xs text-[#b8bcc8] placeholder-[#4a5068] w-48"
                      />
                      <button
                        onClick={handleSave}
                        className="btn-gold px-3 py-1.5 text-xs rounded-lg"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => {
                          setEditing(false);
                          setEditContent(file.content);
                        }}
                        className="btn-silver px-3 py-1.5 text-xs rounded-lg"
                      >
                        Cancel
                      </button>
                    </>
                  )}
                </div>
              </div>

              {editing ? (
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="flex-1 glass-input rounded-lg p-4 text-sm text-[#b8bcc8] font-mono resize-none"
                />
              ) : (
                <div className="flex-1 bg-white/[0.02] rounded-lg p-4 overflow-auto border border-white/[0.04]">
                  <pre className="text-sm text-[#b8bcc8] whitespace-pre-wrap font-mono">
                    {file.content}
                  </pre>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Rulebook Bundles */}
      <div className="glass rounded-xl p-5">
        <h3 className="text-sm font-medium text-[#b8bcc8] mb-4">
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
                className="flex items-center justify-between bg-white/[0.02] rounded-lg px-4 py-3 border border-white/[0.04]"
              >
                <div>
                  <p className="text-sm text-[#d1d5db]">
                    {b.name}
                    {b.active && (
                      <StatusBadge label="Active" className="ml-2" />
                    )}
                  </p>
                  <p className="text-[10px] text-[#4a5068] mt-0.5">
                    {b.files.length} file{b.files.length !== 1 ? "s" : ""} ·
                    Created {new Date(b.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => toast(`Set "${b.name}" as active (stub)`, "success")}
                  disabled={b.active}
                  className={`px-3 py-1.5 text-xs rounded-lg transition ${
                    b.active
                      ? "bg-white/[0.03] text-[#4a5068] cursor-not-allowed"
                      : "btn-silver"
                  }`}
                >
                  {b.active ? "Active" : "Set as Active"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

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
