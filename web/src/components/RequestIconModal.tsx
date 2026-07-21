"use client";

import { useState } from "react";
import { X, PaperPlaneRight } from "@phosphor-icons/react";

interface RequestIconModalProps {
  onClose: () => void;
}

export default function RequestIconModal({ onClose }: RequestIconModalProps) {
  const [iconName, setIconName] = useState("");
  const [website, setWebsite] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!iconName.trim()) return;

    const title = encodeURIComponent(`Icon Request: ${iconName}`);
    const body = encodeURIComponent(
      `**Icon Name:** ${iconName}\n**Official Website:** ${website || "Not provided"}`
    );

    const githubIssueUrl = `https://github.com/gui-bus/TechIcons/issues/new?title=${title}&body=${body}`;
    window.open(githubIssueUrl, "_blank");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-zinc-950/80 backdrop-blur-md flex items-center justify-center z-50 p-6" onClick={onClose}>
      <div className="bg-white border border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800 rounded-3xl max-w-[600px] w-full overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b border-zinc-200 dark:border-zinc-800">
          <span className="text-xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">Request an Icon</span>
          <button className="bg-transparent border-0 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center justify-center transition-all cursor-pointer" onClick={onClose}>
            <X size={20} weight="bold" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8">
          <div className="mb-6">
            <label htmlFor="iconName" className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2">
              Icon Name *
            </label>
            <input
              id="iconName"
              type="text"
              value={iconName}
              onChange={(e) => setIconName(e.target.value)}
              placeholder="e.g. Next.js"
              className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-zinc-900 dark:text-zinc-50 outline-none focus:border-blue-500 dark:focus:border-blue-500 transition-colors"
              required
            />
          </div>

          <div className="mb-8">
            <label htmlFor="website" className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2">
              Official Website *
            </label>
            <input
              id="website"
              type="url"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="e.g. https://nextjs.org"
              className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-zinc-900 dark:text-zinc-50 outline-none focus:border-blue-500 dark:focus:border-blue-500 transition-colors"
              required
            />
          </div>

          <button
            type="submit"
            disabled={!iconName.trim() || !website.trim()}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl py-4 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            <PaperPlaneRight size={20} weight="bold" />
            <span>Open GitHub Issue</span>
          </button>
        </form>
      </div>
    </div>
  );
}
