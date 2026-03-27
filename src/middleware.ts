import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const CANONICAL_HOST = "sportscalendar.xyz";

export function middleware(request: NextRequest) {
  const host = request.headers.get("host") || "";

  // Redirect any non-canonical host (e.g. *.vercel.app) to the custom domain
  if (
    host !== CANONICAL_HOST &&
    host !== `www.${CANONICAL_HOST}` &&
    !host.startsWith("localhost")
  ) {
    const url = new URL(request.url);
    url.host = CANONICAL_HOST;
    url.port = "";
    url.protocol = "https:";
    return NextResponse.redirect(url, 301);
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/((?!api|_next/static|_next/image|favicon.ico|icon|apple-icon|.*\\.png$|.*\\.svg$|.*\\.json$|.*\\.xml$|.*\\.txt$).*)",
};
