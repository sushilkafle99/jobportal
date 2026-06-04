import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Application from "@/models/Application";
import Job from "@/models/Job";
import User from "@/models/User";
import Company from "@/models/Company";
import { verifyToken } from "@/utils/auth";
import { applicationSchema } from "@/validations/schemas";

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const decoded = await verifyToken(token);
    if (!decoded) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    await dbConnect();
    const { searchParams } = new URL(request.url);
    const jobId = searchParams.get("jobId");

    const query: { userId?: string; jobId?: string | { $in: unknown[] } } = {};

    if (decoded.role === "USER") {
      query.userId = decoded.userId;
    } else if (decoded.role === "RECRUITER") {
      if (jobId) {
        const job = await Job.findById(jobId);
        if (!job || job.recruiterId.toString() !== decoded.userId) {
          return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        }
        query.jobId = jobId;
      } else {
        const recruiterJobs = await Job.find({ recruiterId: decoded.userId }).select("_id");
        const jobIds = recruiterJobs.map((j) => j._id);
        query.jobId = { $in: jobIds };
      }
    } else if (decoded.role === "ADMIN") {
      if (jobId) query.jobId = jobId;
    }

    const applications = await Application.find(query)
      .populate({
        path: "jobId",
        model: Job,
        select: "title location companyId",
        populate: { path: "companyId", model: Company, select: "name logo" },
      })
      .populate({
        path: "userId",
        model: User,
        select: "name email phone profileImage resumeUrl",
      })
      .sort({ createdAt: -1 });

    return NextResponse.json({ applications });
  } catch (error) {
    console.error("GET Applications Error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const decoded = await verifyToken(token);
    if (!decoded || decoded.role !== "USER") {
      return NextResponse.json({ message: "Forbidden. Seeker accounts only." }, { status: 403 });
    }

    const body = await request.json();
    const { jobId, resumeUrl, coverLetter } = body;

    if (!jobId) {
      return NextResponse.json({ message: "Job ID is required" }, { status: 400 });
    }

    const result = applicationSchema.safeParse({ resumeUrl, coverLetter });
    if (!result.success) {
      return NextResponse.json(
        { message: "Validation error", errors: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    await dbConnect();

    const alreadyApplied = await Application.findOne({ jobId, userId: decoded.userId });
    if (alreadyApplied) {
      return NextResponse.json(
        { message: "You have already applied to this job posting" },
        { status: 400 }
      );
    }

    const job = await Job.findById(jobId);
    if (!job || job.status !== "Active") {
      return NextResponse.json({ message: "Job is no longer active" }, { status: 400 });
    }

    const application = await Application.create({
      jobId,
      userId: decoded.userId,
      resumeUrl: result.data.resumeUrl,
      coverLetter: result.data.coverLetter,
      status: "Pending",
    });

    return NextResponse.json({ message: "Application submitted successfully", application }, { status: 201 });
  } catch (error) {
    console.error("POST Application Error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
