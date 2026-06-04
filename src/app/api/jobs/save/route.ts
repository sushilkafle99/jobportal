import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import SavedJob from "@/models/SavedJob";
import Job from "@/models/Job";
import Company from "@/models/Company";
import { verifyToken } from "@/utils/auth";

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const decoded = await verifyToken(token);
    if (!decoded || decoded.role !== "USER") {
      return NextResponse.json({ message: "Forbidden. Seekers only." }, { status: 403 });
    }

    await dbConnect();
    const savedJobs = await SavedJob.find({ userId: decoded.userId })
      .populate({
        path: "jobId",
        model: Job,
        populate: { path: "companyId", model: Company, select: "name logo location" },
      })
      .sort({ createdAt: -1 });

    const filteredJobs = savedJobs.filter((sj) => sj.jobId !== null);

    return NextResponse.json({ savedJobs: filteredJobs });
  } catch (error) {
    console.error("GET Saved Jobs Error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const decoded = await verifyToken(token);
    if (!decoded || decoded.role !== "USER") {
      return NextResponse.json({ message: "Forbidden. Seekers only." }, { status: 403 });
    }

    const { jobId } = await request.json();
    if (!jobId) {
      return NextResponse.json({ message: "Job ID is required" }, { status: 400 });
    }

    await dbConnect();

    const existing = await SavedJob.findOne({ userId: decoded.userId, jobId });
    if (existing) {
      return NextResponse.json({ message: "Job is already saved" });
    }

    await SavedJob.create({
      userId: decoded.userId,
      jobId,
    });

    return NextResponse.json({ message: "Job saved successfully" }, { status: 201 });
  } catch (error) {
    console.error("POST Saved Job Error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const decoded = await verifyToken(token);
    if (!decoded || decoded.role !== "USER") {
      return NextResponse.json({ message: "Forbidden. Seekers only." }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const jobId = searchParams.get("jobId");
    if (!jobId) {
      return NextResponse.json({ message: "Job ID is required" }, { status: 400 });
    }

    await dbConnect();
    await SavedJob.findOneAndDelete({ userId: decoded.userId, jobId });

    return NextResponse.json({ message: "Job removed from saved list" });
  } catch (error) {
    console.error("DELETE Saved Job Error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
