import { NextResponse } from "next/server";
import { auth } from "@/lib/auth.config";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const { nextUrl } = req;
  const isAdminPage = nextUrl.pathname.startsWith("/admin");
  const isLoginPage = nextUrl.pathname === "/admin/login";

  // Redirect to login if not logged in and trying to access admin pages
  if (isAdminPage && !isLoginPage && !isLoggedIn) {
    return NextResponse.redirect(new URL("/admin/login", nextUrl));
  }

  // Redirect to admin dashboard if logged in and trying to access login page
  if (isLoginPage && isLoggedIn) {
    return NextResponse.redirect(new URL("/admin", nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*"],
};
