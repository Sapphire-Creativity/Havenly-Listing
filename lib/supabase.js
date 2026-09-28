// lib/supabase.js
import { createClient } from "@supabase/supabase-js";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Wait for Clerk to finish loading once (max ~3s), then never wait again
let clerkReady;
const waitForClerk = () =>
  (clerkReady ??= (async () => {
    for (let i = 0; i < 30 && !window.Clerk?.loaded; i++) await sleep(100);
  })());

// Returns the signed-in user's Clerk token, or null for signed-out visitors
// (null means Supabase treats the request as anonymous, same as today)
async function getClerkToken() {
  if (typeof window === "undefined") return null;
  await waitForClerk();
  try {
    return (await window.Clerk?.session?.getToken()) ?? null;
  } catch {
    return null;
  }
}

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  { accessToken: getClerkToken },
);