import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "success" | "warning" | "danger" | "neutral";
  className?: string;
}

export default function Badge({ children, variant = "neutral", className = "" }: BadgeProps) {
  const baseStyles = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide transition-colors duration-150";

  const variants = {
    primary: "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-900/50",
    secondary: "bg-violet-50 text-violet-700 dark:bg-violet-950/40 dark:text-violet-300 border border-violet-100 dark:border-violet-900/50",
    success: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-100 dark:border-emerald-900/50",
    warning: "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-100 dark:border-amber-900/50",
    danger: "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-100 dark:border-rose-900/50",
    neutral: "bg-zinc-100 text-zinc-800 dark:bg-zinc-850 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800",
  };

  return <span className={`${baseStyles} ${variants[variant]} ${className}`}>{children}</span>;
}
