import { UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import StatusWidget from "./_components/StatusWidget";

export default async function AdminPage() {
  const user = await currentUser();

  const email = user?.primaryEmailAddress?.emailAddress ?? "unknown";
  const userId = user?.id ?? "unknown";
  const role = (user?.publicMetadata as any)?.role ?? "none";

  return (
    <main className="min-h-screen p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">OpenClaw Admin Panel</h1>
        <UserButton />
      </div>

      <div className="mt-6 rounded-xl border p-6 space-y-2">
        <p className="text-sm text-gray-600">
          <b>Email:</b> {email}
        </p>
        <p className="text-sm text-gray-600">
          <b>User ID:</b> <code className="text-xs">{userId}</code>
        </p>
        <p className="text-sm text-gray-600">
          <b>Role (publicMetadata):</b>{" "}
          <code className={role === "admin" ? "text-green-600" : "text-red-600"}>
            {role}
          </code>
        </p>

        {role === "admin" ? (
          <p className="text-sm text-green-700 font-medium mt-2">
            ✓ You have admin access.
          </p>
        ) : (
          <p className="text-sm text-red-700 font-medium mt-2">
            ✗ Your role is not &quot;admin&quot; — you should be redirected to /no-access.
          </p>
        )}

        <div className="mt-4">
          <button className="rounded-lg bg-black px-4 py-2 text-white">
            Open OpenClaw (next step)
          </button>
        </div>
      </div>

      <StatusWidget />
    </main>
  );
}
