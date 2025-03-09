// middleware.js
import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // If user is authenticated, allow access
  if (token) {
    return NextResponse.next();
  }

  // Redirect to signin page with a return URL
  const url = req.nextUrl.clone();
  url.pathname = '/auth/signin';
  url.searchParams.set('callbackUrl', req.nextUrl.pathname);
  return NextResponse.redirect(url);
}

// Specify which routes this middleware applies to
export const config = {
  matcher: ['/pro-plan'],
};
