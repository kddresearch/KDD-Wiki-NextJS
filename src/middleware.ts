import { NextRequest, NextResponse } from 'next/server'
import { UserActivity } from './app/lib/models/user_activity'
import { auth } from '@/auth'
import KddUser from './app/lib/models/kdd_user';

export async function middleware(req: NextRequest) {

  const session = await auth();
  let user;
  if (!session) {
    user = KddUser.guestFactory();
  } else {
    user = new KddUser(session.user);
  }

  var res = NextResponse.next();

  const userActivity = UserActivity.viewedPage(
    user.id,
    res.status,
    req.nextUrl.hostname,
    req.nextUrl.pathname,
    req.nextUrl.href
  );
  console.log(res.status);
  // console.log(userActivity.toString())
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - auth (Auth routes)
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!auth|api|_next/static|_next/image|favicon.ico|static).*)',
  ],
}