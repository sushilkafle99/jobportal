import React from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { dbConnect } from "@/lib/db";
import { verifyToken } from "@/utils/auth";
import User from "@/models/User";
import Application from "@/models/Application";
import SavedJob from "@/models/SavedJob";
import Job from "@/models/Job";
import Company from "@/models/Company";
import DashboardHeader from "@/components/DashboardHeader";
import { Briefcase, Bookmark, CheckCircle, ArrowRight } from "lucide-react";
import Badge from "@/components/Badge";

export const dynamic = "force-dynamic";

export default async function SeekerDashboardPage() {
  await dbConnect();
  
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) redirect("/login");

  const decoded = await verifyToken(token);
  if (!decoded) redirect("/login");

  const user = await User.findById(decoded.userId);
  if (!user) redirect("/login");

  const appliedCount = await Application.countDocuments({ userId: decoded.userId });
  const savedCount = await SavedJob.countDocuments({ userId: decoded.userId });

  let profileCompletion = 50;
  if (user.phone) profileCompletion += 12.5;
  if (user.location) profileCompletion += 12.5;
  if (user.profileImage) profileCompletion += 12.5;
  if (user.resumeUrl) profileCompletion += 12.5;

  const recentApplications = await Application.find({ userId: decoded.userId })
    .populate({
      path: "jobId",
      model: Job,
      select: "title location companyId",
      populate: { path: "companyId", model: Company, select: "name logo" },
    })
    .sort({ createdAt: -1 })
    .limit(3);

  return (
    <div className="flex flex-col gap-8 w-full">
      <DashboardHeader
        title={`Welcome, ${user.name}!`}
        description="Here's a summary of your job search progress."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 rounded-3xl shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-extrabold text-zinc-900 dark:text-white">{appliedCount}</p>
            <p className="text-xs text-zinc-400 mt-0.5">Applied Jobs</p>
          </div>
        </div>

        <div className="p-6 bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 rounded-3xl shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-violet-50 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400 flex items-center justify-center shrink-0">
            <Bookmark className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-extrabold text-zinc-900 dark:text-white">{savedCount}</p>
            <p className="text-xs text-zinc-400 mt-0.5">Saved Bookmarks</p>
          </div>
        </div>

        <div className="p-6 bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 rounded-3xl shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-450 flex items-center justify-center shrink-0">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <p className="text-2xl font-extrabold text-zinc-900 dark:text-white">{profileCompletion}%</p>
            <p className="text-xs text-zinc-400 mt-0.5">Profile Completion</p>
            <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${profileCompletion}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 md:p-8 bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 rounded-3xl shadow-sm">
        <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-850 pb-4 mb-6">
          <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-50">Recent Applications</h3>
          <Link
            href="/user/applications"
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentApplications.length === 0 ? (
          <div className="text-center py-8 text-zinc-400">
            <p className="text-sm">You haven&apos;t submitted any job applications yet.</p>
            <Link href="/jobs" className="text-indigo-650 dark:text-indigo-400 text-xs font-semibold hover:underline mt-2 inline-block">
              Browse jobs and apply now!
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {recentApplications.map((app) => (
              <div
                key={app._id.toString()}
                className="flex items-center justify-between p-4 border border-zinc-150 dark:border-zinc-850 rounded-2xl bg-zinc-50/20 dark:bg-zinc-950/20 hover:border-indigo-500/20 transition-colors"
              >
                <div>
                  <h4 className="text-sm font-bold text-zinc-800 dark:text-zinc-300">
                    {app.jobId?.title || "Job Posting"}
                  </h4>
                  <p className="text-xs text-zinc-500 mt-1 font-medium">
                    {app.jobId?.companyId?.name || "Company"} • {app.jobId?.location}
                  </p>
                </div>
                <div className="text-right">
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
                  <p className="text-[10px] text-zinc-400 mt-1.5">
                    {new Date(app.appliedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
