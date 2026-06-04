import React from "react";

export default function Loader({ className = "" }: { className?: string }) {
  return (
    <div className={`flex flex-col items-center justify-center py-12 gap-3 ${className}`}>
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 rounded-full border-4 border-indigo-100 dark:border-indigo-950/40" />
        <div className="absolute inset-0 rounded-full border-4 border-t-indigo-600 border-r-indigo-600 animate-spin" />
      </div>
      <p className="text-sm font-medium text-zinc-500 animate-pulse">Loading content...</p>
    </div>
  );
}
