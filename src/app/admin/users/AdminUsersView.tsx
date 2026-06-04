"use client";

import React, { useState, useEffect } from "react";
import DashboardHeader from "@/components/DashboardHeader";
import DataTable from "@/components/DataTable";
import Button from "@/components/Button";
import Badge from "@/components/Badge";

interface UserData {
  _id: string;
  name: string;
  email: string;
  isActive: boolean;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const loadUsers = async () => {
      try {
        const res = await fetch("/api/users?role=USER");
        if (res.ok && active) {
          const data = await res.json();
          setUsers(data.users || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };
    loadUsers();
    return () => {
      active = false;
    };
  }, []);

  const handleToggleStatus = async (user: UserData) => {
    try {
      const newActive = !user.isActive;
      const res = await fetch(`/api/users/${user._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: newActive }),
      });
      if (res.ok) {
        setUsers((prev) =>
          prev.map((u) => (u._id === user._id ? { ...u, isActive: newActive } : u))
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
      accessor: (row: UserData) => (
        <Badge variant={row.isActive ? "success" : "danger"}>
          {row.isActive ? "Active" : "Suspended"}
        </Badge>
      ),
    },
    {
      header: "Actions",
      accessor: (row: UserData) => (
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
        title="Manage Seekers"
        description="View candidate account details and suspend or activate profiles."
      />

      <DataTable
        columns={columns}
        data={users}
        keyExtractor={(row: UserData) => row._id}
        isLoading={isLoading}
      />
    </div>
  );
}
