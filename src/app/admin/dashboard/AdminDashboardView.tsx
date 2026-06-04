import React from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { dbConnect } from "@/lib/db";
import { verifyToken } from "@/utils/auth";
import User from "@/models/User";
import Company from "@/models/Company";
import Job from "@/models/Job";
import Application from "@/models/Application";
import DashboardHeader from "@/components/DashboardHeader";
import { Briefcase, Users, ShieldCheck, Building2, ClipboardList, Clock } from "lucide-react";
import Badge from "@/components/Badge";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  await dbConnect();
  
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) redirect("/login");

  const decoded = await verifyToken(token);
  if (!decoded || decoded.role !== "ADMIN") {
    redirect("/unauthorized");
  }

  const [
    usersCount,
    recruitersCount,
    companiesCount,
    jobsCount,
    applicationsCount,
    recentJobs,
    recentUsers,
  ] = await Promise.all([
    User.countDocuments({ role: "USER" }),
    User.countDocuments({ role: "RECRUITER" }),
    Company.countDocuments(),
    Job.countDocuments(),
    Application.countDocuments(),
    Job.find().sort({ createdAt: -1 }).limit(3).populate({ path: "companyId", model: Company, select: "name" }),
    User.find().sort({ createdAt: -1 }).limit(3).select("-password"),
  ]);

  return (
    <div className="flex flex-col gap-8 w-full">
      <DashboardHeader
        title="Admin Control Center"
        description="Monitor system metrics, manage registrations, and moderate listings."
      />

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="p-5 bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 rounded-3xl shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xl font-extrabold text-zinc-900 dark:text-white">{usersCount}</p>
            <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider mt-0.5">Seekers</p>
          </div>
        </div>

        <div className="p-5 bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 rounded-3xl shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-violet-50 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xl font-extrabold text-zinc-900 dark:text-white">{recruitersCount}</p>
            <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider mt-0.5">Employers</p>
          </div>
        </div>

        <div className="p-5 bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 rounded-3xl shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xl font-extrabold text-zinc-900 dark:text-white">{companiesCount}</p>
            <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider mt-0.5">Companies</p>
          </div>
        </div>

        <div className="p-5 bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 rounded-3xl shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-650 dark:text-emerald-450 flex items-center justify-center shrink-0">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xl font-extrabold text-zinc-900 dark:text-white">{jobsCount}</p>
            <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider mt-0.5">Jobs</p>
          </div>
        </div>

        <div className="p-5 bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 rounded-3xl shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-rose-50 dark:bg-rose-955/40 text-rose-650 dark:text-rose-400 flex items-center justify-center shrink-0">
            <ClipboardList className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xl font-extrabold text-zinc-900 dark:text-white">{applicationsCount}</p>
            <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider mt-0.5">Applications</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="p-6 md:p-8 bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 rounded-3xl shadow-sm">
          <h3 className="text-base font-bold text-zinc-900 dark:text-white pb-3 border-b border-zinc-100 dark:border-zinc-850 mb-6 flex items-center gap-2">
            <Clock className="w-5 h-5 text-indigo-500" />
            <span>Recently Added Jobs</span>
          </h3>

          <div className="flex flex-col gap-4">
            {recentJobs.map((job) => (
              <div
                key={job._id.toString()}
                className="flex items-center justify-between p-4 border border-zinc-150 dark:border-zinc-850 rounded-2xl bg-zinc-50/20"
              >
                <div>
                  <h4 className="text-sm font-bold text-zinc-800 dark:text-zinc-300">{job.title}</h4>
                  <p className="text-xs text-zinc-500 mt-1 font-semibold">{job.companyId?.name || "Company"}</p>
                </div>
                <Badge variant={job.status === "Active" ? "success" : "neutral"}>
                  {job.status}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 md:p-8 bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 rounded-3xl shadow-sm">
          <h3 className="text-base font-bold text-zinc-900 dark:text-white pb-3 border-b border-zinc-100 dark:border-zinc-850 mb-6 flex items-center gap-2">
            <Clock className="w-5 h-5 text-indigo-500" />
            <span>New Registrations</span>
          </h3>

          <div className="flex flex-col gap-4">
            {recentUsers.map((user) => (
              <div
                key={user._id.toString()}
                className="flex items-center justify-between p-4 border border-zinc-150 dark:border-zinc-855 rounded-2xl bg-zinc-50/20"
              >
                <div>
                  <h4 className="text-sm font-bold text-zinc-800 dark:text-zinc-300">{user.name}</h4>
                  <p className="text-xs text-zinc-500 mt-1 font-medium">{user.email}</p>
                </div>
                <Badge variant={user.role === "RECRUITER" ? "primary" : "neutral"}>
                  {user.role}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
