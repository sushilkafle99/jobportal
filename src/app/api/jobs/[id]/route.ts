import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Job from "@/models/Job";
import Company from "@/models/Company";
import { verifyToken } from "@/utils/auth";
import { jobSchema } from "@/validations/schemas";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await dbConnect();
    const job = await Job.findById(id).populate({
      path: "companyId",
      model: Company,
    });

    if (!job) {
      return NextResponse.json({ message: "Job not found" }, { status: 404 });
    }

    return NextResponse.json({ job });
  } catch (error) {
    console.error("GET Job ID Error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const token = request.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const decoded = await verifyToken(token);
    if (!decoded) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    await dbConnect();
    const job = await Job.findById(id);
    if (!job) {
      return NextResponse.json({ message: "Job not found" }, { status: 404 });
    }

    const isOwner = job.recruiterId.toString() === decoded.userId;
    const isAdmin = decoded.role === "ADMIN";

    if (!isOwner && !isAdmin) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();

    if (body.status && Object.keys(body).length === 1) {
      const updatedJob = await Job.findByIdAndUpdate(id, { status: body.status }, { new: true });
      return NextResponse.json({ message: "Job status updated", job: updatedJob });
    }

    const result = jobSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { message: "Validation error", errors: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { requirements, responsibilities, skills, ...rest } = result.data;
    const reqArray = requirements.split(",").map((s) => s.trim()).filter(Boolean);
    const respArray = responsibilities.split(",").map((s) => s.trim()).filter(Boolean);
    const skillsArray = skills.split(",").map((s) => s.trim()).filter(Boolean);

    const updatedJob = await Job.findByIdAndUpdate(
      id,
      {
        ...rest,
        requirements: reqArray,
        responsibilities: respArray,
        skills: skillsArray,
      },
      { new: true }
    );

    return NextResponse.json({ message: "Job updated successfully", job: updatedJob });
  } catch (error) {
    console.error("PATCH Job ID Error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const token = request.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const decoded = await verifyToken(token);
    if (!decoded) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    await dbConnect();
    const job = await Job.findById(id);
    if (!job) {
      return NextResponse.json({ message: "Job not found" }, { status: 404 });
    }

    const isOwner = job.recruiterId.toString() === decoded.userId;
    const isAdmin = decoded.role === "ADMIN";

    if (!isOwner && !isAdmin) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    await Job.findByIdAndDelete(id);

    return NextResponse.json({ message: "Job posting deleted successfully" });
  } catch (error) {
    console.error("DELETE Job ID Error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
