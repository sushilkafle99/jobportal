"use client";

import React, { useState, useEffect } from "react";
import DashboardHeader from "@/components/DashboardHeader";
import JobCard from "@/components/JobCard";
import Loader from "@/components/Loader";

interface SavedJobItem {
  _id: string;
  jobId: {
    _id: string;
    title: string;
    description: string;
    location: string;
    category: string;
    experienceLevel: string;
    employmentType: string;
    salaryMin: number;
    salaryMax: number;
    createdAt: string | Date;
    companyId: {
      _id: string;
      name: string;
      logo?: string;
      location?: string;
    };
  };
}

export default function SeekerSavedJobsPage() {
  const [savedJobs, setSavedJobs] = useState<SavedJobItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const fetchSavedJobs = async () => {
      try {
        const res = await fetch("/api/jobs/save");
        if (res.ok && active) {
          const data = await res.json();
          setSavedJobs(data.savedJobs || []);
        }
      } catch (err) {
        console.error("Failed to load saved jobs", err);
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };
    fetchSavedJobs();
    return () => {
      active = false;
    };
  }, []);

  const handleBookmarkToggle = async (jobId: string, newState: boolean) => {
    if (!newState) {
      setSavedJobs((prev) => prev.filter((item) => item.jobId?._id !== jobId));
    }
  };

  return (
    <div className="flex flex-col gap-8 w-full">
      <DashboardHeader
        title="Saved Jobs"
        description="View and apply to your saved job postings."
      />

      {isLoading ? (
        <Loader />
      ) : savedJobs.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl bg-zinc-50/20">
          <p className="text-sm text-zinc-500">You haven&apos;t saved any jobs yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {savedJobs.map((item) => {
            if (!item.jobId) return null;
            return (
              <JobCard
                key={item.jobId._id}
                job={item.jobId}
                isSavedInitial={true}
                onBookmarkToggle={handleBookmarkToggle}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
