import { NextResponse } from "next/server";

export function middleware(req) {
  // Let NextAuth handle auth; just allow the route to exist
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard"]
};
