import Link from "next/link";
import Image from "next/image";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 md:p-8 bg-gray-950 relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-amber-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center animate-[fadeInUp_0.8s_ease-out_both]">
        {/* Hero Image */}
        <div className="relative group">
          <div className="absolute -inset-4 bg-gradient-to-b from-emerald-500/10 via-amber-500/5 to-transparent rounded-3xl blur-2xl opacity-60 group-hover:opacity-80 transition-opacity duration-700" />
          <Image
            src="/openclaw-scs-command-center.png"
            alt="OpenClaw — SCS Command Center"
            width={420}
            height={420}
            priority
            className="relative rounded-2xl shadow-2xl shadow-black/40 w-[280px] h-[280px] sm:w-[340px] sm:h-[340px] md:w-[420px] md:h-[420px] object-contain"
          />
        </div>

        {/* Title */}
        <h1 className="mt-10 text-3xl sm:text-4xl md:text-5xl font-bold text-white text-center tracking-tight">
          OpenClaw{" "}
          <span className="text-gray-500 font-light">—</span>{" "}
          <span className="bg-gradient-to-r from-emerald-400 to-amber-400 bg-clip-text text-transparent">
            SCS Command Center
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-4 text-sm sm:text-base text-gray-400 text-center max-w-lg leading-relaxed">
          AI Agent Control, Monitoring, and Rule Management
          <br className="hidden sm:block" />
          <span className="text-gray-500"> for </span>
          Smart Content Solutions
        </p>

        {/* Primary Button */}
        <Link
          href="/admin"
          className="mt-10 group relative inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-900/30 hover:from-emerald-500 hover:to-emerald-600 hover:shadow-emerald-800/40 hover:scale-[1.03] active:scale-[0.98] transition-all duration-200"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25a2.25 2.25 0 0 1-2.25-2.25v-2.25Z" />
          </svg>
          Go to Admin Panel
          <svg className="w-4 h-4 opacity-50 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
          </svg>
        </Link>

        {/* Secondary Link */}
        <Link
          href="/whoami"
          className="mt-4 text-xs text-gray-600 hover:text-gray-400 transition-colors duration-200"
        >
          Debug: /whoami
        </Link>
      </div>

      {/* Footer */}
      <p className="absolute bottom-6 text-[10px] text-gray-700 tracking-widest uppercase">
        Smart Content Solutions
      </p>
    </main>
  );
}
