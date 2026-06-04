"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, Briefcase } from "lucide-react";
import Button from "./Button";

export default function SearchBar({
  initialKeyword = "",
  initialLocation = "",
  initialCategory = "",
}: {
  initialKeyword?: string;
  initialLocation?: string;
  initialCategory?: string;
}) {
  const router = useRouter();
  const [keyword, setKeyword] = useState(initialKeyword);
  const [location, setLocation] = useState(initialLocation);
  const [category, setCategory] = useState(initialCategory);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (keyword) params.set("keyword", keyword);
    if (location) params.set("location", location);
    if (category && category !== "all") params.set("category", category);

    router.push(`/jobs?${params.toString()}`);
  };

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "Technology", label: "Technology" },
    { value: "Design", label: "Design" },
    { value: "Marketing", label: "Marketing" },
    { value: "Finance", label: "Finance" },
    { value: "Healthcare", label: "Healthcare" },
    { value: "Education", label: "Education" },
  ];

  return (
    <form
      onSubmit={handleSearch}
      className="w-full bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 rounded-3xl p-2.5 md:p-3.5 shadow-xl shadow-zinc-200/50 dark:shadow-none flex flex-col md:flex-row items-center gap-3.5"
    >
      <div className="w-full flex items-center gap-3 px-3 py-1">
        <Search className="w-5 h-5 text-indigo-500 shrink-0" />
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Job title, keywords, or company..."
          className="w-full bg-transparent text-sm text-zinc-800 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none"
        />
      </div>

      <div className="hidden md:block w-px h-8 bg-zinc-200 dark:bg-zinc-800 shrink-0" />

      <div className="w-full flex items-center gap-3 px-3 py-1">
        <MapPin className="w-5 h-5 text-indigo-500 shrink-0" />
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="City, state, or remote..."
          className="w-full bg-transparent text-sm text-zinc-800 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none"
        />
      </div>

      <div className="hidden md:block w-px h-8 bg-zinc-200 dark:bg-zinc-800 shrink-0" />

      <div className="w-full flex items-center gap-3 px-3 py-1">
        <Briefcase className="w-5 h-5 text-indigo-500 shrink-0" />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full bg-transparent text-sm text-zinc-850 dark:text-zinc-350 focus:outline-none cursor-pointer"
        >
          {categories.map((c) => (
            <option key={c.value} value={c.value} className="bg-white dark:bg-zinc-900">
              {c.label}
            </option>
          ))}
        </select>
      </div>

      <Button type="submit" className="w-full md:w-auto shrink-0 shadow-lg shadow-indigo-200 dark:shadow-none">
        Find Jobs
      </Button>
    </form>
  );
}
