import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

/*
 * The three families are self-hosted from `app/fonts/` rather than fetched
 * from Google at build time. `next/font/google` downloads the files during
 * every build, and when Google did not answer the Vercel build failed
 * outright — four production deploys did. These are the same files Google
 * serves for the `latin` subset (each is one variable font covering every
 * weight the site uses), so nothing renders differently.
 *
 * To update: request the css2 URL for the family with a modern user agent,
 * take the `latin` block's woff2, and replace the file here.
 */

/* Headings — IBM Plex Sans (as used by Verity.net), weights 300–700 */
const ibmPlexSans = localFont({
  src: "./fonts/IBMPlexSans-latin.woff2",
  weight: "300 700",
  style: "normal",
  variable: "--font-heading",
  display: "swap",
});

/* Body & UI — Roboto, weights 300–700 */
const roboto = localFont({
  src: "./fonts/Roboto-latin.woff2",
  weight: "300 700",
  style: "normal",
  variable: "--font-body",
  display: "swap",
});

/* Mono — Roboto Mono, weights 300–500 */
const robotoMono = localFont({
  src: "./fonts/RobotoMono-latin.woff2",
  weight: "300 500",
  style: "normal",
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "RAMS 2.0 - Operational Intelligence for the Modern Warehouse",
  description:
    "RAMS delivers AI-powered warehouse intelligence, digital twin platforms, and enterprise automation solutions trusted by global operations teams.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${ibmPlexSans.variable} ${roboto.variable} ${robotoMono.variable} antialiased`}>
      <body className="min-h-screen">
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
