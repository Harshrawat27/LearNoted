// middleware.js
import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  // Function that will be executed on protected routes
  //function middleware(req) {
  function middleware() {
    // You can add additional logic here if needed
    return NextResponse.next();
  },
  {
    callbacks: {
      // Return true if the user is authenticated, false otherwise
      authorized: ({ token }) => !!token,
    },
  }
);

// Define which routes to protect
export const config = {
  // Using a matcher to protect specific routes
  matcher: ['/pro-plan', '/dashboard', '/api/upgrade-plan'],
};
