import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Mundial FIFA · Hangar 14",
  description: "Torneo FIFA entre amigos — 3 de Julio · Hangar 14",
  openGraph: {
    title: "Mundial FIFA · Hangar 14",
    description: "Torneo FIFA entre amigos — 3 de Julio · Hangar 14",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mundial FIFA · Hangar 14",
    description: "Torneo FIFA entre amigos — 3 de Julio · Hangar 14",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="h-full">
      <body className={`${inter.className} min-h-full bg-black text-white`}>{children}</body>
    </html>
  );
}
