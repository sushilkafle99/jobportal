import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MapPin, Users, Calendar, Building2, ExternalLink } from "lucide-react";
import { dbConnect } from "@/lib/db";
import Company from "@/models/Company";
import Job from "@/models/Job";
import JobCard from "@/components/JobCard";
import Avatar from "@/components/Avatar";

export const dynamic = "force-dynamic";

export default async function CompanyDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  await dbConnect();
  const company = await Company.findById(id);

  if (!company) {
    notFound();
  }

  const openJobs = await Job.find({ companyId: id, status: "Active" }).sort({ createdAt: -1 });

  return (
    <div className="mx-auto max-w-5xl px-6 py-10 w-full flex-1">
      <Link href="/companies" className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline mb-6 inline-block">
        ← Back to Companies
      </Link>

      <div className="p-6 md:p-8 bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 rounded-3xl shadow-sm mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <Avatar src={company.logo} name={company.name} size="xl" />
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-white">
              {company.name}
            </h1>
            <p className="text-sm font-semibold text-indigo-650 dark:text-indigo-400 mt-1 uppercase tracking-wider">
              {company.industry}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-500 font-semibold md:text-right">
          {company.website && (
            <a
              href={company.website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-900 hover:bg-zinc-100 text-zinc-700 dark:text-zinc-300 transition-colors"
            >
              <span>Visit Website</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 flex flex-col gap-8">
          <div className="p-6 md:p-8 bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 rounded-3xl shadow-sm">
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-50 mb-4">About Company</h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-355 leading-relaxed whitespace-pre-line">
              {company.description || "No description available."}
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-zinc-900 dark:text-white mb-6">
              Open Positions ({openJobs.length})
            </h2>

            {openJobs.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl bg-zinc-50/20">
                <p className="text-sm text-zinc-555">No active job vacancies at the moment.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {openJobs.map((job) => (
                  <JobCard
                    key={job._id.toString()}
                    job={{
                      ...JSON.parse(JSON.stringify(job)),
                      companyId: {
                        _id: company._id.toString(),
                        name: company.name,
                        logo: company.logo,
                        location: company.location,
                      },
                    }}
                    hideBookmark
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="w-full lg:w-80 flex flex-col gap-6 shrink-0 h-fit">
          <div className="p-6 bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 rounded-3xl shadow-sm">
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-550 pb-3 border-b border-zinc-100 dark:border-zinc-850 mb-4">
              Company Facts
            </h3>
            <div className="flex flex-col gap-4 text-xs font-semibold text-zinc-500">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-indigo-500 shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-zinc-400 font-normal">Headquarters</p>
                  <p className="text-zinc-800 dark:text-zinc-300">{company.location || "N/A"}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-indigo-500 shrink-0">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-zinc-400 font-normal">Company Size</p>
                  <p className="text-zinc-800 dark:text-zinc-300">{company.employeeCount ? `${company.employeeCount} Employees` : "N/A"}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-indigo-500 shrink-0">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-zinc-400 font-normal">Founded Year</p>
                  <p className="text-zinc-800 dark:text-zinc-300">{company.foundedYear || "N/A"}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-indigo-500 shrink-0">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-zinc-400 font-normal">Industry</p>
                  <p className="text-zinc-800 dark:text-zinc-300">{company.industry}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
