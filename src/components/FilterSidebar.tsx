"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Select from "./Select";

export default function FilterSidebar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentCategory = searchParams.get("category") || "all";
  const currentExperience = searchParams.get("experienceLevel") || "all";
  const currentType = searchParams.get("employmentType") || "all";

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "all") {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    router.push(`/jobs?${params.toString()}`);
  };

  const handleClear = () => {
    router.push("/jobs");
  };

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "Technology", label: "Technology" },
    { value: "Design", label: "Design" },
    { value: "Marketing", label: "Marketing" },
    { value: "Finance", label: "Finance" },
  ];

  const experienceLevels = [
    { value: "all", label: "All Levels" },
    { value: "Entry", label: "Entry Level" },
    { value: "Mid", label: "Mid Level" },
    { value: "Senior", label: "Senior Level" },
    { value: "Lead", label: "Lead / Manager" },
  ];

  const employmentTypes = [
    { value: "all", label: "All Types" },
    { value: "Full-Time", label: "Full-Time" },
    { value: "Part-Time", label: "Part-Time" },
    { value: "Contract", label: "Contract" },
    { value: "Internship", label: "Internship" },
    { value: "Remote", label: "Remote" },
  ];

  return (
    <div className="w-full md:w-64 bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 rounded-2xl p-6 h-fit shrink-0">
      <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-4 mb-6">
        <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-555">Filter Jobs</h3>
        <button
          onClick={handleClear}
          className="text-xs font-semibold text-indigo-605 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
        >
          Clear All
        </button>
      </div>

      <div className="flex flex-col gap-5">
        <Select
          label="Category"
          value={currentCategory}
          onChange={(e) => handleFilterChange("category", e.target.value)}
          options={categories}
        />

        <Select
          label="Experience Level"
          value={currentExperience}
          onChange={(e) => handleFilterChange("experienceLevel", e.target.value)}
          options={experienceLevels}
        />

        <Select
          label="Employment Type"
          value={currentType}
          onChange={(e) => handleFilterChange("employmentType", e.target.value)}
          options={employmentTypes}
        />
      </div>
    </div>
  );
}
