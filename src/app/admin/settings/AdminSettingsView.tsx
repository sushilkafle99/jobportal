import React from "react";
import DashboardHeader from "@/components/DashboardHeader";

export default function AdminSettingsPage() {
  return (
    <div className="flex flex-col gap-8 w-full max-w-xl">
      <DashboardHeader
        title="Portal Configurations"
        description="Configure platform rules and administrative settings."
      />

      <div className="p-6 md:p-8 bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 rounded-3xl shadow-sm flex flex-col gap-6">
        <div>
          <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-50">Theme Settings</h3>
          <p className="text-xs text-zinc-400 mt-1">
            Follows your system theme settings (light/dark mode support).
          </p>
        </div>

        <div className="border-t border-zinc-150 pt-6 dark:border-zinc-855">
          <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-50">System Logs</h3>
          <p className="text-xs text-zinc-400 mt-1">
            System logs and auditor details are piped directly to Next.js deployment logs.
          </p>
        </div>
      </div>
    </div>
  );
}
