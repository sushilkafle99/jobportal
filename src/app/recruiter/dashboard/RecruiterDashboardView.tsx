import React from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { dbConnect } from "@/lib/db";
import { verifyToken } from "@/utils/auth";
import Recruiter from "@/models/Recruiter";
import Job from "@/models/Job";
import Application from "@/models/Application";
import Company from "@/models/Company";
import DashboardHeader from "@/components/DashboardHeader";
import { Briefcase, Users, LayoutDashboard, ArrowRight, CheckCircle, HelpCircle } from "lucide-react";
import Badge from "@/components/Badge";

export const dynamic = "force-dynamic";

export default async function RecruiterDashboardPage() {
  await dbConnect();
  
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) redirect("/login");

  const decoded = await verifyToken(token);
  if (!decoded) redirect("/login");

  const recruiter = await Recruiter.findOne({ userId: decoded.userId }).populate({ path: "companyId", model: Company });
  
  const jobsCount = await Job.countDocuments({ recruiterId: decoded.userId });
  
  const recruiterJobs = await Job.find({ recruiterId: decoded.userId }).select("_id");
  const jobIds = recruiterJobs.map((j) => j._id);
  const applicationsCount = await Application.countDocuments({ jobId: { $in: jobIds } });

  const recentApplications = await Application.find({ jobId: { $in: jobIds } })
    .populate({ path: "jobId", model: Job, select: "title" })
    .populate({ path: "userId", select: "name email" })
    .sort({ createdAt: -1 })
    .limit(3);

  const avgApps = jobsCount > 0 ? (applicationsCount / jobsCount).toFixed(1) : "0.0";

  return (
    <div className="flex flex-col gap-8 w-full">
      <DashboardHeader
        title="Employer Dashboard"
        description="Monitor your active tech vacancies and manage incoming applications."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 rounded-3xl shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-extrabold text-zinc-900 dark:text-white">{jobsCount}</p>
            <p className="text-xs text-zinc-400 mt-0.5">Active Job Postings</p>
          </div>
        </div>

        <div className="p-6 bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 rounded-3xl shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-violet-50 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400 flex items-center justify-center shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-extrabold text-zinc-900 dark:text-white">{applicationsCount}</p>
            <p className="text-xs text-zinc-400 mt-0.5">Applications Received</p>
          </div>
        </div>

        <div className="p-6 bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 rounded-3xl shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-450 flex items-center justify-center shrink-0">
            <LayoutDashboard className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-extrabold text-zinc-900 dark:text-white">{avgApps}</p>
            <p className="text-xs text-zinc-400 mt-0.5">Avg. Apps / Job</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 p-6 md:p-8 bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 rounded-3xl shadow-sm">
          <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-850 pb-4 mb-6">
            <h3 className="text-base font-bold text-zinc-900 dark:text-white">Recent Applicants</h3>
            <Link
              href="/recruiter/applications"
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentApplications.length === 0 ? (
            <div className="text-center py-8 text-zinc-400">
              <p className="text-sm">No applications received for your jobs yet.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {recentApplications.map((app) => (
                <div
                  key={app._id.toString()}
                  className="flex items-center justify-between p-4 border border-zinc-150 dark:border-zinc-850 rounded-2xl bg-zinc-50/20 dark:bg-zinc-955/20 hover:border-indigo-500/20 transition-colors"
                >
                  <div>
                    <h4 className="text-sm font-bold text-zinc-800 dark:text-zinc-300">
                      {app.userId?.name || "Applicant"}
                    </h4>
                    <p className="text-xs text-zinc-500 mt-1 font-semibold">
                      Applied for: <span className="text-indigo-650 dark:text-indigo-400">{app.jobId?.title}</span>
                    </p>
                  </div>
                  <Badge
                    variant={
                      app.status === "Accepted"
                        ? "success"
                        : app.status === "Rejected"
                        ? "danger"
                        : app.status === "Shortlisted"
                        ? "primary"
                        : app.status === "Reviewing"
                        ? "warning"
                        : "neutral"
                    }
                  >
                    {app.status}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-6 bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 rounded-3xl shadow-sm h-fit">
          <h3 className="text-base font-bold text-zinc-900 dark:text-white pb-3 border-b border-zinc-100 dark:border-zinc-855 mb-4">
            Employer Checklist
          </h3>
          <div className="flex flex-col gap-4">
            <div className="flex items-start gap-3">
              {recruiter?.companyId ? (
                <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
              ) : (
                <HelpCircle className="w-5 h-5 text-amber-500 shrink-0" />
              )}
              <div>
                <p className="text-sm font-bold text-zinc-800 dark:text-zinc-300">Company Profile</p>
                <p className="text-xs text-zinc-400 mt-0.5">
                  {recruiter?.companyId
                    ? `Linked to: ${recruiter.companyId.name}`
                    : "Not linked. Create a company profile to post jobs."}
                </p>
                {!recruiter?.companyId && (
                  <Link href="/recruiter/company" className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline mt-1.5 inline-block">
                    Create Company profile →
                  </Link>
                )}
              </div>
            </div>

            <div className="flex items-start gap-3 mt-2">
              <CheckCircle className={`w-5 h-5 ${recruiter?.verified ? "text-emerald-500" : "text-zinc-300"} shrink-0`} />
              <div>
                <p className="text-sm font-bold text-zinc-800 dark:text-zinc-300">Recruiter Verification</p>
                <p className="text-xs text-zinc-400 mt-0.5">
                  {recruiter?.verified
                    ? "Your recruiter account is verified."
                    : "Pending administration verification checklist."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
