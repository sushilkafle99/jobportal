import React from "react";

interface DashboardHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}

export default function DashboardHeader({ title, description, actions }: DashboardHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-150 pb-6 dark:border-zinc-800 mb-8">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
          {title}
        </h1>
        {description && (
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            {description}
          </p>
        )}
      </div>
      {actions && <div className="flex items-center gap-3 shrink-0">{actions}</div>}
    </div>
  );
}
