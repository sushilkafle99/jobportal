"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import DashboardHeader from "@/components/DashboardHeader";
import Input from "@/components/Input";
import Textarea from "@/components/Textarea";
import Select from "@/components/Select";
import Button from "@/components/Button";

export default function RecruiterJobCreatePage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [requirements, setRequirements] = useState("");
  const [responsibilities, setResponsibilities] = useState("");
  const [salaryMin, setSalaryMin] = useState(0);
  const [salaryMax, setSalaryMax] = useState(0);
  const [experienceLevel, setExperienceLevel] = useState("Entry");
  const [employmentType, setEmploymentType] = useState("Full-Time");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("Technology");
  const [skills, setSkills] = useState("");
  const [status, setStatus] = useState("Active");

  const [companyId, setCompanyId] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadRecruiterCompany() {
      try {
        const userRes = await fetch("/api/auth/me");
        if (userRes.ok) {
          const userData = await userRes.json();
          const companiesRes = await fetch("/api/companies");
          if (companiesRes.ok) {
            const comData = await companiesRes.json();
            const myCompany = comData.companies.find(
              (c: { createdBy: string; _id: string }) => c.createdBy === userData.user._id
            );
            if (myCompany) {
              setCompanyId(myCompany._id);
            }
          }
        }
      } catch {
        console.error("Failed to load recruiter company");
      } finally {
        setLoading(false);
      }
    }
    loadRecruiterCompany();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyId) {
      setError("Please create a Company Profile first before posting a job");
      return;
    }

    if (!title || !description || !requirements || !responsibilities || !location || !skills) {
      setError("Please fill in all required fields");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          requirements,
          responsibilities,
          salaryMin,
          salaryMax,
          experienceLevel,
          employmentType,
          location,
          category,
          skills,
          status,
          companyId,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Failed to create job posting");
        return;
      }

      router.push("/recruiter/jobs");
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center py-20">Loading employer details...</div>;
  }

  return (
    <div className="flex flex-col gap-8 w-full max-w-3xl">
      <DashboardHeader
        title="Post a Job"
        description="List a new vacancy to hire top tech candidates."
      />

      {!companyId ? (
        <div className="p-8 border border-dashed border-amber-300 dark:border-amber-900 rounded-3xl bg-amber-50/50 dark:bg-amber-950/10 text-center flex flex-col items-center">
          <h4 className="text-base font-bold text-amber-800 dark:text-amber-400">Company Profile Required</h4>
          <p className="text-sm text-zinc-500 mt-2 max-w-md">
            You must set up a company profile (name, logo, website, and industry) before listing vacancies.
          </p>
          <Link href="/recruiter/company" className="mt-6">
            <Button>Create Company Profile</Button>
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="p-6 md:p-8 bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 rounded-3xl shadow-sm flex flex-col gap-5">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl text-xs font-semibold text-rose-650 dark:bg-rose-955/20 dark:border-rose-900/50">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Job Title*"
              type="text"
              placeholder="e.g. Senior Full-Stack Developer"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />

            <Select
              label="Category*"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              options={[
                { value: "Technology", label: "Technology" },
                { value: "Design", label: "Design" },
                { value: "Marketing", label: "Marketing" },
                { value: "Finance", label: "Finance" },
                { value: "Healthcare", label: "Healthcare" },
                { value: "Education", label: "Education" },
              ]}
            />
          </div>

          <Textarea
            label="Job Description*"
            placeholder="Outline the role details, technologies, and target profiles..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />

          <Textarea
            label="Requirements* (Comma-separated list)"
            placeholder="e.g. 3+ years React experience, BSc in CS, strong communication"
            value={requirements}
            onChange={(e) => setRequirements(e.target.value)}
            required
            rows={3}
          />

          <Textarea
            label="Responsibilities* (Comma-separated list)"
            placeholder="e.g. Design UI layouts, build robust APIs, participate in code reviews"
            value={responsibilities}
            onChange={(e) => setResponsibilities(e.target.value)}
            required
            rows={3}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Minimum Yearly Salary ($)*"
              type="number"
              value={salaryMin}
              onChange={(e) => setSalaryMin(parseInt(e.target.value) || 0)}
              required
            />

            <Input
              label="Maximum Yearly Salary ($)*"
              type="number"
              value={salaryMax}
              onChange={(e) => setSalaryMax(parseInt(e.target.value) || 0)}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select
              label="Experience Level*"
              value={experienceLevel}
              onChange={(e) => setExperienceLevel(e.target.value)}
              options={[
                { value: "Entry", label: "Entry Level" },
                { value: "Mid", label: "Mid Level" },
                { value: "Senior", label: "Senior Level" },
                { value: "Lead", label: "Lead / Principal" },
              ]}
            />

            <Select
              label="Employment Type*"
              value={employmentType}
              onChange={(e) => setEmploymentType(e.target.value)}
              options={[
                { value: "Full-Time", label: "Full-Time" },
                { value: "Part-Time", label: "Part-Time" },
                { value: "Contract", label: "Contract" },
                { value: "Internship", label: "Internship" },
                { value: "Remote", label: "Remote" },
              ]}
            />

            <Input
              label="LocationHQ / Remote*"
              type="text"
              placeholder="e.g. Remote (US) or Paris, FR"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
          </div>

          <Input
            label="Required Skills* (Comma-separated list)"
            placeholder="e.g. React, Node.js, MongoDB, TypeScript"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            required
          />

          <Select
            label="Posting Status*"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            options={[
              { value: "Active", label: "Active (Visible to all)" },
              { value: "Draft", label: "Draft (Internal only)" },
              { value: "Closed", label: "Closed" },
            ]}
          />

          <div className="flex gap-3 pt-6 border-t border-zinc-150 dark:border-zinc-800">
            <Link href="/recruiter/jobs">
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>
            <Button type="submit" isLoading={saving}>
              Post Vacancy
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
