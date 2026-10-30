import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Check if the auth-token matches the current server boot ID
  const authToken = request.cookies.get('auth-token')?.value;
  const expectedBootId = process.env.BOOT_ID;
  const hasAuthToken = authToken === expectedBootId;
  
  // The path the user is trying to access
  const path = request.nextUrl.pathname;

  // Paths that don't require authentication
  const isPublicPath = path === '/login' || path.startsWith('/_next') || path.startsWith('/api') || path.includes('.');

  // If the user doesn't have a token and is trying to access a protected route
  if (!hasAuthToken && !isPublicPath) {
    // Redirect them to the login page
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.webm|.*\\.glb|.*\\.mp4|.*\\.png|.*\\.jpg).*)',
  ],
};
