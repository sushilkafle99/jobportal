"use client";

import React, { useState, useEffect } from "react";
import DashboardHeader from "@/components/DashboardHeader";
import DataTable from "@/components/DataTable";
import Button from "@/components/Button";
import Badge from "@/components/Badge";

interface JobData {
  _id: string;
  title: string;
  location: string;
  status: string;
  companyId?: {
    name: string;
  };
}

export default function AdminJobsPage() {
  const [jobs, setJobs] = useState<JobData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const loadJobs = async () => {
      try {
        const res = await fetch("/api/jobs?status=all");
        if (res.ok && active) {
          const data = await res.json();
          setJobs(data.jobs || []);
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

  const handleStatusChange = async (jobId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/jobs/${jobId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setJobs((prev) =>
          prev.map((j) => (j._id === jobId ? { ...j, status: newStatus } : j))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (jobId: string) => {
    if (!confirm("Are you sure you want to delete this job vacancy posting?")) {
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

  const columns = [
    { header: "Vacancy Title", accessor: "title" as const },
    { header: "Company", accessor: (row: JobData) => row.companyId?.name || "N/A" },
    { header: "Location", accessor: "location" as const },
    {
      header: "Status",
      accessor: (row: JobData) => (
        <Badge variant={row.status === "Active" ? "success" : row.status === "Draft" ? "neutral" : "danger"}>
          {row.status}
        </Badge>
      ),
    },
    {
      header: "Actions",
      accessor: (row: JobData) => (
        <div className="flex items-center gap-2">
          {row.status !== "Active" && (
            <Button size="sm" onClick={() => handleStatusChange(row._id, "Active")}>
              Approve
            </Button>
          )}
          {row.status === "Active" && (
            <Button size="sm" variant="outline" onClick={() => handleStatusChange(row._id, "Closed")}>
              Close
            </Button>
          )}
          <Button variant="danger" size="sm" onClick={() => handleDelete(row._id)}>
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-8 w-full">
      <DashboardHeader
        title="Moderate Vacancies"
        description="Audit all submitted tech jobs, approve listings, or remove postings."
      />

      <DataTable
        columns={columns}
        data={jobs}
        keyExtractor={(row: JobData) => row._id}
        isLoading={isLoading}
      />
    </div>
  );
}
