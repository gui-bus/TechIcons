import { ArrowBendDownLeft, ArrowLeft, ArrowRight, Trash } from "@phosphor-icons/react";

interface IconItem {
  filename: string;
  label: string;
}

interface StackItem {
  id: string;
  type: "icon" | "break";
  icon?: IconItem;
}

interface WorkspaceItemProps {
  item: StackItem;
  index: number;
  globalTheme: "dark" | "light";
  onMoveLeft: (index: number) => void;
  onMoveRight: (index: number) => void;
  onRemove: (id: string) => void;
}

export default function WorkspaceItem({
  item,
  index,
  globalTheme,
  onMoveLeft,
  onMoveRight,
  onRemove,
}: WorkspaceItemProps) {
  if (item.type === "break") {
    return (
      <div className="flex items-center justify-between p-3 bg-blue-600/5 dark:bg-blue-600/10 border border-blue-600/20 dark:border-blue-600/30 text-blue-600 rounded-xl transition-all">
        <div className="flex items-center gap-3 font-bold text-sm">
          <ArrowBendDownLeft size={16} weight="bold" />
          <span>Line Break</span>
        </div>
        <div className="flex gap-1.5">
          <button
            className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 p-1.5 rounded-lg flex items-center justify-center transition-all cursor-pointer"
            onClick={() => onMoveLeft(index)}
            title="Move up"
          >
            <ArrowLeft size={14} weight="bold" />
          </button>
          <button
            className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 p-1.5 rounded-lg flex items-center justify-center transition-all cursor-pointer"
            onClick={() => onMoveRight(index)}
            title="Move down"
          >
            <ArrowRight size={14} weight="bold" />
          </button>
          <button
            className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-400 hover:text-red-500 hover:border-red-500/20 hover:bg-red-500/5 p-1.5 rounded-lg flex items-center justify-center transition-all cursor-pointer"
            onClick={() => onRemove(item.id)}
            title="Delete"
          >
            <Trash size={14} weight="bold" />
          </button>
        </div>
      </div>
    );
  }

  if (item.type === "icon" && item.icon) {
    const encodedFn = encodeURIComponent(item.icon.filename).replace(/%20/g, "%20");
    return (
      <div className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl transition-all hover:border-zinc-300 dark:hover:border-zinc-700">
        <div className="flex items-center gap-3 font-bold text-sm">
          <img
            src={`/${globalTheme === "dark" ? "Dark" : "Light"}/${encodedFn}`}
            alt={item.icon.label}
            width="24"
            height="24"
          />
          <span>{item.icon.label}</span>
        </div>
        <div className="flex gap-1.5">
          <button
            className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 p-1.5 rounded-lg flex items-center justify-center transition-all cursor-pointer"
            onClick={() => onMoveLeft(index)}
            title="Move Left"
          >
            <ArrowLeft size={14} weight="bold" />
          </button>
          <button
            className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 p-1.5 rounded-lg flex items-center justify-center transition-all cursor-pointer"
            onClick={() => onMoveRight(index)}
            title="Move Right"
          >
            <ArrowRight size={14} weight="bold" />
          </button>
          <button
            className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-400 hover:text-red-500 hover:border-red-500/20 hover:bg-red-500/5 p-1.5 rounded-lg flex items-center justify-center transition-all cursor-pointer"
            onClick={() => onRemove(item.id)}
            title="Delete"
          >
            <Trash size={14} weight="bold" />
          </button>
        </div>
      </div>
    );
  }

  return null;
}
