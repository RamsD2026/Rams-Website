import type { Metadata } from "next";
import { IBM_Plex_Sans, Roboto } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { VersionSwitcher } from "@/components/ui/VersionSwitcher";

/* Headings — IBM Plex Sans (as used by Verity.net) */
const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-heading",
  display: "swap",
});

/* Body & UI — Roboto */
const roboto = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "RAMS 2.0 — Operational Intelligence for the Modern Warehouse",
  description:
    "RAMS delivers AI-powered warehouse intelligence, digital twin platforms, and enterprise automation solutions trusted by global operations teams.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${ibmPlexSans.variable} ${roboto.variable} antialiased`}>
      <body className="min-h-screen">
        <Header />
        <main>{children}</main>
        <VersionSwitcher />
      </body>
    </html>
  );
}
