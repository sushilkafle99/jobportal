"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  MapPin,
  Briefcase,
  DollarSign,
  Calendar,
  Bookmark,
} from "lucide-react";
import Badge from "./Badge";
import Avatar from "./Avatar";

interface JobCardProps {
  job: {
    _id: string;
    title: string;
    description: string;
    location: string;
    employmentType: string;
    salaryMin: number;
    salaryMax: number;
    category: string;
    createdAt: string | Date;
    companyId: {
      _id: string;
      name: string;
      logo?: string;
      location?: string;
    };
  };
  isSavedInitial?: boolean;
  onBookmarkToggle?: (jobId: string, newState: boolean) => Promise<void>;
  hideBookmark?: boolean;
}

export default function JobCard({
  job,
  isSavedInitial = false,
  onBookmarkToggle,
  hideBookmark = false,
}: JobCardProps) {
  const [isSaved, setIsSaved] = useState(isSavedInitial);
  const [isLoading, setIsLoading] = useState(false);

  const formattedDate = new Date(job.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const handleBookmark = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isLoading) return;

    try {
      setIsLoading(true);
      const newState = !isSaved;

      if (onBookmarkToggle) {
        await onBookmarkToggle(job._id, newState);
        setIsSaved(newState);
      } else {
        const method = newState ? "POST" : "DELETE";
        const url = newState
          ? "/api/jobs/save"
          : `/api/jobs/save?jobId=${job._id}`;
        const res = await fetch(url, {
          method,
          headers: { "Content-Type": "application/json" },
          body: newState ? JSON.stringify({ jobId: job._id }) : undefined,
        });

        if (res.status === 401) {
          window.location.href = "/login?from=/jobs";
          return;
        }

        if (res.ok) {
          setIsSaved(newState);
        }
      }
    } catch (err) {
      console.error("Failed to bookmark job", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Link
      href={`/jobs/${job._id}`}
      className="group block relative p-6 bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 rounded-2xl hover:border-indigo-500/50 dark:hover:border-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/[0.02] transition-all duration-300 active:scale-[0.99]"
    >
      <div className="flex items-start gap-4">
        <Avatar
          src={job.companyId?.logo}
          name={job.companyId?.name || "Company"}
          size="md"
        />

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="text-base font-bold text-zinc-900 dark:text-white group-hover:text-indigo-650 dark:group-hover:text-indigo-400 transition-colors truncate">
                {job.title}
              </h3>
              <p className="text-sm text-zinc-500 dark:text-white font-medium truncate mt-0.5">
                {job.companyId?.name || "Hiring Company"}
              </p>
            </div>

            {!hideBookmark && (
              <button
                onClick={handleBookmark}
                disabled={isLoading}
                className={`p-2 rounded-xl border transition-all duration-200 ${
                  isSaved
                    ? "bg-indigo-50 border-indigo-200 text-indigo-600 dark:bg-indigo-950/40 dark:border-indigo-900/50 dark:text-indigo-400"
                    : "bg-zinc-50 border-zinc-200 text-zinc-400 hover:text-zinc-650 hover:bg-zinc-100 dark:bg-zinc-950 dark:border-zinc-800 dark:hover:bg-zinc-850"
                }`}
              >
                <Bookmark
                  className={`w-4 h-4 ${isSaved ? "fill-current" : ""}`}
                />
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-4 text-xs font-medium text-zinc-500 dark:text-zinc-450">
            <div className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              <span>{job.location}</span>
            </div>
            <div className="flex items-center gap-1">
              <Briefcase className="w-3.5 h-3.5" />
              <span>{job.employmentType}</span>
            </div>
            <div className="flex items-center gap-1">
              <DollarSign className="w-3.5 h-3.5" />
              <span>
                ${job.salaryMin.toLocaleString()} - $
                {job.salaryMax.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center gap-1 ml-auto">
              <Calendar className="w-3.5 h-3.5" />
              <span>{formattedDate}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-850">
            <Badge variant="primary">{job.category}</Badge>
            <span className="text-xs text-zinc-400 dark:text-zinc-550 ml-auto group-hover:translate-x-0.5 transition-transform inline-flex items-center gap-0.5">
              View Details →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
