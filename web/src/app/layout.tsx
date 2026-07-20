import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col w-full max-w-[110rem] mx-auto">
        {children}
      </body>
    </html>
  );
}
