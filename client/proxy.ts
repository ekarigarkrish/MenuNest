import { NextResponse, type NextRequest } from 'next/server'

export default function proxy(req: NextRequest) {
    const token = req.cookies.get('auth_token')?.value;

    if (!token) {
        return NextResponse.redirect(new URL('/', req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: '/admin/:path*',
}