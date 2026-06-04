"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Briefcase } from "lucide-react";
import Button from "@/components/Button";
import Input from "@/components/Input";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    try {
      setIsLoading(true);
      setError("");

      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Invalid credentials");
        return;
      }

      router.refresh();
      if (data.user.role === "ADMIN") {
        router.push("/admin/dashboard");
      } else if (data.user.role === "RECRUITER") {
        router.push("/recruiter/dashboard");
      } else {
        router.push(from === "/" ? "/user/dashboard" : from);
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-black px-6 py-12">
      <div className="max-w-md w-full p-8 md:p-10 bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 rounded-3xl shadow-xl shadow-zinc-200/40 dark:shadow-none">
        <div className="flex flex-col items-center mb-8">
          <Link href="/" className="flex items-center gap-2 group mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-md shadow-indigo-200 dark:shadow-none group-hover:scale-[1.05] transition-transform duration-200">
              <Briefcase className="h-5 w-5" />
            </div>
            <span className="text-xl font-black tracking-tight text-zinc-900 dark:text-white">
              Job<span className="text-indigo-650 dark:text-indigo-400">Portal</span>
            </span>
          </Link>
          <h2 className="text-2xl font-extrabold text-zinc-900 dark:text-white">
            Welcome Back
          </h2>
          <p className="text-xs text-zinc-400 mt-1.5">
            Log in to manage applications and browse listings
          </p>
        </div>

        {error && (
          <div className="p-3 mb-6 bg-rose-50 border border-rose-100 rounded-xl text-xs font-semibold text-rose-600 dark:bg-rose-950/20 dark:border-rose-900/50">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="Email Address"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-350">
                Password
              </label>
              <Link
                href="/forgot-password"
                className="text-xs text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 font-semibold"
              >
                Forgot Password?
              </Link>
            </div>
            <Input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>

          <Button type="submit" isLoading={isLoading} className="mt-4 w-full">
            Log In
          </Button>
        </form>

        <p className="text-center text-xs text-zinc-400 mt-8">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 font-bold"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-black text-sm text-zinc-500">
        Loading Login Form...
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
