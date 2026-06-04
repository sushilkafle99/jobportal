import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Job from "@/models/Job";
import Company from "@/models/Company";
import { verifyToken } from "@/utils/auth";
import { jobSchema } from "@/validations/schemas";

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);

    const keyword = searchParams.get("keyword");
    const location = searchParams.get("location");
    const category = searchParams.get("category");
    const experienceLevel = searchParams.get("experienceLevel");
    const employmentType = searchParams.get("employmentType");
    const recruiterId = searchParams.get("recruiterId");
    const status = searchParams.get("status") || "Active";

    const query: {
      status?: string;
      recruiterId?: string;
      category?: string;
      experienceLevel?: string;
      employmentType?: string;
      location?: { $regex: string; $options: string };
      $or?: Array<
        | { title: { $regex: string; $options: string } }
        | { skills: { $in: RegExp[] } }
        | { description: { $regex: string; $options: string } }
      >;
    } = {};

    if (status !== "all") {
      query.status = status;
    }

    if (recruiterId) {
      query.recruiterId = recruiterId;
    }

    if (category && category !== "all") {
      query.category = category;
    }

    if (experienceLevel && experienceLevel !== "all") {
      query.experienceLevel = experienceLevel;
    }

    if (employmentType && employmentType !== "all") {
      query.employmentType = employmentType;
    }

    if (location) {
      query.location = { $regex: location, $options: "i" };
    }

    if (keyword) {
      query.$or = [
        { title: { $regex: keyword, $options: "i" } },
        { skills: { $in: [new RegExp(keyword, "i")] } },
        { description: { $regex: keyword, $options: "i" } },
      ];
    }

    const jobs = await Job.find(query)
      .populate({ path: "companyId", model: Company, select: "name logo location" })
      .sort({ createdAt: -1 });

    return NextResponse.json({ jobs });
  } catch (error) {
    console.error("GET Jobs Error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const decoded = await verifyToken(token);
    if (!decoded || decoded.role !== "RECRUITER") {
      return NextResponse.json({ message: "Forbidden. Recruiters only." }, { status: 403 });
    }

    const body = await request.json();
    const result = jobSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { message: "Validation error", errors: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    await dbConnect();

    const { requirements, responsibilities, skills, ...rest } = result.data;
    const reqArray = requirements.split(",").map((s) => s.trim()).filter(Boolean);
    const respArray = responsibilities.split(",").map((s) => s.trim()).filter(Boolean);
    const skillsArray = skills.split(",").map((s) => s.trim()).filter(Boolean);

    const job = await Job.create({
      ...rest,
      requirements: reqArray,
      responsibilities: respArray,
      skills: skillsArray,
      recruiterId: decoded.userId,
    });

    return NextResponse.json({ message: "Job posting created successfully", job }, { status: 201 });
  } catch (error) {
    console.error("POST Job Error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
