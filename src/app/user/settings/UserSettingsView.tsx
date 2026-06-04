"use client";

import React, { useState } from "react";
import DashboardHeader from "@/components/DashboardHeader";
import Button from "@/components/Button";

export default function SeekerSettingsPage() {
  const [deactivating, setDeactivating] = useState(false);
  const [success, setSuccess] = useState("");

  const handleDeactivate = async () => {
    if (!confirm("Are you sure you want to deactivate your account? This action can only be reversed by contacting administration.")) {
      return;
    }

    try {
      setDeactivating(true);
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        const updateRes = await fetch(`/api/users/${data.user._id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ isActive: false }),
        });

        if (updateRes.ok) {
          setSuccess("Account deactivated successfully. Logging out...");
          setTimeout(async () => {
            await fetch("/api/auth/logout", { method: "POST" });
            window.location.href = "/";
          }, 2000);
        }
      }
    } catch (err) {
      console.error("Deactivate error", err);
    } finally {
      setDeactivating(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 w-full max-w-xl">
      <DashboardHeader
        title="Account Settings"
        description="Manage your account preferences."
      />

      <div className="p-6 md:p-8 bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 rounded-3xl shadow-sm flex flex-col gap-6">
        <div>
          <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-50">Theme Mode</h3>
          <p className="text-xs text-zinc-400 mt-1">Portal follows your system light or dark preferences automatically.</p>
        </div>

        <div className="border-t border-zinc-100 dark:border-zinc-850 pt-6">
          <h3 className="text-base font-bold text-red-600 dark:text-red-400">Danger Zone</h3>
          <p className="text-xs text-zinc-400 mt-1">Deactivate your account temporarily. Employers will no longer be able to search your applications.</p>

          {success && (
            <div className="p-3 mt-4 bg-emerald-50 border border-emerald-100 rounded-xl text-xs font-semibold text-emerald-650 dark:bg-emerald-955/20 dark:border-emerald-900/50">
              {success}
            </div>
          )}

          <Button
            variant="danger"
            onClick={handleDeactivate}
            isLoading={deactivating}
            className="mt-4"
          >
            Deactivate My Account
          </Button>
        </div>
      </div>
    </div>
  );
}
