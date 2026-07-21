import { ArrowSquareOut, Plus } from "@phosphor-icons/react";
import Image from "next/image";

interface IconItem {
  filename: string;
  label: string;
}

interface IconCardProps {
  icon: IconItem;
  iconSize: number;
  onClick: () => void;
  onAddToStack: () => void;
}

export default function IconCard({ icon, iconSize, onClick, onAddToStack }: IconCardProps) {
  const encodedFn = encodeURIComponent(icon.filename).replace(/%20/g, "%20");

  return (
    <div
      className="group bg-white border border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800 rounded-2xl p-6 flex flex-col items-center relative overflow-hidden cursor-pointer transition-all duration-300 shadow-sm hover:-translate-y-1 hover:border-blue-600 hover:shadow-lg hover:shadow-blue-600/5 dark:hover:shadow-blue-600/10"
      onClick={onClick}
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          onAddToStack();
        }}
        className="absolute top-3.5 right-3.5 p-1.5 rounded-lg bg-zinc-50 hover:bg-blue-600 hover:text-white dark:bg-zinc-950 dark:hover:bg-blue-600 text-zinc-400 dark:text-zinc-500 border border-zinc-200 dark:border-zinc-800 hover:border-blue-600 dark:hover:border-blue-600 transition-all cursor-pointer z-10"
        title="Add to Stack"
      >
        <Plus size={14} weight="bold" />
      </button>

      <div className="flex items-center justify-center gap-10 h-44 w-full rounded-xl bg-zinc-50 dark:bg-zinc-950 mb-6 relative border border-transparent group-hover:border-zinc-200 dark:group-hover:border-zinc-800">
        <div className="flex flex-col items-center gap-2">
          <div className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Dark</div>
          <Image
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
          <Image
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
}
