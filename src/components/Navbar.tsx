"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, User, LayoutDashboard, Briefcase, Sun, Moon } from "lucide-react";
import Button from "./Button";
import Avatar from "./Avatar";

interface NavbarProps {
  user?: {
    name: string;
    email: string;
    role: "ADMIN" | "RECRUITER" | "USER";
    profileImage?: string;
  } | null;
}

export default function Navbar({ user }: NavbarProps) {
  const router = useRouter();
  const [theme, setTheme] = React.useState<"light" | "dark">("light");

  React.useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setTheme(isDark ? "dark" : "light");
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    if (nextTheme === "dark") {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      if (res.ok) {
        router.refresh();
        router.push("/login");
      }
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  const getDashboardLink = () => {
    if (!user) return "/";
    switch (user.role) {
      case "ADMIN":
        return "/admin/dashboard";
      case "RECRUITER":
        return "/recruiter/dashboard";
      default:
        return "/user/dashboard";
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-150 bg-white/80 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-md shadow-indigo-200 dark:shadow-none group-hover:scale-[1.05] transition-transform duration-200">
            <Briefcase className="h-4.5 w-4.5" />
          </div>
          <span className="text-lg font-black tracking-tight text-zinc-900 dark:text-white bg-gradient-to-r from-zinc-900 to-zinc-650 dark:from-white dark:to-zinc-300 bg-clip-text">
            Job<span className="text-indigo-650 dark:text-indigo-400">Portal</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-zinc-500 dark:text-zinc-400">
          <Link href="/jobs" className="hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors">
            Find Jobs
          </Link>
          <Link href="/companies" className="hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors">
            Companies
          </Link>
          <Link href="/about" className="hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors">
            About Us
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 text-zinc-500 hover:text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-850 dark:hover:text-zinc-250 transition-colors cursor-pointer flex items-center justify-center"
            aria-label="Toggle theme"
          >
            {theme === "light" ? (
              <Moon className="w-4 h-4" />
            ) : (
              <Sun className="w-4 h-4" />
            )}
          </button>
          {user ? (
            <div className="flex items-center gap-3">
              <Link
                href={getDashboardLink()}
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-855 transition-colors"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>Dashboard</span>
              </Link>
              <div className="relative group">
                <button className="flex items-center gap-2 outline-none">
                  <Avatar src={user.profileImage} name={user.name} size="sm" />
                </button>
                <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-xl border border-zinc-150 bg-white p-2 shadow-lg dark:border-zinc-800 dark:bg-zinc-900 hidden group-hover:block transition-all duration-200 before:absolute before:-top-2 before:left-0 before:right-0 before:h-2 before:content-['']">
                  <div className="px-3 py-2 border-b border-zinc-100 dark:border-zinc-850">
                    <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100 truncate">{user.name}</p>
                    <p className="text-xs text-zinc-500 truncate">{user.role}</p>
                  </div>
                  <Link
                    href={getDashboardLink()}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-zinc-600 hover:bg-zinc-50 dark:text-zinc-350 dark:hover:bg-zinc-800/50 mt-1"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    <span>Dashboard</span>
                  </Link>
                  {user.role === "USER" && (
                    <Link
                      href="/user/profile"
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-zinc-600 hover:bg-zinc-50 dark:text-zinc-350 dark:hover:bg-zinc-800/50"
                    >
                      <User className="w-4 h-4" />
                      <span>My Profile</span>
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/20"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm">Get Started</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
