// app/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtDecode } from "jwt-decode";

const PUBLIC_ROUTES = ["/", "/login"];
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("token")?.value;

  const isPublic = PUBLIC_ROUTES.includes(pathname);
  if (isPublic) return NextResponse.next();
  if (!token) return NextResponse.redirect(new URL("/login", req.url));
  try {
    const decoded = jwtDecode<{ exp: number; sub: string }>(token);
    console.log(decoded);
    return NextResponse.next();
  } catch (err) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

// Only run middleware for these paths
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
