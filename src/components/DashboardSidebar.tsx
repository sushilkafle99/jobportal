"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  User,
  FileText,
  Bookmark,
  Settings,
  Building2,
  Briefcase,
  Users,
  ShieldCheck,
  ClipboardList,
} from "lucide-react";

interface SidebarItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface DashboardSidebarProps {
  role: "ADMIN" | "RECRUITER" | "USER";
}

export default function DashboardSidebar({ role }: DashboardSidebarProps) {
  const pathname = usePathname();

  const getItems = (): SidebarItem[] => {
    switch (role) {
      case "ADMIN":
        return [
          { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
          { label: "Seekers", href: "/admin/users", icon: Users },
          { label: "Recruiters", href: "/admin/recruiters", icon: ShieldCheck },
          { label: "Companies", href: "/admin/companies", icon: Building2 },
          { label: "Manage Jobs", href: "/admin/jobs", icon: Briefcase },
          { label: "Applications", href: "/admin/applications", icon: ClipboardList },
          { label: "Settings", href: "/admin/settings", icon: Settings },
        ];
      case "RECRUITER":
        return [
          { label: "Dashboard", href: "/recruiter/dashboard", icon: LayoutDashboard },
          { label: "Company Profile", href: "/recruiter/company", icon: Building2 },
          { label: "My Jobs", href: "/recruiter/jobs", icon: Briefcase },
          { label: "Post a Job", href: "/recruiter/jobs/create", icon: ClipboardList },
          { label: "Applicants", href: "/recruiter/applications", icon: Users },
          { label: "Settings", href: "/recruiter/settings", icon: Settings },
        ];
      default: // USER
        return [
          { label: "Dashboard", href: "/user/dashboard", icon: LayoutDashboard },
          { label: "My Profile", href: "/user/profile", icon: User },
          { label: "My Applications", href: "/user/applications", icon: FileText },
          { label: "Saved Jobs", href: "/user/saved-jobs", icon: Bookmark },
          { label: "Settings", href: "/user/settings", icon: Settings },
        ];
    }
  };

  const items = getItems();

  return (
    <aside className="w-64 border-r border-zinc-150 bg-white dark:border-zinc-800 dark:bg-zinc-950 flex flex-col shrink-0 min-h-[calc(100vh-4rem)] p-4">
      <nav className="flex-1 flex flex-col gap-1.5 mt-2">
        {items.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                isActive
                  ? "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-650 dark:text-indigo-400"
                  : "text-zinc-600 hover:bg-zinc-50 dark:text-zinc-350 dark:hover:bg-zinc-900/50"
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? "text-indigo-600 dark:text-indigo-400" : "text-zinc-400"}`} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
