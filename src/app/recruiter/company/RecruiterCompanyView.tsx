"use client";

import React, { useState, useEffect } from "react";
import DashboardHeader from "@/components/DashboardHeader";
import Input from "@/components/Input";
import Textarea from "@/components/Textarea";
import Button from "@/components/Button";

interface CompanyItem {
  _id: string;
  createdBy: string;
  name?: string;
  logo?: string;
  website?: string;
  description?: string;
  industry?: string;
  location?: string;
  employeeCount?: number;
  foundedYear?: number;
}

export default function RecruiterCompanyPage() {
  const [companyId, setCompanyId] = useState("");
  const [name, setName] = useState("");
  const [logo, setLogo] = useState("");
  const [website, setWebsite] = useState("");
  const [description, setDescription] = useState("");
  const [industry, setIndustry] = useState("");
  const [location, setLocation] = useState("");
  const [employeeCount, setEmployeeCount] = useState(0);
  const [foundedYear, setFoundedYear] = useState(new Date().getFullYear());

  const [isLoading, setIsLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    async function loadCompany() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const meData = await res.json();
          const recRes = await fetch("/api/companies");
          if (recRes.ok) {
            const comData = await recRes.json();
            const myCompany = comData.companies.find(
              (c: CompanyItem) => c.createdBy === meData.user._id
            );

            if (myCompany) {
              setCompanyId(myCompany._id);
              setName(myCompany.name || "");
              setLogo(myCompany.logo || "");
              setWebsite(myCompany.website || "");
              setDescription(myCompany.description || "");
              setIndustry(myCompany.industry || "");
              setLocation(myCompany.location || "");
              setEmployeeCount(myCompany.employeeCount || 0);
              setFoundedYear(myCompany.foundedYear || 2026);
            }
          }
        }
      } catch {
        console.error("Failed to load company");
      } finally {
        setFetching(false);
      }
    }
    loadCompany();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !description || !industry || !location) {
      setError("Please fill in all required fields (Name, Description, Industry, Location)");
      return;
    }

    try {
      setIsLoading(true);
      setError("");
      setSuccess("");

      const method = companyId ? "PATCH" : "POST";
      const url = companyId ? `/api/companies/${companyId}` : "/api/companies";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          logo,
          website,
          description,
          industry,
          location,
          employeeCount,
          foundedYear,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Failed to save company profile");
        return;
      }

      if (!companyId) {
        setCompanyId(data.company._id);
      }
      setSuccess("Company profile saved successfully!");
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (fetching) {
    return <div className="text-center py-20">Loading profile...</div>;
  }

  return (
    <div className="flex flex-col gap-8 w-full max-w-2xl">
      <DashboardHeader
        title="Company Profile"
        description="Set up and manage details about your hiring organization."
      />

      <form onSubmit={handleSubmit} className="p-6 md:p-8 bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 rounded-3xl shadow-sm flex flex-col gap-5">
        {error && (
          <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl text-xs font-semibold text-rose-650 dark:bg-rose-955/20 dark:border-rose-900/50">
            {error}
          </div>
        )}
        {success && (
          <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-xs font-semibold text-emerald-650 dark:bg-emerald-955/20 dark:border-emerald-900/50">
            {success}
          </div>
        )}

        <Input
          label="Company Name*"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <Input
          label="Logo URL Link"
          type="url"
          placeholder="https://example.com/logo.png"
          value={logo}
          onChange={(e) => setLogo(e.target.value)}
        />

        <Input
          label="Website URL"
          type="url"
          placeholder="https://example.com"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
        />

        <Textarea
          label="Company Description*"
          placeholder="Tell candidates about your company mission, values, and work culture..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Industry*"
            type="text"
            placeholder="e.g. Technology, Healthcare"
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
            required
          />

          <Input
            label="Location Headquarters*"
            type="text"
            placeholder="e.g. San Francisco, CA"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Employee Count"
            type="number"
            value={employeeCount}
            onChange={(e) => setEmployeeCount(parseInt(e.target.value) || 0)}
          />

          <Input
            label="Founded Year"
            type="number"
            value={foundedYear}
            onChange={(e) => setFoundedYear(parseInt(e.target.value) || 2026)}
          />
        </div>

        <Button type="submit" isLoading={isLoading} className="mt-4 self-start">
          {companyId ? "Update Company Profile" : "Create Company Profile"}
        </Button>
      </form>
    </div>
  );
}
