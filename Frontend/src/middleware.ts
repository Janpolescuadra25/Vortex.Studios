import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const INTERNAL_ROUTE = "/owner-console";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname === INTERNAL_ROUTE || pathname.startsWith(`${INTERNAL_ROUTE}/`)) {
    return new NextResponse(null, { status: 404 });
  }

  const adminPath = process.env.ADMIN_PATH;
  if (adminPath && pathname === `/${adminPath}`) {
    return NextResponse.rewrite(new URL(INTERNAL_ROUTE, req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|logo.svg|robots.txt).*)"],
};
