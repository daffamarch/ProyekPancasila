import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // We can't access localStorage in middleware (server-side)
  // But we can use cookies. Since the current app uses localStorage,
  // I will implement a client-side guard improvement first.
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/reports', '/profil/:path*', '/input'],
};
