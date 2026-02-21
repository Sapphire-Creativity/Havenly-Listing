// import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
// import { NextResponse } from "next/server";

// const isAuthRoute = createRouteMatcher(["/auth(.*)"]);
// const isOwnerRoute = createRouteMatcher(["/propertyowner(.*)"]);
// const isClientRoute = createRouteMatcher(["/client(.*)"]);

// const isPublicRoute = createRouteMatcher([
//   "/",
//   "/buy",
//   "/shortlet",
//   "/rent",
//   "/unauthorized",
// ]);

// export default clerkMiddleware((auth, req) => {
//   const { userId, sessionClaims } = auth();
//   const { pathname } = req.nextUrl;
//   console.log("User ID:", userId);

//   // 1️⃣ Always allow public routes
//   if (isPublicRoute(req)) {
//     return NextResponse.next();
//   }

//   // 2️⃣ Let the redirect handler through — it manages its own logic
//   if (pathname === "/auth/redirect") {
//     return NextResponse.next();
//   }

//   // 3️⃣ Not signed in → allow auth pages only
//   if (!userId) {
//     if (isAuthRoute(req)) {
//       return NextResponse.next();
//     }
//     return NextResponse.redirect(new URL("/auth/login", req.url));
//   }

//   // 4️⃣ Signed in → block login/signup/verify pages
//   if (isAuthRoute(req)) {
//     return NextResponse.redirect(new URL("/auth/redirect", req.url));
//   }

//   // 5️⃣ Requires JWT template fix (Option A) or publicMetadata (Option B) to work
//   const role = sessionClaims?.unsafeMetadata?.role;
//   // const emailVerified = sessionClaims?.email_verified;

//   // if (!emailVerified && pathname !== "/auth/email-verification") {
//   //   return NextResponse.redirect(new URL("/auth/email-verification", req.url));
//   // }

//   if (isOwnerRoute(req) && role !== "owner") {
//     return NextResponse.redirect(new URL("/unauthorized", req.url));
//   }

//   if (isClientRoute(req) && role !== "client") {
//     return NextResponse.redirect(new URL("/unauthorized", req.url));
//   }

//   return NextResponse.next();
// });

// export const config = {
//   matcher: ["/((?!_next|.*\\..*).*)"],
// };

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
  "/shortlet",
  "/rent",
  "/unauthorized",
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
    if (isVerifyRoute(req))
      return NextResponse.redirect(new URL("/auth/signup", req.url));
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
