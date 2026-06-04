import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Application from "@/models/Application";
import Job from "@/models/Job";
import { verifyToken } from "@/utils/auth";

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
    const application = await Application.findById(id);
    if (!application) {
      return NextResponse.json({ message: "Application not found" }, { status: 404 });
    }

    const job = await Job.findById(application.jobId);
    const isJobOwner = job && job.recruiterId.toString() === decoded.userId;
    const isAdmin = decoded.role === "ADMIN";

    if (!isJobOwner && !isAdmin) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { status } = body;

    const allowedStatuses = ["Pending", "Reviewing", "Shortlisted", "Rejected", "Accepted"];
    if (!status || !allowedStatuses.includes(status)) {
      return NextResponse.json({ message: "Invalid application status" }, { status: 400 });
    }

    const updatedApp = await Application.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    return NextResponse.json({ message: "Application status updated successfully", application: updatedApp });
  } catch (error) {
    console.error("PATCH Application Error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
