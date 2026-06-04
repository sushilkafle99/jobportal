import React from "react";
import Link from "next/link";
import { dbConnect } from "@/lib/db";
import Job from "@/models/Job";
import Company from "@/models/Company";
import HeroSection from "@/components/HeroSection";
import JobCard from "@/components/JobCard";
import CompanyCard from "@/components/CompanyCard";
import Button from "@/components/Button";
import { Briefcase, Award, Users, ShieldCheck, Star } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  await dbConnect();

  const featuredJobs = await Job.find({ status: "Active" })
    .populate({ path: "companyId", model: Company, select: "name logo location" })
    .sort({ createdAt: -1 })
    .limit(3);

  const featuredCompanies = await Company.find()
    .sort({ createdAt: -1 })
    .limit(3);

  const categories = [
    { title: "Technology", count: "1,200+ Jobs", icon: Briefcase, color: "text-blue-600 bg-blue-50 dark:bg-blue-950/40 dark:text-blue-400" },
    { title: "Design", count: "450+ Jobs", icon: Award, color: "text-purple-600 bg-purple-50 dark:bg-purple-950/40 dark:text-purple-400" },
    { title: "Marketing", count: "800+ Jobs", icon: Users, color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-400" },
    { title: "Finance", count: "320+ Jobs", icon: ShieldCheck, color: "text-amber-600 bg-amber-50 dark:bg-amber-950/40 dark:text-amber-400" },
  ];

  const testimonials = [
    {
      quote: "Finding a job in my niche was incredibly smooth. I applied to 3 jobs and got 2 interviews within a week. Highly recommended!",
      author: "Alex Rivera",
      role: "Frontend Engineer",
      company: "Linear",
      stars: 5,
    },
    {
      quote: "As a Recruiter, the caliber of talent on this portal is outstanding. We closed our Senior Dev role in record time.",
      author: "Sarah Chen",
      role: "Talent Acquisition",
      company: "Vercel",
      stars: 5,
    },
  ];

  return (
    <div className="flex flex-col w-full">
      <HeroSection />

      <section className="py-20 bg-white dark:bg-zinc-950">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold text-zinc-900 dark:text-white">
              Browse Jobs by Category
            </h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2">
              Explore listings across high-growth domains to find your next career transition.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat, idx) => {
              const Icon = cat.icon;
              return (
                <Link
                  key={idx}
                  href={`/jobs?category=${cat.title}`}
                  className="group p-6 border border-zinc-150 dark:border-zinc-800 rounded-2xl bg-zinc-50/50 hover:bg-white dark:bg-zinc-950 dark:hover:bg-zinc-900 hover:border-indigo-500/50 hover:shadow-xl transition-all duration-300"
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${cat.color} group-hover:scale-110 transition-transform`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-50">
                    {cat.title}
                  </h3>
                  <p className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 mt-1">
                    {cat.count}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 bg-zinc-50/50 dark:bg-zinc-900/10">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl font-extrabold text-zinc-900 dark:text-white">
                Featured Job Opportunities
              </h2>
              <p className="text-sm text-zinc-505 dark:text-zinc-400 mt-2">
                Handpicked vacancies from verified hiring companies updated hourly.
              </p>
            </div>
            <Link href="/jobs" className="mt-4 sm:mt-0">
              <Button variant="outline" size="sm">
                View All Jobs →
              </Button>
            </Link>
          </div>

          {featuredJobs.length === 0 ? (
            <div className="py-12 text-center text-zinc-400">
              No featured vacancies available. Please check back later.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredJobs.map((job) => (
                <JobCard key={job._id.toString()} job={JSON.parse(JSON.stringify(job))} hideBookmark />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-20 bg-white dark:bg-zinc-955">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl font-extrabold text-zinc-900 dark:text-white">
                Work at Top Companies
              </h2>
              <p className="text-sm text-zinc-505 dark:text-zinc-400 mt-2">
                Discover workplace cultures, employee reviews, and open tech roles.
              </p>
            </div>
            <Link href="/companies" className="mt-4 sm:mt-0">
              <Button variant="outline" size="sm">
                Browse Companies →
              </Button>
            </Link>
          </div>

          {featuredCompanies.length === 0 ? (
            <div className="py-12 text-center text-zinc-400">
              No company profiles registered yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredCompanies.map((company) => (
                <CompanyCard key={company._id.toString()} company={JSON.parse(JSON.stringify(company))} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-20 bg-zinc-50/50 dark:bg-zinc-900/10">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold text-zinc-900 dark:text-white">
              Loved by Candidates & Recruiters
            </h2>
            <p className="text-sm text-zinc-505 dark:text-zinc-400 mt-2">
              Hear success stories from developers who secured roles and HR managers who sourced talents.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {testimonials.map((t, idx) => (
              <div
                key={idx}
                className="p-8 bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 rounded-2xl shadow-sm relative"
              >
                <div className="flex gap-1 text-amber-500 mb-4">
                  {[...Array(t.stars)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-sm text-zinc-600 dark:text-zinc-350 italic leading-relaxed mb-6">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div>
                  <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-50">{t.author}</h4>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    {t.role} @ <span className="font-semibold">{t.company}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white dark:bg-zinc-955">
        <div className="mx-auto max-w-5xl px-6">
          <div className="p-8 md:p-16 rounded-3xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-center flex flex-col items-center gap-6 shadow-xl shadow-indigo-200 dark:shadow-none relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(99,102,241,0.2),transparent_60%)] pointer-events-none" />
            <h2 className="text-3xl sm:text-4xl font-extrabold max-w-xl">
              Ready to Explore Your Next Career Milestone?
            </h2>
            <p className="text-sm text-indigo-100 max-w-lg leading-relaxed">
              Create an account now to start tracking applications, saving your favorite postings, and building your custom resume profile.
            </p>
            <div className="flex gap-3 mt-4">
              <Link href="/register">
                <Button variant="secondary" className="font-bold">
                  Create Free Account
                </Button>
              </Link>
              <Link href="/jobs">
                <Button className="border border-white/20 bg-white/10 hover:bg-white/20 text-white shadow-none">
                  Search All Jobs
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
