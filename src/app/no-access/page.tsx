import Link from "next/link";

export default function NoAccessPage() {
  return (
    <main className="min-h-screen p-8">
      <h1 className="text-2xl font-semibold">Access denied</h1>
      <p className="mt-2 text-gray-600">
        You do not have the required role to access OpenClaw.
      </p>
      <p className="mt-4">
        <Link className="underline" href="/sign-in">
          Sign in with a different account
        </Link>
      </p>
    </main>
  );
}
