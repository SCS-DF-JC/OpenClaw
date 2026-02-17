import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold">OpenClaw</h1>
      <p className="mt-4 text-gray-600">Welcome to OpenClaw</p>
      <Link
        href="/admin"
        className="mt-6 rounded-lg bg-black px-6 py-3 text-white hover:bg-gray-800 transition"
      >
        Go to Admin Panel
      </Link>
      <Link
        href="/whoami"
        className="mt-3 text-sm text-gray-500 underline hover:text-gray-800 transition"
      >
        Debug: /whoami
      </Link>
    </main>
  );
}
