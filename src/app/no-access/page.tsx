import Link from "next/link";

export default function NoAccessPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="glass rounded-2xl p-10 text-center max-w-md animate-[fadeInUp_0.5s_ease-out_both]">
        <span className="text-5xl mb-4 block">🔒</span>
        <h1 className="text-2xl font-bold text-white">Access Denied</h1>
        <p className="mt-3 text-sm text-[#8890a4]">
          You do not have the required role to access the SCS Command Center.
        </p>
        <p className="mt-6">
          <Link
            className="btn-gold inline-block px-6 py-2.5 text-sm rounded-lg"
            href="/sign-in"
          >
            Sign in with a different account
          </Link>
        </p>
        <p className="mt-3">
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
