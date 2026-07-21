import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 transition-colors">
      <div className="w-full px-8">
        <div className="py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-zinc-500 dark:text-zinc-400 text-sm font-medium">
            TechIcons &copy; {new Date().getFullYear()}. Open source project.
          </p>
          <Link
            href="https://github.com/gui-bus"
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50 text-sm font-semibold transition-colors"
            style={{ textDecoration: "none" }}
          >
            Built by @gui-bus
          </Link>
        </div>
      </div>
    </footer>
  );
}
