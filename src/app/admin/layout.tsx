import React from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { dbConnect } from "@/lib/db";
import User from "@/models/User";
import { verifyToken } from "@/utils/auth";
import Navbar from "@/components/Navbar";
import DashboardSidebar from "@/components/DashboardSidebar";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await dbConnect();
  
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) redirect("/login");

  const decoded = await verifyToken(token);
  if (!decoded || decoded.role !== "ADMIN") {
    redirect("/unauthorized");
  }

  const user = await User.findById(decoded.userId).select("name email role profileImage");
  if (!user) redirect("/login");

  const userPayload = {
    name: user.name,
    email: user.email,
    role: user.role as "ADMIN" | "RECRUITER" | "USER",
    profileImage: user.profileImage,
  };

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50/30 dark:bg-black">
      <Navbar user={userPayload} />
      <div className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto">
        <DashboardSidebar role="ADMIN" />
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
