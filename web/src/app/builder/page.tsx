"use client";

import { useState, useEffect } from "react";
import iconsData from "../../data/icons.json";
import JSZip from "jszip";
import { 
  Plus, 
  ArrowBendDownLeft,
  MagnifyingGlass,
  Sliders,
  Code,
  Check,
  Copy
} from "@phosphor-icons/react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import WorkspaceItem from "../../components/WorkspaceItem";

interface IconItem {
  filename: string;
  label: string;
}

interface StackItem {
  id: string;
  type: "icon" | "break";
  icon?: IconItem;
}

export default function Builder() {
  const [searchQuery, setSearchQuery] = useState("");
  const [globalTheme, setGlobalTheme] = useState<"dark" | "light">("light");
  const [iconSize, setIconSize] = useState(50);
  const [stackAlignment, setStackAlignment] = useState<"center" | "left" | "right">("center");
  const [includeTitles, setIncludeTitles] = useState(true);
  const [stackItems, setStackItems] = useState<StackItem[]>([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", globalTheme);
  }, [globalTheme]);

  const filteredIcons = iconsData.filter((icon) =>
    icon.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const addIconToStack = (icon: IconItem) => {
    const newItem: StackItem = {
      id: `${icon.filename}-${Date.now()}-${Math.random()}`,
      type: "icon",
      icon
    };
    setStackItems((prev) => [...prev, newItem]);
  };

  const addLineBreak = () => {
    const newItem: StackItem = {
      id: `break-${Date.now()}-${Math.random()}`,
      type: "break"
    };
    setStackItems((prev) => [...prev, newItem]);
  };

  const removeItem = (id: string) => {
    setStackItems((prev) => prev.filter((item) => item.id !== id));
  };

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
    <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950 text-zinc-950 dark:text-zinc-50">
      <Header globalTheme={globalTheme} onToggleTheme={() => setGlobalTheme(globalTheme === "dark" ? "light" : "dark")} />

      <main className="mx-auto max-w-[1200px] px-8 flex-1 w-full pb-16">
        <section className="flex flex-col items-center text-center py-12 px-4">
          <div className="mb-4 hover:-translate-y-1 transition-transform duration-300">
            <img src={logoSrc} alt="TechIcons" className="h-12 w-auto" />
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight mt-2 text-zinc-900 dark:text-zinc-50">Stack Builder</h2>
          <p className="text-zinc-500 dark:text-zinc-400 text-base max-w-[520px] mx-auto leading-relaxed mt-2 font-medium">
            Select icons, arrange them into multiple lines, customize parameters, and generate ready-to-use HTML code.
          </p>
        </section>

        <div className="flex flex-col lg:flex-row gap-8 mt-4">
          <div className="flex-1 bg-white border border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800 rounded-3xl p-6 shadow-sm lg:max-w-[380px] w-full">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-base font-extrabold text-zinc-900 dark:text-zinc-50">Select Icons</h3>
              <button 
                className="bg-zinc-50 hover:bg-white border border-zinc-200 hover:border-zinc-300 dark:bg-zinc-950 dark:hover:bg-zinc-800 dark:border-zinc-800 dark:hover:border-zinc-700 text-zinc-900 dark:text-zinc-50 rounded-lg px-3 py-1.5 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer" 
                onClick={addLineBreak}
              >
                <ArrowBendDownLeft size={16} weight="bold" />
                <span>Add Line Break</span>
              </button>
            </div>

            <div className="relative mb-4">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 flex items-center">
                <MagnifyingGlass size={16} weight="bold" />
              </span>
              <input
                type="text"
                placeholder="Search technologies..."
                className="w-full pl-10 pr-4 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-900 dark:text-zinc-50 text-sm font-medium outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-2 max-h-[520px] overflow-y-auto pr-1 no-scrollbar">
              {filteredIcons.map((icon) => {
                const encodedFn = encodeURIComponent(icon.filename).replace(/%20/g, "%20");
                return (
                  <div
                    key={icon.filename}
                    className="group flex items-center gap-3 p-2.5 bg-zinc-50 hover:bg-white dark:bg-zinc-950 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 hover:border-blue-600 rounded-xl cursor-pointer transition-all hover:translate-x-0.5"
                    onClick={() => addIconToStack(icon)}
                  >
                    <img
                      src={`/${globalTheme === "dark" ? "Dark" : "Light"}/${encodedFn}`}
                      alt={icon.label}
                      width="32"
                      height="32"
                    />
                    <span className="text-sm font-bold flex-1 text-zinc-900 dark:text-zinc-50">{icon.label}</span>
                    <button className="text-zinc-400 group-hover:text-blue-600 p-1 rounded-md transition-colors cursor-pointer">
                      <Plus size={14} weight="bold" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex-2 flex flex-col gap-6 w-full">
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 flex items-center justify-between flex-wrap gap-6 shadow-sm">
              <div className="flex items-center gap-3 text-sm font-semibold text-zinc-500 dark:text-zinc-400">
                <Sliders size={18} weight="bold" />
                <span>Size:</span>
                <input
                  type="range"
                  min="30"
                  max="100"
                  value={iconSize}
                  onChange={(e) => setIconSize(Number(e.target.value))}
                  className="w-[90px] h-1.5 rounded-full bg-zinc-200 dark:bg-zinc-800 accent-blue-600 cursor-pointer"
                />
                <span className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 px-3 py-1 rounded-lg text-xs font-bold text-zinc-900 dark:text-zinc-50">{iconSize}px</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-zinc-500 dark:text-zinc-400">Align:</span>
                <div className="relative">
                  <select
                    className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-zinc-50 text-sm font-semibold py-1.5 pl-3 pr-8 outline-none cursor-pointer appearance-none bg-[url('data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%238e8e9f\' stroke-width=\'3\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' d=\'M19.5 8.25l-7.5 7.5-7.5-7.5\'/%3E%3C/svg%3E')] bg-no-repeat bg-[position:right_0.5rem_center] bg-[size:0.75rem]"
                    value={stackAlignment}
                    onChange={(e) => setStackAlignment(e.target.value as any)}
                  >
                    <option value="left">Left</option>
                    <option value="center">Center</option>
                    <option value="right">Right</option>
                  </select>
                </div>
              </div>

              <label className="flex items-center gap-2 text-sm font-semibold text-zinc-500 dark:text-zinc-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeTitles}
                  onChange={(e) => setIncludeTitles(e.target.checked)}
                  className="cursor-pointer"
                />
                <span>Include Tooltips</span>
              </label>
            </div>

            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-base font-extrabold text-zinc-400 dark:text-zinc-500">Your Custom Stack</h4>
                {stackItems.some(item => item.type === "icon") && (
                  <button 
                    className="bg-zinc-50 hover:bg-white border border-zinc-200 hover:border-zinc-300 dark:bg-zinc-950 dark:hover:bg-zinc-800 dark:border-zinc-800 dark:hover:border-zinc-700 text-zinc-900 dark:text-zinc-50 rounded-lg px-3 py-1.5 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                    onClick={downloadBundle}
                  >
                    <span>Download Bundle (.zip)</span>
                  </button>
                )}
              </div>
              {stackItems.length === 0 ? (
                <div className="flex items-center justify-center h-[180px] border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl text-zinc-400 dark:text-zinc-500 text-sm text-center p-6">
                  <p>Click on technologies on the left panel to start building your stack layout.</p>
                </div>
              ) : (
                <div className="flex flex-col gap-2 max-h-[380px] overflow-y-auto pr-1 no-scrollbar">
                  {stackItems.map((item, idx) => (
                    <WorkspaceItem
                      key={item.id}
                      item={item}
                      index={idx}
                      globalTheme={globalTheme}
                      onMoveLeft={moveItemLeft}
                      onMoveRight={moveItemRight}
                      onRemove={removeItem}
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-sm">
              <div className="flex items-center justify-between px-6 py-4 bg-zinc-50 dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800 text-sm font-bold text-zinc-500 dark:text-zinc-400">
                <div className="flex items-center gap-2">
                  <Code size={18} weight="bold" />
                  <span>Generated HTML Code</span>
                </div>
                <button
                  className={`bg-blue-600 hover:bg-blue-700 text-white border-0 rounded-lg px-4 py-1.5 text-xs font-bold flex items-center justify-center gap-1.5 transition-all min-w-[85px] cursor-pointer ${
                    copied ? "bg-emerald-600 hover:bg-emerald-600" : ""
                  }`}
                  onClick={handleCopy}
                  disabled={stackItems.length === 0}
                >
                  {copied ? <Check size={14} weight="bold" /> : <Copy size={14} />}
                  <span>{copied ? "Copied" : "Copy"}</span>
                </button>
              </div>
              <pre className="p-6 bg-zinc-950 dark:bg-zinc-950 overflow-x-auto max-h-[250px] font-mono text-[13px] leading-relaxed">
                <code className="color-[#60a5fa] whitespace-pre-wrap break-all">{generateHtmlCode()}</code>
              </pre>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
