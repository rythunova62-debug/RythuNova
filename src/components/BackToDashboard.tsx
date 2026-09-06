import Link from "next/link";

// Plain server-safe link (no i18n) — used on admin pages, which stay English.
export default function BackToDashboard({ href }: { href: string }) {
  return (
    <Link href={href} className="mb-4 inline-block text-sm text-stone-500 hover:text-stone-800 hover:underline">
      ← Back to Dashboard
    </Link>
  );
}
