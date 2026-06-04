import React from "react";
import Link from "next/link";
import Button from "@/components/Button";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50/50 dark:bg-black p-6">
      <div className="max-w-md w-full text-center p-8 bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 rounded-3xl shadow-lg">
        <div className="w-16 h-16 bg-red-50 text-red-650 rounded-full flex items-center justify-center mx-auto mb-6 dark:bg-red-950/40">
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-extrabold text-zinc-900 dark:text-white mb-2">Access Denied</h1>
        <p className="text-sm text-zinc-500 mb-8">
          You do not have the required permissions to view this resource. Please make sure you are logged in with the correct role.
        </p>
        <div className="flex flex-col gap-3">
          <Link href="/">
            <Button className="w-full">Go to Home Page</Button>
          </Link>
          <Link href="/login">
            <Button variant="outline" className="w-full">
              Sign in with a different account
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
