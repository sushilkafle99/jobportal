import React from "react";
import Link from "next/link";
import { Briefcase } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full bg-zinc-50 border-t border-zinc-150 py-12 dark:bg-zinc-950 dark:border-zinc-905 mt-auto">
      <div className="mx-auto max-w-7xl px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="flex flex-col gap-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-md">
              <Briefcase className="h-4.5 w-4.5" />
            </div>
            <span className="text-lg font-black tracking-tight text-zinc-900 dark:text-white">
              Job<span className="text-indigo-600 dark:text-indigo-400">Portal</span>
            </span>
          </Link>
          <p className="text-sm text-zinc-500 leading-relaxed">
            Connecting world-class talents with the world&apos;s most innovative companies. Build your dream career today.
          </p>
          <div className="flex items-center gap-3 mt-2 text-zinc-400 dark:text-zinc-500">
            <a href="#" className="hover:text-indigo-600 transition-colors" aria-label="Twitter">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </a>
            <a href="#" className="hover:text-indigo-600 transition-colors" aria-label="LinkedIn">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
            </a>
            <a href="#" className="hover:text-indigo-600 transition-colors" aria-label="GitHub">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
            </a>
          </div>
        </div>

        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-4">
            For Candidates
          </h4>
          <ul className="flex flex-col gap-3 text-sm font-medium text-zinc-600 dark:text-zinc-405">
            <li>
              <Link href="/jobs" className="hover:text-indigo-600 transition-colors">
                Browse Jobs
              </Link>
            </li>
            <li>
              <Link href="/companies" className="hover:text-indigo-600 transition-colors">
                Browse Companies
              </Link>
            </li>
            <li>
              <Link href="/user/dashboard" className="hover:text-indigo-600 transition-colors">
                Candidate Dashboard
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-4">
            For Employers
          </h4>
          <ul className="flex flex-col gap-3 text-sm font-medium text-zinc-600 dark:text-zinc-405">
            <li>
              <Link href="/recruiter/jobs/create" className="hover:text-indigo-600 transition-colors">
                Post a Job
              </Link>
            </li>
            <li>
              <Link href="/recruiter/dashboard" className="hover:text-indigo-600 transition-colors">
                Employer Dashboard
              </Link>
            </li>
            <li>
              <Link href="/register" className="hover:text-indigo-600 transition-colors">
                Recruiter Registration
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-4">
            Company
          </h4>
          <ul className="flex flex-col gap-3 text-sm font-medium text-zinc-600 dark:text-zinc-455">
            <li>
              <Link href="/about" className="hover:text-indigo-600 transition-colors">
                About Us
              </Link>
            </li>
            <li>
              <a href="#" className="hover:text-indigo-600 transition-colors">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-indigo-600 transition-colors">
                Terms of Service
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 border-t border-zinc-150 dark:border-zinc-900 mt-12 pt-8 text-center text-xs text-zinc-400">
        <p>&copy; {new Date().getFullYear()} JobPortal. All rights reserved. Created for SushilKafle33/DABS.</p>
      </div>
    </footer>
  );
}
