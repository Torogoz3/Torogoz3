import { NextResponse } from "next/server";

export function middleware(req: Request) {
  const url = new URL(req.url);

  // Dominios permitidos por el momento
  const allowedHosts = ["torogoz3.vercel.app","localhost"];

  
  if (!allowedHosts.includes(url.hostname)) {
    return new Response("No autorizado", { status: 403 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/public/:path*", 
};
