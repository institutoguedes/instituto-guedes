import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Karla } from "next/font/google";
import "./globals.css";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
});

const corpo = Karla({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: {
    default: "Cruzada Evangelística",
    template: "%s · Cruzada Evangelística",
  },
  description:
    "Você aceitou Jesus na Cruzada Evangelística? Deixe seu contato para ser acompanhado por líderes da sua região.",
  openGraph: {
    title: "Aceitei Jesus — Cruzada Evangelística",
    description: "Deixe seu contato para ser acompanhado na sua caminhada com Cristo.",
    type: "website",
    locale: "pt_BR",
  },
  applicationName: "Cruzada Evangelística",
  icons: { icon: "/icon.png", apple: "/icon.png" },
  manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = {
  themeColor: "#f6f1e7",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className={`${display.variable} ${corpo.variable}`}>{children}</body>
    </html>
  );
}
