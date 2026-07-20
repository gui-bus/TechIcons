"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import iconsData from "../data/icons.json";
import { 
  MagnifyingGlass, 
  Sun, 
  Moon, 
  GithubLogo, 
  Copy, 
  Check, 
  X, 
  ArrowSquareOut,
  Sliders
} from "@phosphor-icons/react";
import { CATEGORIES, getIconCategory, CategoryType } from "../utils/categories";

interface IconItem {
  filename: string;
  label: string;
}

export default function Home() {
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState("");
  const [iconSize, setIconSize] = useState(60);
  const [globalTheme, setGlobalTheme] = useState<"dark" | "light">("light");
  const [selectedIcon, setSelectedIcon] = useState<IconItem | null>(null);
  const [activeTab, setActiveTab] = useState<"dark" | "light">("light");
  const [copiedType, setCopiedType] = useState<string | null>(null);
  const [rawSvgContent, setRawSvgContent] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>("all");

  const [visibleCount, setVisibleCount] = useState(24);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", globalTheme);
  }, [globalTheme]);

  useEffect(() => {
    setVisibleCount(24);
  }, [searchQuery, selectedCategory]);

  const filteredIcons = iconsData.filter((icon) => {
    const matchesSearch = icon.label.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || getIconCategory(icon.label) === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount((prev) => Math.min(prev + 24, filteredIcons.length));
        }
      },
      { rootMargin: "200px" }
    );

    const currentSentinel = sentinelRef.current;
    if (currentSentinel) {
      observer.observe(currentSentinel);
    }

    return () => {
      if (currentSentinel) {
        observer.unobserve(currentSentinel);
      }
    };
  }, [filteredIcons.length]);

  useEffect(() => {
    if (selectedIcon) {
      const folder = activeTab === "dark" ? "Dark" : "Light";
      const encodedFilename = encodeURIComponent(selectedIcon.filename).replace(/%20/g, "%20");
      fetch(`/${folder}/${encodedFilename}`)
        .then((res) => {
          if (res.ok) return res.text();
          throw new Error("Failed to fetch SVG");
        })
        .then((text) => setRawSvgContent(text))
        .catch(() => setRawSvgContent("<!-- Failed to load SVG -->"));
    } else {
      setRawSvgContent("");
    }
  }, [selectedIcon, activeTab]);

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 1500);
  };

  const getCdnUrl = (icon: IconItem, theme: "dark" | "light") => {
    const folder = theme === "dark" ? "Dark" : "Light";
    const escapedName = encodeURIComponent(icon.filename).replace(/%20/g, "%20");
    return `https://raw.githubusercontent.com/gui-bus/TechIcons/main/${folder}/${escapedName}`;
  };

  const getHtmlCode = (icon: IconItem, theme: "dark" | "light") => {
    return `<img alt="${icon.label}" height="${iconSize}" width="${iconSize}" src="${getCdnUrl(icon, theme)}">`;
  };

  const getMarkdownCode = (icon: IconItem, theme: "dark" | "light") => {
    return `![${icon.label}](${getCdnUrl(icon, theme)})`;
  };

  const logoSrc = globalTheme === "dark" 
    ? "/logo/techicons_logo_white.svg" 
    : "/logo/techicons_logo_black.svg";

  const visibleIcons = filteredIcons.slice(0, visibleCount);

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950 text-zinc-950 dark:text-zinc-50">
      <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 transition-colors">
        <div className="mx-auto max-w-[1200px] px-8 flex justify-between items-center h-20">
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
              onClick={() => setGlobalTheme(globalTheme === "dark" ? "light" : "dark")}
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

      <main className="mx-auto max-w-[1200px] px-8 flex-1 w-full">
        <section className="flex flex-col items-center text-center py-16 px-4">
          <div className="mb-4 hover:-translate-y-1 transition-transform duration-300">
            <img src={logoSrc} alt="TechIcons" className="h-14 w-auto" />
          </div>
          <p className="text-zinc-500 dark:text-zinc-400 text-lg max-w-[600px] mx-auto leading-relaxed font-medium">
            A premium, curated collection of high-quality technology icons tailored for your GitHub profiles, READMEs, and projects.
          </p>
        </section>

        <div className="flex flex-col md:flex-row gap-5 mb-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm">
          <div className="relative flex-1">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 flex items-center">
              <MagnifyingGlass size={18} weight="bold" />
            </span>
            <input
              type="text"
              placeholder="Search 290+ icons..."
              className="w-full pl-12 pr-4 py-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-900 dark:text-zinc-50 text-base font-medium outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-6 flex-wrap">
            <div className="flex items-center gap-3 text-sm font-semibold text-zinc-500 dark:text-zinc-400">
              <Sliders size={18} weight="bold" />
              <span>Size:</span>
              <input
                type="range"
                min="40"
                max="120"
                value={iconSize}
                onChange={(e) => setIconSize(Number(e.target.value))}
                className="w-[120px] h-1.5 rounded-full bg-zinc-200 dark:bg-zinc-800 accent-blue-600 cursor-pointer"
              />
              <span className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 px-3 py-1 rounded-lg text-xs font-bold text-zinc-900 dark:text-zinc-50">{iconSize}px</span>
            </div>
            <div className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 px-3 py-1 rounded-lg text-xs font-bold text-zinc-900 dark:text-zinc-50">
              {filteredIcons.length} icons
            </div>
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar scroll-smooth">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              className={`px-4 py-2 rounded-full text-sm font-semibold cursor-pointer whitespace-nowrap transition-all border ${
                selectedCategory === cat.value
                  ? "bg-blue-600 border-blue-600 text-white"
                  : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-50"
              }`}
              onClick={() => setSelectedCategory(cat.value)}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-6 mb-12">
          {visibleIcons.map((icon) => {
            const encodedFn = encodeURIComponent(icon.filename).replace(/%20/g, "%20");
            return (
              <div
                key={icon.filename}
                className="group bg-white border border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800 rounded-2xl p-6 flex flex-col items-center relative overflow-hidden cursor-pointer transition-all duration-300 shadow-sm hover:-translate-y-1 hover:border-blue-600 hover:shadow-lg hover:shadow-blue-600/5 dark:hover:shadow-blue-600/10"
                onClick={() => {
                  setSelectedIcon(icon);
                  setActiveTab(globalTheme);
                }}
              >
                <div className="flex items-center justify-center gap-10 h-[110px] w-full rounded-xl bg-zinc-50 dark:bg-zinc-950 mb-6 relative border border-transparent group-hover:border-zinc-200 dark:group-hover:border-zinc-800">
                  <div className="flex flex-col items-center gap-2">
                    <div className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Dark</div>
                    <img
                      src={`/Dark/${encodedFn}`}
                      alt={`${icon.label} Dark`}
                      width={Math.min(iconSize, 80)}
                      height={Math.min(iconSize, 80)}
                      loading="lazy"
                    />
                  </div>
                  <div className="w-[1px] h-[70px] bg-zinc-200 dark:bg-zinc-800 absolute left-1/2" />
                  <div className="flex flex-col items-center gap-2">
                    <div className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Light</div>
                    <img
                      src={`/Light/${encodedFn}`}
                      alt={`${icon.label} Light`}
                      width={Math.min(iconSize, 80)}
                      height={Math.min(iconSize, 80)}
                      loading="lazy"
                    />
                  </div>
                </div>
                <div className="text-lg font-bold mb-2 text-center text-zinc-900 dark:text-zinc-50">{icon.label}</div>
                <div className="text-sm text-zinc-400 dark:text-zinc-500 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 group-hover:text-blue-600 translate-y-1 group-hover:translate-y-0 transition-all duration-300">
                  <span>Copy Code</span>
                  <ArrowSquareOut size={12} />
                </div>
              </div>
            );
          })}
        </div>

        {visibleCount < filteredIcons.length && (
          <div ref={sentinelRef} className="h-10 my-8 flex justify-center items-center">
            <div className="w-8 h-8 border-3 border-zinc-200 dark:border-zinc-800 border-t-blue-600 rounded-full animate-spin"></div>
          </div>
        )}
      </main>

      <footer className="border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 py-10 text-center text-zinc-500 dark:text-zinc-400 text-sm">
        <div className="mx-auto max-w-[1200px] px-8">
          <p>Created by gui-bus &bull; Open-source on GitHub</p>
        </div>
      </footer>

      {selectedIcon && (
        <div className="fixed inset-0 bg-zinc-950/80 backdrop-blur-md flex items-center justify-center z-50 p-6" onClick={() => setSelectedIcon(null)}>
          <div className="bg-white border border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800 rounded-3xl max-w-[600px] w-full overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-zinc-200 dark:border-zinc-800">
              <span className="text-xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">{selectedIcon.label}</span>
              <button className="bg-transparent border-0 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center justify-center transition-all cursor-pointer" onClick={() => setSelectedIcon(null)}>
                <X size={20} weight="bold" />
              </button>
            </div>

            <div className="p-8">
              <div className="flex gap-2 mb-6 bg-zinc-50 dark:bg-zinc-950 p-1.5 rounded-2xl border border-zinc-200 dark:border-zinc-800">
                <button
                  className={`flex-1 bg-transparent border-0 rounded-xl py-2.5 text-sm font-bold flex items-center justify-center gap-2.5 transition-all cursor-pointer ${
                    activeTab === "dark" 
                      ? "bg-white text-zinc-900 dark:bg-zinc-900 dark:text-zinc-50 shadow-sm" 
                      : "text-zinc-400 dark:text-zinc-500"
                  }`}
                  onClick={() => setActiveTab("dark")}
                >
                  <Moon size={16} weight="bold" />
                  <span>Dark Theme Variant</span>
                </button>
                <button
                  className={`flex-1 bg-transparent border-0 rounded-xl py-2.5 text-sm font-bold flex items-center justify-center gap-2.5 transition-all cursor-pointer ${
                    activeTab === "light" 
                      ? "bg-white text-zinc-900 dark:bg-zinc-900 dark:text-zinc-50 shadow-sm" 
                      : "text-zinc-400 dark:text-zinc-500"
                  }`}
                  onClick={() => setActiveTab("light")}
                >
                  <Sun size={16} weight="bold" />
                  <span>Light Theme Variant</span>
                </button>
              </div>

              <div className="flex justify-center items-center bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-10 mb-8">
                <img
                  src={`/${activeTab === "dark" ? "Dark" : "Light"}/${encodeURIComponent(selectedIcon.filename).replace(/%20/g, "%20")}`}
                  alt={selectedIcon.label}
                  width={iconSize}
                  height={iconSize}
                />
              </div>

              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <div className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">HTML Image tag</div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      readOnly
                      className="flex-1 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 text-zinc-900 dark:text-zinc-50 font-mono text-sm outline-none focus:border-blue-600 truncate"
                      value={getHtmlCode(selectedIcon, activeTab)}
                    />
                    <button
                      className={`bg-blue-600 hover:bg-blue-700 text-white border-0 rounded-xl px-5 py-2.5 text-sm font-bold flex items-center justify-center gap-2 transition-all min-w-[100px] cursor-pointer ${
                        copiedType === "html" ? "bg-emerald-600 hover:bg-emerald-600" : ""
                      }`}
                      onClick={() => copyToClipboard(getHtmlCode(selectedIcon, activeTab), "html")}
                    >
                      {copiedType === "html" ? <Check size={16} weight="bold" /> : <Copy size={16} />}
                      <span>{copiedType === "html" ? "Copied" : "Copy"}</span>
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <div className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Markdown Syntax</div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      readOnly
                      className="flex-1 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 text-zinc-900 dark:text-zinc-50 font-mono text-sm outline-none focus:border-blue-600 truncate"
                      value={getMarkdownCode(selectedIcon, activeTab)}
                    />
                    <button
                      className={`bg-blue-600 hover:bg-blue-700 text-white border-0 rounded-xl px-5 py-2.5 text-sm font-bold flex items-center justify-center gap-2 transition-all min-w-[100px] cursor-pointer ${
                        copiedType === "markdown" ? "bg-emerald-600 hover:bg-emerald-600" : ""
                      }`}
                      onClick={() => copyToClipboard(getMarkdownCode(selectedIcon, activeTab), "markdown")}
                    >
                      {copiedType === "markdown" ? <Check size={16} weight="bold" /> : <Copy size={16} />}
                      <span>{copiedType === "markdown" ? "Copied" : "Copy"}</span>
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <div className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Direct CDN Link</div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      readOnly
                      className="flex-1 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 text-zinc-900 dark:text-zinc-50 font-mono text-sm outline-none focus:border-blue-600 truncate"
                      value={getCdnUrl(selectedIcon, activeTab)}
                    />
                    <button
                      className={`bg-blue-600 hover:bg-blue-700 text-white border-0 rounded-xl px-5 py-2.5 text-sm font-bold flex items-center justify-center gap-2 transition-all min-w-[100px] cursor-pointer ${
                        copiedType === "cdn" ? "bg-emerald-600 hover:bg-emerald-600" : ""
                      }`}
                      onClick={() => copyToClipboard(getCdnUrl(selectedIcon, activeTab), "cdn")}
                    >
                      {copiedType === "cdn" ? <Check size={16} weight="bold" /> : <Copy size={16} />}
                      <span>{copiedType === "cdn" ? "Copied" : "Copy"}</span>
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <div className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Raw SVG Source</div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      readOnly
                      className="flex-1 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 text-zinc-900 dark:text-zinc-50 font-mono text-sm outline-none focus:border-blue-600 truncate"
                      value={rawSvgContent || "Loading..."}
                    />
                    <button
                      className={`bg-blue-600 hover:bg-blue-700 text-white border-0 rounded-xl px-5 py-2.5 text-sm font-bold flex items-center justify-center gap-2 transition-all min-w-[100px] cursor-pointer ${
                        copiedType === "svg" ? "bg-emerald-600 hover:bg-emerald-600" : ""
                      }`}
                      disabled={!rawSvgContent}
                      onClick={() => copyToClipboard(rawSvgContent, "svg")}
                    >
                      {copiedType === "svg" ? <Check size={16} weight="bold" /> : <Copy size={16} />}
                      <span>{copiedType === "svg" ? "Copied" : "Copy"}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
