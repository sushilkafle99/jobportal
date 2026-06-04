"use client";

import React, { useState, useEffect } from "react";
import DashboardHeader from "@/components/DashboardHeader";
import DataTable from "@/components/DataTable";
import Button from "@/components/Button";
import Badge from "@/components/Badge";

interface RecruiterData {
  _id: string;
  name: string;
  email: string;
  isActive: boolean;
}

export default function AdminRecruitersPage() {
  const [recruiters, setRecruiters] = useState<RecruiterData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const loadRecruiters = async () => {
      try {
        const res = await fetch("/api/users?role=RECRUITER");
        if (res.ok && active) {
          const data = await res.json();
          setRecruiters(data.users || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };
    loadRecruiters();
    return () => {
      active = false;
    };
  }, []);

  const handleToggleStatus = async (recruiter: RecruiterData) => {
    try {
      const newActive = !recruiter.isActive;
      const res = await fetch(`/api/users/${recruiter._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: newActive }),
      });
      if (res.ok) {
        setRecruiters((prev) =>
          prev.map((r) => (r._id === recruiter._id ? { ...r, isActive: newActive } : r))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const columns = [
    { header: "Name", accessor: "name" as const },
    { header: "Email Address", accessor: "email" as const },
    {
      header: "Status",
      accessor: (row: RecruiterData) => (
        <Badge variant={row.isActive ? "success" : "danger"}>
          {row.isActive ? "Active" : "Suspended"}
        </Badge>
      ),
    },
    {
      header: "Actions",
      accessor: (row: RecruiterData) => (
        <Button
          variant={row.isActive ? "danger" : "primary"}
          size="sm"
          onClick={() => handleToggleStatus(row)}
        >
          {row.isActive ? "Suspend" : "Activate"}
        </Button>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-8 w-full">
      <DashboardHeader
        title="Manage Recruiters"
        description="View employer accounts and manage access permissions."
      />

      <DataTable
        columns={columns}
        data={recruiters}
        keyExtractor={(row: RecruiterData) => row._id}
        isLoading={isLoading}
      />
    </div>
  );
}
