import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export default async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const publicRoutes = ["/login", "/register"];
  const protectedRoutes = ["/applicant", "/employer", "/admin"];

  const session = (await cookies()).get("session")?.value;

  // Not logged in → block protected routes
  if (!session && protectedRoutes.some(p => pathname.startsWith(p))) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  // Logged in → block auth pages
  if (session && publicRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next|favicon.ico).*)"],
};
