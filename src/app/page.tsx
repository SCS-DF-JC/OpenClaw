"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  const [imgStatus, setImgStatus] = useState<"loading" | "loaded" | "missing">("loading");

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 md:p-8 relative overflow-hidden">
      <div className="relative z-10 flex flex-col items-center animate-[fadeInUp_0.8s_ease-out_both]">
        {/* Hero Image */}
        <div className="relative group">
          {/* Glow behind image */}
          <div className="absolute -inset-8 rounded-3xl blur-3xl opacity-50 group-hover:opacity-70 transition-opacity duration-700 bg-[radial-gradient(ellipse,rgba(220,38,38,0.12),rgba(212,168,67,0.08),transparent)]" />

          {imgStatus !== "missing" ? (
            <Image
              src="/brand/openclaw-scs-hero.png"
              alt="OpenClaw — SCS Command Center"
              width={440}
              height={440}
              priority
              onLoad={() => setImgStatus("loaded")}
              onError={() => setImgStatus("missing")}
              className="relative rounded-2xl shadow-2xl shadow-black/50 w-[260px] h-[260px] sm:w-[340px] sm:h-[340px] md:w-[440px] md:h-[440px] object-contain border border-white/[0.08]"
            />
          ) : (
            /* Fallback card */
            <div className="relative glass rounded-2xl w-[260px] h-[260px] sm:w-[340px] sm:h-[340px] md:w-[440px] md:h-[440px] flex flex-col items-center justify-center gap-3 text-center px-6">
              <span className="text-5xl">🦀</span>
              <p className="text-sm text-[#b8bcc8]">Hero media missing</p>
              <code className="text-[10px] text-[#6b7394] bg-white/[0.04] rounded px-2 py-1">
                /brand/openclaw-scs-hero.png
              </code>
            </div>
          )}
        </div>

        {/* Asset status indicator */}
        <div className="mt-4 flex items-center gap-2">
          <span
            className={`inline-block w-1.5 h-1.5 rounded-full ${
              imgStatus === "loaded"
                ? "bg-emerald-400"
                : imgStatus === "missing"
                ? "bg-red-400"
                : "bg-amber-400 animate-pulse"
            }`}
          />
          <span className="text-[10px] text-[#4a5068] uppercase tracking-widest">
            Asset {imgStatus === "loaded" ? "Loaded" : imgStatus === "missing" ? "Missing" : "Loading…"}
          </span>
        </div>

        {/* Title */}
        <h1 className="mt-8 text-3xl sm:text-4xl md:text-5xl font-bold text-white text-center tracking-tight leading-tight">
          OpenClaw{" "}
          <span className="text-[#4a5068] font-light">—</span>{" "}
          <span className="bg-gradient-to-r from-[#d4a843] via-[#e8c45a] to-[#d4a843] bg-clip-text text-transparent">
            SCS Command Center
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-4 text-sm sm:text-base text-[#8890a4] text-center max-w-lg leading-relaxed">
          AI Agent Control, Monitoring, and Rule Management
          <br className="hidden sm:block" />
          <span className="text-[#6b7394]"> for </span>
          <span className="text-[#b8bcc8]">Smart Content Solutions</span>
        </p>

        {/* Primary Button */}
        <Link
          href="/admin"
          className="mt-10 btn-gold inline-flex items-center gap-2.5 rounded-xl px-8 py-3.5 text-sm"
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
          className="mt-4 text-xs text-[#4a5068] hover:text-[#8890a4] transition-colors duration-200"
        >
          Debug: /whoami
        </Link>
      </div>

      {/* Footer */}
      <p className="absolute bottom-6 text-[10px] text-[#2a2f42] tracking-widest uppercase">
        Smart Content Solutions
      </p>
    </main>
  );
}
