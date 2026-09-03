export const dynamic = "force-dynamic";

import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-[100svh] flex-col items-center justify-center gap-4 bg-[#fbfdfd] px-4 text-center">
      <h1 className="font-mono text-sm uppercase tracking-widest text-[#0d9488]">404</h1>
      <h2 className="text-3xl font-semibold tracking-tight text-[#1e3a5f]">
        This page drifted off the grid.
      </h2>
      <p className="text-sm text-[#1e3a5f]/70">
        The page you&apos;re looking for doesn&apos;t exist — but the vortex is still spinning.
      </p>
      <Link
        href="/"
        className="mt-2 rounded-md bg-[#0d9488] px-4 py-2 text-sm font-medium text-white hover:bg-[#0f766e]"
      >
        Back to the studio
      </Link>
    </main>
  );
}
