// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token");

  if (!token) {
    const loginUrl = new URL("/login", req.url);
    return NextResponse.redirect(loginUrl);
  }

  console.log("Token found:", token);
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/moje-konto/:path*"], // Protect these routes
};
