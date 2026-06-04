"use client";

import React, { useState, useEffect } from "react";
import DashboardHeader from "@/components/DashboardHeader";
import ApplicationCard from "@/components/ApplicationCard";
import Loader from "@/components/Loader";

interface ApplicationData {
  _id: string;
  resumeUrl: string;
  coverLetter?: string;
  status: "Pending" | "Reviewing" | "Shortlisted" | "Rejected" | "Accepted";
  appliedAt: string | Date;
  jobId: {
    _id: string;
    title: string;
    location: string;
    companyId?: {
      name: string;
    };
  };
  userId?: {
    name: string;
    email: string;
  };
}

export default function SeekerApplicationsPage() {
  const [applications, setApplications] = useState<ApplicationData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    async function fetchApplications() {
      try {
        const res = await fetch("/api/applications");
        if (res.ok && active) {
          const data = await res.json();
          setApplications(data.applications || []);
        }
      } catch (err) {
        console.error("Failed to load applications", err);
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }
    fetchApplications();
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="flex flex-col gap-8 w-full">
      <DashboardHeader
        title="My Applications"
        description="Track the status of your job applications."
      />

      {isLoading ? (
        <Loader />
      ) : applications.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl bg-zinc-50/20">
          <p className="text-sm text-zinc-500">You haven&apos;t submitted any applications yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {applications.map((app) => (
            <ApplicationCard key={app._id} application={app} />
          ))}
        </div>
      )}
    </div>
  );
}
