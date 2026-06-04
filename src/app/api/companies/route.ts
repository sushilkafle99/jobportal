import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Company from "@/models/Company";
import Recruiter from "@/models/Recruiter";
import { verifyToken } from "@/utils/auth";
import { companySchema } from "@/validations/schemas";

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");

    const query: { name?: { $regex: string; $options: string } } = {};
    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    const companies = await Company.find(query).sort({ createdAt: -1 });
    return NextResponse.json({ companies });
  } catch (error) {
    console.error("GET Companies Error:", error);
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
    const result = companySchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { message: "Validation error", errors: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    await dbConnect();

    const company = await Company.create({
      ...result.data,
      createdBy: decoded.userId,
    });

    await Recruiter.findOneAndUpdate(
      { userId: decoded.userId },
      { companyId: company._id }
    );

    return NextResponse.json({ message: "Company profile created successfully", company }, { status: 201 });
  } catch (error) {
    console.error("POST Company Error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
