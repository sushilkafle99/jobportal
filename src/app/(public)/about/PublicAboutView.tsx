import React from "react";
import { Sparkles, Users, Award, ShieldCheck } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-16 w-full flex-1 flex flex-col items-center">
      <div className="text-center max-w-2xl mb-16">
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-indigo-200/50 bg-indigo-50/50 dark:border-indigo-950/40 dark:bg-indigo-950/20 text-xs font-bold text-indigo-650 dark:text-indigo-400 mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Connecting Talent & Opportunity</span>
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
          About JobPortal
        </h1>
        <p className="text-base text-zinc-500 dark:text-zinc-400 mt-4 leading-relaxed">
          We build modern tools that eliminate the friction of recruitment, enabling software engineers, designers, and managers to connect seamlessly with fast-growing tech startups.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-3xl mb-16">
        <div className="p-6 bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 rounded-2xl text-center flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4">
            <Users className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-555">Talent First</h3>
          <p className="text-xs text-zinc-500 mt-2 leading-relaxed">
            Prioritizing seeker experience with easy applications and bookmark details tracking.
          </p>
        </div>

        <div className="p-6 bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 rounded-2xl text-center flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-violet-50 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400 flex items-center justify-center mb-4">
            <Award className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-555">Verified Vacancies</h3>
          <p className="text-xs text-zinc-500 mt-2 leading-relaxed">
            Every company and job posting is audited for authenticity and salary transparency.
          </p>
        </div>

        <div className="p-6 bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 rounded-2xl text-center flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-555">Secure Platform</h3>
          <p className="text-xs text-zinc-500 mt-2 leading-relaxed">
            Custom HTTP-only cookies and cryptographic JWT checks ensure applicant data privacy.
          </p>
        </div>
      </div>
    </div>
  );
}
