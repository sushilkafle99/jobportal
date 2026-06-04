import React from "react";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export default function Select({ label, error, options, className = "", ...props }: SelectProps) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          {label}
        </label>
      )}
      <select
        className={`w-full px-4 py-2.5 rounded-xl border bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-all duration-200 focus:outline-none focus:ring-2 focus:border-indigo-500 focus:ring-indigo-500/20 ${
          error
            ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
            : "border-zinc-300 dark:border-zinc-800"
        } ${className}`}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <span className="text-xs text-red-500 mt-0.5">{error}</span>}
    </div>
  );
}
