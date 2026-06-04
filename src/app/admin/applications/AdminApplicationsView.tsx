"use client";

import React, { useState, useEffect } from "react";
import DashboardHeader from "@/components/DashboardHeader";
import DataTable from "@/components/DataTable";
import Badge from "@/components/Badge";

interface ApplicationData {
  _id: string;
  status: string;
  userId?: {
    name: string;
  };
  jobId?: {
    title: string;
    companyId?: {
      name: string;
    };
  };
}

export default function AdminApplicationsPage() {
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
          prev.map((app) => (app._id === appId ? { ...app, status: newStatus } : app))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const columns = [
    { header: "Candidate", accessor: (row: ApplicationData) => row.userId?.name || "N/A" },
    { header: "Vacancy Title", accessor: (row: ApplicationData) => row.jobId?.title || "N/A" },
    { header: "Company", accessor: (row: ApplicationData) => row.jobId?.companyId?.name || "N/A" },
    {
      header: "Status",
      accessor: (row: ApplicationData) => (
        <Badge
          variant={
            row.status === "Accepted"
              ? "success"
              : row.status === "Rejected"
              ? "danger"
              : row.status === "Shortlisted"
              ? "primary"
              : row.status === "Reviewing"
              ? "warning"
              : "neutral"
          }
        >
          {row.status}
        </Badge>
      ),
    },
    {
      header: "Modify Status",
      accessor: (row: ApplicationData) => (
        <select
          value={row.status}
          onChange={(e) => handleStatusChange(row._id, e.target.value)}
          className="px-2.5 py-1 text-xs font-semibold rounded-lg border border-zinc-200 bg-zinc-50 text-zinc-700 dark:border-zinc-800 dark:bg-zinc-955 dark:text-zinc-300 focus:outline-none"
        >
          <option value="Pending">Pending</option>
          <option value="Reviewing">Reviewing</option>
          <option value="Shortlisted">Shortlisted</option>
          <option value="Rejected">Rejected</option>
          <option value="Accepted">Accepted</option>
        </select>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-8 w-full">
      <DashboardHeader
        title="Monitor Applications"
        description="View and moderate candidate applications across the platform."
      />

      <DataTable
        columns={columns}
        data={applications}
        keyExtractor={(row: ApplicationData) => row._id}
        isLoading={isLoading}
      />
    </div>
  );
}
