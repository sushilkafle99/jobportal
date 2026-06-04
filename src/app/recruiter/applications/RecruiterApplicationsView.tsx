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

export default function RecruiterApplicationsPage() {
  const [applications, setApplications] = useState<ApplicationData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const loadApplications = async () => {
      try {
        const res = await fetch("/api/applications");
        if (res.ok && active) {
          const data = await res.json();
          setApplications(data.applications || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };
    loadApplications();
    return () => {
      active = false;
    };
  }, []);

  const handleStatusChange = async (appId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/applications/${appId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        setApplications((prev) =>
          prev.map((app) => (app._id === appId ? { ...app, status: newStatus as ApplicationData["status"] } : app))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col gap-8 w-full">
      <DashboardHeader
        title="Candidate Applications"
        description="Review incoming resumes and update candidates' statuses."
      />

      {isLoading ? (
        <Loader />
      ) : applications.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl bg-zinc-50/20">
          <p className="text-sm text-zinc-500">No applications have been received for your jobs yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {applications.map((app) => (
            <ApplicationCard
              key={app._id}
              application={app}
              isAdminOrRecruiter={true}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      )}
    </div>
  );
}
