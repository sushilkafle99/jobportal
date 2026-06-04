import React from "react";
import SearchBar from "./SearchBar";
import { Sparkles } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-zinc-50 dark:bg-black py-20 md:py-28">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-3xl -z-10" />
      <div className="absolute top-1/3 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-violet-500/10 rounded-full blur-3xl -z-10 animate-pulse" />

      <div className="mx-auto max-w-5xl px-6 text-center flex flex-col items-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-indigo-200/50 bg-indigo-50/50 dark:border-indigo-950/40 dark:bg-indigo-950/20 text-xs font-bold text-indigo-650 dark:text-indigo-400 mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Launch Your Tech Career Today</span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-none bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-700 dark:from-white dark:via-zinc-100 dark:to-zinc-300 text-transparent bg-clip-text max-w-3xl">
          Discover the Perfect Career Path For You
        </h1>

        <p className="text-base sm:text-lg text-zinc-500 max-w-2xl mt-6 leading-relaxed">
          Search over 12,000+ high-paying tech jobs, remote positions, and corporate internships from top startups and Fortune 500 enterprises.
        </p>

        <div className="w-full max-w-4xl mt-10">
          <SearchBar />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-12 mt-16 max-w-4xl w-full border-t border-zinc-200 dark:border-zinc-850 pt-8 text-center">
          <div>
            <p className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">12k+</p>
            <p className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mt-1">
              Active Jobs
            </p>
          </div>
          <div>
            <p className="text-3xl font-extrabold text-zinc-900 dark:text-white">8,500+</p>
            <p className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mt-1">
              Hiring Startups
            </p>
          </div>
          <div>
            <p className="text-3xl font-extrabold text-zinc-900 dark:text-white">45k+</p>
            <p className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mt-1">
              Candidates
            </p>
          </div>
          <div>
            <p className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">$125k</p>
            <p className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mt-1">
              Average Salary
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
