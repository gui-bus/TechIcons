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
  const [globalTheme, setGlobalTheme] = useState<"dark" | "light">("dark");
  const [selectedIcon, setSelectedIcon] = useState<IconItem | null>(null);
  const [activeTab, setActiveTab] = useState<"dark" | "light">("dark");
  const [copiedType, setCopiedType] = useState<string | null>(null);
  const [rawSvgContent, setRawSvgContent] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>("all");

  // Infinite Scroll State
  const [visibleCount, setVisibleCount] = useState(24);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  // Sync theme attribute to html element for styling
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", globalTheme);
  }, [globalTheme]);

  // Reset pagination when search query or category changes
  useEffect(() => {
    setVisibleCount(24);
  }, [searchQuery, selectedCategory]);

  const filteredIcons = iconsData.filter((icon) => {
    const matchesSearch = icon.label.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || getIconCategory(icon.label) === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Intersection Observer for Infinite Scroll
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

  // Fetch Raw SVG when selectedIcon or activeTab changes
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
    <>
      {/* Header - Non Sticky */}
      <header className="header-nav">
        <div className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", height: "80px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
            <img src={logoSrc} alt="TechIcons Logo" style={{ height: "40px", width: "auto" }} />
            <nav style={{ display: "flex", gap: "1rem" }}>
              <Link href="/" className={`nav-link ${pathname === "/" ? "active" : ""}`}>
                Catalog
              </Link>
              <Link href="/builder" className={`nav-link ${pathname === "/builder" ? "active" : ""}`}>
                Stack Builder
              </Link>
            </nav>
          </div>
          <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
            <button
              onClick={() => setGlobalTheme(globalTheme === "dark" ? "light" : "dark")}
              className="btn-toggle"
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
              className="btn-toggle github-btn"
              style={{ textDecoration: "none" }}
            >
              <GithubLogo size={18} weight="bold" />
              <span>Star on GitHub</span>
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container" style={{ flex: 1 }}>
        <section className="hero">
          <div className="hero-logo-wrapper">
            <img src={logoSrc} alt="TechIcons" className="hero-logo-image" />
          </div>
          <p className="hero-subtitle">
            A premium, curated collection of high-quality technology icons tailored for your GitHub profiles, READMEs, and projects.
          </p>
        </section>

        {/* Toolbar */}
        <div className="toolbar" style={{ marginBottom: "1.5rem" }}>
          <div className="search-wrapper">
            <span className="search-icon">
              <MagnifyingGlass size={18} weight="bold" />
            </span>
            <input
              type="text"
              placeholder="Search 290+ icons..."
              className="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="controls-group">
            <div className="slider-container">
              <Sliders size={18} weight="bold" />
              <span>Size:</span>
              <input
                type="range"
                min="40"
                max="120"
                value={iconSize}
                onChange={(e) => setIconSize(Number(e.target.value))}
                className="range-slider"
              />
              <span className="size-badge">{iconSize}px</span>
            </div>
            <div className="count-badge">
              {filteredIcons.length} icons
            </div>
          </div>
        </div>

        {/* Categories pills list */}
        <div className="categories-list">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              className={`category-pill ${selectedCategory === cat.value ? "active" : ""}`}
              onClick={() => setSelectedCategory(cat.value)}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Icon Grid */}
        <div className="grid">
          {visibleIcons.map((icon) => {
            const encodedFn = encodeURIComponent(icon.filename).replace(/%20/g, "%20");
            return (
              <div
                key={icon.filename}
                className="card"
                onClick={() => {
                  setSelectedIcon(icon);
                  setActiveTab(globalTheme);
                }}
              >
                <div className="card-previews">
                  <div className="preview-box">
                    <div className="preview-label">Dark</div>
                    <img
                      src={`/Dark/${encodedFn}`}
                      alt={`${icon.label} Dark`}
                      width={Math.min(iconSize, 80)}
                      height={Math.min(iconSize, 80)}
                      loading="lazy"
                    />
                  </div>
                  <div className="preview-box">
                    <div className="preview-label">Light</div>
                    <img
                      src={`/Light/${encodedFn}`}
                      alt={`${icon.label} Light`}
                      width={Math.min(iconSize, 80)}
                      height={Math.min(iconSize, 80)}
                      loading="lazy"
                    />
                  </div>
                </div>
                <div className="card-title">{icon.label}</div>
                <div className="card-action">
                  <span>Copy Code</span>
                  <ArrowSquareOut size={12} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Infinite Scroll Sentinel */}
        {visibleCount < filteredIcons.length && (
          <div ref={sentinelRef} style={{ height: "40px", margin: "2rem 0", display: "flex", justifyContent: "center", alignItems: "center" }}>
            <div className="spinner"></div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer>
        <div className="container">
          <p>Created by gui-bus &bull; Open-source on GitHub</p>
        </div>
      </footer>

      {/* Copy Code Modal */}
      {selectedIcon && (
        <div className="modal-overlay" onClick={() => setSelectedIcon(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">{selectedIcon.label}</span>
              <button className="modal-close" onClick={() => setSelectedIcon(null)}>
                <X size={20} weight="bold" />
              </button>
            </div>

            <div className="modal-body">
              <div className="modal-tabs">
                <button
                  className={`modal-tab-btn ${activeTab === "dark" ? "active" : ""}`}
                  onClick={() => setActiveTab("dark")}
                >
                  <Moon size={16} weight="bold" />
                  <span>Dark Theme Variant</span>
                </button>
                <button
                  className={`modal-tab-btn ${activeTab === "light" ? "active" : ""}`}
                  onClick={() => setActiveTab("light")}
                >
                  <Sun size={16} weight="bold" />
                  <span>Light Theme Variant</span>
                </button>
              </div>

              <div className="modal-preview-bar">
                <img
                  src={`/${activeTab === "dark" ? "Dark" : "Light"}/${encodeURIComponent(selectedIcon.filename).replace(/%20/g, "%20")}`}
                  alt={selectedIcon.label}
                  width={iconSize}
                  height={iconSize}
                />
              </div>

              <div className="copy-section">
                <div className="copy-row">
                  <div className="copy-label">HTML Image tag</div>
                  <div className="copy-input-group">
                    <input
                      type="text"
                      readOnly
                      className="copy-input"
                      value={getHtmlCode(selectedIcon, activeTab)}
                    />
                    <button
                      className={`btn-copy ${copiedType === "html" ? "copied" : ""}`}
                      onClick={() => copyToClipboard(getHtmlCode(selectedIcon, activeTab), "html")}
                    >
                      {copiedType === "html" ? <Check size={16} weight="bold" /> : <Copy size={16} />}
                      <span>{copiedType === "html" ? "Copied" : "Copy"}</span>
                    </button>
                  </div>
                </div>

                <div className="copy-row">
                  <div className="copy-label">Markdown Syntax</div>
                  <div className="copy-input-group">
                    <input
                      type="text"
                      readOnly
                      className="copy-input"
                      value={getMarkdownCode(selectedIcon, activeTab)}
                    />
                    <button
                      className={`btn-copy ${copiedType === "markdown" ? "copied" : ""}`}
                      onClick={() => copyToClipboard(getMarkdownCode(selectedIcon, activeTab), "markdown")}
                    >
                      {copiedType === "markdown" ? <Check size={16} weight="bold" /> : <Copy size={16} />}
                      <span>{copiedType === "markdown" ? "Copied" : "Copy"}</span>
                    </button>
                  </div>
                </div>

                <div className="copy-row">
                  <div className="copy-label">Direct CDN Link</div>
                  <div className="copy-input-group">
                    <input
                      type="text"
                      readOnly
                      className="copy-input"
                      value={getCdnUrl(selectedIcon, activeTab)}
                    />
                    <button
                      className={`btn-copy ${copiedType === "cdn" ? "copied" : ""}`}
                      onClick={() => copyToClipboard(getCdnUrl(selectedIcon, activeTab), "cdn")}
                    >
                      {copiedType === "cdn" ? <Check size={16} weight="bold" /> : <Copy size={16} />}
                      <span>{copiedType === "cdn" ? "Copied" : "Copy"}</span>
                    </button>
                  </div>
                </div>

                <div className="copy-row">
                  <div className="copy-label">Raw SVG Source</div>
                  <div className="copy-input-group">
                    <input
                      type="text"
                      readOnly
                      className="copy-input"
                      value={rawSvgContent || "Loading..."}
                    />
                    <button
                      className={`btn-copy ${copiedType === "svg" ? "copied" : ""}`}
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
    </>
  );
}
