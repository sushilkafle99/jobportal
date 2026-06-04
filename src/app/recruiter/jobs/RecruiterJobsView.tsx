"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import DashboardHeader from "@/components/DashboardHeader";
import Button from "@/components/Button";
import Loader from "@/components/Loader";
import Badge from "@/components/Badge";
import { Edit2, Trash2, Plus, Calendar, MapPin } from "lucide-react";

interface RecruiterJob {
  _id: string;
  title: string;
  status: string;
  location: string;
  createdAt: string;
}

export default function RecruiterJobsPage() {
  const [jobs, setJobs] = useState<RecruiterJob[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const loadJobs = async () => {
      try {
        const userRes = await fetch("/api/auth/me");
        if (userRes.ok && active) {
          const userData = await userRes.json();

          const jobsRes = await fetch(`/api/jobs?recruiterId=${userData.user._id}&status=all`);
          if (jobsRes.ok && active) {
            const jobsData = await jobsRes.json();
            setJobs(jobsData.jobs || []);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };
    loadJobs();
    return () => {
      active = false;
    };
  }, []);

  const handleDelete = async (jobId: string) => {
    if (!confirm("Are you sure you want to delete this job posting? This action cannot be undone.")) {
      return;
    }

    try {
      const res = await fetch(`/api/jobs/${jobId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setJobs((prev) => prev.filter((j) => j._id !== jobId));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col gap-8 w-full">
      <DashboardHeader
        title="Manage Jobs"
        description="View, edit, or delete your tech vacancy listings."
        actions={
          <Link href="/recruiter/jobs/create">
            <Button size="sm" className="flex items-center gap-1.5">
              <Plus className="w-4 h-4" />
              <span>Post a Job</span>
            </Button>
          </Link>
        }
      />

      {isLoading ? (
        <Loader />
      ) : jobs.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl bg-zinc-50/20">
          <p className="text-sm text-zinc-500">You haven&apos;t posted any jobs yet.</p>
          <Link href="/recruiter/jobs/create" className="mt-4 inline-block">
            <Button size="sm">Create First Job Posting</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {jobs.map((job) => (
            <div
              key={job._id}
              className="p-6 bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 rounded-2xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div>
                <div className="flex items-center gap-3">
                  <h4 className="text-base font-bold text-zinc-900 dark:text-white">
                    {job.title}
                  </h4>
                  <Badge variant={job.status === "Active" ? "success" : "neutral"}>
                    {job.status}
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-4 text-xs font-semibold text-zinc-500 mt-2">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    {job.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    Posted {new Date(job.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <Link href={`/recruiter/jobs/edit/${job._id}`}>
                  <Button variant="outline" size="sm" className="flex items-center gap-1.5">
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </Button>
                </Link>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(job._id)}
                  className="flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
