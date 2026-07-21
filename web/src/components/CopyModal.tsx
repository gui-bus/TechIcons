"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { X, Moon, Sun, Check, Copy } from "@phosphor-icons/react";

interface IconItem {
  filename: string;
  label: string;
}

interface CopyModalProps {
  selectedIcon: IconItem;
  iconSize: number;
  globalTheme: "dark" | "light";
  onClose: () => void;
}

export default function CopyModal({
  selectedIcon,
  iconSize,
  globalTheme,
  onClose,
}: CopyModalProps) {
  const [activeTab, setActiveTab] = useState<"dark" | "light">(globalTheme);
  const [copiedType, setCopiedType] = useState<string | null>(null);
  const [rawSvgContent, setRawSvgContent] = useState<string>("");

  useEffect(() => {
    const folder = activeTab === "dark" ? "Dark" : "Light";
    const encodedFilename = encodeURIComponent(selectedIcon.filename).replace(/%20/g, "%20");
    fetch(`/${folder}/${encodedFilename}`)
      .then((res) => {
        if (res.ok) return res.text();
        throw new Error("Failed to fetch SVG");
      })
      .then((text) => setRawSvgContent(text))
      .catch(() => setRawSvgContent("<!-- Failed to load SVG -->"));
  }, [selectedIcon, activeTab]);

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 1500);
  };

  const getCdnUrl = (theme: "dark" | "light") => {
    const folder = theme === "dark" ? "Dark" : "Light";
    const escapedName = encodeURIComponent(selectedIcon.filename).replace(/%20/g, "%20");
    return `https://raw.githubusercontent.com/gui-bus/TechIcons/main/${folder}/${escapedName}`;
  };

  const getHtmlCode = (theme: "dark" | "light") => {
    return `<img alt="${selectedIcon.label}" height="${iconSize}" width="${iconSize}" src="${getCdnUrl(theme)}">`;
  };

  const getMarkdownCode = (theme: "dark" | "light") => {
    return `![${selectedIcon.label}](${getCdnUrl(theme)})`;
  };

  return (
    <div className="fixed inset-0 bg-zinc-950/80 backdrop-blur-md flex items-center justify-center z-50 p-6" onClick={onClose}>
      <div className="bg-white border border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800 rounded-3xl max-w-[600px] w-full overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b border-zinc-200 dark:border-zinc-800">
          <span className="text-xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">{selectedIcon.label}</span>
          <button className="bg-transparent border-0 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center justify-center transition-all cursor-pointer" onClick={onClose}>
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
            <Image
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
                  value={getHtmlCode(activeTab)}
                />
                <button
                  className={`bg-blue-600 hover:bg-blue-700 text-white border-0 rounded-xl px-5 py-2.5 text-sm font-bold flex items-center justify-center gap-2 transition-all min-w-[100px] cursor-pointer ${
                    copiedType === "html" ? "bg-emerald-600 hover:bg-emerald-600" : ""
                  }`}
                  onClick={() => copyToClipboard(getHtmlCode(activeTab), "html")}
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
                  value={getMarkdownCode(activeTab)}
                />
                <button
                  className={`bg-blue-600 hover:bg-blue-700 text-white border-0 rounded-xl px-5 py-2.5 text-sm font-bold flex items-center justify-center gap-2 transition-all min-w-[100px] cursor-pointer ${
                    copiedType === "markdown" ? "bg-emerald-600 hover:bg-emerald-600" : ""
                  }`}
                  onClick={() => copyToClipboard(getMarkdownCode(activeTab), "markdown")}
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
                  value={getCdnUrl(activeTab)}
                />
                <button
                  className={`bg-blue-600 hover:bg-blue-700 text-white border-0 rounded-xl px-5 py-2.5 text-sm font-bold flex items-center justify-center gap-2 transition-all min-w-[100px] cursor-pointer ${
                    copiedType === "cdn" ? "bg-emerald-600 hover:bg-emerald-600" : ""
                  }`}
                  onClick={() => copyToClipboard(getCdnUrl(activeTab), "cdn")}
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
  );
}
