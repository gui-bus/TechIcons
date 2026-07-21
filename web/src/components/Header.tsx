"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Sun,
  Moon,
  GithubLogo,
  PlusCircle,
  List,
  X,
} from "@phosphor-icons/react";
import RequestIconModal from "./RequestIconModal";

interface HeaderProps {
  globalTheme: "dark" | "light";
  onToggleTheme: () => void;
}

export default function Header({ globalTheme, onToggleTheme }: HeaderProps) {
  const pathname = usePathname();
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const logoSrc =
    globalTheme === "dark"
      ? "/logo/techicons_logo_white.svg"
      : "/logo/techicons_logo_black.svg";

  return (
    <header>
      <div className="px-5 md:px-8 flex justify-around items-center h-20">
        <div className="flex items-center gap-8">
          <Link href="/">
            <Image
              src={logoSrc}
              alt="TechIcons Logo"
              width={140}
              height={40}
              className="h-10 w-auto"
            />
          </Link>

          <nav className="max-md:hidden flex gap-2">
            <Link
              href="/"
              className={`text-sm font-semibold rounded-lg px-3 py-2 transition-all ${
                pathname === "/"
                  ? "text-zinc-900 bg-zinc-100 dark:text-zinc-50 dark:bg-zinc-800"
                  : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50 dark:text-zinc-400 dark:hover:text-zinc-50 dark:hover:bg-zinc-800"
              }`}
            >
              Catalog
            </Link>
            <Link
              href="/builder"
              className={`text-sm font-semibold rounded-lg px-3 py-2 transition-all ${
                pathname === "/builder"
                  ? "text-zinc-900 bg-zinc-100 dark:text-zinc-50 dark:bg-zinc-800"
                  : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50 dark:text-zinc-400 dark:hover:text-zinc-50 dark:hover:bg-zinc-800"
              }`}
            >
              Stack Builder
            </Link>
          </nav>
        </div>
        <div className="max-md:hidden flex gap-4 items-center">
          <button
            onClick={onToggleTheme}
            className="px-5 py-2.5 text-sm font-semibold flex items-center gap-2.5 transition-all cursor-pointer hover:scale-105"
            aria-label="Toggle theme"
          >
            {globalTheme === "dark" ? (
              <Sun size={18} weight="bold" />
            ) : (
              <Moon size={18} weight="bold" />
            )}
          </button>
          <button
            onClick={() => setIsRequestModalOpen(true)}
            className="bg-white border border-zinc-200 hover:bg-zinc-50 dark:bg-zinc-900 dark:border-zinc-800 dark:hover:bg-zinc-800 text-zinc-900 dark:text-zinc-50 rounded-xl px-5 py-2.5 text-sm font-semibold flex items-center gap-2.5 shadow-sm transition-all cursor-pointer"
          >
            <PlusCircle size={18} weight="bold" />
            <span>Request Icon</span>
          </button>
          <Link
            href="https://github.com/gui-bus/TechIcons"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-zinc-900 border border-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-50 dark:border-zinc-50 dark:hover:bg-zinc-200 dark:text-zinc-950 rounded-xl px-5 py-2.5 text-sm font-semibold flex items-center gap-2.5 shadow-sm transition-all cursor-pointer"
            style={{ textDecoration: "none" }}
          >
            <GithubLogo size={18} weight="bold" />
            <span>Star on GitHub</span>
          </Link>
        </div>

        <button
          className="md:hidden flex p-2 text-zinc-900 dark:text-zinc-50 rounded-lg bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-800 dark:hover:bg-zinc-700 border border-zinc-200 dark:border-zinc-700 cursor-pointer transition-colors"
          onClick={() => setIsMobileMenuOpen(true)}
        >
          <List size={22} weight="bold" />
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="fixed inset-0 bg-zinc-950/80 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-white py-6 pb-12 shadow-xl dark:bg-zinc-900 border-l border-zinc-200 dark:border-zinc-800 flex-1">
            <div className="flex items-center justify-between px-6 mb-8">
              <Image
                src={logoSrc}
                alt="TechIcons Logo"
                width={120}
                height={34}
                className="h-8 w-auto"
              />
              <button
                type="button"
                className="-mr-2 flex h-10 w-10 items-center justify-center rounded-lg p-2 text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-800 cursor-pointer transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <X size={22} weight="bold" />
              </button>
            </div>

            <div className="px-4 flex flex-col gap-2">
              <Link
                href="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`text-base font-semibold rounded-lg px-4 py-3 transition-all ${
                  pathname === "/"
                    ? "text-zinc-900 bg-zinc-100 dark:text-zinc-50 dark:bg-zinc-800"
                    : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 dark:text-zinc-400 dark:hover:text-zinc-50 dark:hover:bg-zinc-800"
                }`}
              >
                Catalog
              </Link>
              <Link
                href="/builder"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`text-base font-semibold rounded-lg px-4 py-3 transition-all ${
                  pathname === "/builder"
                    ? "text-zinc-900 bg-zinc-100 dark:text-zinc-50 dark:bg-zinc-800"
                    : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 dark:text-zinc-400 dark:hover:text-zinc-50 dark:hover:bg-zinc-800"
                }`}
              >
                Stack Builder
              </Link>
            </div>

            <div className="mt-auto px-6 pt-8 flex flex-col gap-3">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onToggleTheme();
                }}
                className="bg-zinc-50 hover:bg-white border border-zinc-200 hover:border-zinc-300 dark:bg-zinc-950 dark:hover:bg-zinc-800 dark:border-zinc-800 dark:hover:border-zinc-700 text-zinc-900 dark:text-zinc-50 rounded-xl px-5 py-3 text-sm font-semibold flex items-center justify-center gap-2.5 shadow-sm transition-all cursor-pointer w-full"
              >
                {globalTheme === "dark" ? (
                  <>
                    <Sun size={18} weight="bold" />
                    <span>Light Mode</span>
                  </>
                ) : (
                  <>
                    <Moon size={18} weight="bold" />
                    <span>Dark Mode</span>
                  </>
                )}
              </button>
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsRequestModalOpen(true);
                }}
                className="bg-white border border-zinc-200 hover:bg-zinc-50 dark:bg-zinc-900 dark:border-zinc-800 dark:hover:bg-zinc-800 text-zinc-900 dark:text-zinc-50 rounded-xl px-5 py-3 text-sm font-semibold flex items-center justify-center gap-2.5 shadow-sm transition-all cursor-pointer w-full"
              >
                <PlusCircle size={18} weight="bold" />
                <span>Request Icon</span>
              </button>
              <Link
                href="https://github.com/gui-bus/TechIcons"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-zinc-900 border border-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-50 dark:border-zinc-50 dark:hover:bg-zinc-200 dark:text-zinc-950 rounded-xl px-5 py-3 text-sm font-semibold flex items-center justify-center gap-2.5 shadow-sm transition-all cursor-pointer w-full"
                style={{ textDecoration: "none" }}
              >
                <GithubLogo size={18} weight="bold" />
                <span>Star on GitHub</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {isRequestModalOpen && (
        <RequestIconModal onClose={() => setIsRequestModalOpen(false)} />
      )}
    </header>
  );
}
