"use client";

import React from "react";
import Link from "next/link";
import { Briefcase } from "lucide-react";
import Button from "@/components/Button";
import Input from "@/components/Input";

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-black px-6 py-12">
      <div className="max-w-md w-full p-8 md:p-10 bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 rounded-3xl shadow-xl shadow-zinc-200/40 dark:shadow-none">
        <div className="flex flex-col items-center mb-6">
          <Link href="/" className="flex items-center gap-2 group mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-650 text-white shadow-md shadow-indigo-200 dark:shadow-none group-hover:scale-105 transition-transform duration-200">
              <Briefcase className="h-5 w-5" />
            </div>
            <span className="text-xl font-black tracking-tight text-zinc-900 dark:text-white">
              Job<span className="text-indigo-650 dark:text-indigo-400">Portal</span>
            </span>
          </Link>
          <h2 className="text-2xl font-extrabold text-zinc-900 dark:text-white">
            Reset Password
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Enter your email to receive a password reset link (placeholder)
          </p>
        </div>

        <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
          <Input
            label="Email Address"
            type="email"
            placeholder="you@example.com"
            required
          />

          <Button type="submit" className="mt-4 w-full">
            Send Reset Link
          </Button>
        </form>

        <p className="text-center text-xs text-zinc-400 mt-6">
          Remember your password?{" "}
          <Link
            href="/login"
            className="text-indigo-650 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 font-bold"
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
