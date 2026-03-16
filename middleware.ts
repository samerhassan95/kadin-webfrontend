import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const PUBLIC_FILE = /\.(.*)$/;

export const middleware = async (request: NextRequest) => {
  const { pathname } = request.nextUrl;
  
  // Default settings - no API calls in middleware
  const defaultSettings = {
    ui_type: process.env.NEXT_PUBLIC_UI_TYPE || '1'
  };
  
  if (PUBLIC_FILE.test(pathname)) {
    return NextResponse.next();
  }

  if (!cookies().has("token") && (pathname.includes("/profile") || pathname.includes("/orders"))) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    return NextResponse.redirect(loginUrl, 302);
  }

  const uiType = ["2", "3", "4"].find((type) => type === defaultSettings?.ui_type);

  if (!!uiType && (pathname === "/" || pathname === "/products")) {
    return NextResponse.rewrite(
      new URL(`${pathname === "/" ? `/home-${uiType}` : `${pathname}-${uiType}`}`, request.url)
    );
  }

  if (pathname.startsWith("/shops/") && !!uiType) {
    return NextResponse.rewrite(new URL(pathname.replace("shops", `shops-${uiType}`), request.url));
  }

  return NextResponse.next();
};

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|assets|favicon.ico|sw.js).*)"],
};