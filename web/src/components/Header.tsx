"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sun, Moon, GithubLogo } from "@phosphor-icons/react";

interface HeaderProps {
  globalTheme: "dark" | "light";
  onToggleTheme: () => void;
}

export default function Header({ globalTheme, onToggleTheme }: HeaderProps) {
  const pathname = usePathname();
  const logoSrc = globalTheme === "dark" 
    ? "/logo/techicons_logo_white.svg" 
    : "/logo/techicons_logo_black.svg";

  return (
    <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 transition-colors">
      <div className="px-8 flex justify-between items-center h-20">
        <div className="flex items-center gap-8">
          <img src={logoSrc} alt="TechIcons Logo" className="h-10 w-auto" />
          <nav className="flex gap-2">
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
        <div className="flex gap-4 items-center">
          <button
            onClick={onToggleTheme}
            className="bg-zinc-50 hover:bg-white border border-zinc-200 hover:border-zinc-300 dark:bg-zinc-950 dark:hover:bg-zinc-800 dark:border-zinc-800 dark:hover:border-zinc-700 text-zinc-900 dark:text-zinc-50 rounded-xl px-5 py-2.5 text-sm font-semibold flex items-center gap-2.5 shadow-sm transition-all cursor-pointer"
            aria-label="Toggle theme"
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
          <a
            href="https://github.com/gui-bus/TechIcons"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-zinc-900 border border-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-50 dark:border-zinc-50 dark:hover:bg-zinc-200 dark:text-zinc-950 rounded-xl px-5 py-2.5 text-sm font-semibold flex items-center gap-2.5 shadow-sm transition-all cursor-pointer"
            style={{ textDecoration: "none" }}
          >
            <GithubLogo size={18} weight="bold" />
            <span>Star on GitHub</span>
          </a>
        </div>
      </div>
    </header>
  );
}
