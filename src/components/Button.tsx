import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "danger" | "ghost" | "success";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

export default function Button({
  children,
  variant = "primary",
  size = "md",
  isLoading = false,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none";

  const variants = {
    primary:
      "bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white shadow-md shadow-indigo-200 dark:shadow-none focus:ring-indigo-500",
    secondary:
      "bg-zinc-100 hover:bg-zinc-200 text-zinc-900 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-zinc-100 focus:ring-zinc-500",
    outline:
      "border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-900 text-zinc-700 dark:text-zinc-300 focus:ring-indigo-500",
    danger: "bg-red-600 hover:bg-red-700 text-white shadow-md shadow-red-200 dark:shadow-none focus:ring-red-500",
    success: "bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-200 dark:shadow-none focus:ring-emerald-500",
    ghost: "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-100",
  };

  const sizes = {
    sm: "px-3.5 py-1.5 text-sm",
    md: "px-5 py-2.5 text-base",
    lg: "px-7 py-3.5 text-lg",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <svg
            className="animate-spin -ml-1 mr-2 h-4.5 w-4.5 text-current"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          Loading...
        </>
      ) : (
        children
      )}
    </button>
  );
}
