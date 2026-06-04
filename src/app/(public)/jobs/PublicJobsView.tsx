import React from "react";
import { cookies } from "next/headers";
import { dbConnect } from "@/lib/db";
import Job from "@/models/Job";
import Company from "@/models/Company";
import SavedJob from "@/models/SavedJob";
import { verifyToken } from "@/utils/auth";
import JobCard from "@/components/JobCard";
import FilterSidebar from "@/components/FilterSidebar";
import SearchBar from "@/components/SearchBar";

export const dynamic = "force-dynamic";

export default async function JobsPage({
  searchParams,
}: {
  searchParams: Promise<{
    keyword?: string;
    location?: string;
    category?: string;
    experienceLevel?: string;
    employmentType?: string;
  }>;
}) {
  const params = await searchParams;
  const { keyword, location, category, experienceLevel, employmentType } = params;

  await dbConnect();

  const query: {
    status: string;
    category?: string;
    experienceLevel?: string;
    employmentType?: string;
    location?: { $regex: string; $options: string };
    $or?: Array<
      | { title: { $regex: string; $options: string } }
      | { skills: { $in: RegExp[] } }
      | { description: { $regex: string; $options: string } }
    >;
  } = { status: "Active" };

  if (category && category !== "all") {
    query.category = category;
  }
  if (experienceLevel && experienceLevel !== "all") {
    query.experienceLevel = experienceLevel;
  }
  if (employmentType && employmentType !== "all") {
    query.employmentType = employmentType;
  }
  if (location) {
    query.location = { $regex: location, $options: "i" };
  }
  if (keyword) {
    query.$or = [
      { title: { $regex: keyword, $options: "i" } },
      { skills: { $in: [new RegExp(keyword, "i")] } },
      { description: { $regex: keyword, $options: "i" } },
    ];
  }

  const jobs = await Job.find(query)
    .populate({ path: "companyId", model: Company, select: "name logo location" })
    .sort({ createdAt: -1 });

  let savedJobIds: string[] = [];
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (token) {
      const decoded = await verifyToken(token);
      if (decoded) {
        const saved = await SavedJob.find({ userId: decoded.userId }).select("jobId");
        savedJobIds = saved.map((s) => s.jobId.toString());
      }
    }
  } catch (err) {
    console.error("Failed to fetch saved job ids", err);
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-10 w-full flex-1 flex flex-col">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-white">
          Find Your Dream Job
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          Browse through high-quality opportunities across remote, full-time, and internship positions.
        </p>
      </div>

      <div className="mb-10 w-full max-w-4xl">
        <SearchBar
          initialKeyword={keyword}
          initialLocation={location}
          initialCategory={category}
        />
      </div>

      <div className="flex flex-col md:flex-row gap-8 flex-1">
        <FilterSidebar />

        <div className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm font-semibold text-zinc-500">
              Showing <span className="text-zinc-800 dark:text-zinc-300 font-bold">{jobs.length}</span> jobs found
            </p>
          </div>

          {jobs.length === 0 ? (
            <div className="text-center py-20 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl bg-zinc-50/20">
              <p className="text-base font-bold text-zinc-900 dark:text-zinc-150">No jobs found</p>
              <p className="text-sm text-zinc-500 mt-1">Try adjusting your filters or search terms.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {jobs.map((job) => (
                <JobCard
                  key={job._id.toString()}
                  job={JSON.parse(JSON.stringify(job))}
                  isSavedInitial={savedJobIds.includes(job._id.toString())}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
