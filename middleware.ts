import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Get the pathname of the request (e.g., /, /dashboard, /settings)
  const { pathname } = request.nextUrl;

  // Define protected routes that require authentication
  const protectedRoutes = [
    '/dashboard',
    '/settings',
    '/saved',
    '/api/user',
    '/api/saved',
  ];

  // Define public routes that don't require authentication
  const publicRoutes = [
    '/',
    '/pricing',
    '/auth/login',
    '/auth/register',
    '/search',
    '/api/search',
    '/api/business',
    '/api/analyze',
    '/api/contact',
    '/api/export',
  ];

  // Check if the current path is protected
  const isProtectedRoute = protectedRoutes.some(route =>
    pathname.startsWith(route)
  );

  // Check if the current path is public
  const isPublicRoute = publicRoutes.some(route =>
    pathname === route || pathname.startsWith(route)
  );

  // For now, we'll simulate authentication check
  // In a real app, this would check for valid JWT token, session, etc.
  const isAuthenticated = checkAuthentication(request);

  // Redirect to login if accessing protected route without authentication
  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect authenticated users away from auth pages
  if (isAuthenticated && (pathname.startsWith('/auth/login') || pathname.startsWith('/auth/register'))) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Add security headers to all responses
  const response = NextResponse.next();

  // Security headers
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  // CORS headers for API routes
  if (pathname.startsWith('/api/')) {
    response.headers.set('Access-Control-Allow-Origin', process.env.NEXT_PUBLIC_APP_URL || '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  }

  return response;
}

function checkAuthentication(request: NextRequest): boolean {
  // TODO: Implement actual authentication check
  // This is a placeholder - in a real app you would:
  // 1. Check for JWT token in cookies or Authorization header
  // 2. Validate the token
  // 3. Check token expiration
  // 4. Verify user exists in database

  // For development, we'll check for a simple session cookie
  const sessionCookie = request.cookies.get('session');
  const authHeader = request.headers.get('Authorization');

  // Mock authentication - replace with actual logic
  return !!(sessionCookie?.value || authHeader?.startsWith('Bearer '));
}

// Rate limiting helper
function isRateLimited(request: NextRequest): boolean {
  // TODO: Implement rate limiting logic
  // This could use Redis, in-memory cache, or database
  // to track requests per IP/user and enforce limits

  const userAgent = request.headers.get('user-agent') || '';
  const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown';

  // Basic bot detection
  const suspiciousPatterns = [
    /bot/i,
    /crawler/i,
    /spider/i,
    /scraper/i,
  ];

  return suspiciousPatterns.some(pattern => pattern.test(userAgent));
}

export const config = {
  /*
   * Match all request paths except for the ones starting with:
   * - _next/static (static files)
   * - _next/image (image optimization files)
   * - favicon.ico (favicon file)
   * - public folder files
   */
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
};