import React from "react";
import { dbConnect } from "@/lib/db";
import Company from "@/models/Company";
import CompanyCard from "@/components/CompanyCard";
import Input from "@/components/Input";
import Button from "@/components/Button";

export const dynamic = "force-dynamic";

export default async function CompaniesPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>;
}) {
  const params = await searchParams;
  const search = params.search || "";

  await dbConnect();

  const query: { name?: { $regex: string; $options: string } } = {};
  if (search) {
    query.name = { $regex: search, $options: "i" };
  }

  const companies = await Company.find(query).sort({ createdAt: -1 });

  return (
    <div className="mx-auto max-w-7xl px-6 py-10 w-full flex-1">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-white">
          Explore Top Tech Employers
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          Discover company details, workplace insights, and current job openings.
        </p>
      </div>

      <form method="GET" action="/companies" className="flex items-center gap-3 max-w-md mb-10">
        <Input
          type="text"
          name="search"
          defaultValue={search}
          placeholder="Search companies by name..."
        />
        <Button type="submit">Search</Button>
      </form>

      {companies.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl bg-zinc-50/20">
          <p className="text-base font-bold text-zinc-900 dark:text-zinc-150">No companies found</p>
          <p className="text-sm text-zinc-500 mt-1">Try typing a different name.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {companies.map((company) => (
            <CompanyCard key={company._id.toString()} company={JSON.parse(JSON.stringify(company))} />
          ))}
        </div>
      )}
    </div>
  );
}
