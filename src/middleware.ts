import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const isPublicRoute = req.nextUrl.pathname === '/login' || req.nextUrl.pathname === '/register' || req.nextUrl.pathname === '/';
    const isAuth = !!req.nextauth.token;

    // If logged in and on public route (like /login), redirect to dashboard
    if (isPublicRoute && isAuth) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    // If on / and not auth, redirect to login
    if (req.nextUrl.pathname === '/' && !isAuth) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  },
  {
    callbacks: {
      authorized({ req, token }) {
        const isPublicRoute = req.nextUrl.pathname === '/login' || req.nextUrl.pathname === '/register' || req.nextUrl.pathname === '/';
        if (isPublicRoute) return true;
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};
