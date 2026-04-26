"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Moon, Sun, LogOut, User, FileText, Folder, Tags, Mail } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";

const navItems = [
  { href: "/admin", icon: User, label: "个人信息" },
  { href: "/admin/projects", icon: Folder, label: "项目作品" },
  { href: "/admin/skills", icon: Tags, label: "技能标签" },
  { href: "/admin/posts", icon: FileText, label: "博客文章" },
  { href: "/admin/social-links", icon: Mail, label: "社交链接" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [checking, setChecking] = useState(true);

  const checkSession = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/session");
      if (!res.ok) {
        router.push("/admin/login");
      }
    } catch {
      router.push("/admin/login");
    } finally {
      setChecking(false);
    }
  }, [router]);

  useEffect(() => {
    if (pathname === "/admin/login") {
      setChecking(false);
      return;
    }

    checkSession();
  }, [pathname, checkSession]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
  };

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">加载中...</p>
      </div>
    );
  }

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex">
      <aside className="w-64 border-r border-gray-200 dark:border-gray-800 p-4 flex flex-col">
        <h1 className="text-lg font-bold mb-8">后台管理</h1>

        <nav className="flex-1 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  isActive
                    ? "bg-gray-100 dark:bg-gray-800 font-medium"
                    : "hover:bg-gray-50 dark:hover:bg-gray-800"
                }`}
              >
                <item.icon size={18} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="space-y-2 pt-4 border-t border-gray-200 dark:border-gray-800">
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="flex items-center gap-3 px-3 py-2 w-full rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            <span>{theme === "dark" ? "浅色模式" : "深色模式"}</span>
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2 w-full rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-red-500"
          >
            <LogOut size={18} />
            <span>退出登录</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 p-6 overflow-auto">
        {children}
      </main>
    </div>
  );
}
