import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";

export default async function WhoAmIPage() {
  const user = await currentUser();

  if (!user) {
    return (
      <main className="min-h-screen flex items-center justify-center p-8">
        <div className="glass rounded-2xl p-10 text-center animate-[fadeInUp_0.5s_ease-out_both]">
          <span className="text-5xl mb-4 block">👤</span>
          <h1 className="text-2xl font-bold text-red-400">SIGNED OUT</h1>
          <p className="mt-3">
            <Link
              className="btn-gold inline-block px-6 py-2.5 text-sm rounded-lg mt-4"
              href="/sign-in"
            >
              Sign in
            </Link>
          </p>
        </div>
      </main>
    );
  }

  const email = user.primaryEmailAddress?.emailAddress ?? "no email";
  const metadata = user.publicMetadata;

  return (
    <main className="min-h-screen flex items-center justify-center p-8">
      <div className="glass rounded-2xl p-8 max-w-xl w-full animate-[fadeInUp_0.5s_ease-out_both]">
        <h1 className="text-xl font-semibold text-white">Who Am I?</h1>

        <div className="mt-6 space-y-4">
          <div>
            <p className="text-[11px] text-[#6b7394] uppercase tracking-wider">User ID</p>
            <code className="text-sm text-[#b8bcc8]">{user.id}</code>
          </div>

          <div>
            <p className="text-[11px] text-[#6b7394] uppercase tracking-wider">Primary Email</p>
            <code className="text-sm text-[#b8bcc8]">{email}</code>
          </div>

          <div>
            <p className="text-[11px] text-[#6b7394] uppercase tracking-wider">publicMetadata (raw JSON)</p>
            <pre className="mt-1 rounded-lg bg-white/[0.02] border border-white/[0.04] p-4 text-sm text-[#d4a843] overflow-auto font-mono">
              {JSON.stringify(metadata, null, 2)}
            </pre>
          </div>
        </div>

        <p className="mt-6">
          <Link
            className="text-xs text-[#4a5068] hover:text-[#8890a4] transition-colors"
            href="/"
          >
            ← Back to home
          </Link>
        </p>
      </div>
    </main>
  );
}
