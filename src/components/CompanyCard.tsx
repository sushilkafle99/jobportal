import React from "react";
import Link from "next/link";
import { MapPin, Users, Calendar } from "lucide-react";
import Avatar from "./Avatar";

interface CompanyCardProps {
  company: {
    _id: string;
    name: string;
    logo?: string;
    description?: string;
    industry?: string;
    location?: string;
    employeeCount?: number;
    foundedYear?: number;
  };
}

export default function CompanyCard({ company }: CompanyCardProps) {
  return (
    <Link
      href={`/companies/${company._id}`}
      className="group block p-6 bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 rounded-2xl hover:border-indigo-500/50 dark:hover:border-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/[0.02] transition-all duration-300 active:scale-[0.99]"
    >
      <div className="flex items-center gap-4">
        <Avatar src={company.logo} name={company.name} size="lg" />
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-bold text-zinc-900 dark:text-white group-hover:text-indigo-650 dark:group-hover:text-indigo-400 transition-colors truncate">
            {company.name}
          </h3>
          <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-550 mt-0.5 uppercase tracking-wider">
            {company.industry || "General Industry"}
          </p>
        </div>
      </div>

      <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-4 line-clamp-2 leading-relaxed">
        {company.description || "No description provided by the company."}
      </p>

      <div className="flex items-center gap-4 mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-850 text-xs font-medium text-zinc-400">
        {company.location && (
          <div className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5" />
            <span className="truncate max-w-[120px]">{company.location}</span>
          </div>
        )}
        {company.employeeCount !== undefined && company.employeeCount > 0 && (
          <div className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5" />
            <span>{company.employeeCount} Employees</span>
          </div>
        )}
        {company.foundedYear && (
          <div className="flex items-center gap-1 ml-auto">
            <Calendar className="w-3.5 h-3.5" />
            <span>Est. {company.foundedYear}</span>
          </div>
        )}
      </div>
    </Link>
  );
}
