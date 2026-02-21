import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center text-center gap-4">
      <h1 className="text-3xl font-bold">Unauthorized</h1>
      <p className="text-gray-600">
        Opps! You don’t have permission to view the requested page.
      </p>

      <div className="flex gap-3">
        <Link href="/">Go Home</Link>
        <Link href="/auth/redirect">Go to Dashboard</Link>
      </div>
    </main>
  );
}
