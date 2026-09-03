"use client";
export const dynamic = "force-dynamic";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex min-h-[100svh] flex-col items-center justify-center gap-4 bg-[#fbfdfd] px-4 text-center">
      <h2 className="text-2xl font-semibold tracking-tight text-[#1e3a5f]">Something went wrong</h2>
      <button
        onClick={() => reset()}
        className="rounded-md bg-[#0d9488] px-4 py-2 text-sm font-medium text-white hover:bg-[#0f766e]"
      >
        Try again
      </button>
    </main>
  );
}
