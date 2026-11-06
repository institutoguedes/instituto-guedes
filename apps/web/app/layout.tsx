import type { Metadata, Viewport } from "next";
import { Fraunces, Nunito_Sans } from "next/font/google";
import "./globals.css";

const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
});

const corpo = Nunito_Sans({
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: {
    default: "Cruzada Evangelística",
    template: "%s · Cruzada Evangelística",
  },
  description:
    "Cristo a Verdade que Liberta. Deixe seu contato para uma liderança caminhar com você depois da decisão por Jesus.",
  applicationName: "Cruzada Evangelística",
  icons: { icon: "/icon.png", apple: "/icon.png" },
  manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = {
  themeColor: "#100c08",
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
