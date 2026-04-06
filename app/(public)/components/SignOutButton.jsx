"use client";
import { useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function SignOutButton({ className }) {
  const { signOut } = useClerk();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push("/auth/login");
  };

  return (
    <button onClick={handleSignOut} className={className}>
      Sign Out
    </button>
  );
}