import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

// Add paths that don't require authentication
const publicPaths = ['/login', '/signup', '/'];

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Check if the path is public
  if (publicPaths.includes(path)) {
    return NextResponse.next();
  }

  const token = request.cookies.get('token')?.value;

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    // Verify JWT token
    jwt.verify(token, process.env.JWT_SECRET!);
    return NextResponse.next();
  } catch {
    // Invalid token
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

// Specify which paths should be protected
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/profile/:path*',
    '/stress', // Protect the stress page
    // Add other protected routes here
  ],
};
