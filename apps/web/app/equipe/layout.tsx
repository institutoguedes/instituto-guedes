import type { Metadata } from "next";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: "Equipe",
};

export const dynamic = "force-dynamic";

export default function EquipeLayout({ children }: { children: React.ReactNode }) {
  return children;
}
