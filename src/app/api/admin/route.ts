import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import User from "@/models/User";
import Company from "@/models/Company";
import Job from "@/models/Job";
import Application from "@/models/Application";
import { verifyToken } from "@/utils/auth";

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const decoded = await verifyToken(token);
    if (!decoded || decoded.role !== "ADMIN") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    await dbConnect();

    const [
      totalUsers,
      totalRecruiters,
      totalCompanies,
      totalJobs,
      totalApplications,
      recentJobs,
    ] = await Promise.all([
      User.countDocuments({ role: "USER" }),
      User.countDocuments({ role: "RECRUITER" }),
      Company.countDocuments(),
      Job.countDocuments(),
      Application.countDocuments(),
      Job.find().sort({ createdAt: -1 }).limit(5).populate({ path: "companyId", model: Company, select: "name" }),
    ]);

    return NextResponse.json({
      stats: {
        totalUsers,
        totalRecruiters,
        totalCompanies,
        totalJobs,
        totalApplications,
      },
      recentJobs,
    });
  } catch (error) {
    console.error("GET Admin Stats Error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
