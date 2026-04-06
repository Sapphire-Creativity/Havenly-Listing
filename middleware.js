import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isAuthRoute = createRouteMatcher([
  "/auth/login",
  "/auth/signup",
  "/auth/redirect",
]);
const isVerifyRoute = createRouteMatcher(["/auth/email-verification"]);
const isOwnerRoute = createRouteMatcher(["/propertyowner(.*)"]);
const isClientRoute = createRouteMatcher(["/client(.*)"]);

const isPublicRoute = createRouteMatcher([
  "/",
  "/buy",
  "/buy/(.*)",
  "/shortlet",
  "/shortlet/(.*)",
  "/rent",
  "/rent/(.*)",
  "/unauthorized",
  "/api/webhooks/clerk",
]);

export default clerkMiddleware(async (auth, req) => {
  // ✅ async
  const { userId, sessionClaims } = await auth(); // ✅ awaited
  const { pathname } = req.nextUrl;

  console.log("Session claims:", JSON.stringify(sessionClaims, null, 2));

  console.log("Middleware running for:", pathname);
  console.log("User ID:", userId);

  if (isPublicRoute(req)) {
    return NextResponse.next();
  }

  if (pathname === "/auth/redirect") {
    return NextResponse.next();
  }

  if (!userId) {
    if (isAuthRoute(req)) return NextResponse.next();
    if (isVerifyRoute(req)) return NextResponse.next();
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  if (isAuthRoute(req)) {
    return NextResponse.redirect(new URL("/auth/redirect", req.url));
  }

  const role = sessionClaims?.unsafeMetadata?.role;

  if (isOwnerRoute(req) && role !== "owner") {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  if (isClientRoute(req) && role !== "client") {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)"],
};
