"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Briefcase, User, ShieldCheck } from "lucide-react";
import Button from "@/components/Button";
import Input from "@/components/Input";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<"USER" | "RECRUITER">("USER");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setIsLoading(true);
      setError("");
      setSuccess("");

      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, confirmPassword, role }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Registration failed");
        return;
      }

      setSuccess("Account created successfully! Redirecting to login...");
      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

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
            Create Your Account
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Join thousands of developers and top tech organizations
          </p>
        </div>

        {error && (
          <div className="p-3 mb-4 bg-rose-50 border border-rose-100 rounded-xl text-xs font-semibold text-rose-650 dark:bg-rose-950/20 dark:border-rose-900/50">
            {error}
          </div>
        )}

        {success && (
          <div className="p-3 mb-4 bg-emerald-50 border border-emerald-100 rounded-xl text-xs font-semibold text-emerald-650 dark:bg-emerald-955/20 dark:border-emerald-900/50">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3 mb-2">
            <button
              type="button"
              onClick={() => setRole("USER")}
              className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border text-sm font-semibold transition-all duration-200 ${
                role === "USER"
                  ? "bg-indigo-50 border-indigo-200 text-indigo-600 dark:bg-indigo-950/40 dark:border-indigo-900/50 dark:text-indigo-400"
                  : "bg-white border-zinc-200 text-zinc-500 hover:bg-zinc-50 dark:bg-zinc-950 dark:border-zinc-800 dark:hover:bg-zinc-900"
              }`}
            >
              <User className="w-4.5 h-4.5" />
              <span>Job Seeker</span>
            </button>

            <button
              type="button"
              onClick={() => setRole("RECRUITER")}
              className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border text-sm font-semibold transition-all duration-200 ${
                role === "RECRUITER"
                  ? "bg-indigo-50 border-indigo-200 text-indigo-600 dark:bg-indigo-950/40 dark:border-indigo-900/50 dark:text-indigo-400"
                  : "bg-white border-zinc-200 text-zinc-500 hover:bg-zinc-50 dark:bg-zinc-950 dark:border-zinc-800 dark:hover:bg-zinc-900"
              }`}
            >
              <ShieldCheck className="w-4.5 h-4.5" />
              <span>Employer</span>
            </button>
          </div>

          <Input
            label="Full Name"
            type="text"
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoComplete="name"
          />

          <Input
            label="Email Address"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />

          <Input
            label="Password"
            type="password"
            placeholder="Min. 6 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="new-password"
          />

          <Input
            label="Confirm Password"
            type="password"
            placeholder="Re-enter password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            autoComplete="new-password"
          />

          <Button type="submit" isLoading={isLoading} className="mt-4 w-full">
            Sign Up
          </Button>
        </form>

        <p className="text-center text-xs text-zinc-400 mt-6">
          Already have an account?{" "}
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
