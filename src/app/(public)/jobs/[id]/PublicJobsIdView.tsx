import React from "react";
import { cookies } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MapPin, Briefcase, DollarSign, Calendar, Building2, ExternalLink } from "lucide-react";
import { dbConnect } from "@/lib/db";
import Job from "@/models/Job";
import Company from "@/models/Company";
import Application from "@/models/Application";
import User from "@/models/User";
import { verifyToken } from "@/utils/auth";
import Badge from "@/components/Badge";
import Avatar from "@/components/Avatar";
import ApplyButton from "@/components/ApplyButton";

export const dynamic = "force-dynamic";

export default async function JobDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  await dbConnect();
  const job = await Job.findById(id).populate({
    path: "companyId",
    model: Company,
  });

  if (!job) {
    notFound();
  }

  let userRole = undefined;
  let userResumeUrl = "";
  let alreadyApplied = false;

  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (token) {
      const decoded = await verifyToken(token);
      if (decoded) {
        userRole = decoded.role;
        const user = await User.findById(decoded.userId);
        if (user) {
          userResumeUrl = user.resumeUrl || "";
        }

        const app = await Application.findOne({ jobId: id, userId: decoded.userId });
        if (app) {
          alreadyApplied = true;
        }
      }
    }
  } catch (err) {
    console.error("Auth check on Job Details failed", err);
  }

  const formattedDate = new Date(job.createdAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="mx-auto max-w-5xl px-6 py-10 w-full flex-1">
      <Link href="/jobs" className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline mb-6 inline-block">
        ← Back to Jobs list
      </Link>

      <div className="flex flex-col lg:flex-row gap-8 mt-4">
        <div className="flex-1 flex flex-col gap-8">
          <div className="p-6 md:p-8 bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 rounded-3xl shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <Avatar src={job.companyId?.logo} name={job.companyId?.name || "Company"} size="xl" />
                <div>
                  <h1 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-white">
                    {job.title}
                  </h1>
                  <p className="text-sm font-semibold text-zinc-500 dark:text-zinc-450 mt-1 flex items-center gap-1">
                    <Building2 className="w-4 h-4 text-zinc-400" />
                    <span>{job.companyId?.name}</span>
                  </p>
                </div>
              </div>

              <div className="sm:shrink-0">
                <ApplyButton
                  jobId={job._id.toString()}
                  defaultResumeUrl={userResumeUrl}
                  alreadyApplied={alreadyApplied}
                  userRole={userRole}
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 mt-8 pt-6 border-t border-zinc-100 dark:border-zinc-850 text-sm font-medium text-zinc-500">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-indigo-500" />
                <span>{job.location}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Briefcase className="w-4 h-4 text-indigo-500" />
                <span>{job.employmentType}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <DollarSign className="w-4 h-4 text-indigo-500" />
                <span>
                  ${job.salaryMin.toLocaleString()} - ${job.salaryMax.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center gap-1.5 ml-auto text-xs text-zinc-400">
                <Calendar className="w-4 h-4" />
                <span>Posted {formattedDate}</span>
              </div>
            </div>
          </div>

          <div className="p-6 md:p-8 bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 rounded-3xl shadow-sm">
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-50 mb-4">Job Description</h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-350 leading-relaxed whitespace-pre-line">
              {job.description}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 rounded-3xl shadow-sm">
              <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-50 mb-4">Key Requirements</h3>
              <ul className="list-disc list-inside text-sm text-zinc-600 dark:text-zinc-355 leading-relaxed flex flex-col gap-2.5">
                {job.requirements.map((req: string, idx: number) => (
                  <li key={idx}>{req}</li>
                ))}
              </ul>
            </div>

            <div className="p-6 bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 rounded-3xl shadow-sm">
              <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-50 mb-4">Key Responsibilities</h3>
              <ul className="list-disc list-inside text-sm text-zinc-600 dark:text-zinc-355 leading-relaxed flex flex-col gap-2.5">
                {job.responsibilities.map((resp: string, idx: number) => (
                  <li key={idx}>{resp}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-80 flex flex-col gap-6 shrink-0">
          {job.companyId && (
            <div className="p-6 bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 rounded-3xl shadow-sm">
              <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-50 pb-3 border-b border-zinc-100 dark:border-zinc-850">
                Hiring Organization
              </h3>
              <div className="flex items-center gap-3.5 mt-4">
                <Avatar src={job.companyId.logo} name={job.companyId.name} size="md" />
                <div>
                  <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-50">{job.companyId.name}</h4>
                  <p className="text-xs text-indigo-600 dark:text-indigo-400 mt-0.5">{job.companyId.industry}</p>
                </div>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-4 leading-relaxed line-clamp-4">
                {job.companyId.description}
              </p>
              <div className="mt-6 flex flex-col gap-2.5 text-xs text-zinc-400 font-semibold">
                <div className="flex justify-between">
                  <span>Location</span>
                  <span className="text-zinc-700 dark:text-zinc-300">{job.companyId.location || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span>Employees</span>
                  <span className="text-zinc-700 dark:text-zinc-300">{job.companyId.employeeCount || "N/A"}</span>
                </div>
                {job.companyId.website && (
                  <a
                    href={job.companyId.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 mt-2 hover:underline"
                  >
                    <span>Visit Website</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          )}

          <div className="p-6 bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 rounded-3xl shadow-sm">
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-50 pb-3 border-b border-zinc-100 dark:border-zinc-850">
              Required Tech Stack
            </h3>
            <div className="flex flex-wrap gap-2 mt-4">
              {job.skills.map((skill: string, idx: number) => (
                <Badge key={idx} variant="secondary">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
