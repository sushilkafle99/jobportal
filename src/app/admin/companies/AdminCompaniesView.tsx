"use client";

import React, { useState, useEffect } from "react";
import DashboardHeader from "@/components/DashboardHeader";
import DataTable from "@/components/DataTable";
import Button from "@/components/Button";

interface CompanyData {
  _id: string;
  name: string;
  industry: string;
  location: string;
}

export default function AdminCompaniesPage() {
  const [companies, setCompanies] = useState<CompanyData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const loadCompanies = async () => {
      try {
        const res = await fetch("/api/companies");
        if (res.ok && active) {
          const data = await res.json();
          setCompanies(data.companies || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };
    loadCompanies();
    return () => {
      active = false;
    };
  }, []);

  const handleDelete = async (companyId: string) => {
    if (!confirm("Are you sure you want to delete this company? All related jobs will remain, but the company profile will be removed.")) {
      return;
    }

    try {
      const res = await fetch(`/api/companies/${companyId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setCompanies((prev) => prev.filter((c) => c._id !== companyId));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const columns = [
    { header: "Company Name", accessor: "name" as const },
    { header: "Industry", accessor: "industry" as const },
    { header: "LocationHQ", accessor: "location" as const },
    {
      header: "Actions",
      accessor: (row: CompanyData) => (
        <Button variant="danger" size="sm" onClick={() => handleDelete(row._id)}>
          Delete Profile
        </Button>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-8 w-full">
      <DashboardHeader
        title="Manage Companies"
        description="Monitor registered hiring companies and moderate profiles."
      />

      <DataTable
        columns={columns}
        data={companies}
        keyExtractor={(row: CompanyData) => row._id}
        isLoading={isLoading}
      />
    </div>
  );
}
