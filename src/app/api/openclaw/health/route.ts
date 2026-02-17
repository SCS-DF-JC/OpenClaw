import { NextResponse } from "next/server";

const HEALTH_URLS = [
  "http://127.0.0.1:18790/health",
  "http://agents.smartcontentsolutions.co.uk/health",
];

export async function GET() {
  for (const url of HEALTH_URLS) {
    try {
      const res = await fetch(url, { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        return NextResponse.json(data);
      }
    } catch {
      // try next URL
    }
  }

  return NextResponse.json(
    { ok: false, status: "unreachable", ts: new Date().toISOString() },
    { status: 502 }
  );
}
