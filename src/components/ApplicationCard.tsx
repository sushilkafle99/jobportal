import React from "react";
import { Briefcase, Calendar, FileText, ExternalLink } from "lucide-react";
import Badge from "./Badge";

interface ApplicationCardProps {
  application: {
    _id: string;
    resumeUrl: string;
    coverLetter?: string;
    status: "Pending" | "Reviewing" | "Shortlisted" | "Rejected" | "Accepted";
    appliedAt: string | Date;
    jobId: {
      _id: string;
      title: string;
      location: string;
      companyId?: {
        name: string;
      };
    };
    userId?: {
      name: string;
      email: string;
    };
  };
  isAdminOrRecruiter?: boolean;
  onStatusChange?: (id: string, newStatus: string) => Promise<void>;
}

export default function ApplicationCard({
  application,
  isAdminOrRecruiter = false,
  onStatusChange,
}: ApplicationCardProps) {
  const formattedDate = new Date(application.appliedAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "Accepted":
        return "success";
      case "Shortlisted":
        return "primary";
      case "Reviewing":
        return "warning";
      case "Rejected":
        return "danger";
      default:
        return "neutral";
    }
  };

  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (onStatusChange) {
      await onStatusChange(application._id, e.target.value);
    }
  };

  return (
    <div className="p-6 bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3">
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-50 truncate">
              {application.jobId?.title || "Job Posting"}
            </h3>
            <Badge variant={getStatusVariant(application.status)}>
              {application.status}
            </Badge>
          </div>
          <p className="text-sm font-medium text-zinc-500 mt-1 flex items-center gap-1.5">
            <Briefcase className="w-3.5 h-3.5" />
            <span>{application.jobId?.companyId?.name || "Company"}</span>
            <span className="text-zinc-300 dark:text-zinc-700">•</span>
            <span>{application.jobId?.location}</span>
          </p>

          {isAdminOrRecruiter && application.userId && (
            <div className="mt-3 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-950/40 border border-zinc-100 dark:border-zinc-850">
              <p className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                Applicant Details
              </p>
              <p className="text-sm font-bold text-zinc-800 dark:text-zinc-300 mt-1">
                {application.userId.name}
              </p>
              <p className="text-xs text-zinc-555">{application.userId.email}</p>
            </div>
          )}
        </div>

        <div className="flex flex-col md:items-end gap-3 min-w-[200px]">
          <div className="flex items-center gap-1 text-xs font-medium text-zinc-400">
            <Calendar className="w-3.5 h-3.5" />
            <span>Applied: {formattedDate}</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <a
              href={application.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-650 bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 dark:text-indigo-400 dark:bg-indigo-950/30 dark:border-indigo-900/50 dark:hover:bg-indigo-950/60 rounded-xl transition-colors"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Resume</span>
              <ExternalLink className="w-3 h-3" />
            </a>

            {isAdminOrRecruiter && onStatusChange && (
              <select
                value={application.status}
                onChange={handleStatusChange}
                className="px-3 py-1.5 text-xs font-semibold rounded-xl border border-zinc-200 bg-zinc-50 text-zinc-700 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                <option value="Pending">Pending</option>
                <option value="Reviewing">Reviewing</option>
                <option value="Shortlisted">Shortlisted</option>
                <option value="Rejected">Rejected</option>
                <option value="Accepted">Accepted</option>
              </select>
            )}
          </div>
        </div>
      </div>

      {application.coverLetter && (
        <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-850">
          <h4 className="text-xs font-semibold text-zinc-400 dark:text-zinc-550 uppercase tracking-wider mb-1.5">
            Cover Letter
          </h4>
          <p className="text-sm text-zinc-600 dark:text-zinc-350 leading-relaxed italic bg-zinc-50/50 dark:bg-zinc-950/20 p-3.5 rounded-xl border border-zinc-100 dark:border-zinc-850/50">
            &ldquo;{application.coverLetter}&rdquo;
          </p>
        </div>
      )}
    </div>
  );
}
