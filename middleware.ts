import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Allow public routes
    if (pathname === '/login' || pathname === '/signup' || pathname === '/') {
        return NextResponse.next();
    }

    // Check if user is authenticated (this is a simplified check)
    // In a real app, you'd verify the Firebase token
    const authToken = request.cookies.get('auth-token');

    // if (!authToken && pathname.startsWith('/dashboard')) {
    //     return NextResponse.redirect(new URL('/login', request.url));
    // }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};