"use client";

import React from "react";

interface AvatarProps {
  src?: string;
  name: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export default function Avatar({ src, name, size = "md", className = "" }: AvatarProps) {
  const getInitials = (n: string) => {
    if (!n) return "?";
    return n
      .split(" ")
      .map((part) => part[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  const sizes = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-16 h-16 text-lg",
    xl: "w-24 h-24 text-2xl",
  };

  const initials = getInitials(name);

  const colors = [
    "bg-indigo-600 text-white",
    "bg-violet-600 text-white",
    "bg-purple-600 text-white",
    "bg-blue-600 text-white",
    "bg-emerald-600 text-white",
    "bg-rose-600 text-white",
    "bg-amber-600 text-white",
  ];
  const charSum = name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const colorClass = colors[charSum % colors.length];

  return (
    <div className="relative inline-block">
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={name}
          className={`rounded-full object-cover border border-zinc-200 dark:border-zinc-800 ${sizes[size]} ${className}`}
          onError={(e) => {
            (e.target as HTMLElement).style.display = "none";
            const fallback = (e.target as HTMLElement).nextElementSibling;
            if (fallback) fallback.classList.remove("hidden");
          }}
        />
      ) : null}
      <div
        className={`${src ? "hidden" : ""} rounded-full flex items-center justify-center font-bold tracking-wider border border-white/10 ${sizes[size]} ${colorClass} ${className}`}
      >
        {initials}
      </div>
    </div>
  );
}
