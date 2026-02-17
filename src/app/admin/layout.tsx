import { currentUser } from "@clerk/nextjs/server";
import AdminShell from "./_components/AdminShell";

export const metadata = {
  title: "SCS Command Center",
  description: "OpenClaw Admin Dashboard",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();

  const userInfo = {
    email: user?.primaryEmailAddress?.emailAddress ?? "unknown",
    userId: user?.id ?? "unknown",
    role: (user?.publicMetadata as any)?.role ?? "none",
  };

  return <AdminShell userInfo={userInfo}>{children}</AdminShell>;
}
