"use client";

import Link from "next/link";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "./ThemeProvider";

export default function Header() {
  const { theme, setTheme } = useTheme();

  return (
    <header className="border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold">
          叶秋
        </Link>
        <nav className="flex items-center gap-6">
          <Link href="/projects" className="text-sm hover:underline">
            项目
          </Link>
          <Link href="/blog" className="text-sm hover:underline">
            博客
          </Link>
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="切换主题"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </nav>
      </div>
    </header>
  );
}
