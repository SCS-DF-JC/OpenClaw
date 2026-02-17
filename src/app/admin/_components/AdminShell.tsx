"use client";

import type { UserInfo } from "@/lib/types";
import { ToastProvider } from "./ToastProvider";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";

export default function AdminShell({
  userInfo,
  children,
}: {
  userInfo: UserInfo;
  children: React.ReactNode;
}) {
  return (
    <ToastProvider>
      <div className="min-h-screen text-[#e8e8ef]">
        <Sidebar />
        <div className="ml-60">
          <TopBar userInfo={userInfo} />
          <main className="p-6">{children}</main>
        </div>
      </div>
    </ToastProvider>
  );
}
