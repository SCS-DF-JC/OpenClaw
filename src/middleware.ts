import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isAdminRoute = createRouteMatcher(["/admin(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  // Only protect /admin routes; everything else (including /whoami) passes through
  if (!isAdminRoute(req)) return NextResponse.next();

  // Protect /admin — unauthenticated users go to /sign-in
  const { userId } = await auth.protect({
    unauthenticatedUrl: new URL("/sign-in", req.url).toString(),
  });

  // Fetch the full user record from Clerk backend (always fresh)
  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  const role = (user.publicMetadata as any)?.role;

  // Only admins allowed
  if (role !== "admin") {
    return NextResponse.redirect(new URL("/no-access", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin(.*)", "/whoami"],
};
