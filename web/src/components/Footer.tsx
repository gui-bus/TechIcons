export default function Footer() {
  return (
    <footer className="border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 py-10 text-center text-zinc-500 dark:text-zinc-400 text-sm">
      <div className="w-full px-8">
        <p>
          Created by{" "}
          <a 
            href="https://github.com/gui-bus" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="hover:underline font-semibold text-zinc-900 dark:text-zinc-100"
          >
            gui-bus
          </a>{" "}
          &bull; Open-source on GitHub
        </p>
      </div>
    </footer>
  );
}
