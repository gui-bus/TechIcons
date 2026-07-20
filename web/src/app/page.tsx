"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import Link from "next/link";
import { useQueryState } from "nuqs";
import iconsData from "../data/icons.json";
import { MagnifyingGlass, Sliders } from "@phosphor-icons/react";
import { getIconCategory, CategoryType } from "../utils/categories";
import Header from "../components/Header";
import Footer from "../components/Footer";
import CategoryFilters from "../components/CategoryFilters";
import IconCard from "../components/IconCard";
import CopyModal from "../components/CopyModal";

interface IconItem {
  filename: string;
  label: string;
}

function CatalogContent() {
  const [searchQuery, setSearchQuery] = useQueryState("search", { defaultValue: "" });
  const [selectedCategory, setSelectedCategory] = useQueryState<CategoryType>("category", {
    defaultValue: "all",
    parse: (value): CategoryType => (value as CategoryType) || "all",
  });

  const [iconSize, setIconSize] = useState(60);
  const [globalTheme, setGlobalTheme] = useState<"dark" | "light">("light");
  const [selectedIcon, setSelectedIcon] = useState<IconItem | null>(null);
  const [stackCount, setStackCount] = useState(0);

  const [visibleCount, setVisibleCount] = useState(24);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", globalTheme);
  }, [globalTheme]);

  useEffect(() => {
    const saved = localStorage.getItem("techicons_stack");
    if (saved) {
      try {
        setStackCount(JSON.parse(saved).length);
      } catch (e) {}
    }
  }, []);

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

  const handleAddToStack = (icon: IconItem) => {
    const saved = localStorage.getItem("techicons_stack") || "[]";
    let currentList = [];
    try {
      currentList = JSON.parse(saved);
    } catch (e) {}

    const newItem = {
      id: `${icon.filename}-${Date.now()}-${Math.random()}`,
      type: "icon",
      icon
    };
    currentList.push(newItem);
    localStorage.setItem("techicons_stack", JSON.stringify(currentList));
    setStackCount(currentList.length);
  };

  const logoSrc = globalTheme === "dark" 
    ? "/logo/techicons_logo_white.svg" 
    : "/logo/techicons_logo_black.svg";

  const visibleIcons = filteredIcons.slice(0, visibleCount);

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950 text-zinc-950 dark:text-zinc-50">
      <Header globalTheme={globalTheme} onToggleTheme={() => setGlobalTheme(globalTheme === "dark" ? "light" : "dark")} />

      <main className="mx-auto max-w-[1200px] px-8 flex-1 w-full relative">
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

        <CategoryFilters selectedCategory={selectedCategory} onSelectCategory={setSelectedCategory} />

        <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-6 mb-12">
          {visibleIcons.map((icon) => (
            <IconCard 
              key={icon.filename} 
              icon={icon} 
              iconSize={iconSize} 
              onClick={() => setSelectedIcon(icon)}
              onAddToStack={() => handleAddToStack(icon)}
            />
          ))}
        </div>

        {visibleCount < filteredIcons.length && (
          <div ref={sentinelRef} className="h-10 my-8 flex justify-center items-center">
            <div className="w-8 h-8 border-3 border-zinc-200 dark:border-zinc-800 border-t-blue-600 rounded-full animate-spin"></div>
          </div>
        )}
      </main>

      <Footer />

      {selectedIcon && (
        <CopyModal
          selectedIcon={selectedIcon}
          iconSize={iconSize}
          globalTheme={globalTheme}
          onClose={() => setSelectedIcon(null)}
        />
      )}

      {stackCount > 0 && (
        <div className="fixed bottom-6 right-6 z-40 bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-950 px-5 py-3.5 rounded-2xl shadow-xl flex items-center gap-4 animate-in slide-in-from-bottom-5 duration-300">
          <span className="text-sm font-bold">{stackCount} icons selected</span>
          <Link
            href="/builder"
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold px-3 py-2.5 rounded-xl transition-all shadow-sm"
          >
            Build Stack &rarr;
          </Link>
        </div>
      )}
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <div className="w-8 h-8 border-3 border-zinc-200 dark:border-zinc-800 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    }>
      <CatalogContent />
    </Suspense>
  );
}
