import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Company from "@/models/Company";
import { verifyToken } from "@/utils/auth";
import { companySchema } from "@/validations/schemas";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await dbConnect();
    const company = await Company.findById(id);

    if (!company) {
      return NextResponse.json({ message: "Company not found" }, { status: 404 });
    }

    return NextResponse.json({ company });
  } catch (error) {
    console.error("GET Company ID Error:", error);
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
    const company = await Company.findById(id);

    if (!company) {
      return NextResponse.json({ message: "Company not found" }, { status: 404 });
    }

    const isOwner = company.createdBy.toString() === decoded.userId;
    const isAdmin = decoded.role === "ADMIN";

    if (!isOwner && !isAdmin) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const result = companySchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { message: "Validation error", errors: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const updatedCompany = await Company.findByIdAndUpdate(id, result.data, { new: true });

    return NextResponse.json({ message: "Company profile updated successfully", company: updatedCompany });
  } catch (error) {
    console.error("PATCH Company ID Error:", error);
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
    const company = await Company.findById(id);

    if (!company) {
      return NextResponse.json({ message: "Company not found" }, { status: 404 });
    }

    const isOwner = company.createdBy.toString() === decoded.userId;
    const isAdmin = decoded.role === "ADMIN";

    if (!isOwner && !isAdmin) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    await Company.findByIdAndDelete(id);

    return NextResponse.json({ message: "Company profile deleted successfully" });
  } catch (error) {
    console.error("DELETE Company ID Error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
