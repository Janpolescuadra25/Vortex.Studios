import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vortex — Owner",
  robots: { index: false, follow: false },
};

export default function OwnerConsoleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
