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
  metadataBase: new URL('https://techicons.guibus.dev'),
  title: {
    default: "TechIcons | High-Quality SVG Icons Catalog",
    template: "%s | TechIcons"
  },
  description:
    "A premium, curated collection of 290+ high-quality technology icons tailored for your GitHub profiles, READMEs, and projects. Build your tech stack visually.",
  keywords: [
    "techicons",
    "github icons",
    "svg icons",
    "development assets",
    "readme icons",
    "tech stack generator",
    "developer profile"
  ],
  authors: [{ name: "Guilherme" }],
  creator: "Guilherme",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://techicons.guibus.dev",
    title: "TechIcons | High-Quality SVG Icons Catalog",
    description: "A premium, curated collection of 290+ high-quality technology icons tailored for your GitHub profiles, READMEs, and projects.",
    siteName: "TechIcons",
    images: [
      {
        url: "/logo/banner.png",
        width: 1200,
        height: 630,
        alt: "TechIcons Banner",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "TechIcons | High-Quality SVG Icons Catalog",
    description: "A premium, curated collection of 290+ high-quality technology icons tailored for your GitHub profiles, READMEs, and projects.",
    images: ["/logo/banner.png"],
  },
  robots: {
    index: true,
    follow: true,
  }
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
