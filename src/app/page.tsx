import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-10 bg-gradient-to-b from-emerald-50 to-white px-6 py-16 text-center">
      <div className="flex flex-col gap-3">
        <h1 className="text-4xl font-bold tracking-tight text-emerald-900 sm:text-5xl">
          RythuNova
        </h1>
        <p className="max-w-md text-balance text-emerald-700">
          Drone-based crop spraying, connecting West Godavari farmers with
          trained drone pilots.
        </p>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row">
        <Link
          href="/auth/pilot/signup"
          className="rounded-lg bg-emerald-700 px-8 py-3 font-medium text-white shadow-sm transition hover:bg-emerald-800"
        >
          Pilot Signup
        </Link>
        <Link
          href="/auth/pilot/login"
          className="rounded-lg border border-emerald-700 px-8 py-3 font-medium text-emerald-800 transition hover:bg-emerald-50"
        >
          Pilot Login
        </Link>
        <Link
          href="/auth/provider/register"
          className="rounded-lg border border-emerald-700 px-8 py-3 font-medium text-emerald-800 transition hover:bg-emerald-50"
        >
          Drone Provider Signup
        </Link>
        <Link
          href="/auth/admin/login"
          className="rounded-lg border border-stone-300 px-8 py-3 font-medium text-stone-600 transition hover:bg-stone-50"
        >
          Admin Login
        </Link>
      </div>
    </main>
  );
}
