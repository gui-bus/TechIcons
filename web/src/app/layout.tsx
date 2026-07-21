import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TechIcons - SVG Icons Catalog",
  description:
    "A premium, curated collection of 290+ high-quality technology icons tailored for your GitHub profiles, READMEs, and projects.",
  keywords: [
    "techicons",
    "github icons",
    "svg icons",
    "development assets",
    "readme icons",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased bg-zinc-50 dark:bg-zinc-950`}
    >
      <body className="min-h-full flex flex-col w-full max-w-[110rem] mx-auto bg-zinc-50 dark:bg-zinc-950 text-zinc-950 dark:text-zinc-50">
        <NuqsAdapter>{children}</NuqsAdapter>
      </body>
    </html>
  );
}
