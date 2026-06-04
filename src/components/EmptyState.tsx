import React from "react";
import Button from "./Button";

interface EmptyStateProps {
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export default function EmptyState({
  title,
  description,
  actionText,
  onAction,
  icon,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl bg-zinc-50/50 dark:bg-zinc-900/20 max-w-md mx-auto my-6">
      {icon ? (
        <div className="text-zinc-400 dark:text-zinc-500 mb-4">{icon}</div>
      ) : (
        <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 dark:text-zinc-500 mb-4">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
      )}
      <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-150 mb-1">{title}</h3>
      <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">{description}</p>
      {actionText && onAction && (
        <Button size="sm" onClick={onAction}>
          {actionText}
        </Button>
      )}
    </div>
  );
}
