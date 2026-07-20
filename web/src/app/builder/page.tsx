"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import iconsData from "../../data/icons.json";
import JSZip from "jszip";
import { 
  Sun, 
  Moon, 
  GithubLogo, 
  Copy, 
  Check, 
  Trash, 
  ArrowLeft, 
  ArrowRight, 
  Plus, 
  ArrowBendDownLeft,
  MagnifyingGlass,
  Sliders,
  Code
} from "@phosphor-icons/react";
import { getIconCategory } from "../../utils/categories";

interface IconItem {
  filename: string;
  label: string;
}

// Represent an item in the builder workspace (either an icon or a line break)
interface StackItem {
  id: string;
  type: "icon" | "break";
  icon?: IconItem;
}

export default function Builder() {
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState("");
  const [globalTheme, setGlobalTheme] = useState<"dark" | "light">("dark");
  const [iconSize, setIconSize] = useState(50);
  const [stackAlignment, setStackAlignment] = useState<"center" | "left" | "right">("center");
  const [includeTitles, setIncludeTitles] = useState(true);
  const [stackItems, setStackItems] = useState<StackItem[]>([]);
  const [copied, setCopied] = useState(false);

  // Sync theme
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", globalTheme);
  }, [globalTheme]);

  const filteredIcons = iconsData.filter((icon) =>
    icon.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Add icon to stack
  const addIconToStack = (icon: IconItem) => {
    const newItem: StackItem = {
      id: `${icon.filename}-${Date.now()}-${Math.random()}`,
      type: "icon",
      icon
    };
    setStackItems((prev) => [...prev, newItem]);
  };

  // Add line break to stack
  const addLineBreak = () => {
    const newItem: StackItem = {
      id: `break-${Date.now()}-${Math.random()}`,
      type: "break"
    };
    setStackItems((prev) => [...prev, newItem]);
  };

  // Remove item from stack
  const removeItem = (id: string) => {
    setStackItems((prev) => prev.filter((item) => item.id !== id));
  };

  // Move item left (reorder)
  const moveItemLeft = (index: number) => {
    if (index === 0) return;
    setStackItems((prev) => {
      const copy = [...prev];
      const temp = copy[index];
      copy[index] = copy[index - 1];
      copy[index - 1] = temp;
      return copy;
    });
  };

  // Move item right (reorder)
  const moveItemRight = (index: number) => {
    if (index === stackItems.length - 1) return;
    setStackItems((prev) => {
      const copy = [...prev];
      const temp = copy[index];
      copy[index] = copy[index + 1];
      copy[index + 1] = temp;
      return copy;
    });
  };

  const downloadBundle = async () => {
    const zip = new JSZip();
    const folder = globalTheme === "dark" ? "Dark" : "Light";
    const iconsToDownload = stackItems.filter(item => item.type === "icon" && item.icon);
    
    if (iconsToDownload.length === 0) return;
    
    const promises = iconsToDownload.map(async (item) => {
      const filename = item.icon!.filename;
      const encodedFilename = encodeURIComponent(filename).replace(/%20/g, "%20");
      try {
        const response = await fetch(`/${folder}/${encodedFilename}`);
        if (response.ok) {
          const text = await response.text();
          zip.file(filename, text);
        }
      } catch (err) {
        console.error(`Failed to fetch ${filename} for ZIP bundling`, err);
      }
    });
    
    await Promise.all(promises);
    
    const content = await zip.generateAsync({ type: "blob" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(content);
    link.download = `techicons-bundle-${globalTheme}.zip`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getCdnUrl = (icon: IconItem, theme: "dark" | "light") => {
    const folder = theme === "dark" ? "Dark" : "Light";
    const escapedName = encodeURIComponent(icon.filename).replace(/%20/g, "%20");
    return `https://github.com/gui-bus/TechIcons/blob/main/${folder}/${escapedName}`;
  };

  // Generate HTML Code output
  const generateHtmlCode = () => {
    if (stackItems.length === 0) return "<!-- Add icons to generate stack -->";

    let code = `<div align="${stackAlignment}">\n`;
    let isNewLine = true;

    stackItems.forEach((item) => {
      if (item.type === "break") {
        code += `\n  <br>\n`;
        isNewLine = true;
      } else if (item.type === "icon" && item.icon) {
        const url = getCdnUrl(item.icon, globalTheme);
        const titleAttr = includeTitles ? ` title="${item.icon.label}"` : "";
        
        // Add spacing or indentation
        if (isNewLine) {
          code += `  `;
          isNewLine = false;
        } else {
          code += `\n  `;
        }
        code += `<img alt="${item.icon.label}" height="${iconSize}" width="${iconSize}" src="${url}"${titleAttr}>`;
      }
    });

    code += `\n</div>`;
    return code;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateHtmlCode());
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const logoSrc = globalTheme === "dark" 
    ? "/logo/techicons_logo_white.svg" 
    : "/logo/techicons_logo_black.svg";

  return (
    <>
      {/* Header */}
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
      <main className="container" style={{ flex: 1, paddingBottom: "4rem" }}>
        <section className="hero" style={{ padding: "3rem 1rem 2rem 1rem" }}>
          <div className="hero-logo-wrapper">
            <img src={logoSrc} alt="TechIcons" className="hero-logo-image" style={{ height: "50px" }} />
          </div>
          <h2 style={{ fontSize: "1.75rem", fontWeight: 800, marginTop: "0.5rem" }}>Stack Builder</h2>
          <p className="hero-subtitle" style={{ fontSize: "1.1rem", maxWidth: "520px" }}>
            Select icons, arrange them into multiple lines, customize parameters, and generate ready-to-use HTML code.
          </p>
        </section>

        {/* Builder Columns */}
        <div className="builder-layout">
          {/* Left Column: Icon Searcher */}
          <div className="builder-left-panel">
            <div className="search-box-header">
              <h3>Select Icons</h3>
              <button className="btn-toggle btn-add-break" onClick={addLineBreak}>
                <ArrowBendDownLeft size={16} weight="bold" />
                <span>Add Line Break</span>
              </button>
            </div>

            <div className="search-wrapper" style={{ marginBottom: "1rem" }}>
              <span className="search-icon">
                <MagnifyingGlass size={16} weight="bold" />
              </span>
              <input
                type="text"
                placeholder="Search technologies..."
                className="search-input"
                style={{ padding: "0.65rem 1rem 0.65rem 2.5rem", fontSize: "0.9rem" }}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="builder-icon-picker">
              {filteredIcons.map((icon) => {
                const encodedFn = encodeURIComponent(icon.filename).replace(/%20/g, "%20");
                return (
                  <div
                    key={icon.filename}
                    className="picker-item"
                    onClick={() => addIconToStack(icon)}
                  >
                    <img
                      src={`/${globalTheme === "dark" ? "Dark" : "Light"}/${encodedFn}`}
                      alt={icon.label}
                      width="32"
                      height="32"
                    />
                    <span className="picker-label">{icon.label}</span>
                    <button className="btn-add-picker">
                      <Plus size={14} weight="bold" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Workspace & Code Output */}
          <div className="builder-right-panel">
            {/* Options controls */}
            <div className="builder-options-panel">
              <div className="slider-container">
                <Sliders size={18} weight="bold" />
                <span>Size:</span>
                <input
                  type="range"
                  min="30"
                  max="100"
                  value={iconSize}
                  onChange={(e) => setIconSize(Number(e.target.value))}
                  className="range-slider"
                  style={{ width: "90px" }}
                />
                <span className="size-badge">{iconSize}px</span>
              </div>

              <div className="select-container">
                <span style={{ fontSize: "0.9rem", color: "var(--text-muted)", fontWeight: 650 }}>Align:</span>
                <select
                  className="custom-select"
                  value={stackAlignment}
                  onChange={(e) => setStackAlignment(e.target.value as any)}
                >
                  <option value="left">Left</option>
                  <option value="center">Center</option>
                  <option value="right">Right</option>
                </select>
              </div>

              <label className="checkbox-container">
                <input
                  type="checkbox"
                  checked={includeTitles}
                  onChange={(e) => setIncludeTitles(e.target.checked)}
                />
                <span>Include Tooltips</span>
              </label>
            </div>

            {/* Current Workspace List */}
            <div className="workspace-container">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                <h4 style={{ margin: 0 }}>Your Custom Stack</h4>
                {stackItems.some(item => item.type === "icon") && (
                  <button className="btn-toggle" onClick={downloadBundle} style={{ padding: "0.4rem 0.75rem", fontSize: "0.8rem", borderRadius: "8px" }}>
                    <span>Download Bundle (.zip)</span>
                  </button>
                )}
              </div>
              {stackItems.length === 0 ? (
                <div className="empty-workspace">
                  <p>Click on technologies on the left panel to start building your stack layout.</p>
                </div>
              ) : (
                <div className="workspace-items">
                  {stackItems.map((item, idx) => {
                    if (item.type === "break") {
                      return (
                        <div key={item.id} className="workspace-item break-item">
                          <div className="item-info">
                            <ArrowBendDownLeft size={16} weight="bold" />
                            <span>Line Break</span>
                          </div>
                          <div className="item-actions">
                            <button className="action-btn" onClick={() => moveItemLeft(idx)} title="Move up">
                              <ArrowLeft size={14} weight="bold" />
                            </button>
                            <button className="action-btn" onClick={() => moveItemRight(idx)} title="Move down">
                              <ArrowRight size={14} weight="bold" />
                            </button>
                            <button className="action-btn delete" onClick={() => removeItem(item.id)} title="Delete">
                              <Trash size={14} weight="bold" />
                            </button>
                          </div>
                        </div>
                      );
                    }

                    if (item.type === "icon" && item.icon) {
                      const encodedFn = encodeURIComponent(item.icon.filename).replace(/%20/g, "%20");
                      return (
                        <div key={item.id} className="workspace-item">
                          <div className="item-info">
                            <img
                              src={`/${globalTheme === "dark" ? "Dark" : "Light"}/${encodedFn}`}
                              alt={item.icon.label}
                              width="24"
                              height="24"
                            />
                            <span>{item.icon.label}</span>
                          </div>
                          <div className="item-actions">
                            <button className="action-btn" onClick={() => moveItemLeft(idx)} title="Move Left">
                              <ArrowLeft size={14} weight="bold" />
                            </button>
                            <button className="action-btn" onClick={() => moveItemRight(idx)} title="Move Right">
                              <ArrowRight size={14} weight="bold" />
                            </button>
                            <button className="action-btn delete" onClick={() => removeItem(item.id)} title="Delete">
                              <Trash size={14} weight="bold" />
                            </button>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  })}
                </div>
              )}
            </div>

            {/* Code Output Block */}
            <div className="code-output-container">
              <div className="code-header">
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <Code size={18} weight="bold" />
                  <span>Generated HTML Code</span>
                </div>
                <button
                  className={`btn-copy ${copied ? "copied" : ""}`}
                  onClick={handleCopy}
                  disabled={stackItems.length === 0}
                  style={{ padding: "0.45rem 1rem", fontSize: "0.8rem", minWidth: "85px" }}
                >
                  {copied ? <Check size={14} weight="bold" /> : <Copy size={14} />}
                  <span>{copied ? "Copied" : "Copy"}</span>
                </button>
              </div>
              <pre className="code-block">
                <code>{generateHtmlCode()}</code>
              </pre>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
