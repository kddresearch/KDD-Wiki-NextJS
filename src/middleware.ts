// import { NextRequest, NextResponse } from 'next/server'
// import { UserActivity } from './app/lib/models/user_activity'
// import { auth } from '@/auth'
// import KddUser from './app/lib/models/kdd_user';

import { NextRequest } from "next/server";

export default function middleware(req: NextRequest) {
    // https://nextjs.org/docs/app/api-reference/functions/next-request#ip
    const ip = req.headers.get('X-Forwarded-For')
    // console.log(ip);
}

// export const config = {
//   matcher: [
//     /*
//      * Match all request paths except for the ones starting with:
//      * - auth (Auth routes)
//      * - api (API routes)
//      * - _next/static (static files)
//      * - _next/image (image optimization files)
//      * - favicon.ico (favicon file)
//      */
//     '/((?!auth|api|_next/static|_next/image|favicon.ico|static).*)',
//   ],
// }