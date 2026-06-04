"use client";

import React, { useState } from "react";
import Button from "./Button";
import Modal from "./Modal";
import Input from "./Input";
import Textarea from "./Textarea";

interface ApplyButtonProps {
  jobId: string;
  defaultResumeUrl?: string;
  alreadyApplied?: boolean;
  userRole?: string;
}

export default function ApplyButton({
  jobId,
  defaultResumeUrl = "",
  alreadyApplied = false,
  userRole,
}: ApplyButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [resumeUrl, setResumeUrl] = useState(defaultResumeUrl);
  const [coverLetter, setCoverLetter] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [applied, setApplied] = useState(alreadyApplied);

  if (userRole === "RECRUITER" || userRole === "ADMIN") {
    return null;
  }

  if (applied) {
    return (
      <Button disabled variant="success" className="w-full sm:w-auto font-bold py-3.5 px-8">
        Application Submitted
      </Button>
    );
  }

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userRole) {
      window.location.href = `/login?from=/jobs/${jobId}`;
      return;
    }

    if (!resumeUrl) {
      setError("Please provide a valid resume URL link");
      return;
    }

    try {
      setIsLoading(true);
      setError("");
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId, resumeUrl, coverLetter }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Failed to submit application");
        return;
      }

      setSuccess(true);
      setApplied(true);
      setTimeout(() => {
        setIsOpen(false);
      }, 2000);
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button onClick={() => setIsOpen(true)} className="w-full sm:w-auto font-bold py-3.5 px-8 shadow-lg shadow-indigo-200 dark:shadow-none">
        Apply For This Job
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Submit Application"
        footer={null}
      >
        {success ? (
          <div className="text-center py-6">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-650 flex items-center justify-center mx-auto mb-4 dark:bg-emerald-950/40">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-555">Application Successful!</h4>
            <p className="text-sm text-zinc-500 mt-1">Your application details have been sent to the employer.</p>
          </div>
        ) : (
          <form onSubmit={handleApply} className="flex flex-col gap-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs font-semibold text-red-650 dark:bg-red-950/20 dark:border-red-900/50">
                {error}
              </div>
            )}

            <Input
              label="Resume Document URL Link"
              type="url"
              placeholder="https://drive.google.com/file/d/... or dropbox link"
              value={resumeUrl}
              onChange={(e) => setResumeUrl(e.target.value)}
              required
            />

            <Textarea
              label="Cover Letter (Optional)"
              placeholder="Introduce yourself to the hiring team..."
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              rows={4}
            />

            <div className="flex justify-end gap-3 pt-4 border-t border-zinc-150 dark:border-zinc-800">
              <Button type="button" variant="outline" size="sm" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm" isLoading={isLoading}>
                Submit Application
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </>
  );
}
